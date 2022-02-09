const placesRouter = require('express').Router();

const placesController = require('../controllers/places');


placesRouter.get('/:pid', placesController.getPlaceById);

placesRouter.get('/user/:uid', placesController.getPlacesByUserId);

placesRouter.post('/', placesController.createPlace);

placesRouter.patch('/:pid', placesController.updatePlaceById);

placesRouter.delete('/:pid', placesController.deletePlaceById);


module.exports = placesRouter;
