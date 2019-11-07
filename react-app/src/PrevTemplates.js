import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from './axios-object';

class PrevTemplates extends Component {
    constructor() {
        super();
        this.state = {
                data : [],
                error : null,
                submitted : false,
        }
    }

    static contextTypes = {
        router : PropTypes.object,
    }

    componentDidMount() {    
        axios.post('/prevTemplates/', JSON.stringify(localStorage.getItem("username")))   
        .then(response => this.setState({data: response.data}));
    }
    

    showTemplate = (link) => {
        this.context.router.history.push(link)
    }

    showData = (link2) => {
        this.context.router.history.push(link2)
    }

    handledelete = (id, event) => {
        event.preventDefault()
        axios.delete('/deleteTemplate/'+id)
        .then(_ => window.location.reload());
    }

    render () {
        let deleteFunc = this.handledelete
        let showFunc = this.showTemplate
        let showDataFunc = this.showData
        return (
            <CssBaseline>
            <div className = "App">
                <header>
                <Typography variant = "display1"> Previous Templates</Typography>
                <br/>
                </header>
                <div className = "table-responsive container">
                    <table className="table table-hover">
                        <thead className = "thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Created On</th>
                            <th>Show</th>
                            <th>Show Data</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>{this.state.data.map(function(item, key) {
                            let link = '/template/' + item.id
                            let link2 = '/data/' + item.id
                            return (
                                <tr key = {key} className = "table-info">
                                    <td>{key + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.createdon}</td> 
                                    <td><button className = "btn btn-primary" onClick = {() => showFunc(link)}>Show</button></td>
                                    <td><button className = "btn btn-primary" onClick = {() => showDataFunc(link2)}>Show Data</button></td>
                                    <td><button className = "btn btn-danger" onClick = {(event) => deleteFunc(item.id, event)}>Delete</button></td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
            </CssBaseline>
        )
    }
}
export default PrevTemplates;