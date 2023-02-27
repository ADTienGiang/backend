import Loai from "../models/LoaiModel.js";
//lấy loại
export const getLoai = async(req, res)=>{
    try {
        const response = await Loai.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}
//lấy loại theo id loại
export const getloaiById = async (req, res) => {
    try {
      const loai = await Loai.findOne({
        where: {    
          id: req.params.id,
        },
        attributes: ["id", "tenloai"],
      });
  
      if (!loai) {
        return res.status(404).json({ error: "loai not found" });
      }
  
      res.json(loai);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Server error" });
    }
  };
  
//thêm
export const addLoai = async (req, res) => {
    const { id, tenloai } = req.body;
  
    try {
      const loai = await Loai.create({ id, tenloai });
      res.json(loai);
    } catch (error) {
      console.log(error.message);
    }
  };
//sửa
  export const updateLoai = async (req, res) => {
    const loai = await Loai.findOne({ where: { id: req.params.id } });
    if (!loai) return res.status(404).json({ msg: "Không tìm thấy dữ liệu nào" });
  
    const { tenloai } = req.body;
  
    try {
      await Loai.update({ tenloai }, { where: { id: req.params.id } });
      res.status(200).json({ msg: "Cập nhật loại sản phẩm thành công" });
    } catch (error) {
      console.log(error.message);
    }
  };
  
//xóa
  export const deleteLoai = async(req, res) => {
    const loai = await Loai.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!loai) return res.status(404).json({msg: "Không tìm thấy dữ liệu nào"});

    try {
        await Loai.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Xóa loại sản phẩm thành công"});
    } catch (error) {
        console.log(error.message);
    }
}

