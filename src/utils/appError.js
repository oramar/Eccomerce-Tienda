//Captura errores Operacionals 400..
class AppError extends Error {
  //Le pasamos al constructor el mensaje de error y codigo error
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
