const placesRouter = require('express').Router();
const { check } = require('express-validator');

const placesController = require('../controllers/places');


placesRouter.get('/:pid', placesController.getPlaceById);

placesRouter.get('/user/:uid', placesController.getPlacesByUserId);

placesRouter.post('/',
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 10 }),
        check('address').not().isEmpty()
    ],
    placesController.createPlace);

placesRouter.patch('/:pid',
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 10 })
    ]
    , placesController.updatePlaceById);

placesRouter.delete('/:pid', placesController.deletePlaceById);


module.exports = placesRouter;
