import { Router } from "express";
import passport from "passport";

import * as auth from "@vulcan/controllers/auth";
import * as user from "@vulcan/controllers/user";

export const router = Router();

// Auth
router.post("/login", auth.login);
router.post("/token", auth.token);
router.delete("/logout", passport.authenticate('jwt', { session: false }), auth.logout);

// Demo route: ping-pong
router.get('/ping', (req, res) => {
    res.send('pong');
});

// Ping with authentication
router.get('/ping/auth', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('pong');
});

router.get('/user', passport.authenticate('jwt', { session: false }), user.userInfo);