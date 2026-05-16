import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import leadRoutes from "./routes/leadRoutes";
import { errorHandler, notFound } from "./middleware/errorMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req: express.Request, res: express.Response) => {
  res.json({ success: true, message: "Smart Leads API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;