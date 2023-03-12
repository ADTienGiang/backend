import jwt from 'jsonwebtoken';
import khachhang from '../models/KhachHangModel.js';
export const authMiddleware = async (req, res, next) => {
  try {
    // Lấy token từ tiêu đề yêu cầu
    const token = req.header('Authorization').replace('Bearer ', '');

    // Giải mã token và xác thực người dùng
    const decoded = jwt.verify(token, 'mysecretkey');
    console.log("day la decodeddddddd"+decoded.id)
    const user = await khachhang.findOne({ id: decoded.id, 'tokens.token': token });
    if (!user) {
      throw new Error();
    }

    // Lưu thông tin người dùng vào đối tượng req.user
    req.user = user;

    next();
  } catch (error) {
    res.status(401).send({ error: 'lỗi con mẹ nó rồi' });
  }
  };
  
  
  
  
  
  