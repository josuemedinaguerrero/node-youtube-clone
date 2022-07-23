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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.googleAuth = exports.signin = exports.signup = void 0;
const error_1 = require("../helpers/error");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync(body.password, salt);
        const newUser = new User_1.default(Object.assign(Object.assign({}, body), { password: hash }));
        yield newUser.save();
        res.json("User has been created!");
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = (yield User_1.default.findOne({ email: body.email }));
        if (!user)
            return next((0, error_1.createError)(404, "User not found!"));
        const isCorrect = yield bcryptjs_1.default.compare(body.password, user.password);
        if (!isCorrect)
            return next((0, error_1.createError)(400, "Wrong credentials!"));
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT);
        const _a = user._doc, { password } = _a, otherDetails = __rest(_a, ["password"]);
        res.cookie("access_token", token, { httpOnly: true, maxAge: 60 * 60 * 24 * 2 * 1000 }).json(otherDetails);
    }
    catch (error) {
        next(error);
    }
});
exports.signin = signin;
const googleAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ email: req.body.email });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 2 * 1000,
            }).json(user);
        }
        else {
            const newUser = new User_1.default(Object.assign(Object.assign({}, req.body), { fromGoogle: true, password: ":p" }));
            const savedUser = yield newUser.save();
            const usedUserDoc = savedUser;
            const token = jsonwebtoken_1.default.sign({ id: savedUser._id }, process.env.JWT);
            const _b = usedUserDoc._doc, { password } = _b, otherDetails = __rest(_b, ["password"]);
            res.cookie("access_token", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 2 * 1000,
            }).json(otherDetails);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.googleAuth = googleAuth;
const logout = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("access_token");
        res.json("Cookie delete!");
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;
