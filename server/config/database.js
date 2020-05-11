const Sequelize = require('sequelize');

const connection = new Sequelize('pelia_ocp', 'root', '',{
    host: 'localhost',
    dialect:'mysql'
});
module.exports = connection; 
