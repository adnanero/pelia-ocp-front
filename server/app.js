
const express = require('express');
const connection = require('./config/database')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

const bodyParser = require('body-parser');
const videoCall = require('./routes/videoCall');
const chat = require('./routes/chat');

const http = require('http');
const server = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(server);

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(cookieParser());
app.use(session({
    secret: "application_secret",
    resave: false,
    saveUninitialized: false
}))
app.use(videoCall)
app.use(chat)

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
