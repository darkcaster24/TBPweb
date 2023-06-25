// import sequelize
const sequelize = require ("sequelize");
 
// create connection
const db = new sequelize('signing', 'darkcaster24', 'zaqwerty123', {
    host: 'db4free.net',
    port: '3306',
    dialect: 'mysql',
    logging: true,
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      // ...
        connectTimeout: 60000, // Ubah nilai timeout sesuai kebutuhan Anda (dalam milidetik)
        options: {
        maxAllowedPacket: 1073741824 // Nilai maksimum dalam byte (contoh: 1GB)
        }
    },
    // dialectOptions: {
    //     options: {
    //         maxAllowedPacket: 1073741824 // Nilai maksimum dalam byte (contoh: 1GB)
    //     }
    // }
});
 
// export connection
module.exports = db;
