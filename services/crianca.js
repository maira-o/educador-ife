const axios = require('axios');

exports.buscaReduzidaCrianca = async (id) => {
    try {
        return await axios.get(`${process.env.APP_CRIANCA_URL}/buscaReduzidaCrianca/${id}`, {
            headers: { 'Content-Type': 'application/json' /* , token: localStorage.getItem('token') */ }
        });
    } catch (err) {
        return (err.response)
    }
}