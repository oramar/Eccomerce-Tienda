const express = require('express');
const { routerProduct } = require('../routers/product.routes');
const cors = require('cors');
const { db } = require('../databases/db');
const { routerUser } = require('../routers/user.routes');
const morgan = require('morgan');
const { routerCategories } = require('../routers/categories.routes');
const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/error.controller');
const { routerAuth } = require('../routers/auth.routes');
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3010;
    this.paths = {
      users: '/api.v1/users',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      auth: '/api/v1/auth',
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
    //utilizar las rutas de autenticacion
    this.app.use(this.paths.auth, routerAuth);
    this.app.all('*',(req,res,next)=>{
      return next(
        new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
      );
    })
    this.app.use(globalErrorHandler);
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
