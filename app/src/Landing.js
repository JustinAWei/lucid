import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './css/Landing.css';


export default class Landing extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="sky">
        <div id='stars'></div>
        <div id='stars2'></div>
        <div id='stars3'></div>
        <div className="wrapper">
          <div className='title'>
            <h1>Lucid</h1>
            <h2><span className="flashing">enhance your</span> sleep</h2>
            <Link to="/signup">
              <div className="ghost button">start dreaming</div>
            </Link>
          </div>
          <Link to="/signin">
            <div className="bottom">
              <h6>Already dreaming? Click here to sign in</h6>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}
