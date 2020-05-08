import React, { Component, useState } from 'react'

import {Navbar, Nav, Button, Row, Col} from 'react-bootstrap'
import Cookies from 'js-cookie'
import {Link, Redirect } from "react-router-dom";
import Logo from './../components/logo'
import Chat from './../views/chatMedecin'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';

import {TiMessages} from 'react-icons/ti'
import {IoIosTimer} from 'react-icons/io'
import {FaRegQuestionCircle} from 'react-icons/fa'

import Contact from './../components/contact'
import {
  Switch,
  Route
} from "react-router-dom";


import Call from './../components/videochat/app'
const Medecin = (props) =>  {
   
        let isPatient = (props.match.params.name === undefined) ? false : true;
        if( !isPatient && !Cookies.get('medecinAuth') === undefined ){
            return (<Redirect to="/authentification" />)
          }
        return (
            <div>
                <Header {...props} />
                <main id="medecin-site" className="medecin-site">
            <Switch>
                <Route exact path="/call-video" render={props => <Call {...props} />} />
                <Route exact path="/profil/home" render={props => <Comment {...props} />} />
                <Route exact path="/profil/contact" render={props => <Contact {...props} />} />
                <Route exact path="/profil/chat" render={props => <Chat {...props} />} />
                
            </Switch> 
        </main>
            </div>
        )
    
}
export default Medecin;

function Header(props){
    const [isToggle, setIsToggled] = useState(false)
    const [isLogout, setIsLogout] = useState(false)
    const logout = () =>{
        Cookies.remove('medecinAuth');
        Cookies.remove('user');
        Cookies.remove('token');
        setTimeout(() => {
            setIsLogout(true)
        }, 1000);
        
    }
    
    if(isLogout || Cookies.get('user') === undefined){
        return <Redirect to="/" />

    }   

     return(
        <header className="header-call">
             <Navbar collapseOnSelect={true} onToggle={(etat) => setIsToggled(etat)} style={{background: "#61ccff", boxShadow: "0px 0px 30px rgba(73, 78, 92, 1)", padding: 0}} expand="lg" as="nav">
                <Row className="lg-mx-5 w-100"> 
                    <Col lg="2" md="12" className="logo-container">
                        <Row>
                            <span to="/" className="navbar-brand"  > <Logo /> </span>
                            <Navbar.Toggle aria-expanded={isToggle} aria-controls="basic-navbar-nav" className="mx-5 button-toggle" >
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </Navbar.Toggle>
                        </Row>
                    </Col>
                    <Col xl={{ span: 9, offset: 1 }} lg="10"  id="nav-container">  
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav activeKey={props.location.pathname} as="ul" className="nav menu_nav" >
                            <Nav.Item as="li"><Nav.Link as={Link} href='/profil/home' to="/profil/home"> Comment ça marche ?</Nav.Link></Nav.Item>
                            <Nav.Item as="li"><Nav.Link as={Link} href='/profil/chat' to="/profil/chat">téléconsultation</Nav.Link></Nav.Item>
                            <Nav.Item as="li"><Nav.Link as={Link} href='/profil/contact' to="/profil/contact">contactez-nous</Nav.Link></Nav.Item>  
                        </Nav>
                            <Button className="logout" variant="light" onClick={logout}>
                            Se déconnecter
                            </Button>
                    </Navbar.Collapse>
                    </Col>
                </Row>
            </Navbar>

        </header>
    )
}

function Comment(){
    return(
        <div id="comment" className="public-container">
            <Col >
                <Row className="justify-content-around my-5">
                    <h2 className="bounceInRight wow animated mx-4" >Les démarches à suivres pour communiquer avec votre patient</h2>
                </Row>
                <VerticalTimeline>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#fff', color: '#000', borderTop: '2px solid rgba(54,149,235,1)' } }
                        contentArrowStyle={{ borderRight: '7px solid  rgba(54,149,235,1)' }}
                        date="étape 1"
                        iconStyle={{ background: 'rgba(54,149,235,1)', color: '#fff' }}
                        icon={<FaRegQuestionCircle />}
                    >
                        <h3  className="vertical-timeline-element-title">Générer un nouveau lien</h3>
                        <p className='colorBlack' >Pour que le patient puisse vous rejoindre dans un appel vidéo ou audio vous devez générer un lien dans la page "appeler un patient" en haut.</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--education"
                        date="étape 2"
                        contentStyle={{ background: '#fff', color: '#000', borderTop:'2px solid #00F260' }}
                        contentArrowStyle={{ borderRight: '7px solid  #00F260' }}

                        iconStyle={{ background: '#00F260', color: '#fff' }}
                        icon={<IoIosTimer />}
                    >
                        <h3  className="vertical-timeline-element-title">Partager le lien avec le patient</h3>
                        <p  className='colorBlack' >Partager le dernier lien généré avec votre patient pour qu'il puisse vous rejoindre par appel.</p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#fff', color: '#000', borderTop: '2px solid rgba(54,149,235,1)'  }}
                        contentArrowStyle={{ borderRight: '7px solid  rgba(54,149,235,1)' }}   
                            date="étape 3"
                        iconStyle={{ background: 'rgba(54,149,235,1)', color: '#fff' }}
                        icon={<TiMessages />}
                    >
                        <h3  className="vertical-timeline-element-title"> Choisir le type d'appel</h3>
                        <p  className='colorBlack'>Cliquer sur le boutton démarrer la téléconsultation pour aller à la page d'appel et choisis le type d'appel que vous voulez passer.</p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentArrowStyle={{ borderRight: '7px solid  rgba(54,149,235,1)' }}
                        iconStyle={{ background: '#00F260', color: '#fff' }}
                        icon={<TiMessages />}
                    >
                    </VerticalTimelineElement>
                    </VerticalTimeline>         
                </Col>
        </div>
    )
}

