import React from "react";
import PrivateRoute from "../router/privateRouter";
import history from "../router/history";
import Application from "../../common/router";
import ClientLogin from "./client/signin";
import loginStore from "./client/loginStore";
import ClientRegister from "./client/register";
import ClientRegisterDetail from "./client/registerDetail";
import ClientRegisterComplete from "./client/registerComplete";
import { BrowserRouter, Route, Router, Switch } from "react-router-dom";
import CRUD from "../../../crud";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    history.listen((location, action) => {
    });
  }
  render() {
    return (
      <div>
        <BrowserRouter> 
          <Switch>
            <Router history={history}>
              <div>
                <Route path="/crud" component={CRUD} />
                <Route path="/signin" component={ClientLogin} />
                <Route path="/signin-store" component={loginStore}></Route>
                <Route path="/register" component={ClientRegister}></Route>
                <Route path="/register-detail" component={ClientRegisterDetail}></Route>
                <Route path="/signin-complete" component={ClientRegisterComplete}></Route>
                <PrivateRoute path="/" component={Application} loginComponent={ClientLogin}/>
              </div>
            </Router>
          </Switch>
        </BrowserRouter> 
      </div>
    );
  }
}
