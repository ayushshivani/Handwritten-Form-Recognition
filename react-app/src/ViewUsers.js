import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import './ViewUsers.css';
import axios from './axios-object';

class ViewUsers extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      submitted: false,
      loggedin : localStorage.getItem("username")
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
  axios.get('/admin/users')
  .then(reponse => this.setState({data: reponse.data}));
  }

  deleteUser(event,toDelete){
    event.preventDefault();
    var id = toDelete;
      axios.post('/admin/users/'+id)
        .then(_ => {
            this.setState({submitted: true});
            window.location.reload();
        });
  }

  render() {
    return (
      <div className="App">
      {this.state.loggedin==="admin" &&
      <div>
        <header>
          <Typography variant = "display1">All Users</Typography>
          <br/>
        </header>

        <div className = "table-responsive container">
          <table className="table table-hover">
            <thead className = "thead-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>EmailID</th>
                <th>Username</th>
                <th>Password</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>{this.state.data.map((item, key)=> {
                return (
                    <tr key = {key} className = "table-info">
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.emailid}</td>
                        <td>{item.username}</td>
                        <td>{item.password}</td>
                        <td><button className = "btn btn-danger" onClick={(e)=>{this.deleteUser(e,item.id)}}>Delete</button></td>
                    </tr>
                  )})}
            </tbody>
          </table>
        </div>
       </div>
      }
      { this.state.loggedin!=="admin" &&
      <div>
        <h1>You must have Admin Access</h1>
      </div>
      }
      </div>
    );
  }
}

export default ViewUsers;
