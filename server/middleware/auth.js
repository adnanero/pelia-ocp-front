const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    let autHeader = req.get('Authorization')
    if(!autHeader){
      let error = new Error('Invalid token')
      error.statusCode= 401
      res.status(401).json({error:true, data:'token incorrect', error: error})
        // throw error;
        return;
    }
    let decodedToken;
    const token = autHeader.split(' ')[1];

    try{
      decodedToken = jwt.verify(token, 'pelialaclesecurisepourmpbox');
    }
    catch {
      let error = new Error('Invalid request !')
      error.statusCode = 500
      res.status(500).json({error:true, data:'Invalid request', error: error})
      // throw error
      return;
    }
    if(!decodedToken){
      const error = new Error('Not authenticated.');
        error.statusCode = 401;
        res.status(401).json({error:true, data:'Not authenticated.', error: error})
        // throw error;
    }
    next();
};