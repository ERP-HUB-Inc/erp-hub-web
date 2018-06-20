import React, { Component } from "react";
import Router from "../../pos/router/";
import { BrowserRouter } from "react-router-dom";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter> 
        <Router />
      </BrowserRouter> 
    );
  }
}
