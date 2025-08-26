import express from "express";
import { getAllRegPeriksa } from "../controllers/regPeriksaController.js";

const router = express.Router();

router.get("/", getAllRegPeriksa);

export default router;
