const {Router} = require('express')
const { check } = require('express-validator')
const { findAllProducts, findByIdProduct, createProduct, deleteProduct, updateByIdProduct  } = require('../controllers/product.controllers')
const { validProductById } = require('../middlewares/products.middlewares')
const { validateFields } = require('../middlewares/validateField.middleware')
const router = Router()

router.get('/', findAllProducts)
router.get('/:id',validProductById, findByIdProduct)
router.post('/', 
[
    check('title', 'The title is required').not().isEmpty(),
    check('description', 'The description is required').not().isEmpty(),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check('quantity', 'The quantity must be a number').isNumeric(),
    check('price', 'The price is required').not().isEmpty(),
    check('price', 'The price must be a number').isNumeric(),
    check('categoryId', 'The categoryId is required').not().isEmpty(),
    check('categoryId', 'The categoryId must be a number').isNumeric(),
    check('userId', 'The userId is required').not().isEmpty(),
    check('userId', 'The userId must be a number').isNumeric(),
    validateFields,
  ],
createProduct)
router.patch('/:id',
[
    check('title', 'The title is required').not().isEmpty(),
    check('description', 'The description is required').not().isEmpty(),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check('quantity', 'The quantity must be a number').isNumeric(),
    check('price', 'The price is required').not().isEmpty(),
    check('price', 'The price must be a number').isNumeric(),
    validateFields,
    validProductById,
  ],
updateByIdProduct)
router.delete('/:id',validProductById, deleteProduct)

module.exports = {
    routerProduct: router,
}