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
  jabatan: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  pass: {
    type: DataTypes.STRING,
    allowNull: false
  },
  signature: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  avatar: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  active: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetTokenExpiration: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at:{
    type: DataTypes.DATE
  },
  updated_at:{
    type: DataTypes.DATE
  }
},{
    tableName: 'user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;