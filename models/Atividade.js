const   mongoose    = require('mongoose');
var     Schema      = mongoose.Schema;

const atividadeSchema = new Schema({
    titulo: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
    },
    educador: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

atividadeSchema.index({'$**': 'text'});

module.exports = mongoose.model('Atividade', atividadeSchema)