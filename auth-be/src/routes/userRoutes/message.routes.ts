import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getUnreadMessages } from "../../controllers/messageControllers/message.fetchUnreadMessages";

const messageRouter = Router();
messageRouter.route("/fetch-unread-messages").get(authMiddleware, getUnreadMessages);

export {messageRouter}
