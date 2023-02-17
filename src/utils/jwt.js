const jwt = require('jsonwebtoken');

const generateJWT = id => {
  //Creo una Promesa
  return new Promise((resolve, reject) => {
    const payload = { id };

    //Firmo el token
    jwt.sign(
      //Envio el payload y contraseña Secreta
      payload,
      //Envio la frace secreta
      process.env.SECRET_JWT_SEED,
      //Indico cuanto demora su expericion
      {
        expiresIn: process.env.JWT_EXPIRE_IN,
      },
      (err, token) => {
        if (err) {
          console.log(err);
          //Envio error de esta promesa
          reject(err);
        }
        //Si no hay error, envio el token
        resolve(token);
      }
    );
  });
};

module.exports = generateJWT;
