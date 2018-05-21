import { combineReducers } from "redux";

// write as function style 1
// const products = (state = [{name: "PHANNA"}, {name: "SOK SOPHA"}], action) => {
//     console.log("======== REDUCER LOADED ========", state);
//     return [
//         ...state,
//         {
//             name: action.name
//         } 
//     ];
// };

// write as function style 2
function products(state = [{name: "PHANNA"}, {name: "SOK SOPHA"}], action) {
        return [
            ...state,
            {
                name: action.name
            } 
        ];
}

export default combineReducers({
    products
});