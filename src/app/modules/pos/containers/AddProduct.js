import React, { Component } from "react";
import { connect } from "react-redux";
import { addProduct } from "../action";

// write as function
// const newProduct = ({dispatch}) => {
//     return (
//         <button onClick={() => {
//             dispatch(addProduct("Hello World"));
//         } }>
//             Add New
//         </button>
//     );
// };

// export default connect()(newProduct);

// write as a class
class Product extends Component {
    render() {
        return (
            <button onClick={() => {
                this.props.dispatch(addProduct("Hello World"));
            } }>
                Add New
            </button>
        );
    }
} 

export default connect()(Product);