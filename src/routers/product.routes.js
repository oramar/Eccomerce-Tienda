const {Router} = require('express')
const router = Router()

router.get('/', (req,res)=>{
    res.json({
        status: 'success',
        menssage: "Bienvenido",
    })
})

module.exports = {
    routerProduct: router,
}