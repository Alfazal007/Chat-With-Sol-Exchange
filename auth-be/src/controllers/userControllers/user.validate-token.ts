import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { validateTokenType } from "../../zod/validateTokenType";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../utils/Prisma";
import { ApiResponse } from "../../utils/ApiResponse";

const validateToken = asyncHandler(async(req: Request, res: Response) => {
    try {
        if(!req.body) {
            return res.status(200).json(new ApiError(400, "No request body provided"));
        }
        const result = validateTokenType.safeParse(req.body);
        if(result.error) {
            const errors = [];
            errors.push(result.error.errors.map((x) => x.message))
            return res.status(200).json(new ApiError(400, "Invalid request body", [], "" ,errors[0]))
        }
        // check is the provided access token is correct and points to an existing valid user in the database
        let userInfo;
        try {
            userInfo = jwt.verify(result.data.accessToken, process.env.ACCESSTOKENSECRET || "") as JwtPayload;
        } catch(err) {
            return res.status(200).json(new ApiError(401, "Invalid request"));
        }
        if(!userInfo || !userInfo.id) {
            return res.status(200).json(new ApiError(401, "Invalid request"));
        }
        try {
            const userFromDB = await prisma.user.findFirst({
                where: {
                    id: userInfo.id
                },
                select: {
                    id: true,
                    email: true,
                    username: true
                }
            });
            if(!userFromDB) {
                return res.status(200).json(new ApiError(404, "User not found in the database"));
            }
            return res.status(200).json(new ApiResponse(200, "Found the user and validated the user", userFromDB));
        } catch(err) {
            return res.status(200).json(new ApiError(400, "Issue talking to the database"));
        }
    } catch(err) {
        return res.status(200).json(new ApiError(400, "There was an issue with processing the user request"));
    }
});

export {
    validateToken
}
