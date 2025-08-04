import { Request, Response } from 'express';
import { UserServices } from '../services/user.services';
export class UserController {
    private readonly _userService: UserServices;
    constructor(private readonly userService?: UserServices) {
        this._userService = userService ?? new UserServices();
    }
    getUserById = async (request: Request, response: Response) => {
        try {
            const userId = request.params.id;
            if (!userId || isNaN(parseInt(userId))) {
                return response.status(400).json({ Error: "Invalid User ID" });
            }
            const user = await this._userService.getUserById(parseInt(userId));
            if (!user) {
                return response.status(404).json({ Error: "User not found" });
            }
            return response.status(200).json(user);
        } catch (error) {
            return response.status(500).json({ Error: `${error}` });
        }
    };

    createUser = async (request: Request, response: Response) => {
        try {
            const userData = request.body;
            if (!userData || !userData.username || !userData.email || !userData.passwordHash) {
                return response.status(400).json({ Error: "Invalid user data" });
            }
            const newUser = await this._userService.createUsers(userData);
            return response.status(201).json(newUser);
        } catch (error) {
            return response.status(500).json({ Error: `${error}` });
        }
    };
    getUsers = async (request: Request, response: Response) => {
        try {
            const users = await this._userService.getUsers();
            return response.status(200).json(users);
        } catch (error) {
            return response.status(500).json({ Error: `${error}` });
        }
    };
    
}