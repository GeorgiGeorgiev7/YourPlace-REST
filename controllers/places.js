const { validationResult } = require('express-validator');

const getCoordsForAddress = require('../util/location');

const HttpError = require('../models/httpError');
const Place = require('../models/Place');
const User = require('../models/User');


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

    res.json({ places: places.map(placeModelView) });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data passed.', 422));
    }

    const { title, description, address, creator } = req.body;

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }
    if (!user) {
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }

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
        image: 'https://cdn2.iconfinder.com/data/icons/furniture-243/128/_armchair-furniture-512.png',
        creator
    });

    try {
        await createdPlace.save();

        res
            .status(201)
            .json({ place: placeModelView(createdPlace) });
    } catch (err) {
        console.log(err);
        const error = new Error('Creation failed.', 500);
        return next(error);
    }

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

        res
            .status(200)
            .json({ place: placeModelView(updatedPlace) });
    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

};

const deletePlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    try {
        await Place.findByIdAndDelete(placeId);
        res
            .status(200)
            .json({ message: 'Successfully deleted place.' });
    } catch (err) {
        const error = new HttpError(err.message, 500);
        return next(error);
    }

};

module.exports = {
    getPlaceById,
    getPlacesByUserId,
    createPlace,
    updatePlaceById,
    deletePlaceById
};
