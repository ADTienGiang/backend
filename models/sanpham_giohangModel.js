import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Giohang from "./giohangModel.js";
import Sanpham from "./sanphamModel.js";

const { DataTypes } = Sequelize;

const SanphamGiohang = db.define('sanpham_giohangs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sanphamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  giohangId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  soluongmua: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

SanphamGiohang.belongsTo(Giohang, { foreignKey: 'giohangId' });
SanphamGiohang.belongsTo(Sanpham, { foreignKey: 'sanphamId' });
Giohang.belongsToMany(Sanpham, {
  through: SanphamGiohang,
  foreignKey: 'giohangId',
  otherKey: 'sanphamId',
});
Sanpham.belongsToMany(Giohang, {  
  through: SanphamGiohang,
  foreignKey: 'sanphamId',
  otherKey: 'giohangId',
});


export default SanphamGiohang;
(async()=>{
  await db.sync();
})();