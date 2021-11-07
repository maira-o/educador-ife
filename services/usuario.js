const axios = require('axios');

exports.buscaUsuarioPorPapel = async (data) => {
    try {
        return await axios.post(`${process.env.APP_USUARIO_URL}/buscaUsuarioPorPapel`, data, {
            headers: { 'Content-Type': 'application/json' /* , token: localStorage.getItem('token') */ }
        });
    } catch (err) {
        return (err.response)
    }
}