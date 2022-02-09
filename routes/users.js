const usersRouter = require('express').Router();
const { check } = require('express-validator');

const usersController = require('../controllers/users');


usersRouter.get('/', usersController.getAllUsers);

usersRouter.post('/signup',
    [
        check('username').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 8 })
    ],
    usersController.signup);

usersRouter.post('/login', usersController.login);


module.exports = usersRouter;
