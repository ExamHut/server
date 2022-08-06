import express from 'express';
import passport from 'passport';
import { Op } from 'sequelize';
import * as jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy } from "passport-jwt";
import morgan from 'morgan';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';

import { sequelize } from './models';
import { User } from './models';
import { router } from './routes';

const app = express();

// Parse requests of content-type - application/json
app.use(express.json());
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Log requests
app.use(morgan('dev'));
// Mount router
app.use(router);

// Setup AdminJS
AdminJS.registerAdapter(AdminJSSequelize);

const adminjs = new AdminJS({
    databases: [sequelize],
    rootPath: '/admin',
    branding: {
        companyName: 'ExamHut',
    },
});

app.use(adminjs.options.rootPath, AdminJSExpress.buildRouter(adminjs));


// Setup passport
app.use(passport.initialize());
// Passport local strategy
passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}, (jwtPayload, done) => {
    User.findOne({ where: { id: jwtPayload.id, refreshToken: { [Op.ne]: null } } })
        .then(user => {
            if (user) {
                const refresh_payload = jwt.decode(user.refreshToken) as jwt.JwtPayload;
                // Refresh token is outdated. Delete (logout).
                if (refresh_payload.exp < Date.now()) {
                    user.refreshToken = null;
                    user.save();
                    return done(null, false, "Refresh token is outdated. Please login again.");
                }
                return done(null, user);
            }
            return done(null, false);
        }).catch(err => {
            return done(err, false);
        });
}));

sequelize.sync({ force: false }).then(() => {
    console.log("Database synced.");
});

app.listen({host: process.env.HOST, port: process.env.PORT}, () => {
    console.info(`The server is running on ${process.env.HOST}:${process.env.PORT}`);
});