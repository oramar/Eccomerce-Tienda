const Product = require('../models/product.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
//Con este middleware validamos si existe el usuario
exports.validProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOne({
    where: {
      id,
      status: true,
    },
  });
//Si no existe retornamos un error 404
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
//Le  adjunto una llave el producto que encontre
//req.product: product se puede llamar como quiera
  req.product = product;
  next();
});
