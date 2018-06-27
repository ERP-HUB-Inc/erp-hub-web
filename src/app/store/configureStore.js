// if (process.env.NODE_ENV === "production") {
//   	module.exports = require("./configureStore.prod");
// } else {
//   console.log("===========Load Store Development===========");
//   	module.exports = require("./configureStore.dev");
// }

import logger from "redux-logger";
import thunk from "redux-thunk";
import rootReducer from "../reducers/";
import { createStore, applyMiddleware } from "redux";

export default function configureStore(initialState) {
  const middlewares = [];
  if (process.env.NODE_ENV !== "production") {
    middlewares.push(logger);
  }
  middlewares.push(thunk);
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  );
  return store;
}