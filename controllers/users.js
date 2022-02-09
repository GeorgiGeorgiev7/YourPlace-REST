const { validationResult } = require('express-validator');

const HttpError = require('../models/httpError');
const User = require('../models/User');


const userViewModel = (user) => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
        places: user.places
    };
};


const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json({ users: users.map(userViewModel) });
    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

};

const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid data passed.', 422);
        return next(error);
    }

    const { username, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        const error = new HttpError(err.message, 422);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('User with this email already exists', 422);
        return next(error);
    }

    const createdUser = new User({
        username,
        email,
        password, //todo hash
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png',
        places: []
    });

    try {
        await createdUser.save();
        res
            .status(201)
            .json({ createdUser: userViewModel(createdUser) });
    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        const error = new HttpError(err.message, 422);
        return next(error);
    }

    if (!existingUser || existingUser.password != password) {
        const error = new HttpError('Wrong email or password, please try again', 422);
        return next(error);
    }

    res.json({ user: userViewModel(existingUser) });

};

module.exports = {
    getAllUsers,
    signup,
    login
};
