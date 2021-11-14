const router            = require('express').Router();
const atividadeController   = require('../controllers/atividadeController');
//const tokenController = require('../controllers/tokenController');

router.get('/:id', /* tokenController.validation, */ atividadeController.buscaAtividadesEducador);
router.post('/', /* tokenController.validation, */ atividadeController.novaAtividade);
router.delete('/:id', /* tokenController.validation, */ atividadeController.inativaAtividade);

module.exports = router;