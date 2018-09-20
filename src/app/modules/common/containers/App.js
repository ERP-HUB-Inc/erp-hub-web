import React from "react";
import {
  BrowserRouter,
  Route,
  Router,
  Switch
} from "react-router-dom";
import PrivateRoute from "../router/privateRouter";
import history from "../router/history";
import Application from "../router";
import ClientLogin from "./client/signin";
import loginStore from "./client/loginStore";
import ClientRegister from "./client/register";
import ClientRegisterDetail from "./client/registerDetail";
import ClientRegisterComplete from "./client/registerComplete";
// import ErrorHandler from "../components/ErrorHandle";

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Router history={history}>
            {/* <ErrorHandler> */}
            <div style={{height: "100%"}}>
              <Route path="/signin" component={ClientLogin} />
              <Route path="/signin/store" component={loginStore} />
              <Route path="/register" component={ClientRegister} />
              <Route path="/register/detail" component={ClientRegisterDetail} />
              <Route path="/signin-complete" component={ClientRegisterComplete} />
              <PrivateRoute path="/" component={Application} loginComponent={ClientLogin} />
            </div>
            {/* </ErrorHandler> */}
          </Router>
        </Switch>
      </BrowserRouter>
    );
  }
}
