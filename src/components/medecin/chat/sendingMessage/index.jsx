import React, {useEffect} from 'react';
import {isAndroid, isBrowser} from 'react-device-detect'

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
 useEffect(() => {

    let submitButton =  document.querySelector('.SendMsgBtn');
    if (submitButton !== null){
setTimeout(() => {
      submitButton.click();
    }, 1000);	 
}
  }, [])
return (

  <form className="messageForm"  >
      <Row className="chatContainer m-0">
        <Col lg="10" md="10" className="input_width pl-5">
          <input type="text" name="message" className="inputChat" placeholder="Ecrivez votre message ici"
		style={{width:"100%"}}
            value={message}
            onChange={({ target: { value } }) => setMessage(value.replace(/^\s+/g, ''))}
            onKeyPress={event => event.key === 'Enter' && sendMessage(event)} />
        </Col>
        <Col lg="2" className="btn_width">
          <Row className="justify-content-around">                   

	{(isAndroid || isBrowser) ? <button  className="SendMsgBtn" type="button" onClick={e => sendMessage(e)}>{<FiSend size={'1.5rem'}/>} </button> : null}
          </Row> 
            
        </Col>
      </Row>
    </form>	
 
  
  
)
}
export default Input;
