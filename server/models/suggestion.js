const Sequelize = require('sequelize');
const connection = require('./../config/database');

const comment = connection.define('suggestion', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    suggestion: {
        type: Sequelize.STRING,
        allowNull: true
    },
},{underscored: true});

module.exports = comment;