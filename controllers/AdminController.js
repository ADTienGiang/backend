import Admin from "../models/adminModel.js";
export const login = async(req, res)=>{
    try {
        const { email, password } = req.body;
    
        // Tìm admin theo tên người dùng
        const admin = await Admin.findOne({ where: { email } });
    
        // Nếu không tìm thấy admin, hãy trả lại lỗi
        if (!admin) {
          return res.status(401).json({ message: 'Thông tin không hợp lệ' });
        }
    
        // So sánh mật khẩu đã nhập với mật khẩu băm trong cơ sở dữ liệu
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Thông tin không hợp lệ' });
        }
    
        // Nếu thông tin đăng nhập hợp lệ, trả về thành công
        res.redirect('/');
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
        console.log(err);
      }
}