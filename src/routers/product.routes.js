const { Router } = require('express');
const { check } = require('express-validator');
const {
  findAllProducts,
  findByIdProduct,
  createProduct,
  deleteProduct,
  updateByIdProduct,
} = require('../controllers/product.controllers');
const {
  protect,
  protectAccountOwner,
  restrictTo,
} = require('../middlewares/auth.middlewares');
const { validProductById } = require('../middlewares/products.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');
const { createProductValidation, updateProductValidation } = require('../middlewares/validations.middleware');
const { upload } = require('../utils/multer');

const router = Router();

router.get('/', findAllProducts);
router.get('/:id', validProductById, findByIdProduct);

//Protegemos las rutas de aqui hacia abajo utilizando el archivo auth.meddlewares
router.use(protect);

router.post(
  '/',
  [
    upload.array('productImgs', 3),
    createProductValidation,
    validateFields,
    restrictTo('admin'), //su uso funciona siempre que se haya utilizado router.use(protect);
  ],
  createProduct
);
router.patch(
  '/:id',
  [
    updateProductValidation,
    validateFields,
    validProductById,
    restrictTo('admin'),
  ],
  updateByIdProduct
);
router.delete('/:id', validProductById, restrictTo('admin'), deleteProduct);

module.exports = {
  routerProduct: router,
};
