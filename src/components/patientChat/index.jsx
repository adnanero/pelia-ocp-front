import React,{useEffect} from "react";
import {Col, Row} from 'react-bootstrap'
import Messages from './../medecin/chat/messages/index';
import SendMessageForm from './../medecin/chat/sendingMessage/index';
import InfoBar from './../medecin/chat/infoBar/index'

const Chat = (props) => {

  const user = {nom:props.medecin.nom,prenom:props.medecin.prenom,type:'patient'}
  return (
      <div className="chat mt-5">
          <Col lg="12" className = "bg-white p-0 discussion-container">
          <InfoBar user={user} titre={props.nomVille} />
        <Row className="discussion m-0">
            <Col lg="12" className="chat-messages p-0">
                <Messages messages={props.messages} user={props.user} />
                <SendMessageForm message={props.message} setMessage={props.setMessage} sendMessage={props.sendMessage} />
            </Col>
        </Row> 
          </Col>
          
      </div>
  );
}

export default Chat;
