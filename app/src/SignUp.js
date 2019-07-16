import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Route, Redirect } from 'react-router'

import './css/SignUp.css';

export default class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      user: '',
      password: '',
      confirmpassword: ''
    }
  }

  handleSubmit = (e) => {
    var registration = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
            name:this.state.user,
            password:this.state.password
          })
    };

    fetch('/register', registration).then(()=>{
        window.location='/signin'
        return;
    });
    // window.location = '/signin'
  }

  handleUserChange = (event) => {
    this.setState({user: event.target.value});
  }

  handlePassChange = (event) => {
    this.setState({password: event.target.value});
  }

  handleConfirmPassChange = (event) => {
    this.setState({confirmpassword: event.target.value});
  }

  render() {
    return (
      <div className="signup">
        <h1>Sign up with <Link to="/">Lucid</Link></h1>
        <div className="grid">
          <div className="left">
            <h2>Enhance your sleep</h2>
            <p>Lucid is the next generation of sleep; combining a revolutionary sleep-tracking system and emotional analysis, lucid helps you track & analyze your dreams. Get started for free and see how your dreams are influencing your daily life.</p>
          </div>
          <div className="right">
            <form>
              <input value={this.state.user} type="text" placeholder="Email" onChange={this.handleUserChange}/>
              <input value={this.state.password} type="password" placeholder="Password" onChange={this.handlePassChange}/>
              <input value={this.state.confirmpassword} type="password" placeholder="Confirm Password" onChange={this.handleConfirmPassChange}/>
              <div className="ghost button" onClick={this.handleSubmit}>Sign Up</div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
