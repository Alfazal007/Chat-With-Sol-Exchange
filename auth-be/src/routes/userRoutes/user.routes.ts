import { Router } from "express";
import { createNewUserHandler } from "../../controllers/userControllers/user.create-user";
import { loginUser } from "../../controllers/userControllers/user.login-user";

const userRouter = Router();
userRouter.route("/create-user").post(createNewUserHandler);
userRouter.route("/login-user").post(loginUser);

export {userRouter}
