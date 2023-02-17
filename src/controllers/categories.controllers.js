const Category = require('../models/categories.models');
const catchAsync = require('../utils/catchAsync');

//============================Find all Categories=================================================
exports.findAllCategories = catchAsync(async (req, res,next) => {
  const categories = await Category.findAll({
    where: {
      status: true,
    },
  });
  res.status(200).json({
    status: 'success',
    message: 'Categories fetched successfully',
    categories,
  });
});
//============================Find Category By Id===============================================
exports.findByIdCategory = catchAsync(async (req, res,next) => {
    const {category} = req;
   
    res.status(200).json({
        status: 'success',
        message: 'Category fetched successfully',
        category,
      });
})
//==============================Create Category=================================================
exports.createCategory = catchAsync(async (req, res,next) => {
  const { username } = req.body;
  const category = await Category.create({ username });

  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    category,
  });
});
//============================Update Category By Id=============================================
exports.updateByIdCategory = catchAsync(async(req,res,next)=>{
    const {username} = req.body 
    const { category } = req;
    await category.update({ username})
    res.status(200).json({
        status: 'success',
        message: 'Category updated successfully',
      });
})
//=============================Delete Category by Id============================================
exports.deleteByIdCategory = catchAsync(async(req,res,next)=>{
    const {category} = req;
    await category.update({status:false})
    res.status(200).json({
        status:'success',
        message: 'Category deleted successfully',
      });
})