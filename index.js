import ThuonghieuRouter from "./routes/ThuonghieuRouter.js";
import LoginAdmin from "./routes/loginAdminRouter.js";
import SanphamRouter from "./routes/SanphamRouter.js";
import LoaiRouter from "./routes/LoaiRouter.js";
import giohang from './routes/GioHangRouter.js';
import FileUpload from "express-fileupload";
import user from "./routes/UserRouter.js"
import db from "./config/database.js";
import session from'express-session';
import express from "express";
import cors from "cors";


const app = express();
try {
    await db.authenticate();
    console.log('đã kết nối Database...');
} catch (error) {
    console.error('kết nối bị lỗi:', error);
}
//session 
app.use(session({
    secret: 'adsfsfdadsfasfdasdfsafdasdas', 
    resave: false,
    saveUninitialized: false
  }));

app.use(express.static("public"));
app.use(express.json());
app.use(FileUpload());
app.use(cors());

app.use(ThuonghieuRouter);
app.use(SanphamRouter);
app.use(LoaiRouter);
app.use(LoginAdmin);
app.use(giohang);
app.use(user);

app.listen(8000, () => console.log('Server đang chạy cổng 8000'));

