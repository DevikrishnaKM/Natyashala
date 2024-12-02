"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // To parse JSON bodies
app.get('/', (req, res) => {
    res.send('Hello, welcome to Natyashala Backend!');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
