import React from "react";
import {Route, Redirect} from "react-router-dom";
import Authentication from "../constants/authentication";
import {Util} from "../util";
const PrivateRoute = ({component: AdminComponent, ...rest }) => (
  <Route {...rest} render={props => (
    localStorage.getItem(Authentication.ACCESS_TOKEN)
      ? <AdminComponent {...props} />
      : renderPageAuth()
  )} />
);

function renderPageAuth () {
  const no_restrict_route = [
    "/register"
  ];

  const domainInfo = (new Util()).getDomainInfo();

  const isAccessSecureSubDomain = domainInfo.subStr === Authentication.SECURE_SUBDOMAIN;

  if (isAccessSecureSubDomain) {
    if (no_restrict_route.find(value => value === window.location.pathname)) {
      return <Redirect to="/register" />;
    }
  }

  return isAccessSecureSubDomain
    ? <Redirect to="/store" /> : <Redirect to="/signin" />;
}

export default PrivateRoute;