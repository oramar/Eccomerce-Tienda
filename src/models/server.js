const express = require('express')
const {routerProduct} = require('../routers/product.routes')

class Server{
    constructor(){
        this.app = express()
        this.port = process.env.PORT || 3010
        this.paths ={
            products: '/api/v1/products',
        }
        this.middlewares()
        this.router()
    }
    middlewares() {    
        this.app.use(express.json());
      }

router(){
    this.app.use(this.paths.products,routerProduct)
}

    listen() {
        this.app.listen(this.port, () => {
          console.log('Server is running on port', this.port);
        });
      }
}
module.exports = Server