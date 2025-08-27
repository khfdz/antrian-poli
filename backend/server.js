import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";              // <-- ini penting
import { Server } from "socket.io";   // <-- ini penting

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

// ---- ganti app.listen dengan http server ----
const server = http.createServer(app);

// pasang socket.io ke http server
const io = new Server(server, {
  cors: {
    origin: "*", // ganti sesuai domain frontend
    methods: ["GET", "POST"],
  },
});

// inject io ke express biar bisa dipanggil dari controller
app.set("io", io);

// event websocket
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// pakai server.listen, bukan app.listen
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
