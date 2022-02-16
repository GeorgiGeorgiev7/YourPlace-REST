const HttpError = require('../../models/httpError');
const jwt = require('jsonwebtoken');


module.exports = () => (req, res, next) => {
    if (req.method == 'OPTIONS') {
        return next();
    }

    const token = req.headers.authorization;

    if (!token) {
        const error = new HttpError('Authentication failed: Invalid token!', 403);
        return next(error);
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: data.userId };
    next();
};