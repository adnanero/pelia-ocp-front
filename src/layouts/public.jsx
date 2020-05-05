import React, { Component } from 'react';
import WOW from 'wow.js'

import './../assets/css/style.css';
import 'react-vertical-timeline-component/style.min.css';
import 'react-modal-video/css/modal-video.min.css';

import Home from './../views/Home'
import Medecin from './../views/medecin'
import Inscription from './../views/Inscription'
import About from './../views/About'
import Contact from './../views/Contact'
import Authentification from './../views/login'
// import WhitWS from './../components/videochat/webSockets'
import Navbar from './../components/Navbars/navbar'
import Footer from './../components/footer'
import LangSwitcher from './../components/angSwitcher'


import {
  Switch,
  Route
} from "react-router-dom";

import { withRouter, Redirect } from "react-router";

const HeaderWithRouter = withRouter(Navbar);


class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

const ScrollToTopWithRouter = withRouter(ScrollToTop);


class App extends Component {


  componentDidMount() {
    var wow = new WOW({
      boxClass: 'wow', // animated element css class (default is wow)
      animateClass: 'animated', // animation css class (default is animated)
      offset: 60, // distance to the element when triggering the animation (default is 0)
      mobile: false, // trigger animations on mobile devices (default is true)
      live: true // act on asynchronously loaded content (default is true)
  });
  wow.init();

  }
 
    render(props){
      
  return (
    <>
        <ScrollToTopWithRouter />
        <HeaderWithRouter {...props} />
        <LangSwitcher />
        <main id="main-site" className="main-site">
            <Switch>
                <Route exact path="/" render={props => <Home {...props} />} />
                <Route exact path="/about" render={props => <About {...props} />} />
                <Route exact path="/medecin" render={props => <Medecin {...props} />} />
                <Route exact path="/contact" render={props => <Contact {...props} />} />
                <Route exact path="/login" render={props => <Inscription {...props} />} />
                <Route exact path="/authentification" render={props => <Authentification {...props} />} />
                <Redirect to="/not-found" />
            </Switch> 
        </main>
        <Footer />
    </>
  )
    }
}

export default App;
