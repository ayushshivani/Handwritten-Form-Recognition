import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MarkTemp.css';
import { } from './Move';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from './axios-object';

const styles = theme => ({
  button: {
      margin: theme.spacing.unit,
    },
    leftIcon: {
      marginRight: theme.spacing.unit,
    },
    rightIcon: {
      marginLeft: theme.spacing.unit,
    },
    iconSmall: {
      fontSize: 20,
    },
});

class MarkTemp extends Component {
  constructor() {
    super();
    this.state = {
      idCount : 0,
      data : {},
      image : null
    }
  }

  render() {
    const { classes } = this.props;  
    return (
      <div className = "wrapper" id = "wrap">
      <CssBaseline/>

        <div id = "imagePanel">
          <input
            accept="image/*"
            className={classes.input}
            style={{ display: 'none' }}
            id="file"
            multiple
            type="file"
            onChange = {this.loadFile}
          />
          <label htmlFor="file" id = "link">
          <Button variant="contained" color="default" component="span" className={classes.button}>
            Upload Form
            <CloudUploadIcon className={classes.rightIcon} />
          </Button>

          </label>

          <div className = "template" id = "form">
            <img className = "img-fluid" id = "image" onClick = {this.addRectangle} alt = "" />
          </div>
        </div>

        <div id="layerPanel">
        <Typography variant="display1">Fields</Typography>
          <ul id = "templateFields">{Object.keys(this.state.data).map((key, index)=> {
            return (
              <div>
                <li>{this.state.data[key].fieldname}</li>
                <ul>
                <li>Type   :      {this.state.data[key].type}</li>
                <li>Description : {this.state.data[key].desc}</li>
                <li>Box Count :   {this.state.data[key].boxcount}</li>
                <li>Left   :      {this.state.data[key].left_x}</li>
                <li>Right  :      {this.state.data[key].right_x}</li>
                <li>Top    :      {this.state.data[key].top_y}</li>
                <li>Bottom :      {this.state.data[key].bottom_y}</li>
                </ul>
              </div>
            )
          })}
          </ul>
          <div id = "templateSubmit">
            <input type = "text" onChange = {this.addName} placeholder = "Template Name"/>
            <input type = "text" onChange = {this.addDesc} placeholder = "Template Description"/>
            <input type = "submit" value="Submit Template" onClick = {this.submitFormHandler}/>
          </div>
        </div>
      </div>
    );
  }

  addName = (event) => {
    var templateName = event.target.value
    Object.keys(this.state.data).forEach(item =>
    {
      let details = this.state.data[item]
      details["templateName"] = templateName
      details["username"] = localStorage.getItem("username")
      let y = {...this.state.data}
      y[item] = details
      this.setState({data : y})
    })
  }

  addDesc = (event) => {
    var templateDesc = event.target.value
    Object.keys(this.state.data).forEach(item =>
      {
        let details = this.state.data[item]
        details["templateDesc"] = templateDesc
        let y = {...this.state.data}
        y[item] = details
        this.setState({data : y})
      })
  }

  submitFormHandler = () => {
    var keys_list = Object.keys(this.state.data)
    console.log(this.state.data)
    if(keys_list.length === 0 || this.state.data[keys_list[0]]['templateName'] === null)
      return

    let image = new FormData();
    image.append('image',this.state.image);

    axios.post('/submit/', JSON.stringify(this.state.data))
    .then(response => {
      let data = response.data;
      axios.post('/submitimage/'+data.tid, image)
      .then(response => {
        alert("Template Submitted Successfully");
        window.location.reload();
      })
      .catch(_ => alert("Template Submission Failed"))
    })
    .catch(_ => alert("Template Submission Failed"))
  }

  loadFile = (event) => {
    var image = document.getElementById('image');
    image.src = URL.createObjectURL(event.target.files[0]);
    var link = document.getElementById('link');
    link.parentNode.removeChild(link);
    this.setState({image:event.target.files[0]});
  }

  //For Submission of Fields
  submitHandler = (id, fieldname, fielddesc, boxCount, span) => {
    if(fieldname === '')
      return

    let translate_left = span.getAttribute('data-x')
    let translate_down = span.getAttribute('data-y')
    if(translate_left == null)
      translate_left = 0;
    else
      translate_left = Number(translate_left)
    if(translate_down == null)
      translate_down = 0;
    else
      translate_down = Number(translate_down)
    
    let fieldDetails = {}
    let image = document.getElementById('image')
    let selOpt = document.getElementById('sel1' + id)
    fieldDetails['fieldname'] = fieldname
    fieldDetails['desc'] = fielddesc
    fieldDetails['boxcount'] = parseInt(boxCount)
    fieldDetails['type'] = selOpt.value
    fieldDetails['left_x'] = span.offsetLeft - image.offsetLeft + translate_left
    fieldDetails['right_x'] = span.offsetLeft + span.offsetWidth - image.offsetLeft + translate_left
    fieldDetails['top_y'] = span.offsetTop - image.offsetTop + translate_down
    fieldDetails['bottom_y'] = span.offsetTop + span.offsetHeight - image.offsetTop + translate_down
    fieldDetails['image_width'] = image.offsetWidth
    fieldDetails['image_height'] = image.offsetHeight
    let details = Object.assign({}, this.state.data)
    details[id] = fieldDetails
    this.setState({data : details})

    var templateSubmit = document.getElementById('templateSubmit')
    templateSubmit.style.display = 'block'

    var fname = document.getElementById(id+" fname");
    fname.style.display="none";
  }

