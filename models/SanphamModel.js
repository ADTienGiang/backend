import {
    Sequelize
} from "sequelize";
import db from "../config/database.js";
import Thuonghieu from "./ThuonghieuModel.js";
import Loai from "./LoaiModel.js";
const {
    DataTypes
} = Sequelize;

const Sanpham = db.define('sanpham', {
    ten: {
        type: DataTypes.STRING
    },
    gioitinh: {
        type: DataTypes.STRING
    },
    kichco: {
        type: DataTypes.STRING
    },
    mau: {
        type: DataTypes.STRING
    },
    chatlieu: {
        type: DataTypes.STRING
    },
    gia: {
        type: DataTypes.FLOAT
    },
    soluong: {
        type: DataTypes.INTEGER
    },
    hinhanh: {
        type: DataTypes.STRING
    },
    url: {
        type: DataTypes.STRING
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    freezeTableName: true
});
Sanpham.belongsTo(Thuonghieu, {
    foreignKey: 'thuonghieuId',
    as: 'thuongHieu'
  });
Sanpham.belongsTo(Loai, {
    foreignKey: 'loaiId',
    as: 'loai'
  });
  
export default Sanpham;
(async()=>{
    await db.sync();
})();