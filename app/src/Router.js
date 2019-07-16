import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Landing from './Landing';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Record from './Record';

export default class Router extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Landing} />
          <Route path="/signup" component={SignUp} />
          <Route path="/signin" component={SignIn} />
          <Route path="/record" component={Record} />
        </div>
      </BrowserRouter>
    );
  }
}
