const Factura = require("../models/facturas.model");
const Carrito = require("../models/carritos.model");
const Productos = require("../models/productos.model");

function factura(req, res) {
    var usuarioId = req.user.sub;

  Carrito.findOne({ usuario: usuarioId }, (err, buscarCarrito) => {
    if (buscarCarrito == null) return res.status(500).send({ mensaje: "No hay productos" });
    {
      
      for (let carrito of buscarCarrito.productos) {
        Productos.findOne({ _id: carrito.producto._id }, (err, productoId) => {
          const cantidad = carrito.cantidad;
          const data = {
            stock: productoId.stock,};

          data.stock = productoId.stock - cantidad;
          Productos.findOneAndUpdate({ _id: carrito.producto._id },data,{ new: true },(err, actualizarProducto) => {

          }).lean();
        }).lean();
      }
      const factura = new Factura(buscarCarrito);
      factura.save((err, guardado) => {
        Carrito.findOneAndDelete({ usuario: usuarioId },(err, eliminarCarrito) => {
            return res.status(200).send({ factura: factura });
          });
      });
    }
  }).lean();
}


function verFactura(req, res) {
    var usuarioId = req.user.sub;

  Factura.find({ usuario: usuarioId }, (err, facturaEncontrada) => {
    if (facturaEncontrada.length == 0) return res.status(404).send({ mensaje: "No hay compras" });
    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
    if (!facturaEncontrada)return res.status(500).send({ mensaje: "Error al buscar la factura" });

    return res.status(200).send({ Compras: facturaEncontrada });
  })
    .populate("productos.producto")
    .lean();
}

function todasLasFacturas(req, res) {
    Factura.find({}, (err, buscarFacturas) => {
        if (buscarFacturas.length == 0) return res.status(404).send({ mensaje: "No hay compras" });
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!buscarFacturas) return res.status(500).send({ mensaje: "Error al encontrar todas las facturas" });
    
        return res.status(200).send({ Compras: buscarFacturas });
      }).populate("productos.producto").lean();
    }
module.exports = {
    factura,
    verFactura,
    todasLasFacturas
}