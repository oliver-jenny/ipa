import passport from 'koa-passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import type { User } from './authentication';
import { log } from '../../log';
import { findUser } from './authentication.service';

export const authenticationMiddleware = () => {
  passport.serializeUser((user: User, done) => {
    done(null, user.username);
  });

  passport.deserializeUser(async (username: string, done) => {
    const user = await findUser({ username });
    done(null, user);
  });

  passport.use(
    new Strategy(async (username, password, done) => {
      try {
        const user: User = await findUser({ username });

        if (await bcrypt.compare(password, user.password)) {
          done(null, user);
        } else {
          log.warn(
            `Login trial with wrong credentials onto user with _id: ${user._id.toString()}`,
          );
          done(null, false);
        }
      } catch (error) {
        const { message } = error as Error;
        log.error(`Error while login process: ${message}`);
        done(null, false);
      }
    }),
  );
};
