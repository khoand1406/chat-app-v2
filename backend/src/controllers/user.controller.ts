import { Request, Response } from 'express';
import { UserServices } from '../services/user.services';
import { CreateUserRequest } from '../dtos/user/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from '../models/user.model';
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
        const userDto = plainToInstance(CreateUserRequest, userData);
        const errors = await validate(userDto);
        if (errors.length > 0) {
            return response.status(400).json({ errors: errors.map(err => err.constraints) });
        }
        
        const existingUser= await User.findOne({where: {
            userName: userDto.username
        }})

        const existingMail= await User.findOne({where: {email: userDto.email}})
        
        if(existingUser || existingMail){
            return response.status(400).json({error: "Existing email or username"});
        }
        const newUser = await this._userService.createUsers(userDto);

        return response.status(201).json(newUser);
    } catch (error) {
        return response.status(400).json({ Error: `${error}` });
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