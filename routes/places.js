const placesRouter = require('express').Router();

const HttpError = require('../models/httpError');

const DUMMY_DATA = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the greatest skyscrapers in the world!',
        imageUrl: 'https://images.fineartamerica.com/images-medium-large-5/empire-state-building-at-sunset-sylvain-sonnet.jpg',
        address: '20 W 34th St, New York, NY 10001, United States',
        coordinates: {
            lat: 40.7484445,
            lng: -73.9878531
        },
        creatorId: 'uid1'
    },

    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the greatest skyscrapers in the world!',
        imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipOqzJqLshzKnIkL6VlTOaPu6Y2YoEjrGXy79I4E=w408-h271-k-no',
        address: '20 W 34th St, New York, NY 10001, United States',
        coordinates: {
            lat: 40.7484445,
            lng: -73.9878531
        },
        creatorId: 'uid2'
    },

    {
        id: 'p3',
        title: 'Empire State Building',
        description: 'One of the greatest skyscrapers in the world!',
        imageUrl: 'https://static.posters.cz/image/1300/posters/henri-silberman-empire-state-building-i12995.jpg',
        address: '20 W 34th St, New York, NY 10001, United States',
        coordinates: {
            lat: 40.7484445,
            lng: -73.9878531
        },
        creatorId: 'uid1'
    }
];


placesRouter.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_DATA.find(p => p.id == placeId);

    if (!place) {
        throw new HttpError(
            'Could not find a place for the provided id.',
            404
        );
    }

    res.json({ place });
});

placesRouter.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_DATA.filter(p => p.creatorId == userId);

    if (places.length === 0) {
        return next(new HttpError(
            'Could not find places for the provided user id.',
            404
        ));
    }

    res.json({ places });
});


module.exports = placesRouter;
