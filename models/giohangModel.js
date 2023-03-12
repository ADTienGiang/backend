import {Sequelize} from "sequelize";
import db from "../config/database.js";
import khachhang from "./KhachHangModel.js";
import Sanpham from "./sanphamModel.js";
const {DataTypes} = Sequelize;
const giohang = db.define('giohangs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idkh: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idsp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
  soluongmua: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
giohang.belongsTo(khachhang, { foreignKey: "idkh" });
giohang.belongsTo(Sanpham, { foreignKey: "idsp" });
export default giohang;

(async()=>{
  await db.sync({ force: false });
})();