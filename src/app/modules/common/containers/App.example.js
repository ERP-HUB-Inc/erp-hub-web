import React from "react";
import Loadable from "react-loadable";
import { LocaleProvider } from "antd";
import {
  BrowserRouter,
  Route,
  Router,
  Switch
} from "react-router-dom";
import km_KM from "antd/lib/locale-provider/km_KM";
import en_US from "antd/lib/locale-provider/en_US";
import history from "../router/history";
import StartUp from "../components/StartUp";
import ErrorBoundary from "../components/ErrorHandle";
import { Util } from "../../common/util";

export default class App extends React.Component {

  componentDidMount() {
    const channel = window.Ably.channels.get("ca.setting.paymentmethod");

    channel.subscribe("update", function(message) {
      // alert("Something update");
    });
  }

  getCurrentLocaleContext() {
    const currentSetting = (new Util()).getSetting();
    let languageCode = "en";
    if (currentSetting) {
      languageCode = currentSetting.defaultLanguageCode;
    }
    
    if (languageCode === "en") {
      return en_US;
    } else if (languageCode === "km") {
      return km_KM;
    } else {
      return en_US;
    }
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
      <LocaleProvider locale={this.getCurrentLocaleContext()}>
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
      </LocaleProvider>
    );
  }
}
