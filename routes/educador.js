const router                = require('express').Router();
const educadorController    = require('../controllers/educadorController');

router.get('/buscaReduzidaEducador/:id',    educadorController.buscaReduzidaEducador);
router.post('/',                            educadorController.novoEducador);
router.delete('/:id',                       educadorController.apagaEducador);

module.exports = router;