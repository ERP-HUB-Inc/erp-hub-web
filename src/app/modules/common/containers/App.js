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
import PrintSummary from "../../pos/components/transactions/OpenSaleRegistration/PrintSummary";


export default class App extends React.Component {

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
        <Switch>
          <Router history={history}>
            <div style={{height: "100%"}}>
              <Route path="/print" component={PrintSummary} />
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
      </BrowserRouter>
    );
  }
}
