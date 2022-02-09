const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const getCoordsForAddress = require('../util/location');

const Place = require('../models/Place');
const HttpError = require('../models/httpError');


let DUMMY_DATA = [
];

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

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_DATA.filter(p => p.creatorId == userId);

    if (places.length === 0) {
        return next(new HttpError(
            'Could not find places for the provided user id.',
            404
        ));
    }

    res.json({ places });
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

const updatePlaceById = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new HttpError('Invalid data passed.', 422);
    }

    const placeId = req.params.pid;
    const { title, description } = req.body;

    const updatedPlace = {
        ...DUMMY_DATA.find(place => place.id == placeId),
        title,
        description
    };
    const placeIndex = DUMMY_DATA.findIndex(place => place.id == placeId);

    DUMMY_DATA[placeIndex] = updatedPlace;

    res.status(200).json({ place: updatedPlace });
};

const deletePlaceById = (req, res, next) => {
    const placeId = req.params.pid;

    if (!DUMMY_DATA.find(place => place.id == placeId)) {
        throw new HttpError('Could not find a place for that id.', 404);
    }

    DUMMY_DATA = DUMMY_DATA.filter(place => place.id != placeId);
    res.status(200).json({ message: 'Successfully deleted place.' });
};

module.exports = {
    getPlaceById,
    getPlacesByUserId,
    createPlace,
    updatePlaceById,
    deletePlaceById
};
