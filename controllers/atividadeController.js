const Joi       = require('joi')
const Usuario   = require('../models/Usuario');
const Atividade = require('../models/Atividade');

exports.buscaAtividadesEducador = async (req, res) => {
    try {
        const educadorExiste = await Usuario.findOne({ _id: req.params.id, papel: 1 }).exec(); // educadorUsrId
        if(!educadorExiste){
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: 'Educador não encontrado' });
        }

        const atividades = await Atividade.find({ educador: req.params.id, isActive: true }).sort({ createAt: 'asc' }).exec();
        if(!atividades){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'O educador não possui atividades ativas no momento' });
        }
        if(atividades.length === 0){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'O educador não possui atividades ativas no momento' });
        }

        res.status(200).json({ status: 200, message: "Sucesso", atividades: atividades });
    } catch (err){
        console.log("buscaAtividadesEducador > err >>>")
        console.log(err)
        res.status(500).send({ status: 500, message: "Erro ao buscar atividades" });
    }
}

exports.novaAtividade = async (req, res) => {
    try {
        const userLoggedId = '61873f5d6212a24abe8dd210' // >>> APAGAR <<<

        const { titulo, descricao } = req.body
        const atividade = {
            titulo:     titulo,
            descricao:  descricao,
            educador:   userLoggedId    // id do usuário logado (req.user._id)
        }

        let { error } = await validaAtividade(atividade);
        if(error){
            console.log("novaAtividade > validaAtividade > error >>>")
            console.log(error.details[0].message)
            // 406 Not Acceptable
            return res.status(406).send({ status: 406, message: 'O objeto enviado é inválido (dados da atividade)' });
        }

        const educadorExiste = await Usuario.findOne({ _id: atividade.educador, papel: 1 });
        if(!educadorExiste) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Educador não encontrado"});
        }
        const newAtividade = new Atividade(atividade)
        const atividadeRes = await newAtividade.save();
        res.status(200).json({ status: 200, message: "Atividade cadastrada com sucesso", atividade: atividadeRes });
    } catch (err){
        console.log("novaAtividade > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao registrar atividade", error: err });
    }
}

exports.inativaAtividade = async (req, res) => {
    try {
        const userLoggedId  = '61873f5d6212a24abe8dd210' // >>> APAGAR <<<
        const filter        = { _id: req.params.id } // atividadeId

        const educadorExiste = await Usuario.findOne({ _id: userLoggedId, papel: 1 }).exec(); // id do usuário logado (req.user._id)
        if(!educadorExiste){
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: 'Educador não encontrado' });
        }

        let atividadeExiste = await await Atividade.findOne({ _id: req.params.id, educador: userLoggedId }).exec(); // id do usuário logado (req.user._id)
        if(!atividadeExiste){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Atividade não encontrada ou não pertence ao educador' });
        }

        // 200 OK
        atividadeExiste.isActive = false
        await Atividade.findOneAndUpdate(filter, atividadeExiste).exec();
        res.status(200).json({ status: 200, message: "Sucesso" });
    } catch (err){
        console.log("inativaAtividade > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao excluir atividade", error: err });
    }
}

const validaAtividade = (atividade) => {
    const schema = Joi.object({
        titulo:     Joi.string().required(),
        descricao:  Joi.string(),
        educador:   Joi.string().required()
    });
    return schema.validate(atividade);
}