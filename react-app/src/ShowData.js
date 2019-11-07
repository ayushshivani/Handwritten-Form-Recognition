import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import axios from './axios-object';

class ShowData extends Component {
    constructor() {
        super();
        this.state = {
                data : [],
                error : null,
                submitted : false,
        }
    }

    componentDidMount = () => {

        let id = this.props.match.params.tid;
        axios.get('/showData/'+id)
        .then(response => {this.setState({data: response.data})});
      }

    render () {
        return (
            <div className = "App">
                <header>
                <Typography variant = "display1">Template</Typography>
                <br/>
                </header>
                <div className = 'table-responsive container'>
                    <table className="table table-hover">
                        <thead className = "thead-dark">
                        {this.state.data.slice(0,1).map(function(item){
                            return (
                                <tr>
                                    {Object.keys(item).map(key => 
                                    <th value={key}>{key}</th>
                                )}
                                </tr>
                            )
                        })}
                        </thead>
                        <tbody>
                        {this.state.data.map(function(item, key) {
                            return (
                                <tr key = {key} className = "table-info">
                                {Object.keys(item).map(key => 
                                    <td value={key}>{item[key]}</td>
                                )}
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
export default ShowData;