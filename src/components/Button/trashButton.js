import React, { Component } from "react";
import {  
  FormGroup,
} from "reactstrap";
import { Button } from "reactstrap";

export class TrashButton extends Component {
  render(){
    const { 
      icon
    } = this.props;
    return(
      <div className="main-trash">
        <FormGroup> 
          <Button type="button"><i className={ icon }></i></Button>
        </FormGroup>
      </div>
    );
  }
}

TrashButton.defaultProps = {
  icon: "fa fa-home"
};