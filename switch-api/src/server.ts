import { app } from './app';
import { log } from './log';

const ENTRY_PORT = 9000;

app.listen(ENTRY_PORT);
log.info(`Listening to http://localhost:${ENTRY_PORT}`);
