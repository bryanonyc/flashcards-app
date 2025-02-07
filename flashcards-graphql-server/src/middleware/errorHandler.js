import { logEvents } from './logger.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const errorHandler = (err, req, res) => {
    logEvents(
        `${err.name}: \t
        ${err.message}\t
        ${req.method}\t
        ${req.url}\t
        ${req.headers.origin}`,
        'errors.log'
    );

    let errorMessage;
    if (err instanceof PrismaClientKnownRequestError) {
        errorMessage = err.meta;
    } else {
        errorMessage = err.message;
    }
    const status = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(status).json({ message: errorMessage, isError: true });
};

export const handleError = (req, res, error) => {
    errorHandler(error, req, res);
};
