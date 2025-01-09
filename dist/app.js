"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const requestMonitor_1 = require("./middleware/requestMonitor");
const prismaService_1 = require("./services/prismaService");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/api/submit", requestMonitor_1.validateRequest, (req, res) => {
    res.json({ message: "Success" });
});
app.get("/api/metrics", async (req, res) => {
    const ip = req.header("X-Client-IP") || "unknown";
    try {
        const metrics = await prismaService_1.prisma.failedRequest.findMany({
            where: {
                ip,
            },
            orderBy: {
                timestamp: "desc",
            },
        });
        res.json(metrics);
    }
    catch (error) {
        console.error("Error fetching metrics:", error);
        res.status(500).json({ error: "Failed to fetch metrics" });
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
});
process.on("SIGTERM", async () => {
    await prismaService_1.prisma.$disconnect();
    process.exit(0);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
