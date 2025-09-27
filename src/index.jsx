
import "babel-polyfill";
import React, { Suspense } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd"
import 'antd/dist/antd.css';
// import App from "./app/modules/common/containers/App";
import App from "./layout/MainApp";
// import App from "./pages/Onboarding";
// import App from "./pages/Onboarding/InvoicePape"
import configureStore from "./app/store/configureStore";
import Localization from "./app/localization";
import StreamTransactions from "./StreamTransactions";

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
