const Product = require('../models/product.model');
const ProductImg = require('../models/productImg.model');
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
    include: [
      {
        model: ProductImg,
      }
    ]
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

/* Checking if the productId is valid. */
//Validamos si existe un producto
exports.validBodyProductById = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findOne({
    where: {
      id: productId,
      status: true,
    },
  });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  req.product = product;
  next();
});

/* A middleware that checks if there are enough products in stock. */
//Validar si hay stock suficiente para agregar al carro
exports.validIfExistProductsInStock = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { quantity } = req.body;

  if (product.quantity < quantity) {
    return next(
      new AppError('There are not enaugh products in the stock', 400)
    );
  }

  next();
});

exports.validExistProductInStockForUpdate = catchAsync(
  async (req, res, next) => {
    const { product } = req;
    const { newQty } = req.body;

    if (newQty > product.quantity) {
      return next(
        new AppError('There are not enaugh products in the stock', 400)
      );
    }

    next();
  }
);

exports.validExistProductIdByParams = catchAsync(async (req, res, next) => {
  //Se llama productid porque asi se llama la ruta
  const { productId } = req.params;

  const product = await Product.findOne({
    where: {
      id: productId,
      status: true,
    },
  });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  next();
});