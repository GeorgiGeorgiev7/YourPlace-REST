const HttpError = require('../../models/httpError');
const jwt = require('jsonwebtoken');


module.exports = () => (req, res, next) => {
    if (req.method == 'OPTIONS') {
        return next();
    }

    const token = req.headers['Authorization'];

    if (!token) {
        const error = new HttpError('Authentication failed: Invalid token!', 401);
        return next(error);
    }

    const data = jwt.verify(token, '321secretterces123');
    req.user = { userId: data.userId };
    next();
};