import React from 'react';
import { Router, Route, hashHistory} from 'react-router';

import WelcomePage from './components/frontpage';
import ChatRoom from './components/chatroom';

export default (
  <Router history={hashHistory}>
  		<Route path="/" component={WelcomePage}/>
  		<Route path="/chatroom" component={ChatRoom}/>
  </Router>
);
