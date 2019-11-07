import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from './axios-object';

class Logout extends Component {

  static contextTypes = {
    router: PropTypes.object,
  }
  componentDidMount() {
    axios.get('/logout')      
    .then(_ => {
      localStorage.removeItem("username")
      window.location.reload();
      this.context.router.history.push('/');
    });
  }

  render() {

    return (
      <div className="App">
      </div>
    );
  }
}


export default Logout;