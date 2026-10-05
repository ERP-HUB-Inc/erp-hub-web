import React from "react";
import {Route, Redirect} from "react-router-dom";
import Constant from "../constants/authentication";
import Util from "../util";
const PrivateRoute = ({component: AdminComponent, ...rest }) => (
  <Route {...rest} render={props => (
    localStorage.getItem(Constant.ACCESS_TOKEN)
      ? <AdminComponent {...props} />
      : renderPageAuth()
  )} />
);

function renderPageAuth () {
  const domainInfo = (new Util()).getDomainInfo();

  const isAccessSecureSubDomain = domainInfo.subStr === Constant.SECURE_SUBDOMAIN;

  if (isAccessSecureSubDomain) {
    if ("/register" === window.location.pathname) {
      return <Redirect to="/register" />;
    }
  }

  return isAccessSecureSubDomain
    ? <Redirect to="/store" /> : <Redirect to="/login" />;
}

export default PrivateRoute;