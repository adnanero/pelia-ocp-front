import React from 'react';

import {Col, Row} from 'react-bootstrap'
import {FaPaperclip} from 'react-icons/fa';
import {IoIosSend, IoMdMic} from 'react-icons/io'
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
        <Col lg="12">
          <input type="text" name="message" className="inputChat" placeholder="Ecrire votre message..."
            value={message}
            onChange={({ target: { value } }) => setMessage(value.replace(/^\s+/g, ''))}
            onKeyPress={event => event.key === 'Enter' && sendMessage(event)} />
        </Col>
        <Col lg="2">
          {/* <Row className="justify-content-around align-items-center">
            <label htmlFor="document"> <FaPaperclip color= "#435f7a" cursor= "pointer" className="attachment" size="1.5rem" opacity= "0.5" /> </label>
          <input id="document" style={{display: "none"}} type="file" name="file" onChange={onChangeHandler}/>
            <button className="SendMsgBtn" type="button" onClick={e => sendMessage(e)}> {(message === "")  ? <IoMdMic /> : <IoIosSend size="1.5rem" /> }  </button>
          </Row> */}
            
        </Col>
      </Row>
    </form>	
 
  
  
)
}
export default Input;