import { NextFunction, Response } from "express";
import { Req } from "../types/types";
import { createError } from "./error";
import jwt from "jsonwebtoken";

export const verifyToken = async (req: Req, _res: Response, next: NextFunction) => {
   const token = req.cookies.access_token;
   if (!token) return next(createError(401, "You are not authenticated"));

   jwt.verify(token, process.env.JWT as string, (err: any, user: any) => {
      if (err) return next(createError(403, "Token is not valid!"));
      req.user = user;
      next();
   });
};
