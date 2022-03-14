const Carrito = require('../models/carritos.model');
const Producto = require('../models/productos.model');


function carrito(req, res) {
    var idPro = req.body.idProducto;
    var idUsu = req.user.sub;
    var cantidad = req.body.cantidad;

    Producto.findById({ _id: idPro }, (err, productoEn) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })
        if (!productoEn) return res.status(404).send({ message: 'error al listar' })

        Carrito.find({ idUsuario: idUsu, "Productos.idProducto": idPro }, (err, producto) => {

            if (err) return res.status(500).send({ message: 'error en la petician' })

            if (producto == 0) {

                if (productoEn.cantidad < cantidad) return res.status(500).send({ message: 'Insuficiente producto' })

                var total = productoEn.precio * cantidad;

                Carrito.findByIdAndUpdate({ idUsuario: idUsu },
                    { $push: { Productos: { idProducto: idPro, cantidad: cantidad, total: total } } },
                    { new: true }, (err, ingresar) => {
                        productoEn

                        if (err) return res.status(500).send({ message: 'Error en la peticion Uptdate' });
                        if (!ingresar) return res.status(404).send({ message: 'error Update' });

                        return res.status(200).send({ carrito: ingresar })
                    })
            } else {
                Carrito.findOne({ idUsuario: idUsu, "Productos.idProducto": idPro },
                    { "Productos.$.cantidad": 1, _id: 0 }, (err, cantidad) => {

                        var a = cantidad.Carrito[0].cantidad + Number(cantidad);
                        var s = cantidad.Carrito[0].precio * cantidad;

                        if (a > stockProducto) return res.status(404).send({ message: 'No hay productos' })

                        Carrito.updateOne({ idUsuario: idUsu, Productos: { $elemMatch: { idProducto: idPro } } },
                            { $inc: { "Productos.$.cantidad": cantidad, "Productos.$.subTotal": s } }, (err, cantidad) => {

                                if (err) return res.status(500).send({ message: 'Error en la peticion Usuario' })
                                if (!cantidad) return res.status(404).send({ message: 'error al actualizar productos' })

                                Carrito.findById({ idUsuario: idUsu}, (err, usuarioEncontrado) => {
                                    
                                    return res.status(200).send({ Usuario: usuarioEncontrado })
                                })
                            })
                    })
            }
        })
    })
}

module.exports = {
    carrito
}