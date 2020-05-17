const Sequelize = require('sequelize');

const connection = new Sequelize('pelia', 'root', 'Pelia@1337++',{
    host: 'localhost',
    dialect:'mysql'
});
module.exports = connection; 
