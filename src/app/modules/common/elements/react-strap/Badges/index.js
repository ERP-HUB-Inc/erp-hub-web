import React, { Component } from "react";
import { Badge } from "reactstrap";

export class Badges extends Component {
  render(){
    const { title,className } = this.props;
    return(
      <Badge className="">
        { title }
      </Badge>
    );
  }
}