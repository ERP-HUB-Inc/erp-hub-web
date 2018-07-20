import React from "react";
import Router from "../../common/router";
import ClientLogin from "./client";
import { BrowserRouter, Route, Switch } from "react-router-dom";

export default class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter> 
          <Switch>
            <Route path="/signin" component={ClientLogin}></Route>
            <Router />
          </Switch>
        </BrowserRouter> 
      </div>
    );
  }
}
