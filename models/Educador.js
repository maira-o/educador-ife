const   mongoose    = require('mongoose');
var     Schema      = mongoose.Schema;

const educadorSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        unique: true,
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

educadorSchema.index({'$**': 'text'});

module.exports = mongoose.model('Educador', educadorSchema)