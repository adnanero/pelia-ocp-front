import React from "react";
import {Col, Row} from 'react-bootstrap'
import Messages from './../medecin/chat/messages/index';
import SendMessageForm from './../medecin/chat/sendingMessage/index';
import InfoBar from './../medecin/chat/infoBar/index'

const Chat = (props) => {

  
  return (
      <div className="chat">
          <Col lg="12" className = "bg-white p-0 discussion-container">
          <InfoBar user={{nom: props.user.pseudo , prenom : props.user.pseudo, type: "patient"}} />
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
