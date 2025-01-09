import express from "express";
import helmet from "helmet";
import cors from "cors";
import { validateRequest } from "./middleware/requestMonitor";
import { prisma } from "./services/prismaService";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.post("/api/submit", validateRequest, (req, res) => {
  res.json({ message: "Success" });
});

app.get("/api/metrics", async (req, res) => {
  const ip = req.header("IP") || "unknown";

  try {
    const metrics = await prisma.failedRequest.findMany({
      where: {
        ip,
      },
      orderBy: {
        timestamp: "desc",
      },
    });
    res.json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
  },
);

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
