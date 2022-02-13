const usersRouter = require('express').Router();
const { check } = require('express-validator');

const usersController = require('../controllers/users');
const fileUpload = require('../middlewares/file-upload');


usersRouter.get('/', usersController.getAllUsers);

usersRouter.post('/signup',
    fileUpload.single('image'),
    [
        check('username').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 8 })
    ],
    usersController.signup);

usersRouter.post('/login', usersController.login);


module.exports = usersRouter;
