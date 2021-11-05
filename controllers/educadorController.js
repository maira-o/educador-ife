const Usuario   = require('../models/Usuario');
const Educador  = require('../models/Educador');

exports.buscaEducador = async (req, res) => {
    const educadorId = req.params.id;
    try {
        const educador = await Educador.findOne({_id: educadorId}).exec();
        if(!educador){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Educador não encontrado', });
        }
        if(educador.user._id != req.user._id){
            // 403 Forbidden
            return res.status(403).send({ status: 403, message: 'Acesso negado', });
        }
        if(educador.user._id != req.user._id){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Educador não encontrado', });
        }
        // 200 OK
        res.status(200).json({ status: 200, message: "Sucesso", data: educador });
    } catch (err){
        console.log("buscaEducador > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao buscar Educador" });
    }
}

exports.novoEducador = async (req, res) => {
    const { usuario } = req.body;

    try {
        const usuarioExiste = await Usuario.findOne({_id: usuario._id});
        if(!usuarioExiste) {
            // 401 Unauthorized
            return res.status(401).send({ status: 401, message: "Usuário não encontrado"});
        }

        if(usuarioExiste.papel != 1) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Usuário não é educador"});
        }

        const educadorExiste = await Educador.findOne({usuario: usuarioExiste._id});
        if(educadorExiste) {
            // 406 Not Acceptable
            return res.status(406).send({ status: 406, message: "Educador já registrado"});
        }

        const newEducador = new Educador({
            usuario:    usuarioExiste._id
        });

        const savedEducador  = await newEducador.save();
        res.status(200).json({ status: 200, message: "Criança cadastrada com sucesso", data: savedEducador });
    } catch (err){
        console.log("novoEducador > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao registrar educador", error: err });
    }
}