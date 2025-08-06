import { CreateUserRequest } from "../dtos/user/create-user.dto";
import bcrypt from 'bcrypt';
import { UserResponse } from "../dtos/user/user-response.dto";
import { Role } from "../models/role.model";
import { User } from "../models/user.model";

export class UserServices{
    async createUsers(model: CreateUserRequest): Promise<UserResponse> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(model.passwordHash, salt);
    if (!hashedPassword) throw Error("Error hashing password");

    const now = new Date();

    const userPayload = {
      userName: model.username,
      email: model.email,
      passwordHash: hashedPassword,
      avatarUrl: model.avatarUrl ?? undefined,
      createdAt: now,
      updatedAt: now
    };

    console.log("Payload to create user:", userPayload); // ✅ Kiểm tra kỹ trước khi insert

    const user = await User.create(userPayload);

    const defaultRole = await Role.findOne({ where: { roleName: 'user' } });
    if (defaultRole === null) throw Error("Invalid role");

    await user.$add('roles', defaultRole);
    return new UserResponse(user);
  }

    async getUsers(): Promise<UserResponse[]>{
        const users= await User.findAll({include:
    [{
        model: Role,
        through: { attributes: [] },
        attributes: ['roleName'],
    }],
    attributes: { exclude: ['passwordHash'], },});
        return users.map(item=> new UserResponse(item));
    }

    async getUserById(id:number): Promise<UserResponse>{
        const user= await User.findByPk(id, {include: [{
    model: Role,
    through: { attributes: [] },
    attributes: ['roleName'],
    }]
    , attributes: { exclude: ['passwordHash'] }});
        if(user===null) throw Error("User not found");
        return new UserResponse(user);
    }
    
    async authenticateUser(email: string, passwordHash: string): Promise<UserResponse> {
        const user = await User.findOne({ where: { email }, include: [Role] });
        if (!user) throw Error("User not found");
        console.log("User found:", user);
        console.log(user.passwordHash, passwordHash);
        const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
        if (!isMatch) throw Error("Invalid credentials");
        return new UserResponse(user);
    }
}