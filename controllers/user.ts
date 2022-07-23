import { NextFunction, Request, Response } from "express";
import { createError } from "../helpers/error";
import { Req } from "../types/types";
import User from "../models/User";
import Video from "../models/Video";

export const updateUser = async (req: Req, res: Response, next: NextFunction) => {
   if (req.params.id === req.user?.id) {
      try {
         const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
         ).select("-password");
         res.json(updatedUser);
      } catch (error) {
         next(error);
      }
   } else {
      return next(createError(403, "You can update only your account!"));
   }
};

export const deleteUser = async (req: Req, res: Response, next: NextFunction) => {
   if (req.params.id === req.user?.id) {
      try {
         await User.findByIdAndDelete(req.params.id);
         res.json("User has been deleted");
      } catch (error) {
         next(error);
      }
   } else {
      return next(createError(403, "You can delete only your account!"));
   }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = await User.findById(req.params.id).select("-password");
      res.json(user);
   } catch (error) {
      next(error);
   }
};

export const subscribe = async (req: Req, res: Response, next: NextFunction) => {
   try {
      await Promise.all([
         User.findByIdAndUpdate(req.user?.id, { $push: { subscribedUsers: req.params.id } }),
         User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: 1 } }),
      ]);
      res.json("Subscription successfull!");
   } catch (error) {
      next(error);
   }
};

export const unsubscribe = async (req: Req, res: Response, next: NextFunction) => {
   try {
      await Promise.all([
         User.findByIdAndUpdate(req.user?.id, { $pull: { subscribedUsers: req.params.id } }),
         User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: -1 } }),
      ]);
      res.json("Unsubscription successfull!");
   } catch (error) {
      next(error);
   }
};

export const like = async (req: Req, res: Response, next: NextFunction) => {
   try {
      const id = req.user?.id;
      const videoId = req.params.videoId;
      await Video.findByIdAndUpdate(videoId, {
         $addToSet: { likes: id },
         $pull: { dislikes: id },
      });
      res.json("The video has been liked");
   } catch (error) {
      next(error);
   }
};

export const dislike = async (req: Req, res: Response, next: NextFunction) => {
   try {
      const id = req.user?.id;
      const videoId = req.params.videoId;
      await Video.findByIdAndUpdate(videoId, {
         $addToSet: { dislikes: id },
         $pull: { likes: id },
      });
      res.json("The video has been disliked");
   } catch (error) {
      next(error);
   }
};
