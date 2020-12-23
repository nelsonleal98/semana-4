const { Articulo, Categoria } = require('../models');

module.exports = {
    list : async (req, res, next) =>  {
        try{

            const re = await Articulo.findAll({
                include: [{
                    model: Categoria,
                    as: 'categoria'
                }],
            });
            res.status(200).json(re)

        }catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },
    add : async (req, res, next) =>   {
        try{
            const re = await Articulo.create( req.body )
            res.status(200).json(re)
        }catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },
    update : async (req, res, next) =>  {
        try{
            const re = await Articulo.update( { codigo: req.body.codigo, nombre: req.body.nombre, descripcion: req.body.descripcion, urlImagen:req.body.urlImagen ,categoriaId: req.body.categoriaId} , {where: {id: req.body.id }}   )
            res.status(200).json(re)
        }catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },
    activate : async (req, res, next) =>  {
        try{
            const re = await Articulo.update( { estado: 1} , {where: {id: req.body.id }}   )
            res.status(200).json(re)
        }catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },
    deactivate : async (req, res, next) =>  {
        try{
            const re = await Articulo.update( { estado: 0} , {where: {id: req.body.id }}   )
            res.status(200).json(re)
        }catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },

}
