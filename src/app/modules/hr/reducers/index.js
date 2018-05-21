import { combineReducers } from "redux";

function employees(state = [{ id: 101, name: "Morn Sophanna", position: "Developer" }], action) {
    return [
        ...state,
        {
            employee: action.employee
        }
    ];
}

export default combineReducers({ employees });