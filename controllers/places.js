const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/httpError');


const DUMMY_DATA = [
];


const getPlaceById = (req, res, next) => {
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

const getPlaceByUserId = (req, res, next) => {
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

const createPlace = (req, res, next) => {
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

module.exports = {
    getPlaceById,
    getPlaceByUserId,
    createPlace
};
