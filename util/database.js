const mongoose = require('mongoose');


const connectDb = () => {
    return new Promise((resolve, reject) => {
        console.log(process.env.CONNECTION_STRING);
        mongoose.connect(process.env.CONNECTION_STRING, {
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
};

module.exports = connectDb;