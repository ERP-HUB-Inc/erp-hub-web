// import { reducer as reduxFormReducer } from "redux-form";
import { reducer as reduxFormReducers } from "redux-form/immutable";
import { combineReducers } from "redux-immutablejs";
import user from "../modules/common/reducers/user";

const reducer = combineReducers({ 
  user,
  // form: reduxFormReducer,
  form: reduxFormReducers
});

export default reducer;