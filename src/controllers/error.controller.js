const AppError = require('../utils/appError');

const handleCastError22P02 = () =>
  new AppError('Some type of data send does not match was expected', 400);

  //Enviamos un error de que el token es invalido
const handleJWTError = () =>
  new AppError('Invalid Token. Please login again!', 401);

  //Enviamos un error de que el token a experado
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please login again.', 401);

 //Error en desarrollo
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,//Capturamos y mostramos las pilas de errores
  });
};
//Error en produccion, operacional o por nosotros
const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming or other unknown error: don't leak error details
    console.error('ERROR 🧨', err);
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
};
//Manejador de pila de errores
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    //Aqui obtengo el codigo error, es status y si es operacional
    let error = { ...err };

    //Si no existe el codigo de error, a la variable le pasamo err, para muestre mensaje
    if (!error.parent?.code) {
      error = err;
    }

    if (error.parent?.code === '22P02') error = handleCastError22P02(error);
    //Si nos da el error "JsonWebTokenError" significa que token fue camiado
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    //Validamos si el token expira
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
