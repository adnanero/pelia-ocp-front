import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import Admin from './layouts/admin'
import Public from './layouts/public'


import Medecin from './layouts/medecin'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { withRouter } from "react-router";
import NotFound from './layouts/notFound';
import Call from './components/videochat/app'


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
            <Route exact path="/call-video/:name/:medecin" render={props => <Call {...props} />} />
            <Route path={["/profil", "/call-video"]} render={props =>  <Medecin {...props} /> } />
            <Route exact path="/admin/pelia" render={props => <Admin {...props} />} />
            <Route path="/not-found" render={props => <NotFound {...props} />} />
            <Route path="/" render={props => <Public {...props} />} />
        </Switch>
    </Router>
  )
    }
}

export default App;
