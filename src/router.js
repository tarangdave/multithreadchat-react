import React from 'react';
import { Router, Route, hashHistory} from 'react-router';

import WelcomePage from './components/frontpage';

export default (
  <Router history={hashHistory}>
  	<Route path="/" component={WelcomePage}/>
  </Router>
);
