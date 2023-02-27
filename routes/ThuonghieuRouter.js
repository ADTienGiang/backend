import express from "express";
import {
    getThuonghieu,
    getThuonghieuById,
    addThuonghieu,
    updateThuonghieu,
    deleteThuonghieu
} from "../controllers/ThuonghieuController.js";

const router = express.Router();

router.get('/thuonghieu', getThuonghieu);
router.get('/thuonghieu/:id', getThuonghieuById);
router.post('/thuonghieu', addThuonghieu);
router.patch('/thuonghieu/:id', updateThuonghieu);
router.delete('/thuonghieu/:id', deleteThuonghieu);
export default router;