//Recibe una funcion como argumento,
const catchAsync = fn => {
  //Retorno una funcion anonima que se ejecute
  return (req, res, next) => {
    //De la funcion capturo el error con catch y paso el error a la pila de errores
    fn(req, res, next).catch(next);//next es igual: err ==> next(err)
  };
};

module.exports = catchAsync;
