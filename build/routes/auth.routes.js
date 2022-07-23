"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const verifyToken_1 = require("../helpers/verifyToken");
const router = (0, express_1.Router)();
// TODO: CREATE A USER
router.post("/signup", auth_1.signup);
// TODO: SIGN IN
router.post("/signin", auth_1.signin);
// TODO: GOOGLE AUTH
router.post("/google", auth_1.googleAuth);
// TODO: LOGOUT
router.get("/logout", verifyToken_1.verifyToken, auth_1.logout);
exports.default = router;
