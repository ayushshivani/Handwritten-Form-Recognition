import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import axios from './axios-object';

class ShowTemplate extends Component {
    constructor() {
        super();
        this.state = {
                data : [],
                error : null,
                submitted : false,
        }
    }

    componentDidMount = () => {

        let id = this.props.match.params.tid
        let data = {'username':localStorage.getItem("username"),'tid':id}
        axios.post('/showTemplate/',JSON.stringify(data))
        .then(response => {this.setState({data: response.data})});
      }

    handleDelete = (id, event) => {

        event.preventDefault()
        axios.delete('deleteField/'+id)
        .then(_ => {window.location.reload()});
    }

    render () {
        let deleteFunc = this.handleDelete
        return (
            <div className = "App">
                <header>
                <Typography variant = "display1">Template</Typography>
                <br/>
                </header>
                <div className = 'table-responsive container'>
                    <table className="table table-hover">
                        <thead className = "thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Boxes</th>
                            <th>Left Coordinate (Pixels)</th>
                            <th>Right Coordinate (Pixels)</th>
                            <th>Top Coordinate (Pixels)</th>
                            <th>Bottom Coordinate (Pixels)</th>
                            <th>Left Coordinate (Percentage)</th>
                            <th>Right Coordinate (Percentage)</th>
                            <th>Top Coordinate (Percentage)</th>
                            <th>Bottom Coordinate (Percentage)</th>
                            <th>Marked On</th>
                            <th>Anchor Tag</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>{this.state.data.map(function(item, key) {
                            let anchor = 'Yes';
                            if(item.anchor == false)
                                anchor = 'No'
                            return (
                                <tr key = {key} className = "table-info">
                                    <td>{key + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.Type}</td>
                                    <td>{item.description}</td> 
                                    <td>{item.boxcount}</td> 
                                    <td>{item.leftx}</td>
                                    <td>{item.rightx}</td>
                                    <td>{item.topy}</td>
                                    <td>{item.bottomy}</td>
                                    <td>{item.percentleftx} %</td>
                                    <td>{item.percentrightx} %</td>
                                    <td>{item.percenttopy} %</td>
                                    <td>{item.percentbottomy} %</td>
                                    <td>{item.markedon}</td>
                                    <td>{anchor}</td>
                                    <td><button className = "btn btn-danger" onClick = {(event) => deleteFunc(item.id, event)}>Delete</button></td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
export default ShowTemplate;