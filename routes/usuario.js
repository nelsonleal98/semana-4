/* un Ejemplo  de como se veria la ruta listar - modelo del  articulo*/
const routerx = require('express-promise-router');
const usuarioController = require('../controllers/UsuarioController');


const router = routerx();


router.get('/list', usuarioController.list);
router.post('/add', usuarioController.add);
router.post('/login', usuarioController.login);
router.put('/update', usuarioController.update);



module.exports = router;