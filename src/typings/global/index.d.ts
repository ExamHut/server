import { User } from '../../models/user.models';

declare module 'express' {
	interface Request {
		user: User;
	}
}
