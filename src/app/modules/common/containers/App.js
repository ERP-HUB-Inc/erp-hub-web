import React from "react";
import Router from "../../common/router";
import ClientLogin from "./client";
import loginStore from "./client/loginStore";
import ClientRegister from "./client/register";
import { BrowserRouter, Route, Switch } from "react-router-dom";

export default class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter> 
          <Switch>
            <Route path="/signin" component={ClientLogin}></Route>
            <Route path="/signin-store" component={loginStore}></Route>
            <Route path="/signin-register" component={ClientRegister}></Route>
            <Router />
          </Switch>
        </BrowserRouter> 
      </div>
    );
  }
}
