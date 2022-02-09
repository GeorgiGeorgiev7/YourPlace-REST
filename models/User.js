const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    places: { type: String, required: true } // todo
});

userSchema.plugin(uniqueValidator);

module.exports = model('User', userSchema)