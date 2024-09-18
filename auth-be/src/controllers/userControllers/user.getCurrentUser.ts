import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

const getCurrentUser = asyncHandler(
    async(req: Request, res: Response)=> {
        res.status(200).json(new ApiResponse(200, "Found the user in the database", req.user));
    }
)

export {
    getCurrentUser
}
