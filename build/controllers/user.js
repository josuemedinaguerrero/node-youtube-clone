"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dislike = exports.like = exports.unsubscribe = exports.subscribe = exports.getUser = exports.deleteUser = exports.updateUser = void 0;
const error_1 = require("../helpers/error");
const User_1 = __importDefault(require("../models/User"));
const Video_1 = __importDefault(require("../models/Video"));
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.params.id === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        try {
            const updatedUser = yield User_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select("-password");
            res.json(updatedUser);
        }
        catch (error) {
            next(error);
        }
    }
    else {
        return next((0, error_1.createError)(403, "You can update only your account!"));
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (req.params.id === ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        try {
            yield User_1.default.findByIdAndDelete(req.params.id);
            res.json("User has been deleted");
        }
        catch (error) {
            next(error);
        }
    }
    else {
        return next((0, error_1.createError)(403, "You can delete only your account!"));
    }
});
exports.deleteUser = deleteUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id).select("-password");
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
const subscribe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        yield Promise.all([
            User_1.default.findByIdAndUpdate((_c = req.user) === null || _c === void 0 ? void 0 : _c.id, { $push: { subscribedUsers: req.params.id } }),
            User_1.default.findByIdAndUpdate(req.params.id, { $inc: { subscribers: 1 } }),
        ]);
        res.json("Subscription successfull!");
    }
    catch (error) {
        next(error);
    }
});
exports.subscribe = subscribe;
const unsubscribe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        yield Promise.all([
            User_1.default.findByIdAndUpdate((_d = req.user) === null || _d === void 0 ? void 0 : _d.id, { $pull: { subscribedUsers: req.params.id } }),
            User_1.default.findByIdAndUpdate(req.params.id, { $inc: { subscribers: -1 } }),
        ]);
        res.json("Unsubscription successfull!");
    }
    catch (error) {
        next(error);
    }
});
exports.unsubscribe = unsubscribe;
const like = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const id = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
        const videoId = req.params.videoId;
        yield Video_1.default.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id },
        });
        res.json("The video has been liked");
    }
    catch (error) {
        next(error);
    }
});
exports.like = like;
const dislike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const id = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id;
        const videoId = req.params.videoId;
        yield Video_1.default.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id },
        });
        res.json("The video has been disliked");
    }
    catch (error) {
        next(error);
    }
});
exports.dislike = dislike;
