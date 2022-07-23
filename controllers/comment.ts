import { NextFunction, Response } from "express";
import { createError } from "../helpers/error";
import Comment from "../models/Comment";
import Video from "../models/Video";
import { Req } from "../types/types";

export const addComment = async (req: Req, res: Response, next: NextFunction) => {
   try {
      const newComment = new Comment({ userId: req.user?.id, ...req.body });
      const savedComment = await newComment.save();
      res.json(savedComment);
   } catch (error) {
      next(error);
   }
};

export const deleteComment = async (req: Req, res: Response, next: NextFunction) => {
   try {
      const comment = await Comment.findById(req.params.id);
      const video = await Video.findById(req.params.id);
      if (req.user?.id === comment?.userId || req.user?.id === video?.userId) {
         await Comment.findByIdAndDelete(req.params.id);
         res.json("The comment has been deleted!");
      } else {
         return next(createError(403, "You can delete only your comment!"));
      }
   } catch (error) {
      next(error);
   }
};

export const getComments = async (req: Req, res: Response, next: NextFunction) => {
   try {
      const comments = await Comment.find({ videoId: req.params.videoId });
      res.json(comments);
   } catch (error) {
      next(error);
   }
};
