const UsersModel = require('./models');

var Pusher = require('pusher');
const {
    validationResult
} = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.auth= async (req, res, next) =>{
    let {
        email,
        password
    } = req.body;

    let loadedUser;
    UsersModel.findOne({
            where: {
                email: email 
            },
            attributes: ['nom', 'prenom', 'password', 'phone', 'id', 'ville']
    })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 422;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
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

exports.lanceVideocall = (req, res) => {
    let { socket_id, channel_name } = req.body;
    

    let pusher = new Pusher({
        appId: '971546',
        key: '2e923196325bd5eddb8c',
        secret: 'bdd576d4771169113211',
        cluster: 'eu',
        encrypted: true,
	wsPort: 443,
	    enabledTransports:['ws','wss']
    });

      var presenceData = {
        user_id: req.session.id,
        user_info: {
	name: req.session.name,
          userAuth: req.body.name
        }
      };
      var auth = pusher.authenticate(socket_id, channel_name, presenceData);
      res.status(200).json(auth)
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
    
    res.status(200).json({access_token: token, user: req.body })
}
