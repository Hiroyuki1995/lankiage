import React from 'react';
import moment from 'moment';
import {Button, Checkbox} from '@material-ui/core';

class Todoitems extends React.Component{
  // constructor(props){
  //   super(props);
  // }
  
  render() {
    const completedStyle = {
      fontSize : "italic",
      color: "#cdcdcd",
      textDecoration: "line-through"
    };
    let warning = "";
    const date = moment();
    const diff = date.diff(this.props.todo.deadline, 'days');
    // console.log(`${date} ${diff}`);
    if (diff === 0) {
      warning = "You have to do now!"
    }
    return(
      <div>
        <Checkbox
          type="checkbox"
          checked={this.props.todo.done}
          onChange={() => this.props.handleChange(this.props.todo.id)}
        />
        <label style={this.props.todo.done ? completedStyle : null}>{this.props.todo.todo}</label>
        <label>{warning}</label>
      </div>
    )
  }
}

export default Todoitems;
