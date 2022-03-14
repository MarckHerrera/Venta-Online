const mongoose = require('mongoose');
const app = require('./app');
const Usuario = require('./src/controllers/usuario.controller');
const Categoria = require('./src/controllers/categoria.controllers')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VentaOnline', { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Se ha conectado correctamente la Base de Datos');

    Usuario.RegistrarAdmin;
    Categoria.defaultCategoria;

    app.listen(3000, function(){
    console.log('Servidor EXPRESS correcto');
    });

}).catch(error => console.log(error));