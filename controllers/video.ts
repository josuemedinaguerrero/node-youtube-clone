import { NextFunction, Request, Response } from "express";
import { createError } from "../helpers/error";
import { Req, UserModel } from "../types/types";
import Video from "../models/Video";
import User from "../models/User";

export const addVideo = async (req: Req, res: Response, next: NextFunction) => {
   try {
      if (req.user) {
         const newVideo = new Video({ userId: req.user.id, ...req.body });
         const savedVideo = await newVideo.save();
         res.json(savedVideo);
      }
   } catch (error) {
      next(error);
   }
};

export const updateVideo = async (req: Req, res: Response, next: NextFunction) => {
   try {
      const video = await Video.findById(req.params.id);
      if (!video) return next(createError(404, "Video not found!"));
      if (req.user?.id === video.userId) {
         const updatedVideo = await Video.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
         );
         res.json(updatedVideo);
      } else {
         return next(createError(404, "You can update only your video!"));
      }
   } catch (error) {
      next(error);
   }
};

export const deleteVideo = async (req: Req, res: Response, next: NextFunction) => {
   try {
      const video = await Video.findById(req.params.id);
      if (!video) return next(createError(404, "Video not found!"));
      if (req.user?.id === video.userId) {
         await Video.findByIdAndDelete(req.params.id);
         res.json("The video has been deleted!");
      } else {
         return next(createError(404, "You can delete only your video!"));
      }
   } catch (error) {
      next(error);
   }
};

export const getVideo = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const video = await Video.findById(req.params.id);
      res.json(video);
   } catch (error) {
      next(error);
   }
};

export const addView = async (req: Request, res: Response, next: NextFunction) => {
   try {
      await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
      res.json("The view has been increased!");
   } catch (error) {
      next(error);
   }
};

export const random = async (_req: Request, res: Response, next: NextFunction) => {
   try {
      const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
      res.json(videos);
   } catch (error) {
      next(error);
   }
};

export const trend = async (_req: Request, res: Response, next: NextFunction) => {
   try {
      const videos = await Video.find().sort({ views: -1 });
      res.json(videos);
   } catch (error) {
      next(error);
   }
};

export const sub = async (req: Req, res: Response, next: NextFunction) => {
   try {
      const user = (await User.findById(req.user?.id)) as UserModel;

      if (user?.subscribedUsers) {
         const list = await Promise.all(
            user.subscribedUsers.map((channelId) => {
               return Video.find({ userId: channelId });
            })
         );
         res.json(
            list.flat().sort((a, b) => {
               if (a.createdAt !== undefined && b.createdAt !== undefined) {
                  return b.createdAt.getTime() - a.createdAt.getTime();
               }
               return new Date().getTime() - new Date().getTime();
            })
         );
      }
   } catch (error) {
      next(error);
   }
};

export const getByTag = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const tags = req.query.tags as string;
      const videos = await Video.find({ tags: { $in: tags.split(",") } }).limit(20);
      res.json(videos);
   } catch (error) {
      next(error);
   }
};

export const search = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const query = req.query.q;
      const videos = await Video.find({
         title: { $regex: query, $options: "i" },
      }).limit(40);
      res.json(videos);
   } catch (error) {
      next(error);
   }
};
