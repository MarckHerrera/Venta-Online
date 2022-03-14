const express = require('express');
const controladorCategorias = require('../controllers/categoria.controllers');
const md_authentication = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarCategorias',md_authentication.Auth, controladorCategorias.agregarCategorias);
api.put('/agregarCategoriasProducto/:idProducto/:idCategoria', md_authentication.Auth, controladorCategorias.agregarCategoriasProducto);
api.delete('/eliminarCategorias/:idCategoria',md_authentication.Auth, controladorCategorias.eliminarCategorias);
api.put('/editarCategorias/:idCategoria',md_authentication.Auth, controladorCategorias.editarCategorias);
api.get('/obtenerCategorias', controladorCategorias.obtenerCategorias);


module.exports = api;
