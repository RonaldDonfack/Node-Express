// id ussername email

const {Sequelize, DataTypes} = require('sequelize');


const sequelize = require('../utils/database');

const User = sequelize.define('users', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull : false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull : false
    },
    email: {
        type: DataTypes.STRING
    }
});

module.exports = User;