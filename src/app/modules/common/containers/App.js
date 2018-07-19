import React, { Component } from "react";
import Router from "../../common/router";
import { BrowserRouter,Route, Switch } from "react-router-dom";

export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter> 
          <Switch>
            <Route path="/login" name="Create" component=""></Route>
            <Router />
          </Switch>
        </BrowserRouter> 
      </div>
    );
  }
}
