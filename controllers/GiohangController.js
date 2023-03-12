import GioHang from "../models/giohangModel.js"
import SanPham from "../models/sanphamModel.js";
import KhachHang from "../models/KhachHangModel.js";
import SanphamGiohang from "../models/sanpham_giohangModel.js";
import sequelize from "../config/database.js  ";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
export const checkGioHang = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({
      authenticated: false
    });
  }
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;
    // Tìm kiếm người dùng với userId cung cấp
    const user = await KhachHang.findOne({
      where: {
        id: userId
      }
    });
    if (!user) {
      return res.status(401).send({
        authenticated: false
      });
    }
    // Trả về thông tin người dùng
    res.send({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      authenticated: false
    });
  }
}

// Thêm sản phẩm vào giỏ hàng của khách hàng
export const themSanPhamVaoGioHang = async (req, res) => {
  try {
    // Tìm kiếm sản phẩm với id cung cấp
    const idsp = req.body.idsp;
    const product = await SanPham.findOne({ where: { id: idsp } });
    if (!product) {
      return res.status(400).send({ message: 'Sản phẩm không tồn tại' });
    }

    // Giải mã token để lấy thông tin user id
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ authenticated: false });
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;
    
    // Tìm kiếm giỏ hàng của khách hàng hoặc tạo mới nếu chưa có
    let cart = await GioHang.findOne({ where: { idkh: userId } });
    if (!cart) {
      cart = await GioHang.create({ idkh: userId, idsp: idsp ,soluongmua : 1 });
    }

    // Tìm kiếm chi tiết giỏ hàng của sản phẩm hoặc tạo mới nếu chưa có
    let cartItem = await SanphamGiohang.findOne({
      where: { sanphamId: product.id, giohangId: cart.id },
    });

    if (!cartItem) {
      // Nếu chưa có sản phẩm này trong giỏ hàng thì tạo mới
      cartItem = await SanphamGiohang.create({
        sanphamId: product.id,
        giohangId: cart.id,
        soluongmua: 1,
      });
    } else {
      // Nếu sản phẩm đã có trong giỏ hàng thì tăng số lượng mua lên 1 và cập nhật giá trị của trường soluongmua và idsp
      cartItem.soluongmua += 1;
      await cartItem.save(); // Lưu lại giá trị của trường soluongmua // 
    }
    
    const cartItems = await SanphamGiohang.findAll({ where: { giohangId: cart.id } });
    const totalQuantity = cartItems.reduce((total, item) => total + item.soluongmua, 0);
    cart.soluongmua = totalQuantity;
    await cart.save();

    res.status(200).send({ message: 'Thêm sản phẩm vào giỏ hàng thành công' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Lỗi server' + error});
  }
};

// Hiển thị các sản phẩm đã thêm trong giỏ hàng của khách hàng
export const hienThiSanPhamTrongGioHang = async (req, res) => {
  try {
    // Giải mã token để lấy thông tin user id
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ authenticated: false });
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;

    // Tìm kiếm giỏ hàng của khách hàng
    const cart = await GioHang.findOne({
      where: { idkh: userId },
      include: [{
        model: SanPham,
        as: "sanphams",
        through: {
          model: SanphamGiohang,
          as :"sanphamgiohang",
          attributes: ["soluongmua"],
        },
        attributes: { exclude: [] }, // Lấy tất cả thuộc tính của bảng Sanpham
      }],
    });
    res.status(200).send(cart);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Lỗi server" + error });
  }
};
//tăng số lượng sản phẩm trong giỏ hàng
export const tangSoLuongSanPham = async (req, res) => {
  try {
    const idsp = req.params.idsp;

    // Giải mã token để lấy thông tin user id
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ authenticated: false });
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;

    await sequelize.transaction(async (t) => {
      // Tìm giỏ hàng của khách hàng
      const cart = await GioHang.findOne({ where: { idkh: userId }, transaction: t });
      if (!cart) {
        return res.status(400).send({ message: 'Giỏ hàng không tồn tại' });
      }

      // Tìm sản phẩm trong giỏ hàng
      const cartItem = await SanphamGiohang.findOne({
        where: { sanphamId: idsp, giohangId: cart.id },
        transaction: t
      });
      if (!cartItem) {
        return res.status(400).send({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
      }

      // Tăng số lượng sản phẩm
      cartItem.soluongmua += 1;
      await cartItem.save({ transaction: t });

      // Cập nhật số lượng sản phẩm trong bảng giohang
      const cartItems = await SanphamGiohang.findAll({ where: { giohangId: cart.id }, transaction: t });
      const totalQuantity = cartItems.reduce((total, item) => total + item.soluongmua, 0);
      cart.soluongmua = totalQuantity >= 0 ? totalQuantity : 0;
      await cart.save({ transaction: t });

      res.status(200).send({ message: 'Tăng số lượng sản phẩm thành công' });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Lỗi server' });
  }
};


//giảm số lượng sản phẩm trong giỏ hàng
export const giamSoLuongSanPham = async (req, res) => {
  try {
    const idsp = req.params.idsp;

    // Giải mã token để lấy thông tin user id
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ authenticated: false });
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;

    await sequelize.transaction(async (t) => {
      // Tìm giỏ hàng của khách hàng
      const cart = await GioHang.findOne({ where: { idkh: userId } });
      if (!cart) {
        return res.status(400).send({ message: 'Giỏ hàng không tồn tại' });
      }

      // Tìm sản phẩm trong giỏ hàng
      const cartItem = await SanphamGiohang.findOne({
        where: { sanphamId: idsp, giohangId: cart.id },
      });
      if (!cartItem) {
        return res.status(400).send({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
      }

      // Giảm số lượng sản phẩm, nhưng không được nhỏ hơn 1
      if (cartItem.soluongmua > 1) {
        cartItem.soluongmua -= 1;
        await cartItem.save();

        // Giảm số lượng sản phẩm trong giỏ hàng
        cart.soluongmua -= 1;
        await cart.save();
      }

      res.status(200).send({ message: 'Giảm số lượng sản phẩm thành công' });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Lỗi server' + error });
  }
};

export const xoaSanPhamKhoiGioHang = async (req, res) => {
  try {
    // Giải mã token để lấy thông tin user id
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ authenticated: false });
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;

    // Tìm kiếm giỏ hàng của khách hàng
    const cart = await GioHang.findOne({ where: { idkh: userId } });
    if (!cart) {
      return res.status(400).send({ message: 'Không tìm thấy giỏ hàng' });
    }

    // Tìm kiếm chi tiết giỏ hàng của sản phẩm
    const idsp = req.body.idsp;
    console.log(cart.id);
    const cartItem = await SanphamGiohang.findOne({
      where: { giohangId: cart.id, sanphamId: idsp },
    });
    if (!cartItem) {
      return res.status(400).send({ message: 'Sản phẩm không có trong giỏ hàng' });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    await cartItem.destroy();
    // Cập nhật lại số lượng sản phẩm trong giỏ hàng
    cart.soluongmua -= cartItem.soluongmua;
    await cart.save();
    res.status(200).send({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Lỗi server' + error });
  }
};
