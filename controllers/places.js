const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/httpError');


let DUMMY_DATA = [
];


const getPlaceById = (req, res) => {
    const placeId = req.params.pid;
    const place = DUMMY_DATA.find(p => p.id == placeId);

    if (!place) {
        throw new HttpError(
            'Could not find a place for the provided id.',
            404
        );
    }

    res.json({ place });
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

const createPlace = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new HttpError('Invalid data passed.', 422);
    }

    const { title, description, coordinates, address, creator } = req.body;

    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };

    DUMMY_DATA.push(createdPlace);

    res.status(201).json({ place: createdPlace });

};

const updatePlaceById = (req, res) => {
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

const deletePlaceById = (req, res) => {
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
