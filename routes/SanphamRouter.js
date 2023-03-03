import express from "express";
 
import { 
    getAllSanpham,
    getSanPhamById,
    deleteSanpham,
    themSanpham,
    capnhatSanpham,
} from "../controllers/SanphamController.js";
 
const router = express.Router();
 
router.get('/sanpham', getAllSanpham);
router.post('/sanpham', themSanpham);
router.get('/sanpham/:id', getSanPhamById);
router.patch('/sanpham/:id', capnhatSanpham);
router.delete('/sanpham/:id', deleteSanpham);
//api 
router.get('/', getAllSanpham);
export default router;