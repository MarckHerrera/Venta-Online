const Carrito = require('../models/carritos.model');
const Producto = require('../models/productos.model');


function carrito(req, res) {
    var parametros = req.body;
    var usuarioId = req.user.sub;
    const data = {
        producto: parametros.producto,
        cantidad: parametros.cantidad
    };

    Producto.findOne({_id: data.producto},(err, productoFO)=>{
        if (data.cantidad > productoFO.cantidad) {
            return res.status(200).send({message: 'No hay productos suficientes'});
        }

    Carrito.findOne({usuarioId},(err, UsuCarrito)=>{
        if(!UsuCarrito){
            data.usuario = usuarioId;
            data.subtotal = productoFO.precio * data.cantidad;
            data.total = data.subtotal;

            var carritoModel = new Carrito(data);

            carritoModel.save((err, carritoG)=>{
                if (err) {
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
                
                Carrito.findOne({usuario: usuarioId},(err, UsuarioIgual)=>{
                    Carrito.findOneAndUpdate({_id: UsuarioIgual._id},{$push: {productos: data}}, {new: true},(err, carritoConparado)=>{
                        return res.status(200).send({carrito: carritoConparado});
                    }).populate("productos.producto").lean();
                })
            });
        }else{
            Carrito.findOne({usuario: usuarioId},(err, UsuarioIgual)=>{
                data.subtotal = productoFO.precio * data.cantidad;
                data.total = data.subtotal + UsuarioIgual.total;

                Carrito.findOneAndUpdate({_id: UsuarioIgual._id},{$push: {productos: data}, total: data.total},{ new: true},(err, carritoActualizado)=>{
                    return res.status(200).send({carrito: carritoActualizado})
                })
            }).populate("productos.producto").lean();
        }
        })
        
    });
}

function carritoEliminar(req, res) {
    var usuarioId = req.user.sub;

    Carrito.findOneAndDelete({ usuario: usuarioId },(err, cEliminado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!cEliminado) return res.status(500).send({ mensaje: "Error al eliminar carrito" });
  
        return res.status(200).send({ carritoEliminado: eliminarCarrito });
      }).lean();
  }

module.exports = {
    carrito,
    carritoEliminar

}