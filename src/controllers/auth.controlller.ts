import { Request, Response } from 'express';
import { UserServices } from '../services/user.services';

export class AuthController{
    private readonly _userService: UserServices;
    constructor(private readonly userService?: UserServices) {
        this._userService = userService ?? new UserServices();
    }
    authenticateUser = async (request: Request, response: Response) => {
        try {
            const { email, passwordHash } = request.body;
            if (!email || !passwordHash) {
                return response.status(400).json({ Error: "Email and password are required" });
            }
            const user = await this._userService.authenticateUser(email, passwordHash);
            return response.status(200).json(user);
        } catch (error) {
            if(error instanceof Error) {
                return response.status(401).json({ Error: error.message });
            }

            return response.status(500).json({ Error: "Internal server error", error: `${error}` });
        }
    }
}
