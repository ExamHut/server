import { Router } from "express";

export const router = Router();

// Demo route: ping-pong
router.get('/ping', (req, res) => {
    res.send('pong');
});
