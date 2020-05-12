import React, { Component } from 'react'
import { Navbar, Nav, Col, Row } from 'react-bootstrap';
import {Link } from "react-router-dom";
import autoBind from 'react-autobind';

import Logo from '../logo'

import Cookies from 'js-cookie'

let lang = Cookies.get('lang')
lang = (lang === undefined)? "fr" : lang

let style = (lang === "ar")? {
  all:{
    direction: 'rtl',
  },
  logo:{
    marginRight: "25px",
    direction: 'ltr',
    marginLeft: 0
  }
}: {

}
export default class NavbarPublic extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
          activeKey: null,
          colapsed: false,
          navFix:false
        };
      }

      isToggled(etat){
        this.setState({colapsed : etat})
      }
      handleSelectRight(eventKey){
        this.setState({
          activeKey: eventKey
        });
      }
      handleSelect(eventKey, e) {
        this.movingHoriselector(e.target)
        this.setState({
          activeKey: eventKey
        });
      }
      navbarFixing () {
        if(window.pageYOffset > 200 && this.state.navFix === false){
          this.setState({navFix : true}) 
        }
      else if(window.pageYOffset < 200 && this.state.navFix === true){
        this.setState({navFix : false}) 
      }
      }
   
      componentDidMount(){
        window.addEventListener("scroll", this.navbarFixing )
      }

      componentWillUnmount() {
        window.removeEventListener("scroll", this.navbarFixing);
      }
    render() {
      const { location } = this.props;
        const {  colapsed, navFix } = this.state;
        return (
                <header className= {"header_area"}>
                    <div className= { navFix ? "main_menu header_fixed" : "main_menu"}>
                        <div className="nav-wrapper">
                          <Navbar collapseOnSelect={true}  onSelect={this.handleSelectRight}  expand="lg" as="nav" onToggle={this.isToggled}>
                                <Row className="lg-mx-5 w-100"> 

                                    <Col lg={2} md="12" className="logo-container" >
                                    <Row style={style.all}>
                                    <a  href="/" to="/" style={style.logo} className="navbar-brand" ><Logo /> </a>
                                      <Navbar.Toggle aria-expanded={colapsed} aria-controls="basic-navbar-nav" className="mx-5" >
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                      </Navbar.Toggle>
                                    </Row>
                                    </Col>
                                    <Col lg={{ span: 8, offset: 2 }} id="nav-container">
                                        <Navbar.Collapse id="basic-navbar-nav">

                                          <Col lg="8">
                                          <Nav 
                                            activeKey={location.pathname} 
                                            as="ul" 
                                            className="nav menu_nav">
                                          
                                            <Nav.Item as="li"><Nav.Link as={Link} href='/' to="/"> {content.home[lang]}</Nav.Link></Nav.Item>
                                            <Nav.Item as="li"><Nav.Link as={Link} href='/about' to="/about">{content.about[lang]}</Nav.Link></Nav.Item>
                                            <Nav.Item as="li"><Nav.Link as={Link} href='/contact' to="/contact">{content.contact[lang]}</Nav.Link></Nav.Item>  
                                            <Nav.Item as="li"><Nav.Link as={Link} href='/consultation' to="/consultation">{   content.consultation[lang] }</Nav.Link></Nav.Item>  

                                        </Nav>
                                          </Col>
                                          <Col lg="4" className="bouton-container">
                                            <Nav as="ul"activeKey={location.pathname} style={style.all} className="nav justify-content-around" >
                                                {/* <Nav.Item className="py-4" as="li">
                                                  <Nav.Link as={Link} href='/medecin' style={{lineHeight: "0"}} className="inscription-btn" to="/medecin"> 
                                                    <span className="inscrire navbar-right btn_btn">
                                                    {   content.medecin[lang] }
                                                    </span>
                                                  </Nav.Link> 
                                              </Nav.Item> */}
                                              <Nav.Item className="py-4" as="li">
                                              <Nav.Link style={{lineHeight: "0"}} className="inscription-btn" as={Link} href='/authentification' to="/authentification"> 
                                                  <span className="inscrire navbar-right btn_btn">
                                                  {content.inscription[lang]}
                                                  </span>
                                                </Nav.Link> 
                                              </Nav.Item>  
                                            </Nav>
                                          </Col>
                                      </Navbar.Collapse>
                                    </Col>
                                </Row>
                          </Navbar>
                        </div>
                    </div>
                </header>
        )
    }
}

let content ={
    home:{fr:"Accueil", ar:"الرئيسية"},
    about:{fr:"A propos de nous", ar:"عنا"},
    contact:{fr:"Contactez-nous", ar:"اتصل بنا"},
    inscription:{fr:"espace médecins", ar:"منطقة الأطباء"},
    consultation:{fr:"consultation", ar:"استشارة طبية"}
}
