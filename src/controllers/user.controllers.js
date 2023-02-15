const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

//============================Find all user=================================================
exports.findAllUser = catchAsync(async (req, res) => {
  const users = await User.findAll({
    where: {
      status: true,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Users was found successfully',
    users,
  });
});
//============================Find User By Id===============================================
exports.findByIdUser = catchAsync(async (req, res) => {
    const { user } = req;

    res.status(200).json({
      status: 'success',
      message: 'User was found successfully',
      user,
    });
});
//==============================Create user=================================================
exports.createUser = catchAsync(async (req, res) => {});
//============================Update User By Id=============================================
exports.updateUser = catchAsync(async (req, res) => {
    const { username, email } = req.body;
    const { user } = req;
  
    await user.update({ username, email });
  
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
    });
});
//=============================Delete user by Id============================================
exports.deleteUser = catchAsync(async (req, res) => {
    const { user } = req;

    await user.update({ status: false });
  
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
});
