//Captura errores Operacionals 400..
class AppError extends Error {
  //Le pasamos al constructor el mensaje de error y codigo error
  constructor(message, statusCode) {
    //llamamos el constructor de la clase padre
    super(message);
//Creamos una propiedad y le enviamos el codigo de estado que se recibe
    this.statusCode = statusCode;
    //Verificamo si el codigo del statusCode inicia en 4, y enviamo error de lo contrario fail
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';
    //si pasa por aqui, es un error operacional
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
