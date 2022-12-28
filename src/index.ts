import express from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import morgan from 'morgan';

import { AppDataSource, User } from "@vulcan/models";
import { router } from '@vulcan/routes';

export const app = express();

// Parse requests of content-type - application/json
app.use(express.json());
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Log requests
app.use(morgan('dev'));
// Mount router
app.use(router);

// Setup passport
app.use(passport.initialize());
// Passport local strategy
passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}, async (jwtPayload, done) => {
    const user = await User.findOneBy({id: jwtPayload.sub}).catch((err) => {
        return done(err, false);
    });

    const MILLISECONDS_IN_A_SECOND = 1000;
    if (jwtPayload.exp < Date.now() / MILLISECONDS_IN_A_SECOND) {
        return done(null, false);
    }

    return user ? done(null, user) : done(null, false);
}));

(async () => {
    await AppDataSource.initialize().then(() => {
        console.log('The database is initialized.');
    }).catch((error) => {
        console.log('The database failed to initialize:', error);
    });

    app.listen({host: process.env.HOST, port: process.env.PORT}, () => {
        console.info(`The server is running on ${process.env.HOST}:${process.env.PORT}`);
    });
})();
