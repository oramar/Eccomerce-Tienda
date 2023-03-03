const { Router } = require("express");
const { check } = require("express-validator");
const { createCategory, findAllCategories, findByIdCategory, updateByIdCategory, deleteByIdCategory } = require("../controllers/categories.controllers");
const { protect, restrictTo, protectAccountOwner } = require('../middlewares/auth.middlewares');
const { validCategoryById } = require("../middlewares/categories.middlewares");
const { validateFields } = require("../middlewares/validateField.middleware");

const router = Router()
router.get('/',findAllCategories)
router.get('/:id',validCategoryById,findByIdCategory)

//Protegemos las rutas de aqui hacia abajo utilizando el archivo auth.meddlewares
router.use(protect);

router.post('/',
[
    check('username', 'The name is required').not().isEmpty(), 
    validateFields,
    restrictTo('admin'),
],
createCategory)

router.patch('/:id',
[
    check('username', 'The name is required').not().isEmpty(),
    validateFields,
    validCategoryById,
    restrictTo('admin'),
    //protectAccountOwner,
  ],
updateByIdCategory)

router.delete('/:id',
validCategoryById,
restrictTo('admin'),
//protectAccountOwner,
deleteByIdCategory
)


module.exports = {
    routerCategories: router
}