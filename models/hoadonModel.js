import {Sequelize} from "sequelize";
import db from "../config/database.js";
const {DataTypes} = Sequelize;
const hoadon = db.define('hoadon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idsp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  idkh: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  tensp: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    tenkh: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    diachi: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gia: {
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

export default hoadon;

(async()=>{
  await db.sync({ force: false });
})();