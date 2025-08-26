import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import regPeriksaRoutes from "./routes/regPeriksaRoutes.js";
import poliRoutes from "./routes/poliRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running...");
});

app.use("/api/reg-periksa", regPeriksaRoutes);
app.use("/api/poli", poliRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
