const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const HttpError = require('../models/httpError');
const User = require('../models/User');


const userViewModel = () => (user) => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
        places: user.places
    };
};


const getAllUsers = () => async (req, res, next) => {
    const users = await User.find({});
    res.json({ users: users.map(userViewModel) });

};

const signup = () => async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid data passed.', 422);
        return next(error);
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new HttpError('User with this email already exists', 422);
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = new User({
        username,
        email,
        password: hashedPassword,
        image: req.file.path,
        places: []
    });

    await createdUser.save();

    const token = jwt.sign({
        userId: createdUser._id.toString(),
        email: createdUser.email
    },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        });

    res
        .status(201)
        .json({
            user: userViewModel(createdUser),
            token
        });

};

const login = () => async (req, res, next) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        const error = new HttpError('Wrong email or password, please try again', 422);
        return next(error);
    }

    const isPasswordCorrect = await bcrypt
        .compare(password, existingUser.password);

    if (!isPasswordCorrect) {
        const error = new HttpError('Invalid password', 403);
        return next(error);
    }

    const token = jwt.sign({
        userId: existingUser._id.toString(),
        email: existingUser.email
    },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        });

    res.json({ user: userViewModel(existingUser), token });

};

module.exports = {
    getAllUsers,
    signup,
    login
};
