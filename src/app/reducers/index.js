import { reducer as reduxFormReducer } from "redux-form";
import { combineReducers } from "redux";
import user from "../modules/common/reducers/user";

const reducer = combineReducers({ 
  user,
  form: reduxFormReducer 
});

export default reducer;