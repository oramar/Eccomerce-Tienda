const { Router } = require('express');
const { check } = require('express-validator');
const {
  createUser,
  login,
  renewToken,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');
const { validIfExistUserEmail } = require('../middlewares/user.middleware');
const { upload } = require('../utils/multer');
const { registerUserValidation, loginUserValidation } = require('../middlewares/validations.middleware');
const router = Router();
router.post(
  '/signup',
  [
    //2. segundo paso de multer. pasamos al controller de auth
    upload.single('profileImageUrl'),//para indicarle que voy a almacer una imagen
    registerUserValidation,
    validateFields,
    validIfExistUserEmail,

  ],
  createUser
);

router.post(
  '/login',
  [
    loginUserValidation,
    validateFields,
  ],
  login
);
//Verificamos el token
router.use(protect);
//Renovamos el token
router.get('/renew', renewToken);
module.exports = {
  routerAuth: router,
};
