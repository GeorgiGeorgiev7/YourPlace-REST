const usersRouter = require('express').Router();

const usersController = require('../controllers/users');


usersRouter.get('/', usersController.getAllUsers);

usersRouter.post('/signup', usersController.signup);

usersRouter.post('/login', usersController.login);


module.exports = usersRouter;
