
import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import {
  createStore,
  applyMiddleware,
  combineReducers
} from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import axios from "axios";
import thunk from "redux-thunk";
import App from "./app/modules/hr/components/App";
import rootReducer from "./app/modules/hr/reducers";
import promise from "redux-promise-middleware";
import ProductService from "./app/modules/pos/services/product";
import dotenv from "dotenv";

dotenv.config();
 
const initialState = {
  fetching: false,
  fetched: false,
  users: [],
  error: null
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case "LOGIN_PENDING": {
      return {
        ...state,
        fetching: true
      };
      break;
    }
    case "LOGIN_USERS_REJECTED": {
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
      break;
    }
    case "LOGIN_USERS_FULFILLED": {
      return {
        ...state, 
        fetching: false,
        fetched: true,
        users: action.payload
      };
      break;
    }
  }
  return state;
};

function fetchCredential(dispatch) {
  dispatch({ 
    type: "LOGIN_USERS",
    payload: ProductService.list()
  });
}

const middlewar = applyMiddleware(promise(), thunk, createLogger());
const store = createStore(combineReducers({ reducer }), middlewar);

store.dispatch(fetchCredential);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
