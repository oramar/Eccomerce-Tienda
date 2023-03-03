const Cart = require("../models/cart.models");
const Order = require("../models/order.model");
const Product = require("../models/product.model")
const ProductInCart = require("../models/ProductInCart.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.addProductToCart = catchAsync(async(req,res,next)=>{
    const {productId, quantity} = req.body;
    const {cart}=req
    const productInCart = await ProductInCart.create({
        cartId: cart.id,
        productId,
        quantity,
    })
    res.status(201).json({
        status: 'success',
        message: 'The product has been added',
        productInCart,
      });
})

exports.updateCart = catchAsync(async (req, res, next) => {
    const { newQty } = req.body;
    const { productInCart } = req;
  
    if (newQty < 0) {
      return next(new AppError('The quantity must be greater than 0', 400));
    }
  
    if (newQty === 0) {
      await productInCart.update({ quantity: newQty, status: 'removed' });
    } else {
      await productInCart.update({ quantity: newQty, status: 'active' });
    }
  
    res.status(200).json({
      status: 'success',
      message: 'The product in cart has been updated',
    });
  });

  exports.removeProductToCart = catchAsync(async (req, res, next) => {
    const { productInCart } = req;
  
    await productInCart.update({ quantity: 0, status: 'removed' });
  
    res.status(200).json({
      status: 'success',
      message: 'The product in cart has been removed',
    });
  });
  
  exports.buyProductOnCart = catchAsync(async (req, res, next) => {
    //obtenemos el usuario en session
    const { sessionUser } = req;
  
    //1. buscar el carrito del usuario que inicio sesion y este activo
  
    const cart = await Cart.findOne({
      //solo mostramos el id del cart y del id usuario
      attributes: ['id', 'userId'],
      where: {
        userId: sessionUser.id,
        status: 'active',
      },
      //Buscamos que productos esta en el carrito y excluimos la fecha creacion y modificacion
      include: [
        {
          model: ProductInCart,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: {
            status: 'active',
          },
          include: [
            {
              model: Product,
              attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
            },
          ],
        },
      ],
    });
  
    if (!cart) {
      return next(new AppError('There are not products in cart', 400));
    }
  
    //2. calcular el precio total a pagar
    let totalPrice = 0;
    //Multiplico cantidad de productIncart con Preci de productos para allar el preccio total
    //de precio de todos los productos del cart
    cart.productInCarts.forEach(productInCart => {
      totalPrice += productInCart.quantity * productInCart.product.price;
    });
  
    //3. vamos a actualizar el stock o cantidad del modelo Product
    //Cuando se trabaja con map, o que maneja cincronia, no se espera que se cumpla la promesa
    //por lo tanto se va guardando en un array de promesas sin resolver
    const purchasedProductPromises = cart.productInCarts.map(
      async productInCart => {
        //1 buscar el producto para actualizar su información
        const product = await Product.findOne({
          where: {
            id: productInCart.productId,
          },
        });
        //2 calcular la cantidad de productos que me quedan en la tiendan
        //TODO: verificar cantidad para no agregar mas
        const newStock = product.quantity - productInCart.quantity;
        //3 actualizabamos la informacion y la retornabamos
        return await product.update({ quantity: newStock });
      }
    );
  //Resolvemos todas las promesas pendiente por resolver en purchasedProductPromises
    await Promise.all(purchasedProductPromises);
  
    //Creamos una constante asignada a map y recorremos el arregle productInCarts
    const statusProductInCartPromises = cart.productInCarts.map(
      async productInCart => {
        //Buscamos el producto en el carrito a actualizar
        const productInCartFoundIt = await ProductInCart.findOne({
          where: {
            id: productInCart.id,
            status: 'active',
          },
        });
  //cambiamos el estatu del producto en cart encontrado que este activo
        return await productInCartFoundIt.update({ status: 'purchased' });
      }
    );
  //Resolvemos el arreglo de promesas
    await Promise.all(statusProductInCartPromises);
  //cambiamos el estatus del carrito a purchased
    await cart.update({ status: 'purchased' });
  
    //4. generamos el pedido u order y le pasamo 
    //id del usuario que esta en sessionUser.id
    //id cart que esta cart.id
    //y el precio total
    const order = await Order.create({
      userId: sessionUser.id,
      cartId: cart.id,
      totalPrice,
    });
  //Enviamo un mensaje usuario con los datos de la order y un mensaje
    res.status(201).json({
      message: 'The order has been generated succesfully',
      order,
    });
  });