  addRectangle = (event) => {
    const fixedId = this.state.idCount;

    var span = document.createElement('span');
    span.className = 'resize-drag border2';
    span.id = this.state.idCount+" box";
    span.style.top = String(event.pageY - 3) + "px";
    span.style.left = String(event.pageX - 3) + "px";
    document.getElementById('form').appendChild(span);

    var accept = document.createElement('button');
    accept.className = "accept";
    accept.id = this.state.idCount;
    accept.addEventListener('click', () => { this.fixSpan(accept.id); }, false);
    document.getElementById(span.id).appendChild(accept);

    var reject = document.createElement('button');
    reject.className = "reject";
    reject.addEventListener('click', () => { this.removeRectangle(accept.id); }, false);
    document.getElementById(span.id).appendChild(reject);

    var fname = document.createElement('div');
    fname.className = 'fieldName';
    fname.id = this.state.idCount+" fname";
    fname.style.display="none";

    var finput = document.createElement('input');
    finput.type = "text";
    finput.setAttribute('placeholder', 'Field Name')

    var fdesc = document.createElement('input')
    fdesc.type = "text";
    fdesc.setAttribute('placeholder', 'Field Description')

    var type = document.createElement('div');
    var sel = document.createElement('select')
    var opt1 = document.createElement('option')
    var opt2 = document.createElement('option')
    var opt3 = document.createElement('option')

    type.className = 'form-group';
    sel.className = 'form-control';
    sel.id = 'sel1' + this.state.idCount;
    opt1.innerHTML = 'Text';
    opt2.innerHTML = 'Checkbox';
    opt3.innerHTML = 'Signature';

    sel.appendChild(opt1)
    sel.appendChild(opt2)
    sel.appendChild(opt3)
    type.appendChild(sel)

    var boxCount = document.createElement('input');
    boxCount.type = "number";
    // boxCount.setAttribute('placeholder', '1')
    boxCount.setAttribute('value', '1')

    var fsubmit = document.createElement('input');
    fsubmit.addEventListener('click', () => { this.submitHandler(fixedId, finput.value, fdesc.value, boxCount.value, span) ;}, false);
    fsubmit.type = "submit";
    fsubmit.value = "Submit";

    fname.appendChild(finput);
    fname.appendChild(fdesc);
    fname.appendChild(type);
    fname.appendChild(boxCount);
    fname.appendChild(fsubmit);
    span.appendChild(fname);

    let z = this.state.idCount
    this.setState({idCount : z + 1});
  }

  fixSpan = (Boxid) => {
    var span = document.getElementById(Boxid+" box");
    span.style.top = span.offsetTop + "px"
    span.style.left = span.offsetLeft + "px"
    span.className = 'border2';

    var accept = document.getElementById(Boxid);
    accept.style.backgroundColor = "Orange";
    accept.addEventListener('click', () => { this.resizeAgain(accept.id); }, false);

    var fname = document.getElementById(Boxid+" fname");
    fname.style.display="block";

    // let count = 0;
    // var form = document.getElementById("form");
    // form.addEventListener('keydown', function(event) {
    //   const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    //   if(key == "ArrowUp")
    //     count+=1;
    //   else if(key == "ArrowDown")
    //     count-=1;
    //   console.log("For Boxid "+Boxid+" count is "+count);
    // });
  }

  resizeAgain = (Boxid) => {
    var span = document.getElementById(Boxid+" box");
    span.className = 'resize-drag border2'

    var fname = document.getElementById(Boxid+" fname");
    fname.style.display="none";

    var accept = document.getElementById(Boxid);
    accept.style.backgroundColor = "Greenyellow";
    accept.addEventListener('click', () => { this.fixSpan(accept.id); }, false);
  }

  removeRectangle = (Boxid) => {
    var span = document.getElementById(Boxid+" box");
    var id = parseInt(span.id[0], 10)
    delete this.state.data[id]
    span.parentNode.removeChild(span)
  }
}

MarkTemp.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MarkTemp);