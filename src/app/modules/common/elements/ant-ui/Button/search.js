import React, { Component } from "react";
import {  
  FormGroup,
} from "reactstrap";
import { Button } from "antd";

export class SearchButton extends Component {
  render(){
    return(
      <div className="main-search-button">
        <FormGroup>
          <Button icon="search" />
        </FormGroup>
      </div>
    );
  }
}