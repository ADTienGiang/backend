import express from "express";
import {
    login,
} from "../controllers/AdminController.js";

const router = express.Router();

router.post('/loginAdmin', login);

export default router;