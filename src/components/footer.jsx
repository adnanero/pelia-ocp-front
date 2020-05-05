import React, { useState } from 'react'

import {TiSocialLinkedinCircular, TiSocialTwitterCircular, TiSocialInstagramCircular, TiSocialFacebookCircular} from 'react-icons/ti'
import LogoPng from './../assets/img/pelia-logo.png'
import { Container, Row, Col, Navbar, Nav, Alert } from 'react-bootstrap';
import {Link } from "react-router-dom";

import BandeauNewletter from './../assets/img/bandeau-newsletter.svg'
import ProsperineNewsletter from './../assets/img/Prosperine-newsletter.svg'

import { Paper, InputBase, IconButton} from '@material-ui/core';
import {IoIosSend} from 'react-icons/io'

import '../assets/css/style.css';

import Axios  from 'axios';

import baseUrl from './../config'


import Cookies from 'js-cookie'
let lang = Cookies.get('lang')
lang = (lang === undefined)? "fr" : lang

let style = (lang === "ar")? {
    all:{
        direction: 'rtl',
        color:'black'
    },
    text:{
        color:'black',
        textAlign:'right'
    },
 
}: {

}

export default function footer() {
    return (


        <footer className="footer_area">
            <NewsLetter />
            <Container>
            <Col lg="12">

                <Row className="justify-content-center mt-5">
                        <div className="footer_top d-flex flex-column justify-content-center">
                            <Link className="d-flex justify-content-center" to="/"> <img src={LogoPng} width="10%" alt="" /> </Link>
                            <div className="d-lg-block d-none">
                                <Navbar className="navbar navbar-expand-lg navbar-light justify-content-center">
                                    <div className="collapse navbar-collapse offset">
                                        <Nav as="ul" className="nav navbar-nav menu_nav mx-auto">
                                            <Nav.Item> <Link className="text-white nav-link" to="/">{content.footer.home[lang]}</Link> </Nav.Item>
                                            <Nav.Item> <Link className="text-white nav-link" to="/about">{content.footer.about[lang]}</Link> </Nav.Item>
                                            <Nav.Item> <Link className="text-white nav-link" to="/contact">{content.footer.contact[lang]}</Link> </Nav.Item>
                                            <Nav.Item> <Link className="text-white nav-link" to="/medecin">{content.footer.medecin[lang]}</Link> </Nav.Item>
                                        </Nav>
                                    </div>
                                </Navbar>
                            </div>
                            <div className="footer_social mt-lg-0 mt-4">
                                <a href="https://www.facebook.com/PeliaTeam"> <TiSocialFacebookCircular size="1.6rem" /> </a>
                                <a href="https://twitter.com/pelia_19"> <TiSocialTwitterCircular size="1.6rem" /> </a>
                                <a href="https://www.linkedin.com/company/pelia/"> <TiSocialLinkedinCircular size="1.6rem" /> </a>
                                <a href="https://www.instagram.com/pelia.ma/"><TiSocialInstagramCircular size="1.6rem" /></a>
                            </div>
                        </div>
                </Row>
                </Col>

                <Row className="footer_bottom justify-content-center">
                    <p className="footer-text"> Copyright &copy; Pelia Team 2020</p>
                </Row>
                </Container>
                </footer>
    )
}

function NewsLetter () {
    const [email, setEmail] =useState("")
    const [envoye, setMessageEnvoye] = useState(false)
    const handleChange= (e) =>{
        setEmail(e.target.value)
    }
    const handleSubmit = (e) =>{
        e.preventDefault()
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let emailValid = re.test(String(email).toLowerCase());
        if(emailValid){
            Axios.post(`${baseUrl.lumen}api/newsletter` , {email: email}, {headers: {'Content-Type': 'application/json'}})
            .then(res => {
                setMessageEnvoye(true)
                setEmail("")
            })
            .catch(error =>{ setMessageEnvoye(false)})
        }
    }
    if(envoye){
      
    } 
    return(
        <div className="newsletter" style={{backgroundImage:`url(${BandeauNewletter})`}}>
            <Container style={{backgroundImage:`url(${ProsperineNewsletter})`}}>
                 <div className="newsletter-content" style={style.all} >
                    <div className="h2" style={style.text}>{content.newsletter.title[lang]}</div>
                    <p style={style.text} className='colorWhite' >{content.newsletter.subtitle[lang]}</p>
                    
                    {envoye ?
                        <Alert variant="success" style={style.text}> {content.newsletter.body.validation[lang]} </Alert>
                        :
                            <Paper component="form" onSubmit={handleSubmit}>
                            <InputBase
                                placeholder="abc@exemple.ma"
                                inputProps={{ 'aria-label': 'inscription a la newsletter' }}
                                onChange={handleChange}
                                value={email}                                
                            />
                            <IconButton  style={{backgroundColor: "rgba(0, 242, 96, 1)"}} type="submit" aria-label="search">
                                <IoIosSend />
                            </IconButton>
                            </Paper>
                    }
                        <div className="newsletter-legal mt-3" style={style.text}>
                        {content.newsletter.body.traitement[lang]}
                            <Link to="/traitement-donnee" style={{color:"#fff"}}>
                            {content.newsletter.body.plus[lang]}
                            </Link>
                        </div>
                    </div>
            </Container>
        </div>
       
    )
}


let content = {
   footer:{
        home:{fr:"Accueil", ar:"الرئيسية"},
        about:{fr:"A propos de nous", ar:"عنا"},
        contact:{fr:"Contactez-nous", ar:"اتصل بنا"},
        inscription:{fr:"Nous Rejoindre", ar:"انضم إلينا"},
        medecin:{fr:"Vous êtes médecin?", ar:"هل انت طبيب"}
    
   },
    newsletter:{
        title:{fr:"Manquez-vous d'informations?" ,ar:"هل تفتقر للمعلومات؟"},
        subtitle:{
            fr:"En vous inscrivant à notre newsletter, vous aurez des informations tout le temps",
            ar:"من خلال الاشتراك في النشرة الإخبارية ، ستحصل على المعرفة كل مساء! "
        },
        body:{
            validation:{
                fr:"Votre souscription à la newsletter de Pelia a bien été prise en compte, vous recevrez bientôt nos actualités dans votre boîte mail",
                ar:"تم أخذ اشتراكك في نشرة Pelia الإخبارية بعين الاعتبار ، وستتلقى قريبًا أخبارنا في صندوق بريدك"
            },
            traitement:{
                fr:"La société Pelia traite les données recueillies afin de faire suite à votre demande d’inscription à la newsletter.", 
                ar:"تعالج Pelia البيانات التي تم جمعها من أجل الاستجابة لطلبك للاشتراك في النشرة الإخبارية. "
            },
            plus:{
                fr:"En savoir plus sur la gestion de vos données et vos droits",
                ar:"تعرف على المزيد حول إدارة بياناتك وحقوقك "
            }

        }
    },
  
  }

