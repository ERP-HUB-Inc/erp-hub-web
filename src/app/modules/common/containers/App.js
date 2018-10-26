import React from "react";
import Loadable from "react-loadable";
import {
  BrowserRouter,
  Route,
  Router,
  Switch
} from "react-router-dom";
import history from "../router/history";
import Application from "../router";
import StartUp from "../components/StartUp";
import ClientRegisterDetail from "./client/registerDetail";
import ClientRegisterComplete from "./client/registerComplete";

export default class App extends React.Component {
  render() {
    const PrivateRoute = Loadable({
      loader: () => import("../router/privateRouter"),
      loading: () => <StartUp />,
    });

    const ClientLogin = Loadable({
      loader: () => import("./client/signin"),
      loading: () => <StartUp />,
    });

    const LoginStore = Loadable({
      loader: () => import("./client/loginStore"),
      loading: () => <StartUp />,
    });

    const ClientRegister = Loadable({
      loader: () => import("./client/register"),
      loading: () => <StartUp />,
    });

    return (
      <BrowserRouter>
        <Switch>
          <Router history={history}>
            <div style={{height: "100%"}}>
              <Route path="/signin" component={ClientLogin} />
              <Route path="/signin/store" component={LoginStore} />
              <Route path="/register" component={ClientRegister} />
              <Route path="/register/detail" component={ClientRegisterDetail} />
              <Route path="/signin-complete" component={ClientRegisterComplete} />
              <PrivateRoute
                path="/"
                component={Application} loginComponent={ClientLogin} />
            </div>
          </Router>
        </Switch>
      </BrowserRouter>
    );
  }
}
