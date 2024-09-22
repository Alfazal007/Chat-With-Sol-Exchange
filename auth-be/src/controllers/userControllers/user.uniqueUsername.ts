import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { prisma } from "../../utils/Prisma";

const uniqueUsername = asyncHandler(async(req: Request, res: Response) => {
    try {
        const username = req.params.username;
        if(!username) {
            return res.status(200).json(new ApiResponse(400, "No request body", {}));
        }
        if(!username || username.length > 20 || username.length < 6) {
            return res.status(200).json(new ApiResponse(200, "Invalid username length", {}));
        }
        try {
            const usernameAvailable = await prisma.user.findFirst({
                where: {
                    username
                }
            });
            if(usernameAvailable) {
                return res.status(200).json(new ApiResponse(200, "Already present", {}));
            }
            return res.status(200).json(new ApiResponse(200, "Username is available", {}));
        } catch(err) {
            return res.status(200).json(new ApiResponse(400, "Issue with the backend", {}));
        }
    } catch(err) {
        return res.status(200).json(new ApiResponse(400, "Issue with the backend", {}));
    }
});

export {
    uniqueUsername
}
