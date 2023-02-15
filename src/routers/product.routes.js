const {Router} = require('express')
const { findAllProducts, findByIdProduct, createProduct, deleteProduct, updateByIdProduct  } = require('../controllers/product.controllers')
const { validProductById } = require('../middlewares/products.middlewares')
const router = Router()

router.get('/', findAllProducts)
router.get('/:id', findByIdProduct)
router.post('/', createProduct)
router.patch('/:id',validProductById, updateByIdProduct)
router.delete('/:id',validProductById, deleteProduct)

module.exports = {
    routerProduct: router,
}