import { Request, Response, NextFunction } from "express";
import { FilterQuery } from "mongoose";
import { UserSignUp, UserLogIn, UserModel, UserDoc } from "../types/types";
import { createError } from "../helpers/error";
import bcrypt from "bcryptjs";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const body = req.body as UserSignUp;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(body.password, salt);
      const newUser = new User({ ...body, password: hash });

      await newUser.save();
      res.json("User has been created!");
   } catch (error) {
      next(error);
   }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const body = req.body as UserLogIn;
      const user = (await User.findOne({ email: body.email })) as FilterQuery<UserModel>;
      if (!user) return next(createError(404, "User not found!"));

      const isCorrect = await bcrypt.compare(body.password, user.password);
      if (!isCorrect) return next(createError(400, "Wrong credentials!"));

      const token = jwt.sign({ id: user._id }, process.env.JWT as string);

      const { password, ...otherDetails } = user._doc;

      res.cookie("access_token", token, { httpOnly: true, maxAge: 60 * 60 * 24 * 2 * 1000 }).json(
         otherDetails
      );
   } catch (error) {
      next(error);
   }
};

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
         const token = jwt.sign({ id: user._id }, process.env.JWT as string);
         res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 2 * 1000,
         }).json(user);
      } else {
         const newUser = new User({ ...req.body, fromGoogle: true, password: ":p" });
         const savedUser = await newUser.save();

         const usedUserDoc = savedUser as unknown as UserDoc;

         const token = jwt.sign({ id: savedUser._id }, process.env.JWT as string);

         const { password, ...otherDetails } = usedUserDoc._doc;

         res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 2 * 1000,
         }).json(otherDetails);
      }
   } catch (error) {
      next(error);
   }
};

export const logout = async (_req: Request, res: Response, next: NextFunction) => {
   try {
      res.clearCookie("access_token");
      res.json("Cookie delete!");
   } catch (error) {
      next(error);
   }
};
