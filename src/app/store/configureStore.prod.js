import {
  createStore,
  combineReducers,
  applyMiddleware
} from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { localeReducer as locale } from "react-localize-redux";
import reducer from "../reducers";
import dotenv from "dotenv";

dotenv.config();

const middlewar = applyMiddleware(promise(), thunk);

const configureStore = () => createStore(combineReducers({ locale, reducer }), middlewar);

export default configureStore;