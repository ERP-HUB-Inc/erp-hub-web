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
  const domainInfo = (new Util()).getDomainInfo();
  return domainInfo.subStr === Authentication.SECURE_SUBDOMAIN
    ? <Redirect to="/signin/store" /> : <Redirect to="/signin" />;
}

export default PrivateRoute;