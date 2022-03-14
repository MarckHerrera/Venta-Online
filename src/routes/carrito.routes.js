const express = require('express');
const controladorCarrito = require('../controllers/carrito.controllers');
const md_authentication = require('../middlewares/autenticacion');

const api = express.Router();

api.put('/carrito', md_authentication.Auth, controladorCarrito.carrito);

module.exports = api;