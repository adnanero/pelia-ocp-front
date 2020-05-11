import React, { useState } from 'react';

import { Avatar, Typography,  ThemeProvider} from '@material-ui/core';
import { FaMailBulk, FaKey } from 'react-icons/fa';
import theme from './../theme/GlobalTheme'

import {MdLockOpen, MdPersonAdd} from 'react-icons/md'
import {Col, Row, Alert, Collapse } from 'react-bootstrap';

import Button  from './../components/Button/index';
import Heart from './../assets/img/heart_hover.png'
import medecin from './../assets/img/many-medecin.jpg'
import InputField from './../components/Inputs/InputIcone/index'

import Axios  from 'axios';
import { Redirect, Link } from 'react-router-dom';
import Cookie from 'js-cookie'
import baseUrl from './../config'

function SignInSide() {

  const [email, setPhone]= useState("")
  const [authentified, setAuthentified] = useState(false)
  const [password, setPass]= useState("")
  const [success, setSuccess]= useState(false)
  const [sending, setSending]= useState(false)
  const [error, setError] =useState(false)
  const [emailError, setEmailError]= useState(false)

  const handleChange = ( e ) =>{
    setPhone(e.target.value)
  }
  const handleChangePass = ( e ) =>{
    setPass(e.target.value)
  }
  const validateField = (e) =>{
    if(e.target.name === "email"){
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let emailErr = ! re.test(String(email).toLowerCase());
      
      setEmailError(emailErr)
      if(emailErr){
          return true
      }
    }
  }
  const loginSending =(e) =>{
    e.preventDefault( )
    setSending(true)
    let data={
      email:email,
      password:password.toString()
    }
    Axios.post(`${baseUrl.lumen}api/login` , data, {headers: {'Content-Type': 'application/json'}})
    .then(res => {
        Cookie.set("token",res.data.access_token, { expires: 0.5 });
        Cookie.set("user",res.data.user, { expires: 0.5 });
        Cookie.set("medecinAuth", res.data.user.nom , { expires: 0.5 })
        setAuthentified(true)
        setSuccess(true)
        setSending(false)
    })
    .catch(() =>{
      setSending(false)
      setSuccess(false)
      setAuthentified(false)
      setError(true)
    })
  }

  if(authentified || Cookie.get('medecinAuth') !== undefined){
    return (<Redirect to="/profil/chat" />)
  }

  return (
    <ThemeProvider theme={theme}>     

        <Col>
          <Row className="justify-content-around">
            <Avatar >
              <MdLockOpen />
            </Avatar>
          </Row>
          
          <Typography component="h1" variant="h5">
            Se connecter
          </Typography>
          <form noValidate onSubmit={loginSending}>
            <Row className="inscription-input">
                  <InputField 
                  label="Email"
                  Icone={FaMailBulk}
                  placeholder= "abcd@gmail.com"
                  name="email"
                  error={emailError}
                  required={true}
                  onBlur={validateField} 
                  value={email}
                  onChange={handleChange} />                        
              </Row>
              <Row className="inscription-input">
                  <Collapse in={emailError}>
                      <div id="example-collapse-text">
                          <Alert  variant="danger">
                          L'adresse de messagerie que vous avez entrée est introuvable. Vérifiez votre adresse de messagerie
                          </Alert>
                      </div>
                  </Collapse>
                  </Row>
                  <Row className="inscription-input">
                  <InputField 
                  label="Mot de passe" 
                  Icone={FaKey}
                  placeholder= "Mot de passe"
                  name="password"
                  error={emailError}
                  required={true}
                  type="password"
                  id="password"
                  fullWidth
                  value={password}
                  onChange={handleChangePass} />                        
              </Row>
            <Row className="inscription-input">
              <Collapse in={error}>
                  <div id="example-collapse-text">
                      <Alert  variant="danger">
                      On n'a pas pu vous authentifier. Il semble que vos données sont incorrectes
                      </Alert>
                  </div>
              </Collapse>
              </Row>
            <Row className="align-items-center justify-content-around mt-4">
                <Button success={success} type="submit" icone={MdPersonAdd} sending={sending} valeur="S'authentifier" />
            </Row>
          </form>
        </Col>
      </ThemeProvider>
  );
}


export default function Authentification() {

  return (
      <div className="page">
      <div id="inscription" className="inscription">

          <Col lg="5" md="12" xs="12" style={{backgroundColor:"rgba(5,117,230, 0.8)"}}>
              <div className="form-inscription" style={{background: `url(${medecin}) left`, backgroundSize:"cover"}}>
                    <div style={{backgroundColor:"rgba(255,255,255, 0.9)", padding: "82px 55px 33px 55px"}}>
                      <SignInSide  />  
                    </div>
              </div>
          </Col>
          <Col lg="7">
          <section id="inscription-body" style={{background:`url(${Heart})`, backgroundSize:"cover"}}>
  <div className="container">
  <div className="overlay"></div>
    <Row>
      <div className="inscription-info">
          <h1 data-wow-duration="700ms" data-wow-delay="500ms" className="wow bounceInDown animated">Bienvenue sur Pelia !</h1>
          <p>vous ne savez pas de quoi il s'agit? vous êtes perdus ? vous pouvez toujours aller à la page d'accueil pour voir les descriptions des fonctionnalités qu'on propose à nos utilisateurs.</p>
          <Link data-wow-duration="700ms" data-wow-delay="500ms" to="/medecin"
              className="btn section-btn smoothScroll wow slideInUp animated mt-5">
                voir la description
          </Link>
      </div>
    </Row>
  </div>
</section>
          </Col>

             
      </div>
      </div>
  )
}
