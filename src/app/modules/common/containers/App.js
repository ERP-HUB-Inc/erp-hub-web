import React from "react";
import Loadable from "react-loadable";
import {
  BrowserRouter,
  Route,
  Router,
  Switch
} from "react-router-dom";
import history from "../router/history";
import StartUp from "../components/StartUp";
import ErrorBoundary from "../components/ErrorHandle";


export default class App extends React.Component {

  componentDidMount() {
    const channel = window.Ably.channels.get("ca.setting.paymentmethod");

    channel.subscribe("update", function(message) {
      // alert("Something update");
    });
  }

  render() {
    const Application = Loadable({
      loader: () => import("../router"),
      loading: () => <StartUp />,
    });

    const PrivateRoute = Loadable({
      loader: () => import("../router/privateRouter"),
      loading: () => <StartUp />,
    });

    const UserLogin = Loadable({
      loader: () => import("./client/signin"),
      loading: () => <StartUp />,
    });

    const LoginStore = Loadable({
      loader: () => import("./client/loginStore"),
      loading: () => <StartUp />,
    });

    const RegisterDevice = Loadable({
      loader: () => import("./client/registerDevice"),
      loading: () => <StartUp />,
    });

    const ClientRegister = Loadable({
      loader: () => import("./client/register"),
      loading: () => <StartUp />,
    });

    const ClientRegisterDetail = Loadable({
      loader: () => import("./client/registerDetail"),
      loading: () => <StartUp />,
    });

    const ClientRegisterComplete = Loadable({
      loader: () => import("./client/registerComplete"),
      loading: () => <StartUp />,
    });

    return (
      <BrowserRouter>
        <ErrorBoundary>
          <Switch>
            <Router history={history}>
              <div style={{height: "100%"}}>
                <Route path="/signin" component={UserLogin} />
                <Route path="/store" component={LoginStore} />
                <Route path="/device" component={RegisterDevice} />
                <Route path="/register" component={ClientRegister} />
                <Route path="/register/detail" component={ClientRegisterDetail} />
                <Route path="/signin-complete" component={ClientRegisterComplete} />
                <PrivateRoute
                  path="/"
                  component={Application} loginComponent={UserLogin} />
              </div>
            </Router>
          </Switch>
        </ErrorBoundary>
      </BrowserRouter>
    );
  }
}
