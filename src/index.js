// import React from "react";
// import ReactDOM from "react-dom";
// import { Provider } from "react-redux";
// import "./index.css";
// import App from "./App";

// ReactDOM.render(<App />, document.getElementById("root"));

import React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import App from "./app/modules/hr/components/App";
import rootReducer from "./app/modules/hr/reducers";

const store = createStore(rootReducer);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
