const   mongoose    = require('mongoose');
var     Schema      = mongoose.Schema;

const criancasAtividadeSchema = new Schema({
    crianca: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    atividade: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Atividade'
    },
    createAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

criancasAtividadeSchema.index({'$**': 'text'});

module.exports = mongoose.model('CriancasAtividade', criancasAtividadeSchema)