const placesRouter = require('express').Router();
const { check } = require('express-validator');

const placesController = require('../controllers/places');

const fileUpload = require('../middlewares/file-upload');

const isAuth = require('../middlewares/guards/is-auth');


placesRouter.get('/:pid', placesController.getPlaceById());

placesRouter.get('/user/:uid', placesController.getPlacesByUserId());

placesRouter.post('/', isAuth(),
    fileUpload.single('image'),
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 10 }),
        check('address').not().isEmpty()
    ],
    placesController.createPlace());

placesRouter.patch('/:pid', isAuth(),
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 10 })
    ],
    placesController.updatePlaceById());

placesRouter.delete('/:pid', isAuth(),
    placesController.deletePlaceById());


module.exports = () => placesRouter;
