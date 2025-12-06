
import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd"
import 'antd/dist/antd.css';
import '@themes/global.css';
// import App from "./app/modules/common/containers/App";
import App from "./layout/main-app";
// import App from "./pages/Onboarding";
// import App from "./pages/Onboarding/InvoicePape"
import configureStore from "./app/store/configureStore";
import Localization from "./app/localization";

let store = configureStore();
store = new Localization(store);

render(
  <Provider store={store}>
    <ConfigProvider getPrefixCls={() => {}}>
      <App />
    </ConfigProvider>
  </Provider>,
  document.getElementById("root")
);
