const Cart = require('../models/cart.models');
const ProductInCart = require('../models/ProductInCart.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/* Checking if the user has a cart. If not, it will create one. */
exports.validExistCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  let cart = await Cart.findOne({
    where: {
      userId: sessionUser.id,
      status: 'active',
    },
  });

  if (!cart) {
    cart = await Cart.create({ userId: sessionUser.id });
  }

  req.cart = cart;
  next();
});

/* A middleware function that checks if the product is already in the cart. If it is, it will update
the status to active and the quantity to 1. If it is not, it will return an error. */
exports.ValidExistProductInCart = catchAsync(async (req, res, next) => {
  const { product, cart } = req;

  const productInCart = await ProductInCart.findOne({
    where: {
      cartId: cart.id,
      productId: product.id,
    },
  });

  if (productInCart && productInCart.status === 'removed') {
    await productInCart.update({ status: 'active', quantity: 1 });
    return res.status(200).json({
      status: 'success',
      message: 'Product successfully added',
    });
  }

  if (productInCart) {
    return next(new AppError('This product already exists in the cart', 400));
  }

  req.productInCart = productInCart;
  next();
});

exports.validExistProductInCartForUpdate = catchAsync(
  async (req, res, next) => {
    //Traemos el usuario en session, con la finalidad de traer su carrito
    const { sessionUser } = req;
    //Nos traemos del body, el id del producto para validar si existe en ProductInCart
    const { productId } = req.body;

    //buscamos el carrito asignado al usuario en seccion, para obtener su id
    const cart = await Cart.findOne({
      where: {
        userId: sessionUser.id,
        status: 'active',
      },
    });
//busco el carrito ylos productos en ProductInCart
    const productInCart = await ProductInCart.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
    });
//si no existe producto en productIncart
    if (!productInCart) {
      return next(new AppError('The product does not exist in the cart', 400));
    }
//Guardo el productInCart en productIncart
    req.productInCart = productInCart;

    next();
  }
);

exports.validExistProductInCartByParamsForUpdate = catchAsync(
  async (req, res, next) => {
    const { sessionUser } = req;
    const { productId } = req.params;

    const cart = await Cart.findOne({
      where: {
        userId: sessionUser.id,
        status: 'active',
      },
    });

    const productInCart = await ProductInCart.findOne({
      where: {
        cartId: cart.id,
        productId,
        status: 'active',
      },
    });

    if (!productInCart) {
      return next(new AppError('The product does not exist in the cart', 400));
    }

    req.productInCart = productInCart;

    next();
  }
);
