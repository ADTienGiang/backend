import { Sequelize } from "sequelize";

const db = new Sequelize('byms4zqbftp7kvbksvni', 'ufwpi5myoghmfnkc', 'N9q5k2dQqy6YWTSoTz73', {
    host: "byms4zqbftp7kvbksvni-mysql.services.clever-cloud.com",
    dialect: "mysql"
});
 
export default db;