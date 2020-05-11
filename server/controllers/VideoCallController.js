const UsersModel = require('./../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.auth= async (req, res, next) =>{

    let { email, password } = req.body;
    let loadedUser;
    UsersModel.findOne({
            where: {
                email: email 
            },
            attributes: ['nom', 'prenom', 'password', 'phone', 'id']
    })
        .then(user => {
            if (user === null) {
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 403;
                res.status(403).json({error:true, data:'emial introuvable', error: error})
            }else{
                loadedUser = user;
                return bcrypt.compare(password, user.password);
            }  
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                res.status(401).json({error:true, data:'mot de passe incorrect', error: error})
            }
            const token = jwt.sign({
                    email: loadedUser.email,
                    userId: loadedUser.id
            },
                'pelialaclesecurisepourmpbox', {
                    expiresIn: '12h'
                }
            );
            delete loadedUser.password
            res.status(200).json({
                access_token: token,
                user: loadedUser
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}


exports.authPatient = (req, res) =>{
    const token = jwt.sign({
        email: req.body.name,
        userId: req.body.id
},
    'pelialaclesecurisepourmpbox', {
    expiresIn: '12h'
    }
);
    req.session.id = req.body.id
    req.session.name = req.body.name
    
    res.status(200).json({access_token: token })
}
