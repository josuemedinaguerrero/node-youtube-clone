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
exports.search = exports.getByTag = exports.sub = exports.trend = exports.random = exports.addView = exports.getVideo = exports.deleteVideo = exports.updateVideo = exports.addVideo = void 0;
const error_1 = require("../helpers/error");
const Video_1 = __importDefault(require("../models/Video"));
const User_1 = __importDefault(require("../models/User"));
const addVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const newVideo = new Video_1.default(Object.assign({ userId: req.user.id }, req.body));
            const savedVideo = yield newVideo.save();
            res.json(savedVideo);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.addVideo = addVideo;
const updateVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const video = yield Video_1.default.findById(req.params.id);
        if (!video)
            return next((0, error_1.createError)(404, "Video not found!"));
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) === video.userId) {
            const updatedVideo = yield Video_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            res.json(updatedVideo);
        }
        else {
            return next((0, error_1.createError)(404, "You can update only your video!"));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateVideo = updateVideo;
const deleteVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const video = yield Video_1.default.findById(req.params.id);
        if (!video)
            return next((0, error_1.createError)(404, "Video not found!"));
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) === video.userId) {
            yield Video_1.default.findByIdAndDelete(req.params.id);
            res.json("The video has been deleted!");
        }
        else {
            return next((0, error_1.createError)(404, "You can delete only your video!"));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteVideo = deleteVideo;
const getVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const video = yield Video_1.default.findById(req.params.id);
        res.json(video);
    }
    catch (error) {
        next(error);
    }
});
exports.getVideo = getVideo;
const addView = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Video_1.default.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.json("The view has been increased!");
    }
    catch (error) {
        next(error);
    }
});
exports.addView = addView;
const random = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videos = yield Video_1.default.aggregate([{ $sample: { size: 40 } }]);
        res.json(videos);
    }
    catch (error) {
        next(error);
    }
});
exports.random = random;
const trend = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videos = yield Video_1.default.find().sort({ views: -1 });
        res.json(videos);
    }
    catch (error) {
        next(error);
    }
});
exports.trend = trend;
const sub = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const user = (yield User_1.default.findById((_c = req.user) === null || _c === void 0 ? void 0 : _c.id));
        if (user === null || user === void 0 ? void 0 : user.subscribedUsers) {
            const list = yield Promise.all(user.subscribedUsers.map((channelId) => {
                return Video_1.default.find({ userId: channelId });
            }));
            res.json(list.flat().sort((a, b) => {
                if (a.createdAt !== undefined && b.createdAt !== undefined) {
                    return b.createdAt.getTime() - a.createdAt.getTime();
                }
                return new Date().getTime() - new Date().getTime();
            }));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.sub = sub;
const getByTag = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = req.query.tags;
        const videos = yield Video_1.default.find({ tags: { $in: tags.split(",") } }).limit(20);
        res.json(videos);
    }
    catch (error) {
        next(error);
    }
});
exports.getByTag = getByTag;
const search = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.q;
        const videos = yield Video_1.default.find({
            title: { $regex: query, $options: "i" },
        }).limit(40);
        res.json(videos);
    }
    catch (error) {
        next(error);
    }
});
exports.search = search;
