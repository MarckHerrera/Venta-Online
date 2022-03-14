const express = require('express');
const cors = require('cors');
const app = express();

// IMPORTACION RUTAS
var usuarioRoutes = require("./src/routes/usuario.routes");
var productoRoutes = require("./src/routes/producto.routes");
var categoriaRoutes = require("./src/routes/categoria.routes");
var carritoRoutes = require("./src/routes/carrito.routes");
var facturaRoutes = require("./src/routes/factura.routes");


// MIDDLEWARES
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/
app.use('/api', usuarioRoutes, productoRoutes, categoriaRoutes, carritoRoutes, facturaRoutes);

module.exports = app;