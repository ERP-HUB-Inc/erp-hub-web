import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { localeReducer as locale, } from "react-localize-redux";
import reducer from "../reducers";

const registerMiddleWare = [promise(), thunk];

if (process.env.REACT_APP_ENV === "DEV") {
  registerMiddleWare.push(createLogger());
}

// registerMiddleWare.push(createLogger());

const middleware = applyMiddleware(...registerMiddleWare);

const configureStore = () => createStore(combineReducers({ locale, reducer }), middleware);

export default configureStore;