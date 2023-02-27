import express from "express";
import {
    getLoai,
    getloaiById,
    addLoai,
    updateLoai,
    deleteLoai
} from "../controllers/LoaiController.js";

const router = express.Router();

router.get('/loai', getLoai);
router.post('/loai', addLoai);
router.patch('/loai/:id', updateLoai);
router.get('/loai/:id', getloaiById);
router.delete('/loai/:id', deleteLoai);
export default router;