import khachhang from '../models/KhachHangModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Tìm kiếm khách hàng với email cung cấp
    const user = await khachhang.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Tài khoản hoặc mật khẩu không đúng' });
    }
    // So sánh mật khẩu được cung cấp với mật khẩu đã được mã hóa
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Tài khoản hoặc mật khẩu không đúng' });
    }

    // Tạo JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Trả về JWT và thông tin người dùng
    res.json({ user, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Đăng nhập thất bại' });
  }
};

export const getAllCustomer = async (req, res) => {
  try {
      const user = await khachhang.findAll();
      res.json(user);
  } catch (error) {
      res.json("không lấy được sản phẩm"+ error);
      console.log(error);
  }  
}
//delete khachhang
export const deleteKhachHang = async (req, res) => {
  const { id } = req.params;

  try {
    const KhachHangs = await khachhang.findOne({ where: { id } });

    if (!KhachHangs) {
      return res.status(404).json({ error: "Không tìm thấy không tìm thấy" });
    }

    await khachhang.destroy({ where: { id } });

    res.json({ success: "Xóa khách hàng thành công" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Lỗi server" });
  }
};
//sửa sản phẩm 
export const capnhatKhachHang = async (req, res) => {
  try {
    // Cập nhật sản phẩm
    await khachhang.update(
      {
        // ten: name,
        // hinhanh: fileName,
        // url: url,
        // gia: req.body.gia,
        // gioitinh: req.body.gioitinh,
        // kichco: req.body.kichco,
        // mau: req.body.mau,
        // chatlieu: req.body.chatlieu,
        // soluong: req.body.soluong,
        // loaiId: req.body.loaiId,
        // thuonghieuId: req.body.thuonghieuId,

        email:req.body.email,
        password: hashedPassword, // Lưu mật khẩu đã mã hóa vào cơ sở dữ liệu
        name:req.body.name,
        address:req.body.address,
        phone:req.body.phone,
      },
      {
        where: {
          id: req.params.id
        }
      }
    );

    // Lấy thông tin sản phẩm sau khi đã được cập nhật
    const updatedProduct = await khachhang.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Thuonghieu,
          as: 'thuongHieu'
        },
        {
          model: Loai,
          as: 'loai'
        }
      ]
    });

    res.status(200).json({product: updatedProduct, msg: 'Cập nhật khách hàng thành công'});
  } catch (error) {
    console.log(error.message);
  }
}

export const register = async (req, res) => {
  const { email, password, name ,address, phone } = req.body;

  try {
    // Kiểm tra xem email đã được sử dụng chưa
    const existingUser = await khachhang.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã tồn tại trong hệ thống' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo một user mới
    const user = await khachhang.create({
      email,
      password: hashedPassword, // Lưu mật khẩu đã mã hóa vào cơ sở dữ liệu
      name,
      address,
      phone
    });

    res.json({ user, message: "Đăng ký tài khoản thành công!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Đăng ký thất bại' });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Lỗi khi đăng xuất người dùng" });
    } else {
      res.json({ message: "Người dùng đã đăng xuất thành công" });
    }
  });
};

export const checkLogin = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ authenticated: false });
  }
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;
    // Tìm kiếm người dùng với userId cung cấp
    const user = khachhang.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(401).send({ authenticated: false });
    }
    // Trả về thông tin người dùng
    res.send({ authenticated: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.log(error);
    res.status(401).send({ authenticated: false });
  }
};
export const getTuser = async(req, res)=>{
  try {
      const response = await khachhang.findAll();
      res.json(response);
  } catch (error) {
      console.log(error.message);
  }
}