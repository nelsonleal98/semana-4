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
                    const  contrasenhaValida = bcrypt.compareSync(req.body.password, user.password)
                if (contrasenhaValida)
                {
                    const token = await servToken.encode(user.id , user.rol)
                    res.status(200).send({
                        auth: true,
                        tokenReturn: token,
                        user: user
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
            let pas =  req.body.password;
            //Buscar al usuario
            const user = await Usuario.findOne( { where :  { id : req.body.id } } )
            
            if(pas != user.password){
                req.body.password = await bcrypt.hashSync(req.body.password, 10)   
            }
            const re = await Usuario.update( { nombre: req.body.nombre, email : req.body.email ,password: req.body.password , estado: req.body.estado} , {where: { id: req.body.id }}   )
            res.status(200).json(re)
            
        }catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },
    activate : async (req, res, next) =>  {
        try{
            const re = await Usuario.update( { estado: 1} , {where: {id: req.body.id }}   )
            res.status(200).json(re)
        }catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },
    deactivate : async (req, res, next) =>  {
        try{
            const re = await Usuario.update( { estado: 0} , {where: {id: req.body.id }}   )
            res.status(200).json(re)
        }catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },
}
