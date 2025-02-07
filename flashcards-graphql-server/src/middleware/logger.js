import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

export const logEvents = async (message, logfileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}`;

    try {
        if (!fs.existsSync(path.join('logs'))) {
            await fsPromises.mkdir(path.join('logs'));
        }
        await fsPromises.appendFile(path.join('logs', logfileName), logItem);
    } catch (error) {
        console.log(error);
    }
};

export const logger = (req, res, next) => {
    logEvents(
        `${req.method}\t
        ${req.url}\t
        ${req.headers.origin}\t`,
        'requests.log'
    );
    next();
};
