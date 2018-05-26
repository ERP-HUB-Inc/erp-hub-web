import * as React from "react";
import { render } from "react-dom";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import {
  Translate,
  localeReducer as locale,
  setActiveLanguage
} from "react-localize-redux";
import {
  createStore,
  combineReducers,
  applyMiddleware
} from "redux";
import { Provider } from "react-redux";
import App from "./app/modules/hr/components/App";
import employees from "./app/modules/hr/reducers";
import promise from "redux-promise-middleware";
import {
  initLanguage,
  setTranslation
} from "./app/modules/common/actions/language";

const middlewar = applyMiddleware(promise(), thunk, createLogger());

const store = createStore(combineReducers({
  locale,
  employees
}),
middlewar);

store.dispatch(initLanguage());

store.dispatch(setTranslation());

store.dispatch(setActiveLanguage("en"));

const Application = () => (
  <Provider store={store}>
    <div>
      <App />
      <h2>Start editing to see some magic happen {"\u2728"}</h2>
      <Translate id="text_login" />
      <Translate id="text_contact_us" />
    </div>
  </Provider>
);

render(<Application />, document.getElementById("root"));