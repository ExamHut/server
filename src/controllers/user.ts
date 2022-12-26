import { Request, Response } from 'express';
import { AppDataSource, User } from "@vulcan/models";

export async function userInfo(req: Request, res: Response) {
    let user = await User.findOneBy({id: req.user.id});

    return res.status(200).json({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
    });
}
