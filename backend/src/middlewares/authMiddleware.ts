import { NextFunction, Request, Response } from "express";
import { Token } from "../models/token";

export const checkToken= async(request: Request, response: Response, next: NextFunction) => {
    try {
        const authHeaders= request.headers.authorization;
        if(!authHeaders) return response.status(401).json({"error":"Unauthorized. Authorization missing"});
        const token= authHeaders.split(" ")[1];
        if(!token) return response.status(401).json({"error": "Token not found"});
        const tokenFind= await Token.findOne({where: {token}});
        if(!tokenFind) return response.status(401).json({"error":"Invalid token"});
        if (!tokenFind.userId) return response.status(401).json({ Error: "UserId not found" });
        
        (request as any).userId= tokenFind.userId;
        next();

    } catch (error) {
        return response.status(500).json({ Error: "Internal Server Error", Details: error });
    }
}