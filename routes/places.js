const placesRouter = require('express').Router();

const placesController = require('../controllers/places');


placesRouter.get('/:pid', placesController.getPlaceById);

placesRouter.get('/user/:uid', placesController.getPlaceByUserId);


module.exports = placesRouter;
