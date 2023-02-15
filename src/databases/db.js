const { Sequelize } = require('sequelize');
//Creo un objeto de conexion, donde instancio la clase Sequelize
const db = new Sequelize({
  dialect: process.env.DB_DIALECT,//le indico tipo base de datos a trabajar
  host: process.env.DB_HOST,//Indico la direccion ip o nombre dominio
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false,//Muestra log de las consultas que se estan haciendo
});

module.exports = { db };
