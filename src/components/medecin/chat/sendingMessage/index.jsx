import React from 'react';

import {Col, Row} from 'react-bootstrap'
import {FaPaperclip} from 'react-icons/fa';
import {IoIosSend, IoMdMic} from 'react-icons/io';
import {FiSend} from 'react-icons/fi';
import baseUrl from './../../../../config'

import axios from 'axios';

const Input = ({ setMessage, sendMessage, message }) =>
{
  const onChangeHandler = (event) => {
    let selectedFile = event.target.files[0];
    console.log(selectedFile);
    let data = new FormData() 
    data.append('file', selectedFile, selectedFile.name )
    data.file= selectedFile
    console.log(data)
    axios.post(`${baseUrl.node}upload` , data, {headers: {'Content-Type': 'multipart/form-data'}})
  .then(res => { // then print response status
    console.log(res)
  }).catch((e)=> {
    console.log(e)
  })

  }
return (

  <form className="messageForm"  >
      <Row className="chatContainer m-0">
        <Col md="10" className="input_width ml-4 mr-3">
          <input type="text" name="message" className="inputChat" placeholder="Ecrire votre message..."
            value={message}
            onChange={({ target: { value } }) => setMessage(value.replace(/^\s+/g, ''))}
            onKeyPress={event => event.key === 'Enter' && sendMessage(event)} />
        </Col>
        <Col className="btn_width">
          <Row>                   
            <button className="SendMsgBtn" type="button" onClick={e => sendMessage(e)}> {<FiSend size="1.5rem" /> }  </button>
          </Row> 
            
        </Col>
      </Row>
    </form>	
 
  
  
)
}
export default Input;
