import { Router } from "express";
import { addComment, deleteComment, getComments } from "../controllers/comment";
import { verifyToken } from "../helpers/verifyToken";

const router = Router();

router.post("/", verifyToken, addComment);
router.delete("/:id", verifyToken, deleteComment);
router.get("/:videoId", getComments);

export default router;
