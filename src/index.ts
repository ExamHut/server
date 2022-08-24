import express from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import morgan from 'morgan';
// import AdminJSExpress from '@adminjs/express';
// import AdminJS from 'adminjs';
// import { Database, Resource } from '@adminjs/typeorm';

import { AppDataSource, User } from "@vulcan/models";
import { router } from '@vulcan/routes';

const app = express();

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

    if (jwtPayload.exp < Date.now()) {
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

    // AdminJS.registerAdapter({ Database, Resource });
    // const adminjs = new AdminJS({
    //     databases: [AppDataSource],
    //     rootPath: '/admin',
    //     branding: {
    //         companyName: 'ExamHut',
    //     },
    // });
    // app.use(adminjs.options.rootPath, AdminJSExpress.buildRouter(adminjs));

    app.listen({host: process.env.HOST, port: process.env.PORT}, () => {
        console.info(`The server is running on ${process.env.HOST}:${process.env.PORT}`);
    });
})();
