import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import { prisma } from "../../utils/Prisma";

const getUnreadMessages = asyncHandler(
    async(req: Request, res: Response)=> {
        try {
            const unreadMessages = await prisma.message.findMany({
                where: {
                    receiver: req.user.username
                },
                select: {
                    sender: true,
                    content: true
                }
            });
            if(!unreadMessages) {
                return res.status(200).json(new ApiResponse(200, "Found none unread messages", []));
            }
            await prisma.message.deleteMany({
                where: {
                    receiver: req.user.username
                }
            });
            return res.status(200).json(new ApiResponse(200, `Found ${unreadMessages.length} unread messages`, unreadMessages));
        } catch (err) {
            return res.status(400).json(new ApiError(400, "Issue fetching the messages"));
        }
    }
)

export {
    getUnreadMessages
}
