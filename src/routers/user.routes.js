const { Router } = require("express")
const { check } = require("express-validator")
const { findAllUser, findByIdUser, createUser, updateUser, deleteUser } = require("../controllers/user.controllers")
const { validIfExistUser } = require("../middlewares/user.middleware")
const { validateFields } = require("../middlewares/validateField.middleware")

const router = Router()
router.get('/', findAllUser)
router.get('/:id', findByIdUser)

router.patch('/:id',
[
    check('username','The username must be mandatory').not().isEmpty(),//si no esta vacio lo deja pasar
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    validateFields,//Este debe estar para capturar que vengan con el check y los retorna
    validIfExistUser, 
],
updateUser)

router.delete('/:id',validIfExistUser, deleteUser)

module.exports = {
    routerUser: router
}