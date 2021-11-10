const router                = require('express').Router();
const educadorController    = require('../controllers/educadorController');
//const tokenController       = require('../controllers/tokenController');

router.get('/buscaReduzidaEducador/:id', /* tokenController.validation, */ educadorController.buscaReduzidaEducador);
router.post('/', educadorController.novoEducador);

module.exports = router;