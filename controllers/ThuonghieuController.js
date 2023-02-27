import Thuonghieu from "../models/ThuonghieuModel.js";
//lấy all 
export const getThuonghieu = async(req, res)=>{
    try {
        const response = await Thuonghieu.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}
//lấy theo id
export const getThuonghieuById = async (req, res) => {
    try {
      const thuonghieu = await Thuonghieu.findOne({
        where: {    
          id: req.params.id,
        },
        attributes: ["id", "tenhieu"],
      });
  
      if (!thuonghieu) {
        return res.status(404).json({ error: "thương hiệu not found" });
      }
  
      res.json(thuonghieu);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Server error" });
    }
  };
  
//thêm
export const addThuonghieu = async (req, res) => {
    const { id, tenhieu } = req.body;
  
    try {
      const thuonghieu = await Thuonghieu.create({ id, tenhieu });
      res.json(thuonghieu);
    } catch (error) {
      console.log(error.message);
    }
  };
//sửa
  export const updateThuonghieu = async (req, res) => {
    const thuonghieu = await Thuonghieu.findOne({ where: { id: req.params.id } });
    if (!thuonghieu) return res.status(404).json({ msg: "Không tìm thấy dữ liệu nào" });
  
    const { tenhieu } = req.body;
  
    try {
      await Thuonghieu.update({ tenhieu }, { where: { id: req.params.id } });
      res.status(200).json({ msg: "Cập nhật thương hiệu thành công" });
    } catch (error) {
      console.log(error.message);
    }
  };
  
//xóa
  export const deleteThuonghieu = async(req, res) => {
    const thuonghieu = await Thuonghieu.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!thuonghieu) return res.status(404).json({msg: "Không tìm thấy dữ liệu nào"});

    try {
        await Thuonghieu.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Xóa thương hiệu thành công"});
    } catch (error) {
        console.log(error.message);
    }
}

