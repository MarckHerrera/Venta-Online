const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')


//Registar Administrador por defecto

function RegistrarAdmin(req, res) {
    var usuarioModel = new Usuario();

    Usuario.find({ email: 'Admin' }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length > 0) {
            return console.log({ mensaje: "Ya hay un Administrador" })
        } else {

            usuarioModel.nombre = 'Admin';
            usuarioModel.email = 'Admin';
            usuarioModel.rol = 'Admin';

            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;

                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al Registrar' });

                    return res.status(200).send({ usuario: 'Admin creado' });
                });
            });
        }
    })

}

//Registramos el Cliente y validamos que no exista
function RegistrarCliente(req, res) {
    var parametros = req.body;
    var modeloUsuario = new Usuario();

    if (parametros.nombre && parametros.email) {
        Usuario.find({ email: parametros.email }, (err, usuarioEncontrado) => {

            if (usuarioEncontrado.length > 0) {
                return res.status(500).send({ mensaje: "este correo ya se encuentra utilizado" })

            } else {
                modeloUsuario.nombre = parametros.nombre;
                modeloUsuario.apellido = parametros.apellido;
                modeloUsuario.email = parametros.email;
                modeloUsuario.password = parametros.password;
                modeloUsuario.rol = 'Cliente';

                bcrypt.hash(parametros.password, null, null, (err, passwordEncripatada) => {
                    modeloUsuario.password = passwordEncripatada;

                    modeloUsuario.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                        if (!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al Registrar' });

                        return res.status(200).send({ usuario: usuarioGuardado });
                    });
                })
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'Debe ingrear los parametros obligatorios' })
    }
}


//ELIMINAR USUARIOR
function EliminarUsuario(req, res) {
    var idUsu = req.params.idUsuario;

    Usuario.findOne({ _id: idUsu, rol: 'Cliente' }, (err, usuarioEncontrado) => {

        if (!usuarioEncontrado) {
            return res.status(500).send({ mensaje: 'Solo se pueden eliminar Clientes' });
        } else {

            Usuario.findByIdAndDelete(idUsu, (err, usuarioEliminado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!usuarioEliminado) return res.status(500)
                    .send({ mensaje: 'Error al eliminar' });

                return res.status(200).send({ usuario: usuarioEliminado })

            })
        }
    })
}


function Login(req, res) {
    var parametros = req.body;
    // BUSCAMOS EL CORREO
    Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {
            // COMPARAMOS CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {//TRUE OR FALSE
                    if (verificacionPassword) {
                        return res.status(200)
                            .send({ token: jwt.crearToken(usuarioEncontrado) })
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'La contrasena no coincide.' })
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'El usuario, no se ha podido identificar' })
        }
    })
}


function EditarUsuario(req, res) {
    var idUsu = req.params.idUsuario;
    var parametros = req.body;

    Usuario.findOne({ _id: idUsu, rol: 'Cliente' }, (err, usuarioEncontrado) => {

        if (!usuarioEncontrado) {
            return res.status(500).send({ mensaje: 'Solo se pueden editar Clientes' });
        } else {

    // borrar la propiedad de password
    delete parametros.password

    Usuario.findByIdAndUpdate(idUsu, parametros, { new: true }, (err, usuarioEditado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioEditado) return res.status(500).send({ mensaje: 'Error al editar el Usuario' });

        return res.status(200).send({ usuario: usuarioEditado });

    
    })
}
})
}


module.exports = {
    RegistrarAdmin,
    RegistrarCliente,
    EditarUsuario,
    EliminarUsuario,
    Login
}
