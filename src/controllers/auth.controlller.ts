import { Request, Response } from 'express';
import { UserServices } from '../services/user.services';
import jwt from 'jsonwebtoken';
import { Token } from '../models/token';
export class AuthController{
    private readonly _userService: UserServices;
    
    constructor(private readonly userService?: UserServices) {
        this._userService = userService ?? new UserServices();
    }
    authenticateUser = async (request: Request, response: Response) => {
        const secretKey= process.env.JWT_SECRET || 'chaptatcatheloaibug';
        if (!secretKey) {
            return response.status(500).json({ Error: "JWT secret key is not set" });
        }
       
        try {
            const { email, passwordHash } = request.body;
            if (!email || !passwordHash) {
                return response.status(400).json({ Error: "Email and password are required" });
            }
            
            const user = await this._userService.authenticateUser(email, passwordHash);
            console.log("Authenticated user:", user);
            
            const token = jwt.sign({ email }, secretKey, { expiresIn:  '7d' });
            await Token.create({
                userId: user.id,
                token: token
            });
            return response.status(200).json({ user, token });
        } catch (error) {
            if(error instanceof Error) {
                return response.status(401).json({ Error: error.message });
            }

            return response.status(500).json({ Error: "Internal server error", error: `${error}` });
        }
    }
}
