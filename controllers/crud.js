const conexion = require("../database/db");

exports.save = (req, res) => {
    const nombre = req.body.nombre;
    const tipo = req.body.tipo;
    const precio = req.body.precio;
    conexion.query('INSERT INTO productos SET ?', { nombre: nombre, descripcion: tipo, precio: precio }, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error al agregar el producto');
        } else {
            const productoId = results.insertId;
            const cantidad = req.body.cantidad; 
            conexion.query('INSERT INTO inventario SET ?', { productoid: productoId, cantidad: cantidad }, (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Error al actualizar el inventario');
                } else {
                    res.redirect('/');
                }
            });
        }
    });
}


exports.update = (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const tipo = req.body.tipo;
    const precio = req.body.precio;
    const cantidad = req.body.cantidad; 
    const updateProductosQuery = 'UPDATE productos SET ? WHERE id = ?';
    const updateInventarioQuery = 'UPDATE inventario SET cantidad = ? WHERE productoid = ?';

    conexion.query(updateProductosQuery, [{ nombre: nombre, descripcion: tipo, precio: precio }, id], (errorProductos, resultsProductos) => {
        if (errorProductos) {
            console.log(errorProductos);
            res.status(500).send('Error al actualizar el producto');
        } else {
            conexion.query(updateInventarioQuery, [cantidad, id], (errorInventario, resultsInventario) => {
                if (errorInventario) {
                    console.log(errorInventario);
                    res.status(500).send('Error al actualizar el inventario');
                } else {
                    res.redirect('/');
                }
            });
        }
    });
}
