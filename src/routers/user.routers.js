const { Router } = require("express")
const { findAllUser, findByIdUser, createUser, updateUser, deleteUser } = require("../controllers/user.controllers")
const { validIfExistUser } = require("../middlewares/user.middleware")

const router = Router()
router.get('/', findAllUser)
router.get('/:id', findByIdUser)
router.post('/', createUser)
router.patch('/:id',validIfExistUser, updateUser)
router.delete('/:id',validIfExistUser, deleteUser)

module.exports = {
    routerUser: router
}