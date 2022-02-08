class HttpError extends Error {
    constructor(message, errCode) {
        super(message);
        this.code = code;

    }
}

module.exports = HttpError;