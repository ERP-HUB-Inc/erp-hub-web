import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Col,
} from "reactstrap";

export class BreadcrumbLayout extends Component {
  render(){
    const {
      pageNow,
      urlNow
    } = this.props;
    return(
      <Col md="12" sm="12" xs="12">
        <div className="breadcrumb">
          <a href="#"><i className="fa fa-home"></i></a>
          <a href="#"><i className="fa fa-angle-right"></i></a>
          { this.props.children } 
        </div>
      </Col>
    );
  }
}

export class Breadcrumb extends Component {
  render(){
    const {
      nextPage,
      key,
      to
    } = this.props;
    return(
      <Link to={ "/"+ to } className="breadcrumb-link" key={ key }>  
        { nextPage } 
      </Link>
    );
  }
}
