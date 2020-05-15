const Sequelize = require('sequelize');

const connection = new Sequelize('pelia4', 'root', '',{
    host: 'localhost',
    dialect:'mysql'
});
module.exports = connection; 
