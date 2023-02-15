const express = require('express');
const { routerProduct } = require('../routers/product.routes');
const cors = require('cors');
const { db } = require('../databases/db');
const { routerUser } = require('../routers/user.routers');
const morgan = require('morgan');
const { routerCategories } = require('../routers/categories.routers');
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3010;
    this.paths = {
      users: '/api.v1/users',
      products: '/api/v1/products',
      categories: '/api/v1/categories'
    };
    this.database();
    this.middlewares();
    this.router();
  }
  middlewares() {
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
    //Utilizamos las cors asi y las importamos arriba
    this.app.use(cors());
    //mostramos formato Json la respuestas
    this.app.use(express.json());
  }

  router() {   
    //Configuramos la ruta de productos
    this.app.use(this.paths.products, routerProduct);
    //Utilizamos las rutas de usuarios
    this.app.use(this.paths.users, routerUser)
    //Utilizamos las rutas de categorias
    this.app.use(this.paths.categories, routerCategories)
  }

  database(){
    db.authenticate()//Devuelve una promesa
    .then(()=>console.log('Database Authenticated'))
    .catch(err=>console.log(err))

    db.sync()//{force:true} borra todos los datos de la aplicacion
    .then(() => console.log('Database synced'))
    .catch(error => console.log(error));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server is running on port', this.port);
    });
  }
}
module.exports = Server;
