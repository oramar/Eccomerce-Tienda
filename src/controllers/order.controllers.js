const Cart = require('../models/cart.models');
const Order = require('../models/order.model');
const ProductInCart = require('../models/ProductInCart.model');
const catchAsync = require('../utils/catchAsync');

/* A function that is being exported. */
/*Obtenemos las ordenes del usuario en sesion */
exports.getOrders = catchAsync(async (req, res, next) => {
    //Obtenemos el usuario de la req
    const { sessionUser } = req;
  //Buscamos todas las ordenes del usuario en session y que la orden este activa
    const orders = await Order.findAll({
      where: {
        userId: sessionUser.id,
        status: true,
      },
      //Ademas traemos el carrito de ese usuario que tenga el estado purchased
      include: [
        {
          model: Cart,
          where: {
            status: 'purchased',
          },
          //Y dentro del carrito buscamos los productos que estan en cada carrito que tenga status purchased
          include: [
            {
              model: ProductInCart,
              where: {
                status: 'purchased',
              },
            },
          ],
        },
      ],
    });
  
    //Enviamos la respuesta al usuario con la orders
    res.status(200).json({
      orders,
    });
  });
  
  /* A function that is being exported. */
  exports.getOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { sessionUser } = req;
    //TODO: acordarme de hacer esta mejora o esta refactorización
    const order = await Order.findOne({
      where: {
        userId: sessionUser.id,
        id,
        status: true,
      },
      include: [
        {
          model: Cart,
          where: {
            status: 'purchased',
          },
          include: [
            {
              model: ProductInCart,
              where: {
                status: 'purchased',
              },
            },
          ],
        },
      ],
    });
    res.status(200).json({
      order,
    });
  });