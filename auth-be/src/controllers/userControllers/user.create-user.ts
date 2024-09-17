import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { createUserType } from "../../zod/createUserType";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../utils/Prisma";
import { generateHashPassword } from "../../utils/HashPassword";

const createNewUserHandler = asyncHandler(async(req: Request, res: Response) => {
    try {
        if(!req.body) {
            return res.status(400).json(new ApiError(400, "Request body not provided", []))
        }
        const result = createUserType.safeParse(req.body);
        if(result.error) {
            const errors = [];
            errors.push(result.error.errors.map((x) => x.message))
            return res.status(400).json(new ApiError(400, "Invalid request body", [], "" ,errors[0]))
        }
        // check for uniqueness of username and email
        try {
            const userExists = await prisma.user.findFirst({
                where: {
                    OR: [
                        {
                            username: result.data.username,
                        },
                        {
                            email: result.data.email
                        }
                    ]
                }
            });
            if(userExists) {
                return res.status(400).json(new ApiError(400, "User with similar username or email already exists try logging in", 
                    [], "" ,[]))
            }
        } catch(err) {
            return res.status(500).json(new ApiError(400, `There was an unexpected error while talking to the database`, []))
        }
        // hash the password
        const hashedPassword = await generateHashPassword(result.data.password);
        // store the values into the database
        try {
            const newUser = await prisma.user.create({
                data: {
                    password: hashedPassword,
                    username: result.data.username,
                    email: result.data.email,
                    first_name: result.data.firstName || "",
                    last_name: result.data.lastName || "",
                    refreshToken: ""
                },
                select: {
                    username: true,
                    email: true,
                    id: true,
                    first_name: true,
                    last_name: true
                }
            });
            return res.status(201).json(new ApiResponse(201, "New User Created successfully", newUser))
        } catch(err) {
            return res.status(500).json(new ApiError(400, `There was an unexpected error while writing to the database`, []))
        }
        // return the result
    } catch(err: any) {
        let errMessage = err?.message || "";
        return res.status(500).json(new ApiError(400, `There was an unexpected error ${errMessage}`, []))
    }
});

export {createNewUserHandler}
