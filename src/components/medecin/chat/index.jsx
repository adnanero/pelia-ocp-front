import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {Col, Row} from 'react-bootstrap'
import Cookies from 'js-cookie'
import UsersOnline from './tickets/index';
import Messages from './messages/index';
import InfoBar from './infoBar/index';
import SendMessageForm from './sendingMessage/index';
import { Redirect } from "react-router-dom";


let socket;


const Chat = () => {

  const [user, setUser ] = useState({name: '', id:''});
  const [selectedUser, setSelectedUser] = useState("");
  const [tickets, setTickets] = useState([]);
  const [onConsuting, setConsulting] = useState(false);
  const [resolved, setResolved] = useState(0);
  const [nmbr_ticket, setNombreTicket] = useState("")

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
 
  const ENDPOINT = 'localhost:4300';
 
  useEffect(() => {
    socket = io(ENDPOINT);
    let userAuth ={};
    if(Cookies.get('user') !== undefined){
      userAuth = JSON.parse(Cookies.get('user'));
    }
    let userSocket = {name: userAuth.nom + " " + userAuth.prenom , id: userAuth.id, type: "medecin"}
    setUser(userSocket)

    socket.emit('join',  userSocket , (response) => {
      if(response.error) {
        alert(response.message);
      }
    });

  }, [ENDPOINT]);
  
  useEffect(() => {
   
    socket.on('message', (message) => {
      messages[message.room].push(message.text)
    });
    
    socket.on("roomData", () => {
      // setUsers(users);
    });

}, []);
useEffect(() => {
  socket.on("switch-patient", (response) => {

    if(response.type === "disconnect"){
      if(tickets[selectedUser] !== undefined){
         if(response.id_user_deleted === tickets[selectedUser]['id']){
          setConsulting(false)
        }
      }
       
        (response.tickets !== undefined)? setTickets(response.tickets) : setTickets([])
      
    }else{
      (response.tickets !== undefined)? setTickets(response.tickets) : setTickets([])
    }
   
  });
}, [selectedUser]);

const passingConsulting = () => {
  // let index = tickets.findIndex((user) =>  user.status === 1)
  let index = tickets.findIndex((user) => user.status === 0) 
  setSelectedUser(index);

   setConsulting(true)
   socket.emit('switch-ticket',  { selectedUser : index, type:"debut", medecin : user} , (response) => {
    
    if(!response.error){
      if(response.tickets === undefined){
        response.tickets = []
      }
      setTickets(response.tickets)
    }
  });
}

  const finishingConsult = () => {
    socket.emit('switch-ticket',  {selectedUser : selectedUser, type:"fin", medecin : user} , (response) => {
      if(!response.error){
        if(response.tickets === undefined){
          response.tickets = []
        }
        setTickets(response.tickets)
      }
    });
  }

  const metVeille = () => {

    socket.emit('switch-ticket',  {selectedUser : selectedUser, type:"attente", medecin : user} , (response) => {
      if(!response.error){
        if(response.tickets === undefined){
          response.tickets = []
        }
        setTickets(response.tickets)
      }
    });
  }
  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', {message, selectedUser: tickets[selectedUser] }, () => setMessage(''));
    }
  }
 
  if(Cookies.get('user') === undefined){
    return <Redirect to="/authentification" />
  }
  return (
      <div className="chat">
        <Row >
          <Col lg="10">
          <InfoBar resolved={resolved} selectedUser={tickets[selectedUser]} user={user} />
          <Row className="discussion m-0">
          <Col lg="4">
          <UsersOnline
            tickets={tickets} 
            nmbr_ticket={nmbr_ticket} 
            setNombreTicket={setNombreTicket} 
            selectedUser={selectedUser} 
            resolved={resolved} 
            setConsulting={setConsulting}  
            onConsuting={onConsuting} 
            metVeille={metVeille}
            finishingConsult={finishingConsult}
            passingConsulting={passingConsulting}
          />
        </Col>
        { onConsuting ?
          <Col lg="8" className="chat-messages">
          
          <Messages messages={messages[selectedUser]} name={user.name} />
          <SendMessageForm message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </Col>
      : 
      <Col lg="8">

      </Col>
        }
        
          </Row>
          </Col>

        
        </Row> 
      </div>
  );
}

export default Chat;