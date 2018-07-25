import React from "react";
import Router from "../../common/router";
import ClientLogin from "./client";
import loginStore from "./client/loginStore";
import ClientRegister from "./client/register";
import ClientRegisterDetail from "./client/registerDetail";
import ClientRegisterComplete from "./client/registerComplete";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import CRUD from "../../../crud";

export default class App extends React.Component {
  render() {
    const isAuthenticated = false;
    return (
      <div>
        <BrowserRouter> 
          <Switch>
            <Route path="/crud" component={CRUD} />
            <Route path="/signin" component={ClientLogin} />
            <Route path="/signin-store" component={loginStore}></Route>
            <Route path="/signin-register" component={ClientRegister}></Route>
            <Route path="/signin-detail" component={ClientRegisterDetail}></Route>
            <Route path="/signin-complete" component={ClientRegisterComplete}></Route> 
            { 1 == 0  ? <Redirect to="/signin" /> : <Router /> }
          </Switch>
        </BrowserRouter> 
      </div>
    );
  }
}
