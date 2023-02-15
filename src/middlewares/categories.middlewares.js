const catchAsync = require("../utils/catchAsync");
const Category = require('../models/categories.models');
const AppError = require("../utils/appError");
//Con este middleware validamos si existe la categoria
exports.validCategoryById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findOne({
      where: {
        id,
        status: true,
      },
    });
  //Si no existe retornamos un error 404
    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    req.category = category;
    next();
  });