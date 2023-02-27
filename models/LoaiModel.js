import {Sequelize} from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const Loai = db.define('Loai',{
    tenloai: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
},{
    freezeTableName: true
});

export default Loai;

(async()=>{
    await db.sync();
})();