import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { prisma } from "../../utils/Prisma";

const userPresent = asyncHandler(async(req: Request, res: Response)=> {
    if(!req.params || !req.params.username) {
        return res.status(200).json(new ApiResponse(400, "Invalid request to this endpoint", {}));
    }
    const username = req.params.username;
    try {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    username
                }
            });
            if(user) {
                return res.status(200).json(new ApiResponse(200, "Found the user", {}));
            } else {
                return res.status(200).json(new ApiResponse(404, "No user found in the database", {}));
            }
        } catch(err) {
            return res.status(200).json(new ApiResponse(400, "There was certain issue talking to the database", {}));
        }
    } catch(err) {
        return res.status(200).json(new ApiResponse(400, "There was certain issue talking to the backend", {}));
    }
});

export { userPresent }
