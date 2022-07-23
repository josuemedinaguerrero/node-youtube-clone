"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = void 0;
const createError = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
};
exports.createError = createError;
