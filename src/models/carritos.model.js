const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoriaSchema = Schema({
    idUsuario: { type: Schema.Types.ObjectId, ref: 'Usuarios'},
    
    Productos: [{
        idProducto:{ type: Schema.Types.ObjectId, ref: 'Productos' },
        cantidad: Number,
        total: Number
    }]
});

module.exports = mongoose.model('Categorias', CategoriaSchema);