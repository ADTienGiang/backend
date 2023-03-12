import express from "express";
import {
    checkGioHang,
    themSanPhamVaoGioHang,
    hienThiSanPhamTrongGioHang,
    tangSoLuongSanPham,
    giamSoLuongSanPham,
    xoaSanPhamKhoiGioHang
} from "../controllers/GiohangController.js";
const router = express.Router();
router.get('/users/giohang',hienThiSanPhamTrongGioHang);
router.post('/users/gio/them',themSanPhamVaoGioHang);
router.put("/users/giohang/tang/:idsp",tangSoLuongSanPham)
router.put("/users/giohang/giam/:idsp",giamSoLuongSanPham)
router.delete("/users/giohang/xoa/:id",xoaSanPhamKhoiGioHang)
export default router;