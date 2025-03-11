"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const ai_controller_1 = __importDefault(require("./ai.controller"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// 📌 POST isteği ile ses dosyasını işle
router.post('/process-audio', upload.single('audio'), ai_controller_1.default.processAudio);
exports.default = router;
