const Factura = require("../models/facturas.model");

function CrearFactura(req, res) {
    var facturaModel = new Factura();
    var params = req.body;

    if (params.idUsuario) {
        facturaModel.idUsuario = params.idUsuario;
        facturaModel.total = 0;
        facturaModel.editable = "si";
        facturaModel.save((err, guardada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!guardada) return res.status(500).send({ mensaje: 'Error agregando la encuesta' });

            return res.status(200).send({ guardada })
        })
    } else {
        return res.status(500).send({ mensaje: "Llene todos los datos que sean necesarios" })
    }
}

function CancelarFactura(req, res) {
    var params = req.body;

    Factura.findOne({ _id: params.idFactura }).exec(
        (err, factura) => {
            if (err) {
                console.log(err);
            } else {
                if (factura.editable == "no") {
                    return res.status(500).send({ mensaje: "No se puede Eliminar o editar una factura" });
                } else {
                    Factura.findByIdAndDelete(params.idFactura, (err, Eliminado) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        if (!Eliminado) return res.status(500).send({ mensaje: "No se pudo cancelar la factura, verifique el id" });
                        return res.status(200).send({ mensaje: "Se cancelo la factura" });
                    })
                }
            }}
    )}

function FinalzarFactura(req, res) {
    var params = req.body;
    var final = {};
    final['editable'] = "no";
    Factura.findByIdAndUpdate(params.idFactura, final, { new: true }, (err, productoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoActualizado) return res.status(500).send({ mensaje: 'No pudo editar el producto' });
        return res.status(200).send({ productoActualizado })
    })
}

module.exports = {
    CrearFactura,
    CancelarFactura,
    FinalzarFactura
}