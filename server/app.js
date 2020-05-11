
const express = require('express');
const connection = require('./config/database')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
const videoCall = require('./routes/videoCall');
const chat = require('./routes/chat');
const upload = require('./routes/upload');

const http = require('http');
const server = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(server);

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
app.use(videoCall)
app.use(chat)
app.use(upload)

app.use(express.static(path.join(__dirname, 'public')))

const { chatMAnager }= require('./controllers/ChatController')

chatMAnager(io)

connection.sync()
          .then(result => {
            server.listen(process.env.PORT || 4300, () => console.log(`Server has started.`));
            //   app.listen(4300, () => console.log('Server ON'))
          })
          .catch((err) => {
              console.log('error: ', err)
          })
