"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const videos_routes_1 = __importDefault(require("./routes/videos.routes"));
const comments_routes_1 = __importDefault(require("./routes/comments.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const connect = () => {
    mongoose_1.default
        .connect(process.env.MONGODB)
        .then(() => console.log("Connected to database"))
        .catch((err) => {
        throw err;
    });
};
app.get("/", (_req, res) => {
    res.send([]);
});
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", users_routes_1.default);
app.use("/api/videos", videos_routes_1.default);
app.use("/api/comments", comments_routes_1.default);
const errorHandler = (err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
};
app.use(errorHandler);
app.listen(process.env.PORT, () => {
    connect();
    console.log(`Server running on port ${process.env.PORT}`);
});
