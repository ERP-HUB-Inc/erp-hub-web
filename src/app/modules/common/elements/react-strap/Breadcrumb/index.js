import React, { Component } from "react";
import { Link } from "react-router-dom";

export class BreadcrumbLayout extends Component {
  render(){
    const {
      titleNow,
      pageNow
    } = this.props;
    return(
      <div>
        <h4 className="breadcrumb-title">{ titleNow }</h4>
        <div className="breadcrumb">
          <a href="/"><i className="fa fa-home"></i></a>
          <a href="dd"><i className="fa fa-angle-right"></i></a>
          { this.props.children } 
        </div>
      </div>
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
