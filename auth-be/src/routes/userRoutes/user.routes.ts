import { Router } from "express";
import { createNewUserHandler } from "../../controllers/userControllers/user.create-user";
import { loginUser } from "../../controllers/userControllers/user.login-user";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getCurrentUser } from "../../controllers/userControllers/user.getCurrentUser";
import { validateToken } from "../../controllers/userControllers/user.validate-token";
import { uniqueUsername } from "../../controllers/userControllers/user.uniqueUsername";
import { userPresent } from "../../controllers/userControllers/user.userPresent";

const userRouter = Router();
userRouter.route("/create-user").post(createNewUserHandler);
userRouter.route("/login-user").post(loginUser);
userRouter.route("/current-user").get(authMiddleware, getCurrentUser);
userRouter.route("/validate-user").post(validateToken);
userRouter.route("/unique-username/:username").get(uniqueUsername);
userRouter.route("/current-user-cookie").get(authMiddleware, getCurrentUser);
userRouter.route("/get-username/:username").get(authMiddleware, userPresent);

export {userRouter}
