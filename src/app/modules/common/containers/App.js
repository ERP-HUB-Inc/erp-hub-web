import React, { Component } from "react";
import Router from "../../pos/router/";
import { BrowserRouter } from "react-router-dom";
import "../components/layout/styles/Style.css";

export default class App extends Component {
    render() {
        return (
            <BrowserRouter> 
                <Router />
            </BrowserRouter> 
        );
    }
}
