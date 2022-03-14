require('dotenv').config();
const path = require('path');

const express = require('express');

const HttpError = require('./models/httpError');

const bodyParser = require('body-parser');

const placesRouter = require('./routes/places');
const usersRoutes = require('./routes/users');

const cors = require('./middlewares/cors');
const connectDb = require('./util/database');
const errorHandler = require('./middlewares/errorHandler');


start();

async function start() {
    await connectDb();

    const app = express();

    app.use(bodyParser.json());

    app.use(cors());

    app.use('/uploads/images',
        express.static(path.join('uploads', 'images')));

    app.use('/api/places', placesRouter());
    app.use('/api/users', usersRoutes());

    app.use('/*', () => {
        throw new HttpError('Could not find this route.', 404);
    });

    app.use(errorHandler());

    app.listen(process.env.PORT, () =>
        console.log(`>>> Server running`));
}
