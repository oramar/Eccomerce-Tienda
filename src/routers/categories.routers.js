const { Router } = require("express");
const { createCategory, findAllCategories, findByIdCategory, updateByIdCategory, deleteByIdCategory } = require("../controllers/categories.controllers");
const { validCategoryById } = require("../middlewares/categories.middlewares");

const router = Router()
router.get('/',findAllCategories)
router.get('/:id',validCategoryById,findByIdCategory)
router.post('/',createCategory)
router.patch('/:id',validCategoryById,updateByIdCategory)
router.delete('/:id',validCategoryById,deleteByIdCategory)


module.exports = {
    routerCategories: router
}