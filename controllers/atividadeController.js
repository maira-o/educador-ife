const Joi               = require('joi')
const Usuario           = require('../models/Usuario');
const Atividade         = require('../models/Atividade');
const CriancaAtividade  = require('../models/CriancaAtividade');
const criancaService    = require('../services/crianca');

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

        let atividadesRes = []
        for (var i = 0; i < atividades.length; i++) {
            let copia = JSON.parse(JSON.stringify(atividades[i]));
            let criancasAdicionadas = await CriancaAtividade.find({ atividade: atividades[i]._id }).exec();
            let criancasId = []
            for (var j = 0; j < criancasAdicionadas.length; j++) {
                criancasId.push(criancasAdicionadas[j].crianca)
            }
            copia.criancas  = criancasId
            atividadesRes.push(copia)
        }

        res.status(200).json({ status: 200, message: "Sucesso", atividades: atividadesRes });
    } catch (err){
        console.log("buscaAtividadesEducador > err >>>")
        console.log(err)
        res.status(500).send({ status: 500, message: "Erro ao buscar atividades" });
    }
}

exports.novaAtividade = async (req, res) => {
    try {
        // const userLoggedId = '61873f5d6212a24abe8dd210' // >>> APAGAR <<<
        const userLoggedId = req.headers.userid

        const { titulo, descricao, criancas } = req.body
        const atividade = {
            titulo:     titulo,
            descricao:  descricao,
            criancas:   criancas,
            educador:   userLoggedId    // id do usuário logado (req.user._id)
        }

        const { error } = validaAtividade(atividade);
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

        // 200 OK
        const newAtividade  = new Atividade(atividade)
        let atividadeRes    = await newAtividade.save();

        if (atividade.criancas.length > 0) {
            const resultVinculos = await vinculaCriancasAtividade({ educador: atividade.educador, atividade: atividadeRes, criancas: atividade.criancas })
            let copia       = JSON.parse(JSON.stringify(atividadeRes));
            copia.criancas  = resultVinculos.criancasAdicionadas
            atividadeRes    = copia
            res.status(resultVinculos.status).json({ status: resultVinculos.status, message: resultVinculos.message, atividade: atividadeRes });
        } else {
            res.status(200).json({ status: 200, message: "Atividade cadastrada com sucesso", atividade: atividadeRes });
        }
    } catch (err){
        console.log("novaAtividade > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao registrar atividade", error: err });
    }
}

exports.editaAtividade = async (req, res) => {
    try {
        const atividadeId   = req.params.id
        const filter        = { _id: atividadeId }
        const userLoggedId  = '61873f5d6212a24abe8dd210' // >>> APAGAR <<<

        const { titulo, descricao, criancas } = req.body
        const atividade = {
            titulo:     titulo,
            descricao:  descricao,
            criancas:   criancas,
            educador:   userLoggedId    // id do usuário logado (req.user._id)
        }

        const { error } = validaAtividade(atividade);
        if(error){
            console.log("editaAtividade > validaAtividade > error >>>")
            console.log(error.details[0].message)
            // 406 Not Acceptable
            return res.status(406).send({ status: 406, message: 'O objeto enviado é inválido (dados da atividade)' });
        }

        const educadorExiste = await Usuario.findOne({ _id: atividade.educador, papel: 1 });
        if(!educadorExiste) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Educador não encontrado"});
        }

        let atividadeExiste = await Atividade.findOne({ _id: atividadeId, educador: userLoggedId }).exec(); // id do usuário logado (req.user._id)
        if(!atividadeExiste){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Atividade não encontrada ou não pertence ao educador' });
        }

        atividadeExiste = {
            titulo:     atividade.titulo,
            descricao:  atividade.descricao
        }

        // 200 OK
        let atividadeRes        = await Atividade.findOneAndUpdate(filter, atividadeExiste, { new: true }).exec();

        const resultVinculos    = await vinculaCriancasAtividade({ educador: atividade.educador, atividade: atividadeId, criancas: atividade.criancas })
        let copia               = JSON.parse(JSON.stringify(atividadeRes));
        copia.criancas          = resultVinculos.criancasAdicionadas
        atividadeRes            = copia
        
        res.status(resultVinculos.status).json({ status: resultVinculos.status, message: resultVinculos.message, atividade: atividadeRes });
    } catch (err){
        console.log("editaAtividade > err >>>")
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

const vinculaCriancasAtividade = async (req) => {
    try {
        const { educador, atividade, criancas } = req

        // EXCLUIR VINCULOS EXISTENTES
        await CriancaAtividade.deleteMany({ atividade: atividade });

        let criancasAdicionadas = []
        for (var i = 0; i < criancas.length; i++) {
            let resCrianca = await criancaService.buscaReduzidaCrianca(criancas[i])
            if (resCrianca) {
                if (resCrianca.data.crianca.educador == educador) {
                    let newCriancaAtividade = new CriancaAtividade( {
                        crianca:    criancas[i],
                        atividade:  atividade
                    } )
                    let cri = await newCriancaAtividade.save()
                    criancasAdicionadas.push(cri.crianca) 
                }
            }
        }

        // 200 OK
        return ({ status: 200, message: "Atividade e crianças vinculadas com sucesso", criancasAdicionadas: criancasAdicionadas })
    } catch (err){
        console.log("vinculaCriancasAtividade > err >>>")
        console.log(err)
        // 500 Internal Server Error
        return ({ status: 500, message: "Erro ao vincular crianças à atividade", error: err })
    }
}

const validaAtividade = (atividade) => {
    const schema = Joi.object({
        titulo:     Joi.string().required(),
        descricao:  Joi.string().required(),
        criancas:   Joi.array().items(Joi.string()).required(),
        educador:   Joi.string().required()
    });
    return schema.validate(atividade);
}