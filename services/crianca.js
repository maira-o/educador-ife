const axios = require('axios');

exports.buscaReduzidaCrianca = async (id) => {
    try {
        return await axios.get(`${process.env.APP_CRIANCA_URL}/crianca/buscaReduzidaCrianca/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return (err.response)
    }
}

exports.apagaCriancasEducador = async (id) => {
    try {
        return await axios.delete(`${process.env.APP_CRIANCA_URL}/crianca/educador/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.log("serviceCrianca > apagaCriancasEducador > err >>>")
        console.log(err)
        // 500 Internal Server Error
        return { status: 500, message: "Erro ao apagar crianças" }
    }
}