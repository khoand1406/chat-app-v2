import { CreateUserRequest } from "../dtos/user/create-user.dto";
import bcrypt from 'bcrypt';
import { UserResponse } from "../dtos/user/user-response.dto";
import { Role } from "../models/role.model";
import { User } from "../models/user.model";

export class UserServices{
    async createUsers(model: CreateUserRequest): Promise<UserResponse>{
        const user= User.create({userName: model.username, 
                                email: model.email, 
                                passwordHash: model.passwordHash, 
                                avatarUrl: model.avatarUrl})

        const defaultRole= await Role.findOne({where: {roleName: 'user'}});
        if(defaultRole===null) throw Error("Invalid role");
        (await user).$add('roles', defaultRole);
        return new UserResponse(user);
    }

    async getUsers(): Promise<UserResponse[]>{
        const users= await User.findAll({include: [Role]});
        return users.map(item=> new UserResponse(item));
    }

    async getUserById(id:number): Promise<UserResponse>{
        const user= await User.findByPk(id, {include: [Role]});
        if(user===null) throw Error("User not found");
        return new UserResponse(user);
    }
    
    async authenticateUser(email: string, passwordHash: string): Promise<UserResponse> {
        const user = await User.findOne({ where: { email }, include: [Role] });
        if (!user) throw Error("User not found");
        const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
        if (!isMatch) throw Error("Invalid credentials");
        return new UserResponse(user);
    }
}