//Protecion de api ataque bruta
const cors = require('cors');
const express = require('express');
const helmet = require("helmet");
const hpp = require('hpp');
const rateLimit  =  require ( 'express-rate-limit' )
const xss = require('xss-clean')
//registrar solicitudes http
const morgan = require('morgan');
//Configuracion base de datos
const { db } = require('../databases/db');
//Mis rutas
const { routerAuth } = require('../routers/auth.routes');
const { routerCategories } = require('../routers/categories.routes');
const { routerProduct } = require('../routers/product.routes');
const { routerUser } = require('../routers/user.routes');
//Manejo errores personalizados
const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/error.controller');
const initModel = require('./initModels');
const { routerCart } = require('../routers/cart.routes');

//Clase server
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3010;
    this.limiter = rateLimit({
      windowMs : 60  *  60  *  1000,//tiempo 60 minutos
      max:100,
      message: 'Too many request from this IP, please try again in an hour!',
    })
    //Definimos los paths de nuestra aplicacion
    this.paths = {
      auth: '/api/v1/auth',
      cart: '/api/v1/cart',
      categories: '/api/v1/categories',
      products: '/api/v1/products',
      users: '/api/v1/users',
      
      
    };
    this.database();
    this.middlewares();
    this.router();
  }
  middlewares() {
    this.app.use(helmet());
    //Usamos xss-clean
    this.app.use(xss())
    this.app.use(hpp());
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
    //Usamos para todas las rutas el limiter rote
    this.app.use('/api/v1', this.limiter);
    //Utilizamos las cors asi y las importamos arriba
    this.app.use(cors());
    //mostramos formato Json la respuestas
    this.app.use(express.json());
  }

  router() {   
    //Configuramos la ruta de productos
    this.app.use(this.paths.products, routerProduct);
    //Configuramos la ruta de cart
    this.app.use(this.paths.cart, routerCart);
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

    //Relacionamos las tablas
    initModel()
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
