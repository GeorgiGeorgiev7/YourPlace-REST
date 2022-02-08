const express = require('express');
const bodyParser = require('body-parser');
const placesRouter = require('./routes/places');


const PORT = 5000;
const app = express();

app.use('/', placesRouter);
app.use(bodyParser.urlencoded());


app.listen(PORT, () =>
    console.log(`>>> Server listening: http://localhost:${PORT}`));
