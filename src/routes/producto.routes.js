const express = require("express");
const productoControlador = require("../controllers/producto.controllers");
const md_authentication = require("../middlewares/autenticacion");

const api = express.Router();

api.post("/agregarProducto", md_authentication.Auth, productoControlador.agregarProducto);
api.delete('/eliminarProducto/:idProducto', md_authentication.Auth, productoControlador.eliminarProducto);
api.put('/editarProducto/:idProducto', md_authentication.Auth, productoControlador.editarProducto);
api.get('/obtenerProductosXCategoria/:idCategoria', productoControlador.obtenerProductosXCategoria);
api.get('/obtenerProductosAgotados', productoControlador.productosAgotados);
api.put('/stockProductos/:idProducto', productoControlador.stockProductos);
api.get('/obtenerProductosXNombre', productoControlador.obtenerProductosXNombre);


module.exports = api;