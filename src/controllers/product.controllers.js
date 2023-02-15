const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');

//==================================find All Products================================================
exports.findAllProducts = catchAsync(async (req, res) => {
    const products = await Product.findAll({
      where: {
        status: true,
      },
    });
  
    res.status(200).json({
      status: 'success',
      message: 'The products found were successfully',
      products,
    });
  });

//=================================Find Product By Id======================================
exports.findByIdProduct = catchAsync(async(req, res) => {
  const { id } = req.params;
  //const {product}=req
const product = await Product.findOne({
    where:{
        id,
        status: true,
    }
})


return res.status(200).json({
    status: 'success',
    message: 'The product was found successfully',
    product,
  });
});

//================================Create Product===========================================
//Crear un producto
exports.createProduct = catchAsync(async (req, res) => {
  //Obtenemos los datos ingresado por el usuario
  const { title, description, quantity, price, categoryId, userId } = req.body;
  //Creamos el producto con Product.create y le pasamos los datos a crear
  const newProduct = await Product.create({
    //Colocamos los datos en minusculas
    title: title.toLowerCase(),
    description: description.toLowerCase(),
    quantity,
    price,
    categoryId,
    userId,
  });
  //Devolvemos una respuesta al usuario
  res.status(201).json({
    status: 'success',
    message: 'The product was created successfully',
    newProduct,
  });
});

//===============================update By Id product========================================
exports.updateByIdProduct = catchAsync(async (req, res) => {
  //Como ya obtuve el producto con el middleware, y tenemos un respuesta ahora lo desestructuro para hacer el update del mismo
  const { product } = req;
  const { title, description, quantity, price } = req.body;

  const updateProduct = await product.update({
    title,
    description,
    quantity,
    price,
  });
  res.status(200).json({
    status: 'success',
    message: 'Then product has been updated successfully',
    updateProduct,
  });
});

//==================================Delete Product===========================================
exports.deleteProduct = catchAsync(async(req, res) => {
  //  console.log(req.params) Capturamos el parametro que pasamos const { id } = req.params;
const {product}=req
await product.update({status:false})
  res.json({
    status: 'success',
    message: 'The product has been deleted successfully',
  });
});