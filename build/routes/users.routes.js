"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const verifyToken_1 = require("../helpers/verifyToken");
const router = (0, express_1.Router)();
// TODO: UPDATE USER
router.put("/:id", verifyToken_1.verifyToken, user_1.updateUser);
// TODO: DELETE USER
router.delete("/:id", verifyToken_1.verifyToken, user_1.deleteUser);
// TODO: GET A USER
router.get("/find/:id", user_1.getUser);
// TODO: SUBSCRIBE A USER
router.put("/sub/:id", verifyToken_1.verifyToken, user_1.subscribe);
// TODO: UNSUBSCRIBE A USER
router.put("/unsub/:id", verifyToken_1.verifyToken, user_1.unsubscribe);
// TODO: LIKE A VIDEO
router.put("/like/:videoId", verifyToken_1.verifyToken, user_1.like);
// TODO: LIKE A VIDEO
router.put("/dislike/:videoId", verifyToken_1.verifyToken, user_1.dislike);
exports.default = router;
