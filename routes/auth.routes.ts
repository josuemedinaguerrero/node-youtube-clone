import { Router } from "express";
import { googleAuth, logout, signin, signup } from "../controllers/auth";
import { verifyToken } from "../helpers/verifyToken";

const router = Router();

// TODO: CREATE A USER
router.post("/signup", signup);

// TODO: SIGN IN
router.post("/signin", signin);

// TODO: GOOGLE AUTH
router.post("/google", googleAuth);

// TODO: LOGOUT
router.get("/logout", verifyToken, logout);

export default router;
