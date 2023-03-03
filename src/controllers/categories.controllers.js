const Category = require('../models/categories.models');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

//============================Find all Categories=================================================
exports.findAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({
    attributes: ['id', 'username'],
    where: {
      status: true,
    },
    include: [
      {
        //Modelo asociado a categories
        model: Product,
        //Columnas del modelo Product que no se deben mostrar
        attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
        //Mostrara los productos con el status true
        where: {
          status: true,
        },
        //require:false => Mustra todas las categorias asi no tenga productos
        //Tambien vamos a incluir la tabla User, que compraron los productos 
        include: [
          {
            model: User,
            attributes: ['id', 'username'],
            where: {
              status: true,
            },
          },
        ],
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    message: 'Categories fetched successfully',
    categories,
  });
});
//============================Find Category By Id===============================================
exports.findByIdCategory = catchAsync(async (req, res, next) => {
  const { category } = req;

  res.status(200).json({
    status: 'success',
    message: 'Category fetched successfully',
    category,
  });
});
//==============================Create Category=================================================
exports.createCategory = catchAsync(async (req, res, next) => {
  const { username } = req.body;
  const category = await Category.create({ username });

  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    category,
  });
});
//============================Update Category By Id=============================================
exports.updateByIdCategory = catchAsync(async (req, res, next) => {
  const { username } = req.body;
  const { category } = req;
  await category.update({ username });
  res.status(200).json({
    status: 'success',
    message: 'Category updated successfully',
  });
});
//=============================Delete Category by Id============================================
exports.deleteByIdCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  await category.update({ status: false });
  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully',
  });
});
