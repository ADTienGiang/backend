import express from "express";
import FileUpload from "express-fileupload";
import db from "./config/database.js";
import SanphamRouter from "./routes/SanphamRouter.js";
import LoaiRouter from "./routes/LoaiRouter.js";
import ThuonghieuRouter from "./routes/ThuonghieuRouter.js";
import LoginAdmin from "./routes/loginAdminRouter.js";
import cors from "cors";

const app = express();

try {

    await db.authenticate();
    console.log('đã kết nối Database...');
} catch (error) {
    console.error('kết nối bị lỗi:', error);
}
//chinhsua
app.use(cors());
app.use(express.json());

app.use(FileUpload());
app.use(express.static("public"));
app.use(SanphamRouter);
app.use(LoaiRouter);
app.use(ThuonghieuRouter);
app.use(LoginAdmin);
app.listen(8000, () => console.log('Server đang chạy cổng 8000'));

