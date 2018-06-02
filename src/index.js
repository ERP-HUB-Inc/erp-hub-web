
import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import App from "./app/modules/common/containers/App";
import configureStore from "./app/store/configureStore";
import Localization from "./app/localization";
 
let store = configureStore();
store = new Localization(store);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
