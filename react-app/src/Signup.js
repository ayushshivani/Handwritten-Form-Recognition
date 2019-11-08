import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import PersonAddOutlined from '@material-ui/icons/PersonAddOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from './axios-object';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        emailid: "",
        name: "",
        username: "",
        password: "",
      },
      loggedin: localStorage.getItem("username"),
      submitted: false,
      error: null,
    }
    this.handleEChange = this.handleEChange.bind(this);
    this.handleMChange = this.handleMChange.bind(this);
    this.handleUChange = this.handleUChange.bind(this);
    this.handlePChange = this.handlePChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  static contextTypes={
    router: PropTypes.object,
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('/signup',JSON.stringify(this.state.formData))
      .then(_ => {
        this.setState({submitted: true});
        localStorage.setItem("username",this.state.formData.username);
      })
      .catch(error =>{
        if(error.response && error.response.data){
        this.setState({"error" : error.response.data.error})
        this.setState({submitted:true});}
      });
  }
  handleEChange(event) {
    this.state.formData.emailid = event.target.value;
  }
  handleMChange(event) {
    this.state.formData.name = event.target.value;
  }
  handleUChange(event) {
    this.state.formData.username = event.target.value;
  }
  handlePChange(event) {
    this.state.formData.password = event.target.value;
  }

  render() {
    const { classes } = this.props;  
    return (
      <main className={classes.main}>
      <CssBaseline />
      <Typography variant='display1' align='center' gutterBottom>
	        Welcome to Document Scanner
      </Typography>
      {this.state.loggedin == null &&
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonAddOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form} onSubmit={this.handleSubmit}>

          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="text">Full Name</InputLabel>
            <Input id="name" name="fullname" autoComplete="text" value={this.state.phone} onChange={this.handleMChange} autoFocus />
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="text">Email ID</InputLabel>
            <Input id="email" name="email" autoComplete="email" value={this.state.emailid} onChange={this.handleEChange} autoFocus />
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="text">Username</InputLabel>
            <Input id="username" name="username" autoComplete="text" value={this.state.userame} onChange={this.handleUChange} autoFocus />
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input name="password" type="password" id="password" autoComplete="current-password" value={this.state.password} onChange={this.handlePChange}/>
          </FormControl>

          {this.state.submitted && 
          <div>
              <Typography>
                New Account Created
                {window.location.reload()}
              </Typography>
            </div>
          }

          {!this.state.submitted &&
            <div className = "text-danger">
              {this.state.error}
            </div>
          }

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign in
          </Button>

        </form>
      </Paper>
      }

      { this.state.loggedin!=null && 
        this.context.router.history.push("/getdata")
      }
    </main>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Signup);