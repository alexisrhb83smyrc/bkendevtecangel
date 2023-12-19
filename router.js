const express = require('express');
const router = express.Router();
const conexion = require('./database/db')
const crud = require("./controllers/crud");

router.get('/', (req, res)=>{

    const query = 'SELECT productos.id, productos.nombre, productos.descripcion, productos.precio, inventario.cantidad ' +
    'FROM productos ' +
    'LEFT JOIN inventario ON productos.id = inventario.productoid';

    conexion.query (query, (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('index',{results: results});
            
        }
    })
}) 



router.get('/create-product', (rea, res)=>{
    res.render('create');
})

router.get('/edit/:id', (req, res) => {
    const id = req.params.id;

    // Realizar una consulta JOIN para obtener información de productos e inventario
    const query = 'SELECT productos.id, productos.nombre, productos.descripcion, productos.precio, inventario.cantidad ' +
                  'FROM productos ' +
                  'LEFT JOIN inventario ON productos.id = inventario.productoid ' +
                  'WHERE productos.id = ?';

    conexion.query(query, [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            // results contendrá la información del producto y la cantidad en el inventario
            res.render('edit', { producto: results[0] });
        }
    });
});


router.post('/save',crud.save);
router.post('/update',crud.update);


router.get('/delete/:id', (req, res) => {
    const id = req.params.id;

    const deleteInventarioQuery = 'DELETE FROM inventario WHERE productoid = ?';

    const deleteProductoQuery = 'DELETE FROM productos WHERE id = ?';

    conexion.query(deleteInventarioQuery, [id], (errorInventario, resultsInventario) => {
        if (errorInventario) {
            throw errorInventario;
        } else {

            conexion.query(deleteProductoQuery, [id], (errorProductos, resultsProductos) => {
                if (errorProductos) {
                    throw errorProductos;
                } else {
                    res.redirect('/');
                }
            });
        }z
    });
});
       

module.exports = router;