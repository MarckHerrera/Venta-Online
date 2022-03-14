const express = require("express");
const facturaControlador = require("../controllers/factura.controllers");
const md_authentication = require('../middlewares/autenticacion');


const api = express.Router();

api.post("/CrearFactura",md_authentication.Auth, facturaControlador.CrearFactura);
api.delete("/CancelarFactura",md_authentication.Auth, facturaControlador.CancelarFactura);
api.put('/FinalzarFactura',md_authentication.Auth, facturaControlador.FinalzarFactura);

module.exports = api;