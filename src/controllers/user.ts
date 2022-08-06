import { Request, Response } from 'express';
import { Class, User } from "@vulcan/models";

export async function userInfo(req: Request, res: Response) {
    let user = await User.findOne({
        where: { id: req.user.id },
        include: [ Class ],
    });

    return res.status(200).json({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        classes: user.classes.map(c => c.id),
    });
}