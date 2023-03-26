import { Sequelize, Model, DataTypes } from 'sequelize';
const sequelize = new Sequelize('mysql;//root@locahost/signing');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  pass: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  active: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
},{
    tableName: 'user',
    timestamps: true
});

module.exports = User