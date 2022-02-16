const { Schema, model } = require('mongoose');


const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    places: [{ type: Schema.Types.ObjectId, ref: 'Place' }]
});


module.exports = model('User', userSchema);
