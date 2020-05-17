
const express = require('express');
const connection = require('./config/database')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
const upload = require('./routes/upload');

const http = require('http');
const server = http.createServer(app);

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(bodyParser.json({
  type: 'application/*+json'
}))
app.use(bodyParser.raw({
  type: 'application/vnd.custom-type'
}))
app.use(bodyParser.text({
  type: 'text/html'
}))

app.use(cookieParser());
app.use(session({
    secret: "application_secret",
    resave: false,
    saveUninitialized: false
}))
app.use(upload)

app.use(express.static(path.join(__dirname, 'public')))

const { startIo }= require('./controllers/ChatController')
startIo(server)

server.listen(process.env.PORT || 4300, () => console.log(`Server has started.`));
// connection.sync()
//           .then(result => {
            
//             //   app.listen(4300, () => console.log('Server ON'))
//           })
//           .catch((err) => {
//               console.log('error: ', err)
//           })
