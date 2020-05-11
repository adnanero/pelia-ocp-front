import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/css/chat.css';
import './assets/css/video-call.css';
import 'react-vertical-timeline-component/style.min.css';
import 'react-modal-video/css/modal-video.min.css';

import Admin from './layouts/admin'
import Public from './layouts/public'
import Consultation from './views/Consultation'


import Medecin from './layouts/medecin'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { withRouter } from "react-router";
import NotFound from './layouts/notFound';


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

  }

    render(props){
      
  return (
    <Router>
      <ScrollToTopWithRouter />
        <Switch>
            <Route path={["/profil", "/call-video"]} render={props =>  <Medecin {...props} /> } />
            <Route exact path="/admin/pelia" render={props => <Admin {...props} />} />
            <Route exact path="/consultation" render={props => <Consultation {...props} />} />
            <Route path="/not-found" render={props => <NotFound {...props} />} />
            <Route path="/" render={props => <Public {...props} />} />
        </Switch>
    </Router>
  )
    }
}

export default App;
