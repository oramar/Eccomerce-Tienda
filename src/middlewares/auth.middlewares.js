const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');
const AppError = require('../utils/appError');

exports.protect = catchAsync(async (req, res, next) => {
  //1. Obtenemos el token y que venga el token
  let token;
  console.log(req.headers.authorization);

  if (
    //Si exixte el token en el header y empieza con el Bearer, entonces tenemos un token
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //Asginamo el token a la variable y dividimos la informacion en un array de dos posiciones y asignamos la segunda posicion
    token = req.headers.authorization.split(' ')[1];
    //si no existe el token  enviamos un error
    if (!token) {
      return next(
        new AppError('You are not logged in! Not token provided', 401)
      );
    }
  }
  //2. verificacion token
  //Convertimos la funcion en una promesa y verficamos el token con la llave secreta de variable de entorno
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );
  console.log(decoded);

  //3. verficiar que el usuario existe en la base de datos
  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: true,
    },
  });

  //Si no existe el usuario enviamos un error
  if (!user) {
    return next(
      new AppError('The owner of this token it not longer available', 401)
    );
  }

  //4. Verificar si el usuario a cambiado la contraseña despues de que geenro un token
  //si en la base de datos la columna passwordChangedAt tiene datos, entonces
  if (user.passwordChangedAt) {
    //guardamo en una variable el valor de esa fecha y la convertimos en milesegundo con getTime()
    //Luego la dividimos entre 1000, para convertirla en segundos, en base 10
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    //Verificamo la fecha de creacion del token no sea inferior a la variable changedTimeStamp
    if (decoded.iat < changedTimeStamp) {
      return next(
        new AppError(
          'User recently changed password!, please login again.',
          401
        )
      );
    }
  }

  //Guardamo el usuario en la variable sessionUser que esta iniciando seccion
  req.sessionUser = user;
  next();
});

//Proteger cada cuenta usuario
exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  //traemos el usuario obtendio al verificar si existe, en el middleware validIfExistUser
  //Traemos la usuario en seccion del middleware protect "sessionUser"
  const { user, sessionUser } = req;
  //Verificamos el usuario en la base de datos y usuario que inicio seccion
  if (user.id !== sessionUser.id) {
    //Si no concuerda enviamos un error
    return next(new AppError('You do not own this account.', 401));
  }

  next();
});

/* A middleware function that is used to restrict access to certain roles. */
//Le paso los roles que me puedan enviar con ...roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //Si el que inicia seccion no tiene el rol especificado, enviamos un error
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('You do not have permission to perfom this action.!', 403)
      );
    }

    next();
  };
};