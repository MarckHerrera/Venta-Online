const Producto = require("../models/productos.model");

function agregarProducto(req, res) {
    var productoModel = new Producto();
    var parametros = req.body;

    if (req.user.rol != "Admin") {
        return res.status(500).send({ mensaje: "Funcion Admin" });
    }

    Producto.find({ nombre: parametros.nombre }, (err, productoEncontrado) => {
        if (productoEncontrado.length > 0) {
            return res.status(500).send({ mensaje: 'Este producto ya existe' });
        } else {
            if (parametros.nombre) {
                productoModel.nombre = parametros.nombre;
                productoModel.precio = parametros.precio;
                productoModel.cantidad = parametros.cantidad;

                productoModel.save((err, productoGuardado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!productoGuardado) {
                        res.status(404).send({ mensaje: 'No se pudo registrar el producto' })
                    }

                    return res.status(200).send({ producto: productoGuardado });
                })
            } else {
                return res.status(400).send({ mensaje: 'Debe de ingresar parametros obligatorios' });
            }
        }
    })

}

function eliminarProducto(req, res) {
    var idProducto = req.params.idProducto;

    if (req.user.rol != "Admin") {
        return res.status(500).send({ mensaje: "Los clientes no pueden eliminar los producto" });
    }

    Producto.findByIdAndDelete(idProducto, (err, pEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!pEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el Producto' });

        return res.status(200).send({ producto: pEliminado });
    })
}

function editarProducto(req, res) {
    var idProducto = req.params.idProducto;
    var parametros = req.body;

    if (req.user.rol != "Admin") {
        return res.status(500).send({ mensaje: "Funcion Admin" });
    }


    Producto.findByIdAndUpdate(idProducto, parametros, { new: true }, (err, productoEditado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEditado) return res.status(404).send({ mensaje: 'Error al Editar el Producto' });
        return res.status(200).send({ producto: productoEditado });
    })
}

function obtenerProductosXCategoria(req, res) {
    var categoriaId = req.params.idCategoria;

    Producto.find({ idCategoria: categoriaId }).exec(
        (err, productos) => {
            if (err) {
                res.status(500).send("Error en la peticion");
            } else {
                if (!productos) return res.status(500).send({ mensaje: "No tiene productos con esa categoria" })
                return res.status(200).send({ productos });
            }
        })
}

function productosAgotados(req, res) {

    Producto.find({ cantidad: 0 }).exec(
        (err, productos) => {
            if (err) {
                res.status(500).send("Error en la peticion");
            } else {
                if (!productos) return res.status(500).send({ mensaje: "No tiene productos" })
                return res.status(200).send({ productos });
            }
        })
}

function stockProductos(req, res) {
    const idP = req.params.idProducto;
    const parametros = req.body;

    Producto.findByIdAndUpdate(idP, { $inc: { cantidad: parametros.cantidad } }, { new: true },
        (err, stockMod) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!stockMod) return res.status(500).send({ mensaje: 'Error incrementar la cantidad del producto' });
            return res.status(200).send({
                producto: stockMod
            })
        })
}

function obtenerProductosXNombre(req, res) {
    var params = req.body;

    Producto.find({ nombre: params.nombre }).exec(
        (err, productos) => {
            if (err) {
                res.status(500).send("Error en la peticion");
            } else {
                if (!productos) return res.status(500).send({ mensaje: "No tiene productos con ese nombre" })
                return res.status(200).send({ productos });
            }
        })
}

function productosMasVendidos(req, res) {

    Producto.find({ cantidad: {$regex: 0} }),(err, productos) => {
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!productos) return res.status(500)
            .send({ mensaje: 'Error al obtener los productos'})

        return res.status(200).send({ productos: productos })
    }
}

module.exports = {
    agregarProducto,
    eliminarProducto,
    editarProducto,
    obtenerProductosXCategoria,
    productosAgotados,
    stockProductos,
    obtenerProductosXNombre,
    productosMasVendidos

}