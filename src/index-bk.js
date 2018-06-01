import * as React from "react";
import { render } from "react-dom";
import {
  Translate,
  setActiveLanguage
} from "react-localize-redux";
import { Provider } from "react-redux";
import App from "./app/modules/hr/components/App";
import {
  initLanguage,
  setTranslation
} from "./app/modules/common/actions/language";
import configureStore from "./app/store/configureStore";
import requestUsers from "./app/modules/common/actions/user";

const store = configureStore;

store.dispatch(initLanguage());

store.dispatch(setTranslation());

store.dispatch(setActiveLanguage("en"));

store.dispatch(requestUsers);

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