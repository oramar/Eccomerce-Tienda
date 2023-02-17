const { Router } = require("express");
const { check } = require("express-validator");
const { createCategory, findAllCategories, findByIdCategory, updateByIdCategory, deleteByIdCategory } = require("../controllers/categories.controllers");
const { validCategoryById } = require("../middlewares/categories.middlewares");
const { validateFields } = require("../middlewares/validateField.middleware");

const router = Router()
router.get('/',findAllCategories)
router.get('/:id',validCategoryById,findByIdCategory)
router.post('/',
[
    check('name', 'The name is required').not().isEmpty(), 
    validateFields
],
createCategory)

router.patch('/:id',
[
    check('name', 'The name is required').not().isEmpty(),
    validateFields,
    validCategoryById,
  ],
updateByIdCategory)

router.delete('/:id',validCategoryById,deleteByIdCategory)


module.exports = {
    routerCategories: router
}