const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FacturaSchema = Schema({
    nombre: String,
    idProducto: {type: Schema.Types.ObjectId, ref: 'Productos'}
});

module.exports = mongoose.model('facturas', FacturaSchema);