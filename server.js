const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const placesRouter = require('./routes/places');
const usersRoutes = require('./routes/users');

const HttpError = require('./models/httpError');


start();

async function start() {
    const CONNECTION_STRING = 'mongodb://localhost:27017/yourplace';

    await new Promise((resolve, reject) => {
        mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const db = mongoose.connection;

        db.once('open', () => {
            console.log('>>> Database connected');
            resolve();
        });
        db.on('error', (err) => {
            console.log('>>> MongoDB connection error');
            reject(err);
        });
    });

    const PORT = 5000;
    const app = express();

    app.use(bodyParser.json());

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Allow-Methods',
            'GET, POST, PATCH, DELETE, OPTIONS');
        next();
    });

    app.use('/api/places', placesRouter);
    app.use('/api/users', usersRoutes);

    app.use('/*', () => {
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
        console.log(`>>> Server running: http://localhost:${PORT}`));
}
