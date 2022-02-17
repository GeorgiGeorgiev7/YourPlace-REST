const fs = require('fs');


const errorHandler = () => (err, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => console.log(err));
    }

    if (res.headersSent)
        return next(err);

    res
        .status(err.code || 500)
        .json({
            message:
                err.message || 'An unknown server error occurred!'
        });

};


module.exports = errorHandler;