const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
var User = require('../models/users');

const Doc = sequelize.define('Doc', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sender_id: {
      type: Sequelize.INTEGER,
      references: {
          model: User,
          key: 'id'
      }
    },
    signer_id: {
      type: Sequelize.INTEGER,
      references: {
          model: User,
          key: 'id'
      }
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: true
    },
    doc: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at:{
      type: DataTypes.DATE
    },
    updated_at:{
      type: DataTypes.DATE
    }
},{
  tableName: 'document',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Doc;