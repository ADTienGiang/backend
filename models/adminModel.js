import { Sequelize } from "sequelize";
import db from "../config/database.js";
import bcrypt from "bcrypt";

const { DataTypes } = Sequelize;

const Admin = db.define(
  "Admin",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    hooks: {
      beforeCreate: async (admin) => {
        // Hash password before creating admin record
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        admin.password = await bcrypt.hash(admin.password, salt);
      },
    },
    timestamps: false,
    tableName: 'Admin'
  }
);

// Method to compare entered password with the hashed password in the database
Admin.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default Admin;
(async()=>{
  await db.sync({ force: false });
})();