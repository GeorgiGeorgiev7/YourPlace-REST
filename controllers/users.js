const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/httpError');


const DUMMY_DATA = [
    {
        id: 'u1',
        username: 'Gogog G',
        email: 'test@abv.bg',
        password: '12345678'
    }
];

const getAllUsers = (req, res) => {
    res.json({ users: DUMMY_DATA });
};

const signup = (req, res) => {
    const { username, email, password } = req.body;

    const userAlreadyExists =
        Boolean(DUMMY_DATA.find(user => user.email == email));

    if (userAlreadyExists) {
        throw new HttpError('User already exists.', 422);
    }

    const createdUser = {
        id: uuidv4(),
        username,
        email,
        password
    };

    DUMMY_DATA.push(createdUser);

    res.status(201).json({ user: createdUser });
};

const login = (req, res) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_DATA.find(user => user.email == email);
    console.log(identifiedUser);

    if (!identifiedUser || identifiedUser.password != password) {
        throw new HttpError(
            'Could not identify user, credentials seem to be wrong.', 401
        );
    }

    res.json({ message: 'Successfully logged in.' });

};

module.exports = {
    getAllUsers,
    signup,
    login
};