import { Router } from "express";
import { createNewUserHandler } from "../../controllers/userControllers/user.create-user";

const userRouter = Router();
userRouter.route("/create-user").post(createNewUserHandler);

export {userRouter}
