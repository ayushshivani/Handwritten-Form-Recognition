import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from './axios-object';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
  finalpaper: {
    // padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
    position: "relative",
    display: "inline-block"
  },
  image: {
    width : '100%',
  }
});

class ViewData extends Component {
    constructor() {
        super();
        this.state = {
          data : [],
          tid : null,
          did : null,
        }
    }

    static contextTypes = {
        router : PropTypes.object,
    }

    componentDidMount() {
      let tid = this.props.match.params.tid;
      let did = this.props.match.params.did;
      this.setState({tid:tid,did:did});
      axios.get('/showMarked/'+tid+'/'+did)
      .then(response => this.setState({data: response.data}));
    }

    render () {
        const { classes } = this.props;
        return (
          <div className={classes.root}>
            <Grid container wrap="nowrap" spacing={24}>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                <img src={process.env.PUBLIC_URL + '/temp/finalimage.png'} className = {classes.image} alt = ''/> 
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.finalpaper}>
                <img src={process.env.PUBLIC_URL + '/templates/'+this.state.tid} className = {classes.image} alt = ''/>

                {this.state.data.map(function(field, key) {
                  return (
                    <div>
                    {Object.keys(field).map(data => {
                      const st2 = {
                        location :{
                          position : "absolute",
                          margin: "0 auto",
                          color: "black",
                          letterSpacing: "0.4em",
                          left: field[data]["lx"]+0.5+"%",
                          top: field[data]["ty"]+"%",
                        }
                      }
                      return(
                        <strong><div style = {st2.location}>{data}</div></strong>
                      )
                    })}
                    </div>
                  )
                })}

                </Paper>
              </Grid>
            </Grid>
          </div>
        );
    }
}

ViewData.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(ViewData);