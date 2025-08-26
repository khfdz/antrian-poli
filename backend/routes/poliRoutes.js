import express from "express";
import { getAllPoli } from "../controllers/poliController.js";

const router = express.Router();

router.get("/", getAllPoli);

export default router;
