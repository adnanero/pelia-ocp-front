import React, {useState} from 'react'

import { Col,Row, Alert, Collapse, Container } from 'react-bootstrap';

import Axios  from 'axios';
import baseUrl from './../config'


import {FaLongArrowAltRight} from 'react-icons/fa'
export default function Contact() {

    const [objet, setObjet] = useState("")
    const [email, setEmail] = useState("")
    const [body, setBody] = useState("")
    const [messageEnvoye, setMessageEnvoye] = useState(false)
    const [fieldValidationErrors, setFieldValidationErrors] = useState({})
    const handleSubmit = (e) =>{
        e.preventDefault()
        if( !fieldValidationErrors.objetValid && !fieldValidationErrors.emailValid && !fieldValidationErrors.bodyValid){
            let data={
                email : email,
                objet: objet,
                message: body
            }
            Axios.post(`${baseUrl.lumen}api/contact` , data, {headers: {'Content-Type': 'application/json'}})
            .then(res => {
            setMessageEnvoye(true)
            setEmail("")
            setObjet("")
            setBody("")
            })
            .catch(error =>{ setMessageEnvoye(false)})
        }
    }

    const handleChange = (e) =>{
        if(e.target.name === "email"){
            setEmail(e.target.value)
        }
        if(e.target.name === "objet"){
            setObjet(e.target.value)
        }
        if(e.target.name === "message"){
            setBody(e.target.value)
        }

    }
    const verif = (e) => {
        e.target.classList.add("has-val")

        if(validateField(e.target.name)){
            e.target.nextElementSibling.classList.remove("success")
            e.target.nextElementSibling.classList.add("danger")
        }else{
            e.target.nextElementSibling.classList.remove("danger")
            e.target.nextElementSibling.classList.add("success")
        }

    }
    const validateField =(element) => {
        switch (element) {
           case "objet":
            let objetValid = objet.length >= 6;
            fieldValidationErrors.objetValid=  !objetValid
            if(!objetValid){
                fieldValidationErrors.objet =  ' entrer un objet significatif ';
                setFieldValidationErrors({fieldValidationErrors , ...fieldValidationErrors})
                return true
            }
               break;
            case "email":
                let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                fieldValidationErrors.emailValid = ! re.test(String(email).toLowerCase());
                if(fieldValidationErrors.emailValid){
                    fieldValidationErrors.email =  " l'email que vous avez entrer n'est pas valid" ;
                    setFieldValidationErrors({fieldValidationErrors , ...fieldValidationErrors})
                    return true
                }
            break;
            case "message":
                let bodyValid = body.length > 20; 
                fieldValidationErrors.bodyValid = !bodyValid
                if(!bodyValid){
                    fieldValidationErrors.body =  ' un bon message doit contenir au moins 2O caractére';
                    setFieldValidationErrors({fieldValidationErrors , ...fieldValidationErrors})
                    return true
                }
                break;
                default :

                break
        }
        setFieldValidationErrors({fieldValidationErrors , ...fieldValidationErrors})           
    }
    return (
             <Container className="wrap-contact my-5 p-5">
                <form className="contact-form validate-form" id="mailSendingForm" onSubmit={handleSubmit}>
                <Row>
                    <Col lg="6" md="6">
                        <div className="wrap-input rs1-wrap-input validate-input" data-validate="Name is required">
                            <span className="label-input">Objet </span>
                            <input className="input" type="text" name="objet" onBlur={verif} placeholder="" value={objet} onChange={handleChange} />
                            <span className="focus-input"></span>
                        </div>
                        
                        
                    </Col>
                    <Col lg="6" md="6">
                        <div className="wrap-input rs1-wrap-input validate-input" data-validate="Valid email is required: ex@abc.xyz">
                            <span className="label-input">Email</span>
                            <input className="input" type="text" name="email" onBlur={verif} placeholder="" value={email} onChange={handleChange} />
                            <span className="focus-input"></span>
                        </div>
                        
                  
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Collapse in={fieldValidationErrors.objetValid}>
                        <div id="example-collapse-text">
                            <Alert variant="danger">{fieldValidationErrors.objet}</Alert>
                        </div>
                        </Collapse>
                    </Col>
                    <Col>
                    <Collapse in={fieldValidationErrors.emailValid}>
                        <div id="example-collapse-text">
                            <Alert variant="danger">{fieldValidationErrors.email}</Alert>
                        </div>
                        </Collapse>
                    </Col>
                </Row>
    
    <div className="wrap-input validate-input" data-validate="Message is required">
        <span className="label-input">Message</span>
        <textarea className="input" name="message" placeholder="" onBlur={verif} value={body} onChange={handleChange}></textarea>
        <span className="focus-input"></span>
    </div>
    <Collapse in={fieldValidationErrors.bodyValid}>
                        <div id="example-collapse-text">
                            <Alert variant="danger">{fieldValidationErrors.body}</Alert>
                        </div>
                        </Collapse>
                        <Collapse in={messageEnvoye}>
                        <div id="example-collapse-text">
                            <Alert variant="success">votre message à était bien envoyer</Alert>
                        </div>
                        </Collapse>
  
    <div className="container-contact-form-btn">
        <button className="contact-form-btn btn" id="mailSending" type="submit" name="mailSending">
        Envoyer <span> <FaLongArrowAltRight /></span>
        </button>
    </div>
    
</form>

</Container>
    )
}
