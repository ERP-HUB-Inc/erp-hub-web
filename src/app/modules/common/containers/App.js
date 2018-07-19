import React, { Component } from "react";
import Router from "../../common/router";
import { Route, Switch } from "react-router-dom";
import UserList from "../../common/containers/user";
import { BrowserRouter } from "react-router-dom";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter> 
        {/* <Route exact path="/test-component" name="Create" component={ UserList }></Route> */}
        <Router />
      </BrowserRouter> 
    );
  }
}
