import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";

export interface UserModel extends Document {
   _id: string;
   name: string;
   email: string;
   password: string;
   img: string;
   subscribers: number;
   subscribedUsers: string[];
   fromGoogle: boolean;
   createdAt: Date;
   updatedAt: Date;
   __v: number;
}

interface UserDoc {
   _doc: UserModel;
}

export interface VideoModel extends Document {
   _id: string;
   userId: string;
   title: string;
   desc: string;
   imgUrl: string;
   videoUrl: string;
   views: number;
   tags: string;
   likes: string[];
   dislikes: string[];
   createdAt: Date;
   updatedAt: Date;
   __v: number;
}

export interface CommentModel extends Document {
   _id: string;
   userId: string;
   videoId: string;
   desc: string;
   createdAt: Date;
   updatedAt: Date;
   __v: number;
}

interface JWTInfo {
   user: { id: string; iat: number; exp: number };
}

interface Req extends Request {
   user?: { id: string; iat: number; exp: number };
}

export interface UserSignUp {
   name: string;
   email: string;
   password: string;
}

export type UserLogIn = Omit<UserSignUp, "name">;

export interface Error {
   name?: string;
   message: string;
   status: number;
   code?: number;
}

export type ErrorRequestHandler = (
   err: any,
   req: Request,
   res: Response,
   next: NextFunction
) => any;
