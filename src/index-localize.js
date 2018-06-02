import * as React from "react";
import { render } from "react-dom";
import {
  createStore,
  combineReducers,
  applyMiddleware
} from "redux";
import {
  Translate,
  setActiveLanguage
} from "react-localize-redux";
import { localeReducer as locale, } from "react-localize-redux";
import { Provider } from "react-redux";
import App from "./app/modules/hr/components/App";
import {
  initLanguage,
  setTranslation
} from "./app/modules/common/actions/language";
import configureStore from "./app/store/configureStore";
import { fetchUsers } from "./app/modules/common/actions/users";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import reducer from "./app/reducers";

const middlewar = applyMiddleware(promise(), thunk, createLogger());

const store = createStore(combineReducers({ locale, reducer }), middlewar);

store.dispatch(initLanguage());

store.dispatch(setTranslation());

store.dispatch(setActiveLanguage("en"));

store.dispatch(fetchUsers);

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