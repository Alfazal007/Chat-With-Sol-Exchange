import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(
    express.json({
        limit: "16kb",
    })
); // form-data-limit

app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
); // the middleware for reading url params in different browsers

app.use(express.static("public")); // static files which anyone can access
app.use(cookieParser()); // get cookies from browser and also to set it

import { userRouter } from "./routes/userRoutes/user.routes";
app.use("/api/v1/user", userRouter);

import { messageRouter } from "./routes/userRoutes/message.routes";
app.use("/api/v1/message", messageRouter);

export { app };
