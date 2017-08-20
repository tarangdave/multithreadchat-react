import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom'

import WelcomePage from './components/frontpage';

export default (
  <BrowserRouter>
  		<Route path="/" component={WelcomePage}/>
  </BrowserRouter>
);
