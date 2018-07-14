import React, { Component } from "react";
import PropTypes from "prop-types";
import "./index.css"; 
import { Link } from "react-router-dom";

export class BreadcrumbLayout extends Component {
  render(){
    const {
      titleNow
    } = this.props;
    return(
      <div>
        <h4 className="breadcrumb-title">{ titleNow }</h4>
        <div className="breadcrumb">
          <Link to={ "/" }>  
            <span className="icon-home"></span>
          </Link>
          <a href="dd"><i className="fa fa-angle-right"></i></a>
          { this.props.children } 
        </div>
      </div>
    );
  }
}

export class BreadcrumbTitle extends Component {
  render(){
    const {
      title
    } = this.props;
    return(
      <h4 className="breadcrumb-title">{ title }</h4>
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

BreadcrumbLayout.propTypes = {
  titleNow: PropTypes.string
};

Breadcrumb.propTypes = {
  nextPage: PropTypes.string,
  to: PropTypes.string
};

BreadcrumbTitle.propTypes = {
  title: PropTypes.string
};
