const { validationResult } = require('express-validator');

const getCoordsForAddress = require('../util/location');

const Place = require('../models/Place');
const HttpError = require('../models/httpError');


const placeModelView = (place) => {
    return {
        id: place.id,
        title: place.title,
        description: place.description,
        image: place.image,
        address: place.address,
        location: place.location,
        creator: place.creator
    };
};

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError(
            'Could not find a place for the provided id.',
            404
        );
        return next(error);
    }

    console.log(place.toObject({ getters: true }));

    res.json({ place: placeModelView(place) });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;

    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        const error = new HttpError(
            err.message,
            500
        );
        return next(error);
    }

    if (places.length === 0) {
        const error = new HttpError(
            'Could not find places for the provided user id.',
            404
        );
        return next(error);
    }

    res.json({ places: places.map(placeModelView) });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data passed.', 422));
    }

    const { title, description, address, creator } = req.body;

    let location;

    try {
        location = await getCoordsForAddress(address);
    } catch (err) {
        return next(err);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location,
        image: 'todo',
        creator
    });

    try {
        await createdPlace.save();
    } catch (err) {
        const error = new Error('Place creating failed.', 500);
        return next(error);
    }

    res.status(201).json({ place: createdPlace });

};

const updatePlaceById = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new HttpError('Invalid data passed.', 422);
    }

    const placeId = req.params.pid;
    const { title, description } = req.body;

    let updatedPlace;
    try {
        updatedPlace = await Place.findByIdAndUpdate(placeId, {
            title,
            description
        });
    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

    res.status(200).json({ place: placeModelView(updatedPlace) });
};

const deletePlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    try {
        await Place.findByIdAndDelete(placeId);
    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

    res.status(200).json({ message: 'Successfully deleted place.' });
};

module.exports = {
    getPlaceById,
    getPlacesByUserId,
    createPlace,
    updatePlaceById,
    deletePlaceById
};
