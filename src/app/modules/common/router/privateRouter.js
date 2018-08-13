import React from "react";
import {Route, Redirect} from "react-router-dom";
import Authentication from "../constants/authentication";
const PrivateRoute = ({component: AdminComponent, ...rest }) => (
  <Route {...rest} render={props => (
    localStorage.getItem(Authentication.ACCESS_TOKEN)
      ? <AdminComponent {...props} />
      : <Redirect to="/signin/store" />
  )} />
);

export default PrivateRoute;