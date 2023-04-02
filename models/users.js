const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  },
  updated_at:{
    type: DataTypes.DATE
  }
},{
    tableName: 'user',
    timestamps: true,
    updatedAt: 'updated_at'
});

module.exports = User;