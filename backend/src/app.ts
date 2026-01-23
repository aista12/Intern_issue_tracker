import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import issueRoutes from "./routes/issue.routes";
import labelRoutes from "./routes/label.routes";
import { requireAuth } from "./middlewares/auth.middleware";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({ origin: "http://localhost:5173" }));


app.use("/auth", authRoutes);

app.use("/issues", requireAuth, issueRoutes);
app.use("/labels", requireAuth, labelRoutes);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

export default app;