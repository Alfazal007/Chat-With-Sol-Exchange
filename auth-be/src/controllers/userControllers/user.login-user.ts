import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/AsyncHandler";
import { loginUserType } from "../../zod/loginUserType";
import { prisma } from "../../utils/Prisma";
import { comparePassword } from "../../utils/HashPassword";
import { generateAccessToken, generateRefreshToken } from "../../utils/TokenGenerators";
import { ApiResponse } from "../../utils/ApiResponse";

const loginUser = asyncHandler( async(req: Request, res: Response) => {
    try {
        // need email or username along with password
        if(!req.body) {
            return res.status(400).json(new ApiError(400, `No request body provided`, []));
        }
        const result = loginUserType.safeParse(req.body);
        if(result.error) {
            const errors = [];
            errors.push(result.error.errors.map((x) => x.message))
            return res.status(400).json(new ApiError(400, "Invalid request body", [], "" ,errors[0]))
        }
        try {
            const userFromDB = await prisma.user.findFirst({
                where: {
                    OR: [
                        {
                            email: result.data.username
                        },
                        {
                            username: result.data.username
                        }
                    ]
                }
            });
            if(!userFromDB) {
                return res.status(404).json(new ApiError(404, "No user found in the DB matching these credentials"))
            }
            // found the user now validate the password
            const isValidPassword = await comparePassword(result.data.password, userFromDB.password);
            if(!isValidPassword) {
                return res.status(400).json(new ApiError(400, "Invalid password"))
            }
            // generate access token and refresh token
            const accessToken = generateAccessToken(userFromDB);
            const refreshToken = generateRefreshToken(userFromDB);
            // update refresh token in the database
            try {
                await prisma.user.update({
                    where: {
                        username: userFromDB.username
                    },
                    data: {
                        refreshToken
                    }
                });
            } catch(err) {
                return res.status(400).json(new ApiError(400, "Issue talking to the database"));
            }
            const options = {
                httpOnly: true,
                secure: true
            };
            return res.status(200).cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, "Login successful", {
                    accessToken, refreshToken
            }));
        } catch(err) {
            return res.status(400).json(new ApiError(400, "Issue talking to the database"))
        }
    } catch(err: any) {
        let errMessage = err?.message || "";
        return res.status(400).json(new ApiError(400, `There was an unexpected error ${errMessage}`, []))
    }
});

export {loginUser}
