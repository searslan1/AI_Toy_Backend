"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// dotenv.config() fonksiyonu, .env dosyasındaki çevresel değişkenleri yüklüyor.
dotenv_1.default.config();
exports.PORT = process.env.PORT || 8080;
exports.MONGO_URL = process.env.MONGO_DB_URL;
