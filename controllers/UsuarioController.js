const { Usuario } = require('../models');
const bcrypt = require('bcryptjs')
const servToken = require('../services/token');


module.exports = {

    list : async (req, res, next) => {
        try{

            const re = await Usuario.findAll()
            
            res.status(200).json(re)

        }catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },

    add : async (req, res, next) =>  {
        try{
            const user = await Usuario.findOne( { where :  { email : req.body.email } } )
            if(user){
                res.status(404).send('Usuario ya existe')
            }else{
                req.body.password = bcrypt.hashSync(req.body.password, 10);
                const reg = await Usuario.create(req.body);
                res.status(200).json(reg)
            }
            
        } catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },

    login : async (req, res, next) => {

        try {
                const user = await Usuario.findOne( { where :  { email : req.body.email } } )
                if(user){
                    // Evaluar contraseña
                    const contrasenhaValida = bcrypt.compareSync(req.body.password, user.password)
                if (contrasenhaValida)
                {
                    const token = servToken.encode(user.id , user.rol)

                    res.status(200).send({
                        auth : true,
                        tokenReturn : token,
                        user : user
                    })

                }  else {
                    res.status(401).send({ auth: false, tokenReturn: null, reason:
                        "Invalid Password!" })
                }

            } else {
                res.status(404).send('Usuario no existe')
            }

        } catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }


    },

    update : async (req, res, next) =>  {
        try{
            //Buscar al usuario
            const user = await Usuario.findOne( { where :  { email : req.body.email } } )
            
            // Evaluar contraseña
            const validPassword = bcrypt.compareSync(req.body.password, user.password)
            
            const newEncriptedPassword = bcrypt.hashSync(req.body.newpassword)
            if(validPassword){
                const re = await Usuario.update( { nombre: req.body.nombre, password: newEncriptedPassword , estado: req.body.estado} , {where: { email: req.body.email }}   )
            res.status(200).json(re)
            }else {
                res.status(401).send({ auth: false, tokenReturn: null, reason:
                    "Invalid Password!" })
            }
            
        }catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },
}
