import express from "express";
import {
  getAllRegPeriksa,
  panggilAntrian,
  sudahDipanggil3x
} from "../controllers/regPeriksaController.js";

const router = express.Router();

// Get semua data
router.get("/", getAllRegPeriksa);

// Panggil antrian pertama kali (pakai query param)
router.put("/panggil", panggilAntrian);

// Tandai sudah dipanggil 3x (pakai query param)
router.put("/sudah-3x", sudahDipanggil3x);

export default router;
