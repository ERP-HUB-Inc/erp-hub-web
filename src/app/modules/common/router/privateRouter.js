/*import React from "react";
import { Route } from "react-router-dom";
const PrivateRoute = ({component: AdminComponent, loginComponent: LoginComponent, ...rest }) => (
  
  <Route {...rest} render={props => (
    localStorage.getItem("accessToken")
      ? <AdminComponent {...props} />
      : <LoginComponent {...props} />
  )} />
);
IF WANT TO REDIRECT
export default PrivateRoute;
*/

import React from "react";
import { Route, Redirect } from "react-router-dom";
const PrivateRoute = ({component: AdminComponent, ...rest }) => (
  
  <Route {...rest} render={props => (
    localStorage.getItem("accessToken")
      ? <AdminComponent {...props} />
      : <Redirect to="/signin" />
  )} />
);

export default PrivateRoute;