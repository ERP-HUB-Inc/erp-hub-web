
import { reducer as reduxFormReducers } from "redux-form";
import { combineReducers } from "redux";
import { localeReducer as locale, } from "react-localize-redux";
import user from "../modules/common/reducers/user";

const reducer = combineReducers({ 
  user,
  locale,
  form: reduxFormReducers
});

export default reducer;