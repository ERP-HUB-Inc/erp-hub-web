import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import SideBar from "../../../modules/common/components/layout/SideBar";
import Header from "../../../modules/common/components/layout/Header";
import Footer from "../../../modules/common/components/layout/Footer";
import UserList from "../../common/containers/user/UserList";
import Test from "../../common/containers/test";

class Router extends Component {
  render() {
    return (
      <div>
        <SideBar />
        <div className="content">
          <Header />
          <Switch>
            <Route path="/test" name="Home" component={ Test } />
            <Route path="/" name="Home" component={ UserList } />
          </Switch>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Router;

