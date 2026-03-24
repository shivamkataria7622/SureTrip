 const HttpError = require('./Http_error');
 class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
 }
 module.exports = HttpError;