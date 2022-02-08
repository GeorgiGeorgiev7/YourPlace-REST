const placesRouter = require('express').Router();


placesRouter.get('/', (req, res) => {
    console.log('GET Request came here');
    res.json({ message: 'I works' });
});

module.exports = placesRouter;
