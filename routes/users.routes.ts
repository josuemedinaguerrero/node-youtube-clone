import { Router } from "express";
import {
   deleteUser,
   dislike,
   getUser,
   like,
   subscribe,
   unsubscribe,
   updateUser,
} from "../controllers/user";
import { verifyToken } from "../helpers/verifyToken";

const router = Router();

// TODO: UPDATE USER
router.put("/:id", verifyToken, updateUser);

// TODO: DELETE USER
router.delete("/:id", verifyToken, deleteUser);

// TODO: GET A USER
router.get("/find/:id", getUser);

// TODO: SUBSCRIBE A USER
router.put("/sub/:id", verifyToken, subscribe);

// TODO: UNSUBSCRIBE A USER
router.put("/unsub/:id", verifyToken, unsubscribe);

// TODO: LIKE A VIDEO
router.put("/like/:videoId", verifyToken, like);

// TODO: LIKE A VIDEO
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;
