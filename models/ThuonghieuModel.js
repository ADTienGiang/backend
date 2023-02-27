import {Sequelize} from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Thuonghieu = db.define('Thuonghieu',{
    tenhieu: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
},{
    freezeTableName: true
});

export default Thuonghieu;

(async()=>{
    await db.sync();
})();