import { combineReducers } from "redux";
import user from "../modules/common/reducers/user";

const reducer = combineReducers({ user });

export default reducer;