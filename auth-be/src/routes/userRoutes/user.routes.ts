import { Router } from "express";
import { createNewUserHandler } from "../../controllers/userControllers/user.create-user";
import { loginUser } from "../../controllers/userControllers/user.login-user";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getCurrentUser } from "../../controllers/userControllers/user.getCurrentUser";
import { validateToken } from "../../controllers/userControllers/user.validate-token";

const userRouter = Router();
userRouter.route("/create-user").post(createNewUserHandler);
userRouter.route("/login-user").post(loginUser);
userRouter.route("/current-user").get(authMiddleware, getCurrentUser);
userRouter.route("/validate-user").post(validateToken);

export {userRouter}
