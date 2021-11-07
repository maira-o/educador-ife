const Usuario           = require('../models/Usuario');
const Educador          = require('../models/Educador');
const usuarioService    = require('../services/usuario');

exports.buscaEducador = async (req, res) => {
    //req.user = { _id: '1234' } // APAGAR
    req.user = { _id: '618717c8593d263427d57b57' } // APAGAR

    try {
        const reqEducador = {
            usuarioToFind: {
                id:     req.params.id,
                papel:  1
            },
            userLoggedId: req.user._id
        }

        const result = await usuarioService.buscaUsuarioPorPapel(reqEducador)
        switch (result.status) {
            case 403: // 403 Forbidden
                res.status(result.status).send({ status: result.status, message: result.message });
                break;
            case 204: // 204 No Content
                res.status(result.status).send({ status: result.status, message: 'Educador não encontrado' });
                break;
            case 200: // 200 OK
                const educadorIncompleto = await Educador.findOne({ usuario: result.data.usuario._id }).exec();
                if(!educadorIncompleto){
                    // 204 No Content
                    return res.status(204).send({ status: 204, message: 'Educador não encontrado' });
                }
                if(educadorIncompleto.usuario._id != req.user._id){
                    // 403 Forbidden
                    return res.status(403).send({ status: 403, message: 'Acesso negado' });
                }
                // 200 OK
                const educador      =   {
                    nome:       result.data.usuario.nome,
                    email:      result.data.usuario.email,
                    papel:      result.data.usuario.papel,
                    _id:        result.data.usuario._id,
                    idEducador: educadorIncompleto._id
                }
                res.status(200).json({ status: 200, message: "Sucesso", educador: educador });
                break;
            default:
                console.log("buscaEducador > default > result >>>")
                console.log(result)
                // 500 Internal Server Error
                res.status(500).send({ status: 500, message: "Erro ao buscar Educador" });
        }
    } catch (err){
        console.log("buscaEducador > err >>>")
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

        const savedEducador = await newEducador.save();
        const educador      =   {
            nome:       usuarioExiste.nome,
            email:      usuarioExiste.email,
            papel:      usuarioExiste.papel,
            _id:        usuarioExiste._id,
            idEducador: savedEducador._id
        }
        res.status(200).json({ status: 200, message: "Educador cadastrado com sucesso", educador: educador });
    } catch (err){
        console.log("novoEducador > err >>>")
        console.log(err)
        // 500 Internal Server Error
        res.status(500).send({ status: 500, message: "Erro ao registrar educador", error: err });
    }
}