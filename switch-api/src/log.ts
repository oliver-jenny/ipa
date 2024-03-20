import pino from 'pino';
import pretty from 'pino-pretty';

export const log = pino(pretty({ sync: true }));
