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