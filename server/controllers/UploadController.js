


var multer = require('multer')


exports.moveFile= (req, res, next) =>{

    upload(req, res, (err) => {
        if(req.file){
            
        }
        console.log("Request ---", req.body);
        console.log("Request file ---", req.file);//Here you get file.
        /*Now do where ever you want to do*/
        if(!err)
           return res.send(200).end();
     });

}


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file')
