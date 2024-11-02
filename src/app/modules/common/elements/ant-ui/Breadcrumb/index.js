import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./index.css"; 

export function BreadcrumbLayout(props) {
  const { titleNow } = props;
  return <div>
      <h4 className="breadcrumb-title">{ titleNow }</h4>
      <div className="breadcrumb">
        <Link to={ "/" }>  
          <span className="icon-home"></span>
        </Link>
        <a href="dd"><i className="fa fa-angle-right"></i></a>
        { this.props.children } 
      </div>
    </div>;
}

export function BreadcrumbTitle(props) {
  const { title } = props;
  return <h4 className="breadcrumb-title">{ title }</h4>
}

export function Breadcrumb(props) {
  const {
    nextPage,
    key,
    to
  } = props;

  return(
    <Link to={ "/"+ to } className="breadcrumb-link" key={ key }>  
      { nextPage } 
    </Link>
  );
}

BreadcrumbLayout.propTypes = {
  titleNow: PropTypes.string
};

Breadcrumb.propTypes = {
  nextPage: PropTypes.string,
  to: PropTypes.string,
  key: PropTypes.bool
};

BreadcrumbTitle.propTypes = {
  title: PropTypes.string
};
