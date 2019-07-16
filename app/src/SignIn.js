import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './css/SignIn.css';

export default class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      user: '',
      password: '',
      confirmpassword: ''
    }
  }


  handleUserChange = (event) => {
    this.setState({user: event.target.value});
  }

  handlePassChange = (event) => {
    this.setState({password: event.target.value});
  }

  handleSubmit = (e) => {
    var registration = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',

      body: JSON.stringify({
            name:this.state.user,
            password:this.state.password
          })
    };
    fetch('/login', registration).then(()=>{
        window.location='/record'
        return;
    });
  }

  render() {
    return (
      <div className="signin">
        <Link to="/">
          <h1>Lucid</h1>
        </Link>
        <form>
          <input value={this.state.user} type="text" placeholder="Email" onChange={this.handleUserChange}/>
          <input value={this.state.password} type="password" placeholder="Password" onChange={this.handlePassChange}/>
          <div className="ghost button" onClick={this.handleSubmit}>Sign In</div>

        </form>
      </div>
    );
  }
}
