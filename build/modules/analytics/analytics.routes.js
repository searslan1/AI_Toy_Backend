"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = __importDefault(require("./analytics.controller"));
const router = (0, express_1.Router)();
router.get("/usage/:deviceId", analytics_controller_1.default.getUsage);
exports.default = router;
