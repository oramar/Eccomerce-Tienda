const { Router } = require('express');
const { check } = require('express-validator');
const { getOrders, getOrder } = require('../controllers/order.controllers');
const {
  deleteUser,
  findAllUser,
  findByIdUser,  
  updateByIdUser,
  updatePassword,
} = require('../controllers/user.controllers');
const { protect,protectAccountOwner } = require('../middlewares/auth.middlewares')
const { validIfExistUser } = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');
const { updateUserValidation, updatePasswordUserValidation } = require('../middlewares/validations.middleware');

//============================================================================
const router = Router();
router.get('/', findAllUser);

//Obtenemos las ordenes de los usuarios
//Protegemos las rutas incluyendole el middleware protect
router.get('/orders', protect, getOrders);
router.get('/orders/:id', protect, getOrder);


router.get('/:id', validIfExistUser, findByIdUser);

//Protegemos las rutas de aqui hacia abajo utilizando el archivo auth.meddlewares
router.use(protect);
router.patch(
  '/:id',
  [
    updateUserValidation,
    validateFields, //Este debe estar para capturar que vengan con el check y los retorna
    validIfExistUser,
    protectAccountOwner,
  ],
  updateByIdUser
);
router.patch(
  '/password/:id',
  [
    updatePasswordUserValidation,
    validateFields,
    validIfExistUser,
    protectAccountOwner,
  ],
  updatePassword
);
router.delete('/:id', validIfExistUser,protectAccountOwner, deleteUser);

module.exports = {
  routerUser: router,
};
