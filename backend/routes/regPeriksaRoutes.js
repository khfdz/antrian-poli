import express from "express";
import {
  getAllRegPeriksa,
  panggilAntrian,
  panggilanTerlewat
} from "../controllers/regPeriksaController.js";

const router = express.Router();

// Get semua data
router.get("/", getAllRegPeriksa);

// Panggil antrian pertama kali (pakai query param)
router.put("/panggil", panggilAntrian);

// Tandai sudah dipanggil 3x (pakai query param)
router.put("/terlewat", panggilanTerlewat);

export default router;
