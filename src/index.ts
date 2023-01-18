import express from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import morgan from 'morgan';

import { AppDataSource, User } from "@vulcan/models";
import { router } from '@vulcan/routes';
import * as AdminJSExpress from '@adminjs/express';
import { Database } from '@adminjs/typeorm';
import { validate } from 'class-validator';
import AdminJS from 'adminjs';

import { adminjsoptions } from './admin';
import { CustomResource } from './admin/resource';

AdminJS.registerAdapter({ Database, Resource: CustomResource });
CustomResource.validate = validate;

export const app = express();

// Parse requests of content-type - application/json
app.use(express.json());
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

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

    const adminjs = new AdminJS(adminjsoptions);

    if (process.env.BYPASS_ADMINJS_AUTH === 'true') {
        console.warn('Bypassing AdminJS authentication.');
        app.use(adminjs.options.rootPath, AdminJSExpress.default.buildRouter(adminjs));
    } else {
        app.use(
            adminjs.options.rootPath,
            AdminJSExpress.default.buildAuthenticatedRouter(
                adminjs,
                {
                    authenticate: async (username: string, password: string) => {
                        const user = await User.findOne({ where: { username: username } });
                        if (user) {
                            if (user.verifyPassword(password) && user.isAdmin) {
                                return user;
                            }
                        }
                        return null;
                    },
                    cookiePassword: process.env.COOKIE_PASSWORD,
                },
                null,
                {
                    resave: true,
                    saveUninitialized: true,
                    secret: process.env.SESSION_SECRET,
                    cookie: {
                        maxAge: 60000 * 60 * 24,
                        httpOnly: process.env.NODE_ENV === 'production',
                        secure: process.env.NODE_ENV === 'production',
                    },
                    name: 'adminjs',
                }
            )
        );
    }

    app.listen({host: process.env.HOST, port: process.env.PORT}, () => {
        console.info(`The server is running on ${process.env.HOST}:${process.env.PORT}`);
    });
})();
