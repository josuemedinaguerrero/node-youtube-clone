import dotenv from "dotenv";
import mongoose from "mongoose";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import videoRoutes from "./routes/videos.routes";
import commentRoutes from "./routes/comments.routes";
import cookieParser from "cookie-parser";
import { ErrorRequestHandler } from "./types/types";

const app = express();
dotenv.config();

const connect = () => {
   mongoose
      .connect(process.env.MONGODB as string)
      .then(() => console.log("Connected to database"))
      .catch((err) => {
         throw err;
      });
};

app.get("/", (_req: Request, res: Response) => {
   res.send([]);
});

app.use(function (_req: Request, res: Response, next: NextFunction) {
   res.header("Access-Control-Allow-Origin", "https://jos-tube28.netlify.app");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.use(cors({ origin: "https://jos-tube28.netlify.app", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
   const status = err.status || 500;
   const message = err.message || "Something went wrong!";
   return res.status(status).json({
      success: false,
      status,
      message,
   });
};

app.use(errorHandler);

app.listen(process.env.PORT, () => {
   connect();
   console.log(`Server running on port ${process.env.PORT}`);
});
