const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { ref, getDownloadURL } = require('firebase/storage');
const { storage } = require('../utils/firebase');

//============================Find all user=================================================
exports.findAllUser = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      status: true,
    },
  });
  // const userPromises = users.map(async user => {
  //   user.profileImageUrl = await getDownloadURL(
  //     ref(storage, user.profileImageUrl)
  //   );
  //   return user;
  // });
  //const userResolver = await Promise.all(userPromises);

  const userResolver = await Promise.all(users.map(async user=>{
    user.profileImageUrl = await getDownloadURL(
      ref(storage, user.profileImageUrl)
    );
    return user;
  }))
  
  res.status(200).json({
    status: 'success',
    message: 'Users was found successfully',
    users: userResolver,
  });
});
//============================Find User By Id===============================================
exports.findByIdUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  // const imgref =ref(storage, user.profileImageUrl)
  // const url = await getDownloadURL(imgref)
  // user.profileImageUrl = url

  //lo anterior lo puedo remplazar por este codigo
  user.profileImageUrl = await getDownloadURL(
    ref(storage, user.profileImageUrl)
  );
  res.status(200).json({
    status: 'success',
    message: 'User was found successfully',
    user,
  });
});
//============================Update User By Id=============================================
exports.updateByIdUser = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;
  const { user } = req;

  await user.update({ username, email });

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
  });
});

//============================update password user =============================
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { currentPassword, newPassword } = req.body;
  //Si no son correctas las contraseña envio un error
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  //si son correcta encripto la nueva contraseña
  const salt = await bcrypt.genSalt(10);
  const encriptedPassword = await bcrypt.hash(newPassword, salt);

  //Ahora si actualizo la contraseña en la base de datos
  await user.update({
    password: encriptedPassword,
    passwordChangedAt: new Date(),
  });

  res.status(200).json({
    status: 'success',
    message: 'The User Password was updated successfully',
  });
});

//=============================Delete user by Id============================================
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});
