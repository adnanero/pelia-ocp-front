import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {Col, Row} from 'react-bootstrap'
import Cookies from 'js-cookie'
import UsersOnline from './tickets/index';
import Messages from './messages/index';
import InfoBar from './infoBar/index';
import VideoChat from './videoChat'
import SendMessageForm from './sendingMessage/index';
import { Redirect } from "react-router-dom";
import medecine from "./../../../assets/img/medecin/homme.png";
import medecineFemme from "./../../../assets/img/medecin/femme.png";


import baseUrl from './../../../config'


let socket;
const MedecinChat = () =>{
  if(Cookies.get('user') === undefined){
    return <Redirect to="/authentification" />
  }else{
    return <Chat />
  }

}

const Chat = () => {

  const [user, setUser ] = useState({name: '', id:''});
  const [selectedUser, setSelectedUser] = useState("");
  const [tickets, setTickets] = useState([]);
  const [ticket, selectedTicket] = useState({})
  const [onConsuting, setConsulting] = useState(false);
  const [resolved, setResolved] = useState(0);
  const [nmbr_ticket, setNombreTicket] = useState("")

  const [inCall, setInCall] = useState(false)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showConversation, setShowConversation] = useState(false);
  
  const ENDPOINT = baseUrl.node;
  useEffect(() => {
    socket = io(ENDPOINT+"packtchat");
    let userAuth ={};
    if(Cookies.get('user') !== undefined){
      userAuth = JSON.parse(Cookies.get('user'));
    };
    
    let userSocket = {name: userAuth.nom + userAuth.prenom , nom:userAuth.nom, prenom: userAuth.prenom , ville: userAuth.id_ville ,  id: userAuth.id, sexe: userAuth.sexe, type: "medecin"};
    setUser(userSocket)

    socket.emit('join',  userSocket , (response) => {
      if(response.error) {
        alert(response.message);
      }else{
        setTickets(response.tickets)
        let index = response.tickets.findIndex((user) => ( user.status === 1)) 
        // console.log(index);
        if(index !== -1){
          setSelectedUser(index);
          setConsulting(true);
        }
        
      }
      
    });
    socket.on("switch-patient", (response) => {
      if(response.type === "disconnect"){
        if(tickets[selectedUser] !== undefined){
           if(response.id_user_deleted === tickets[selectedUser]['id']){
            setConsulting(false)
          }
        }
      }
      setTickets(response.tickets)
    });
    socket.on('message', (message) => {
      setMessages(messages => [ ...messages, message ]);
    });
    socket.on('ticket-switch', (response) => {
      setTickets(response.tickets)
    });


  }, [ENDPOINT]);
  
const passingConsulting = () => {
  let index = tickets.findIndex((ticket) => (ticket.status === 0 || ticket.status === 1)) 
  setSelectedUser(index);
  selectedTicket(tickets[index])
   setConsulting(true)
   socket.emit('open-ticket',  { ticket:tickets[index], medecin : user} , (response) => {
    if(!response.error){
      setTickets(response.tickets)
    }else{
      console.log(response.message)
    }
  });
  
}

  const finishingConsult = () => {
    socket.emit('close-ticket',  {ticket, medecin : user} , (response) => {
      if(!response.error){
        if(response.tickets === undefined){
          response.tickets = []
        }
        setMessages([])
        setTickets(response.tickets)
        setSelectedUser("")
      }
    });

  }

  const metVeille = () => {

    socket.emit('switch-ticket',  {selectedUser : selectedUser, type:"attente", medecin : user} , (response) => {
      if(!response.error){
        if(response.tickets === undefined){
          response.tickets = []
        }
        setMessages([])
        setTickets(response.tickets)
      }
    });
  }
  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', {message, selectedUser: tickets[selectedUser], user }, (message) =>{
        setMessage('')
        setMessages(messages => [ ...messages, message ]);
     });    }
  }
  const showConversationHandler = () => {
    setShowConversation(!showConversation)
  }
 
  const audioCall = () => {
    setInCall("audio")
  }

  const videoCall = () =>{
    
    setInCall("video")
  }

  if(inCall=== "audio" || inCall === "video"){
    return(
      <VideoChat socket={socket} patient={tickets[selectedUser]} medecin={user} type={inCall} setInCall={setInCall} />
    )
  }
  if(window.innerWidth <= 768){
    
  return (
      <div className="chat">
            <Row className="justify-content-around nom-medecin">
                <h4><span className="pb-2 border-bottom border-white"> { "Docteur " + user.nom + " " + user.prenom}</span> </h4>
            </Row>
        <Row className="justify-content-around ">
          <Col lg="10" className = "bg-white p-0 discussion-container">
            
          <InfoBar resolved={resolved} medecinImage={user.sexe == 0 ? medecine : medecineFemme} selectedUser={tickets[selectedUser]} titre={(tickets[selectedUser]) ? ( tickets[selectedUser]["pseudo"]) : "aucune ticket ouvert"} videoCall={videoCall} audioCall={audioCall} showConversationHandler={showConversationHandler}  onConsuting={onConsuting} user={user} chatIcon={true} showConversation={showConversation} />
          <Row className="discussion m-0">        
      {(onConsuting && showConversation) ?
        <Col lg="8" className="chat-messages p-0">
        
        <Messages messages={messages} user={user} />
        <SendMessageForm message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </Col>
        : 
        <Col lg="4" className="p-0">
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
          setResolved={setResolved}
        />
      </Col>
      }
      
        </Row>
        </Col>

      
      </Row> 
    </div>
  );
  }
  else{
    return (          
      <div className="chat">
         <div className="chat">
         <Row className="justify-content-around nom-medecin">
                <h4> <span className="pb-2 border-bottom border-white"> { "Docteur " + user.nom + " " + user.prenom} </span> </h4>
            </Row>
         <Row className="justify-content-around ">
           <Col lg="10" className = "bg-white p-0 discussion-container">
           
           <InfoBar resolved={resolved} medecinImage={user.sexe == 0 ? medecine : medecineFemme} selectedUser={tickets[selectedUser]} titre={ (tickets[selectedUser]) ? tickets[selectedUser]["pseudo"] : "aucune ticket ouvert"} videoCall={videoCall} audioCall={audioCall} onConsuting={onConsuting} user={user} chatIcon={false}  />
          <Row className="discussion m-0">
          <Col lg="4" className="p-0">
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
            setResolved={setResolved}
          />
        </Col>
        { onConsuting ?
          <Col lg="8" className="chat-messages p-0">
          
          <Messages messages={messages} user={user} />
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
      </div>

  );
}
}
export default MedecinChat;
