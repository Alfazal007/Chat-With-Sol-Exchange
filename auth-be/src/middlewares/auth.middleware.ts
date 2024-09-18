import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../utils/Prisma";

interface User {
    id: string;
    username: string;
    email: string;
    refreshToken: string;
    first_name: string | null;
    last_name: string | null;
}

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

const authMiddleware = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if(!accessToken && !refreshToken) {
        return res.status(401).json(new ApiError(401, "Forbidden request, relogin"));
    }
    let validRefreshToken = false;
    let userInfo;
    if(accessToken) {
        try {
            userInfo = jwt.verify(accessToken, process.env.ACCESSTOKENSECRET || "") as JwtPayload;
        } catch(err) {}
    }
    if(!userInfo) {
        try {
            validRefreshToken = true;
            userInfo = jwt.verify(refreshToken, process.env.REFRESHTOKENSECRET || "") as JwtPayload;
        } catch(err) {}
    }
    if(!userInfo) {
        return res.status(401).json(new ApiError(401, "Forbidden request, relogin"));
    }
    try {
        let user = await prisma.user.findFirst({
            where: {
                id: userInfo.id
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                username: true,
                refreshToken: true
            }
        });
        if(!user) {
            return res.status(400).json(new ApiError(400, "User not found in the database"));
        }
        if(user.refreshToken != refreshToken) {
            return res.status(401).json(new ApiError(401, "Forbidden request, relogin"));
        }
        req.user = user;
    } catch(err) {
        return res.status(500).json(new ApiError(500, "Issue talking to the database"));
    }
    return next();
});

export {
    authMiddleware
}
