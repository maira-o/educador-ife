const Usuario   = require('../models/Usuario');
const Educador  = require('../models/Educador');

exports.buscaReduzidaEducador = async (req, res) => {
    educadorUsrId = req.params.id
    try {
        const educador = await Educador.findOne({ usuario: educadorUsrId }).exec();
        if(!educador){
            // 204 No Content
            return res.status(204).send({ status: 204, message: 'Educador não encontrado' });
        }
        // 200 OK
        res.status(200).json({ status: 200, message: "Sucesso", educador: educador });
    } catch (err){
        console.log("buscaReduzidaEducador > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao buscar Educador" });
    }
}

exports.novoEducador = async (req, res) => {
    const usuario = req.body;

    try {
        const usuarioExiste = await Usuario.findOne({ _id: usuario._id });
        if(!usuarioExiste) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Usuário não encontrado"});
        }

        if(usuarioExiste.papel !== 1) {
            // 400 Bad Request
            return res.status(400).send({ status: 400, message: "Usuário não é educador"});
        }

        const educadorExiste = await Educador.findOne({ usuario: usuarioExiste._id });
        if(educadorExiste) {
            // 406 Not Acceptable
            return res.status(406).send({ status: 406, message: "Educador já registrado"});
        }

        const newEducador = new Educador({
            usuario:    usuarioExiste._id
        });

        const educador = await newEducador.save();
        res.status(200).json({ status: 200, message: "Educador cadastrado com sucesso", educador: educador });
    } catch (err){
        console.log("novoEducador > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao registrar educador", error: err });
    }
}