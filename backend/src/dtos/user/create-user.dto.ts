import { IsString, IsEmail, MinLength, IsOptional, IsUrl } from 'class-validator';
import { RoleEnum } from "../../constants/roleEnum";

export class CreateUserRequest {
    @IsString({ message: "Username must be a string " })
    username!: string;

    @IsEmail({}, { message: "Email must be a valid email address" })
    email!: string;

    @IsString({ message: "Password must be a string" })
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    passwordHash!: string;

    @IsOptional()
    @IsUrl({}, { message: "Avatar must be a valid URL" })
    avatarUrl?: string;

    role = RoleEnum.User;
}