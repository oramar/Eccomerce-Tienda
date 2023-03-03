const multer = require('multer')
//Le indico que se va guardar en memoria del servidor
const storage = multer.memoryStorage()
//Le paso la configuracion al multer
const upload = multer({storage})
//exporto la variable upload
module.exports = {upload}
//1. Esta es la primera configuracion, pasamos al router donde lo vamos a utilizar
//en este caso auth.router