import React, { useState, useEffect } from "react";
import {Col, Row} from 'react-bootstrap'
import Messages from './../medecin/chat/messages/index';
import SendMessageForm from './../medecin/chat/sendingMessage/index';
import InfoBar from './../medecin/chat/infoBar/index'

const Chat = (props) => {

  
  return (
      <div className="chat">
        <Row className="discussion m-0">
            <Col lg="12" className="chat-messages p-0">
                <InfoBar user={{name: props.medecin.nom + " " + props.medecin.prenom}} />
                <Messages messages={props.messages} user={props.user} />
                <SendMessageForm message={props.message} setMessage={props.setMessage} sendMessage={props.sendMessage} />
            </Col>
        </Row> 
      </div>
  );
}

export default Chat;
