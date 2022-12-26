import * as jwt from 'jsonwebtoken';

import { Request, Response } from 'express';

import { AppDataSource, User } from "@vulcan/models";

export async function login(req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await User.findOneBy({ username: username });

    if (!user || !user.verifyPassword(password)) {
        res.status(401).send('Invalid username or password');
        return;
    }

    const access_token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const refresh_token = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

    await User.update({ refreshToken: refresh_token }, user);

    res.status(200).json({
        access_token: access_token,
        refresh_token: refresh_token,
    });
}

export async function token(req: Request, res: Response) {
    const { refresh_token } = req.body;
    const payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET) as jwt.JwtPayload;

    if (!payload || payload.exp < Date.now()) {
        res.status(401).send('Invalid refresh token');
        return;
    }

    const user = await User.findOneBy({ id: payload.id });

    if (!user) {
        res.status(401).send('Invalid refresh token');
        return;
    }

    // Same user, but wrong token.
    if (user.refreshToken !== refresh_token) {
        // Delete current token to prevent replay attacks.
        await User.update({ refreshToken: null }, user);
        res.status(401).send('Invalid refresh token. Please login again.');
        return;
    }

    const access_token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const new_refresh_token = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

    await User.update({ refreshToken: refresh_token }, user);

    res.status(200).json({
        access_token: access_token,
        refresh_token: new_refresh_token,
    });
}

export async function logout(req: Request, res: Response) {
    req.user.refreshToken = null;  // Without refresh token, user state is equivalent to logged out
    await req.user.save();
    res.status(200).send('Logged out');
}
