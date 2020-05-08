import React from 'react';

import {Col, Row} from 'react-bootstrap'
import {FaPaperclip} from 'react-icons/fa';
import {IoIosSend, IoMdMic} from 'react-icons/io'
const Input = ({ setMessage, sendMessage, message }) => (

  <form className="messageForm"  >
      <Row className="chatContainer m-0">
        <Col lg="10">
          <input type="text" name="message" className="inputChat" placeholder="Ecrire votre message..."
            value={message}
            onChange={({ target: { value } }) => setMessage(value.replace(/^\s+/g, ''))}
            onKeyPress={event => event.key === 'Enter' && sendMessage(event)} />
        </Col>
        <Col lg="2">
          <Row className="justify-content-around align-items-center">
          <FaPaperclip color= "#435f7a" cursor= "pointer" className="attachment" size="1.5rem" opacity= "0.5" />
            <button className="SendMsgBtn" type="button" onClick={e => sendMessage(e)}> {(message === "")  ? <IoMdMic /> : <IoIosSend size="1.5rem" /> }  </button>
          </Row>
            
        </Col>
      </Row>
    </form>	
 
  
  
)

export default Input;