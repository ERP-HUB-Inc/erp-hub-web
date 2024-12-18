import {
  createStore,
  combineReducers,
  applyMiddleware
} from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import promise from "redux-promise-middleware";
import { localeReducer as locale, } from "react-localize-redux";
import reducer from "../reducers";

const middlewar = applyMiddleware(promise(), thunk, createLogger());

const configureStore = () => createStore(combineReducers({ locale, reducer }), middlewar);

export default configureStore;