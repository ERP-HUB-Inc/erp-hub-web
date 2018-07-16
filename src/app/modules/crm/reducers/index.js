import { combineReducers } from "redux";

function employees(state = [{ id: 101, name: "Morn Sophanna", position: "Developer" }], action) {
  switch(action.type) {
  case "ADD_EMPLOYEE":
    return [
		        ...state,
		        {
		            employee: action.employee
		        }
		    ];
    break;
  default:
    return state;
  }
}

export default employees;