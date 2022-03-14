const express = require("express");
const facturaControlador = require("../controllers/factura.controllers");


const api = express.Router();

api.post("/CrearFactura", facturaControlador.CrearFactura);
api.delete("/CancelarFactura", facturaControlador.CancelarFactura);
api.put('/FinalzarFactura', facturaControlador.FinalzarFactura);

module.exports = api;