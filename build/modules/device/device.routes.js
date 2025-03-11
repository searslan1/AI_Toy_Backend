"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const device_controller_1 = __importDefault(require("./device.controller"));
const router = (0, express_1.Router)();
router.post("/register", device_controller_1.default.registerDevice);
router.get("/list/:ownerId", device_controller_1.default.listDevices);
router.delete("/remove/:deviceId", device_controller_1.default.removeDevice);
exports.default = router;
