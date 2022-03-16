const express = require('express');
const controladorCarrito = require('../controllers/carrito.controllers');
const md_authentication = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/carrito', md_authentication.Auth, controladorCarrito.carrito);
api.delete('/carritoEliminar', md_authentication.Auth, controladorCarrito.carritoEliminar);

module.exports = api;