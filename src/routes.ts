import { Router } from "express";
import passport from "passport";

import * as auth from "@vulcan/controllers/auth";
import * as user from "@vulcan/controllers/user";
import * as problem from "@vulcan/controllers/problem";
import * as submission from "@vulcan/controllers/submission";

export const router = Router();

// Auth
router.post("/login", auth.login);
router.post("/token", auth.token);
router.delete("/logout", passport.authenticate('jwt', { session: false }), auth.logout);

// User
router.get('/user', passport.authenticate('jwt', { session: false }), user.userInfo);

// Problems
router.get("/problem/:problemId", passport.authenticate('jwt', { session: false }), problem.problemInfo);
router.get("/submission/:submissionId", passport.authenticate('jwt', { session: false }), submission.submissionInfo);
router.get("/problem/:problemId/submissions", passport.authenticate('jwt', { session: false }), submission.allSubmissionInfo);

// Demo route: ping-pong
router.get('/ping', (req, res) => {
    res.send('pong');
});

// Ping with authentication
router.get('/ping/auth', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('pong');
});
