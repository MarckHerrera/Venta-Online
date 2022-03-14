var Categoria = require("../models/categorias.model");
var Producto = require("../models/productos.model");

function agregarCategorias(req, res) {
    var parametros = req.body;
    var modeloCategoria = new Categoria();

    if (req.user.rol != "Admin") {
        return res.status(500).send({ mensaje: "Funcion Admin" });
    }

    if (parametros.nombre) {
        modeloCategoria.nombre = parametros.nombre;
        modeloCategoria.save((err, categoriaGuardado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!categoriaGuardado) return res.status(500).send({ mensaje: 'Error al agregar categoria' });
            return res.status(200).send({ categoria: categoriaGuardado });
        })
    } else {
        return res.status(500).send({ mensaje: 'Debe de ingresar los parametros obligatorios' });
    }
}

function agregarCategoriasProducto(req, res) {
    var producto = req.params.idProducto;
    var categorias = req.params.idCategoria;

    if (req.user.rol != "Admin") {
        return res.status(500).send({ mensaje: "Funcion Admin" });
    }

    Producto.findByIdAndUpdate(producto, { idCategoria: categorias }, { new: true },
        (err, categoriaAgregada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
            if (!categoriaAgregada) return res.status(500).send({ mensaje: 'Error al agregar el categoria' });

            return res.status(200).send({ product: categoriaAgregada });
        })
}

function obtenerCategorias(req, res) {
    Categoria.find({}, (err, categoria) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!categoria) return res.status(500).send({ mensaje: 'Error al buscar la catergoria' });

        return res.status(200).send({ Categorias: categoria });
    })
}

function eliminarCategorias(req, res) {
    var id = req.params.idCategoria

    if (req.user.rol != "Admin") {
        return res.status(500).send({ mensaje: "Funcion Admin" });
    }


    Categoria.find({nombre: {$regex: "Default", $options: "i"}},(err, defecto) => {
        if(defecto.id !== id){
            Categoria.findByIdAndDelete({_id: id}, (err, eliminar)=>{
                if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if(!eliminar) return res.status(500).send({mensaje: 'Error al Eliminar 1'});
                {
                    Producto.updateMany({idCategoria: id}, {idCategoria: defecto.id},{new: true},(err, actualizar)=>{
                        return res.status(200).send({mensaje: eliminar});
                    } )
                }
            })
        } else{
            return res.status(500).send({mensaje: "No puedes eliminar la categoria por defecto"});
        }
    })
}

function editarCategorias(req, res) {
    var Id = req.params.idCategoria;
    var parametros = req.body;

    if (req.user.rol != "Admin") {
        return res.status(500).send({ mensaje: "Funcion Admin" });
    }


    Categoria.findByIdAndUpdate(Id, parametros, { new: true }, (err, categoriaEditado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!categoriaEditado) return res.status(404).send({ mensaje: 'Error al Editar la categoria' });

        return res.status(200).send({ Categoria: categoriaEditado })
    })

}

function defaultCategoria(req, res) {
    var categoriaModel = Categoria();

    categoriaModel.nombre = "Default"

    Categoria.find({ nombre: "Default" }, (err, categoria) => {
        if (err) return console.log({ mensaje: 'Error en la peticion' });
        if (categoria.length >= 1) {
            return console.log({ mensaje: 'La categoria Fue creada' })
        } else {
            categoriaModel.save((err, guardar) => {
                if (err) return console.log({ mensaje: 'Error en la peticion' });
                if (guardar) {
                    console.log("Categoria Lista");
                } else {
                    console.log({ mensaje: "la categoria no se a creado" });
                }

            })
        }

    })
}

module.exports = {
    agregarCategorias,
    agregarCategoriasProducto,
    eliminarCategorias,
    editarCategorias,
    obtenerCategorias,
    defaultCategoria
}