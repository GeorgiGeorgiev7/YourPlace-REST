const fs = require('fs');

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

    let user;

    try {
        user = await User.findById(userId).populate('places');
    } catch (err) {
        const error = new HttpError(
            err.message,
            500
        );
        return next(error);
    }

    res.json({ places: user.places.map(placeModelView) });
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
        image: req.file.path,
        creator
    });

    try {
        await createdPlace.save();
        user.places.push(createdPlace);
        await user.save();

        res
            .status(201)
            .json({ place: placeModelView(createdPlace) });
    } catch (err) {
        const error = new Error('Creation failed.', 500);
        return next(error);
    }

};

const updatePlaceById = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid data passed.', 422);
        return next(error);
    }


    const placeId = req.params.pid;
    const { title, description } = req.body;

    const place = await Place.findById(placeId);

    if (place.creator.toString() != req.user.userId) {
        const error = new HttpError('You are not allowed to edit this place.', 401);
        return next(error);
    }

    place.title = title;
    place.description = description;

    await place.save();

    const user = await User.findById(place.creator);
    const index = user.places
        .findIndex(p => p._id == place._id);

    user.places[index] = place;

    res
        .status(200)
        .json({ place: placeModelView(updatedPlace) });

};

const deletePlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    if(req.user.userId != placeId) {
        const error = new HttpError('You are not allowed to delete this place.', 401);
        return next(error);
    }

    const place = await Place.findByIdAndRemove(placeId);
    fs.unlink(place.image, err => err && console.log(err));

    const user = await User.findById(place.creator.toString());
    const index = user.places
        .findIndex(p => p._id != updatedPlace._id);

    user.places.splice(index, 1);

    res
        .status(200)
        .json({ message: 'Successfully deleted place.' });

};

module.exports = {
    getPlaceById,
    getPlacesByUserId,
    createPlace,
    updatePlaceById,
    deletePlaceById
};
