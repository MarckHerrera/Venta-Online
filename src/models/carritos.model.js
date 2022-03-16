const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CarritosSchema = Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios'},
    
    productos: [{
        producto:{ type: Schema.Types.ObjectId, ref: 'Productos' },
        cantidad: Number,
        subtotal: Number
    }],
    total: Number
});

module.exports = mongoose.model('Carritos', CarritosSchema);