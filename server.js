const express = require('express');
const bodyParser = require('body-parser');

const placesRouter = require('./routes/places');
const HttpError = require('./models/httpError');


const PORT = 5000;
const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRouter);

app.use((req, res, next) => {
    throw new HttpError('Could not find this route.', 404);
});

app.use((err, req, res, next) => {
    if (res.headerSent)
        return next(err);

    res
        .status(err.code || 500)
        .json({
            message:
                err.message || 'An unknown server error occurred!'
        });

});

app.listen(PORT, () =>
    console.log(`>>> Server listening: http://localhost:${PORT}`));
