const express = require("express");
const facturaControlador = require("../controllers/factura.controllers");
const md_authentication = require('../middlewares/autenticacion');


const api = express.Router();

api.get('/factura', md_authentication.Auth, facturaControlador.factura);
api.get('/verFactura', md_authentication.Auth, facturaControlador.verFactura);
api.get('/verTodasLasFacturas', md_authentication.Auth, facturaControlador.todasLasFacturas);

module.exports = api;