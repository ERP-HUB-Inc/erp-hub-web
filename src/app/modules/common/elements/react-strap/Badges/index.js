import React, { Component } from "react";
import { Badge } from "reactstrap";

export class Badges extends Component {
  render(){
    const { title } = this.props;
    return(
      <Badge>
        { title }
      </Badge>
    );
  }
}