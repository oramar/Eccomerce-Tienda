const { Router } = require('express');
const { check } = require('express-validator');
const {
  addProductToCart,
  updateCart,
  removeProductToCart,
  buyProductOnCart,
} = require('../controllers/cart.controllers');
const { protect } = require('../middlewares/auth.middlewares');
const {
  validExistCart,
  ValidExistProductInCart,
  validExistProductInCartByParamsForUpdate,
  validExistProductInCartForUpdate,
} = require('../middlewares/cart.middleware');
const {
  validBodyProductById,
  validIfExistProductsInStock,
  validExistProductInStockForUpdate,
  validExistProductIdByParams,
} = require('../middlewares/products.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');
const {
  updateProductToCartValidation,
} = require('../middlewares/validations.middleware');

const router = Router();
router.use(protect);
router.post(
  '/add-product',
  [
    check('productId', 'The producId is required').not().isEmpty(),
    check('productId', 'The producId must be a number').isNumeric(),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check('quantity', 'The quantity must be a number').isNumeric(),
    validateFields,
    validBodyProductById,
    validIfExistProductsInStock,
    validExistCart,
    ValidExistProductInCart,
  ],
  addProductToCart
);

router.patch(
  '/update-cart',
  [
    updateProductToCartValidation,
    validateFields,
    validBodyProductById,
    validExistProductInStockForUpdate,
    validExistProductInCartForUpdate,
  ],
  updateCart
);

router.delete(
  '/:productId',
  [validExistProductIdByParams, validExistProductInCartByParamsForUpdate],

  removeProductToCart
);

router.post('/purchase', buyProductOnCart);
module.exports = {
  routerCart: router,
};
