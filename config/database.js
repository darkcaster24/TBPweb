// import sequelize
const sequelize = require ("sequelize");
 
// create connection
const db = new sequelize('signing', 'root', '', {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    dialectOptions: {
        options: {
            maxAllowedPacket: 1073741824 // Nilai maksimum dalam byte (contoh: 1GB)
        }
    }
});
 
// export connection
module.exports = db;
