
import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import App from "./app/modules/common/containers/UserList";
import configureStore from "./app/store/configureStore";
 
const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
