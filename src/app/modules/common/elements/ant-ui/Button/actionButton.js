import React, { Component } from "react";
import {  
  FormGroup,
} from "reactstrap";
import { Button } from "antd";

export class ActionButton extends Component {
  render(){
    const { 
      icon,
      color,
      classname
    } = this.props;
    
    var stylecolor = {
      background: color
    };

    return(
      <div className="main-search-button">
        <FormGroup> 
          <Button htmlType="submit" icon={ icon } 
            style={ stylecolor } 
            className={ classname }  
          />
        </FormGroup>
      </div>
    );
  }
}