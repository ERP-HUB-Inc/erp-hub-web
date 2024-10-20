
import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import 'antd/dist/antd.css';
// import App from "./app/modules/common/containers/App";
import App from "./app/layout/MainApp";
import configureStore from "./app/store/configureStore";
import Localization from "./app/localization";
import dotenv from "dotenv";
require("./app/library/ably");

dotenv.config();
let store = configureStore();
store = new Localization(store);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
