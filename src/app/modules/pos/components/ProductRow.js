import React, { Component } from "react";
import PropTypes from "prop-types";

// write as function
// const ProductRow = ({ name, onClick }) => (
//     <li
//         onClick={onClick}
//     >
//         {name}
//     </li>
// );

// ProductRow.propTypes = {
//     name: PropTypes.string.isRequired,
//     onClick: PropTypes.func.isRequired
// };

// export default ProductRow;

// write as a class
export default class ProductRow extends Component {
    render() {
        return (
            <li
                onClick={this.props.onClick}
            >
                {this.props.name}
            </li>
        );
    }
}

ProductRow.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};