import Sanpham from "../models/SanphamModel.js";
import Loai from "../models/LoaiModel.js";
import Thuonghieu from "../models/ThuonghieuModel.js";
import path from "path";
import fs from "fs";
import cloudinary from "cloudinary";
cloudinary.config({
  cloud_name: 'dckghefex',
  api_key: '774948835297821',
  api_secret: 'SWP0BEDXndqUFCMFoxAK-xGiwYM'
});

 //lấy tất cả sản phẩm
export const getAllSanpham = async (req, res) => {
    try {
        const sanpham = await Sanpham.findAll({
          include: [
            { model: Loai, as: 'loai', attributes: ['tenloai'] },
            { model: Thuonghieu, as: 'thuongHieu', attributes: ['tenhieu'] }
          ]
        });
        res.json(sanpham);
    } catch (error) {
        res.json("không lấy được sản phẩm"+ error);
        console.log(error);
    }  
}
  //thêm sản phẩm mới
  export const themSanpham = async (req, res) => {
    try {
      const { ten, gioitinh, kichco, mau, chatlieu, gia, soluong, hinhanh, loaiId, thuonghieuId } = req.body;
  
      // Kiểm tra xem hình ảnh có được gửi lên hay không
      if (req.files === null) {
        return res.status(400).json({ msg: "Không có file nào được thêm" });
      }
  
      // Lấy thông tin về file ảnh
      const file = req.files.hinhanh;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const url = `${process.env.URL_BACKEND}/images/${fileName}`;
        const allowedType = [".png", ".jpg", ".jpeg"];
  
      // Kiểm tra định dạng ảnh: ['.png','.jpg','.jpeg']
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Hình ảnh không hợp lệ" });
      }
  
      // Kiểm tra kích thước ảnh
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: "Hình ảnh phải nhỏ hơn 5 MB" });
      }
  
      // Lưu file ảnh vào thư mục public/images
      file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
          // Thêm sản phẩm vào cơ sở dữ liệu
          await Sanpham.create({
            ten: ten,
            gioitinh: gioitinh,
            kichco: kichco,
            mau: mau,
            chatlieu: chatlieu,
            gia: gia,
            soluong: soluong,
            hinhanh: fileName,
            url: url,
            loaiId: loaiId,
            thuonghieuId: thuonghieuId,
          });
  
          // Lấy thông tin loại và thương hiệu của sản phẩm từ cơ sở dữ liệu
          await Loai.findByPk(loaiId);
          await Thuonghieu.findByPk(thuonghieuId);
  
          // // Thêm sản phẩm vào danh sách sản phẩm của loại
          // await loai.addSanpham(sanpham);
  
          // // Thêm sản phẩm vào danh sách sản phẩm của thương hiệu
          // await thuongHieu.addSanpham(sanpham);
  
          res.status(201).json({ msg: "Thêm sản phẩm thành công" });
        } catch (error) {
          console.log(error.message);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  // export const themSanpham = async (req, res) => {
  //   try {
  //     const { ten, gioitinh, kichco, mau, chatlieu, gia, soluong, hinhanh, loaiId, thuonghieuId } = req.body;
  
  //     // Kiểm tra xem hình ảnh có được gửi lên hay không
  //     if (req.files === null) {
  //       return res.status(400).json({ msg: "Không có file nào được thêm" });
  //     }
  
  //     // Lấy thông tin về file ảnh
  //     const file = req.files.hinhanh;
  //     const allowedType = [".png", ".jpg", ".jpeg"];
  
  //     // Kiểm tra định dạng ảnh: ['.png','.jpg','.jpeg']
  //     if (!allowedType.includes(path.extname(file.name))) {
  //       return res.status(422).json({ msg: "Hình ảnh không hợp lệ" });
  //     }
  //     if (!hinhanh.hasOwnProperty('public_id')) {
  //       return res.status(400).json({ msg: "Hình ảnh không hợp lệ" });
  //     }
      
  //     // Upload hình ảnh lên Cloudinary
  //     const result = await cloudinary.v2.uploader.upload(file.tempFilePath);
  
  //     // Thêm sản phẩm vào cơ sở dữ liệu
  //     const sanpham = await Sanpham.create({
  //       ten: ten,
  //       gioitinh: gioitinh,
  //       kichco: kichco,
  //       mau: mau,
  //       chatlieu: chatlieu,
  //       gia: gia,
  //       soluong: soluong,
  //       hinhanh: result.public_id,
  //       url: result.url,
  //       loaiId: loaiId,
  //       thuonghieuId: thuonghieuId,
  //     });
  
  //     // Lấy thông tin loại và thương hiệu của sản phẩm từ cơ sở dữ liệu
  //     const loai = await Loai.findByPk(loaiId);
  //     const thuongHieu = await Thuonghieu.findByPk(thuonghieuId);
  
  //     // Thêm sản phẩm vào danh sách sản phẩm của loại
  //     await loai.addSanpham(sanpham);
  
  //     // Thêm sản phẩm vào danh sách sản phẩm của thương hiệu
  //     await thuongHieu.addSanpham(sanpham);
  
  //     res.status(201).json({ msg: "Thêm sản phẩm thành công" });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  
  // Xóa sản phẩm
export const deleteSanpham = async (req, res) => {
    const { id } = req.params;
  
    try {
      const sanpham = await Sanpham.findOne({ where: { id } });
  
      if (!sanpham) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
      }
  
      await Sanpham.destroy({ where: { id } });
  
      res.json({ success: "Xóa sản phẩm thành công" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Lỗi server" });
    }
  };
  //sửa sản phẩm 
  export const capnhatSanpham = async (req, res) => {
    const product = await Sanpham.findOne({
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
  
    if (!product) {
      return res.status(404).json({msg: 'Không tìm thấy dữ liệu nào'});
    }
  
    let fileName = "";
    if(req.files === null){
      fileName = product.hinhanh;
  } else {
      const file = req.files.hinhanh;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedTypes = ['.png', '.jpg', '.jpeg'];
  
      if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({msg: 'Hình ảnh không hợp lệ'});
      }
  
      if (fileSize > 5000000) {
        return res.status(422).json({msg: 'Hình ảnh phải nhỏ hơn 5 MB'});
      }
  
      const filepath = `./public/images/${product.hinhanh}`;
      // Xóa file cũ trước khi lưu file mới
      fs.unlinkSync(filepath);
  
      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) {
          return res.status(500).json({msg: err.message});
        }
      });
    }
  
    const name = req.body.ten;
    const url = `${process.env.URL_BACKEND}/images/${fileName}`;
  
    try {
      // Cập nhật sản phẩm
      await Sanpham.update(
        {
          ten: name,
          hinhanh: fileName,
          url: url,
          gia: req.body.gia,
          gioitinh: req.body.gioitinh,
          kichco: req.body.kichco,
          mau: req.body.mau,
          chatlieu: req.body.chatlieu,
          soluong: req.body.soluong,
          loaiId: req.body.loaiId,
          thuonghieuId: req.body.thuonghieuId
        },
        {
          where: {
            id: req.params.id
          }
        }
      );
  
      // Lấy thông tin sản phẩm sau khi đã được cập nhật
      const updatedProduct = await Sanpham.findOne({
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
  
      res.status(200).json({product: updatedProduct, msg: 'Cập nhật sản phẩm thành công'});
    } catch (error) {
      console.log(error.message);
    }
  };
  //lấy sản phẩm theo id để load lên form sửa :vv
  export const getSanPhamById = async (req, res) => {
    try {
      const sanpham = await Sanpham.findOne({
        where: {
          id: req.params.id,
        },
      });
  
      if (!sanpham) {
        return res.status(404).json({ error: "sanpham not found" });
      }
  
      res.json(sanpham);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Server error" });
    }
  };