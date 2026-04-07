import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import issueRoutes from "./routes/issue.routes";
import labelRoutes from "./routes/label.routes";
import { requireAuth } from "./middlewares/auth.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.get("/docs.json", (_req, res) => res.json(swaggerSpec));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);

app.use("/issues", requireAuth, issueRoutes);
app.use("/labels", requireAuth, labelRoutes);

app.use(errorMiddleware);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

export default app;
