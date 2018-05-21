import React, { Component } from "react";
import ProductRow from "./ProductRow";
import PropTypes from "prop-types";

// Write as the class
export default class ProductList extends Component {
    render() {
        return (
            <div>
                <ul>
                    {
                        this.props.products.map((product, index) => (
                            <ProductRow key={index}  {...product} onClick={() => this.props.todoOnClick(product.name)} />
                        ))
                    }
                </ul>
            </div>
        );
    }
}

ProductList.propTypes = {
    products: PropTypes.array.isRequired,
    todoOnClick: PropTypes.func.isRequired
};

// Write as a function

// const ProductList = ({products, todoOnClick}) => (
//     <div>
//         <ul>
//             {
//                 products.map((product, index) => (
//                     <ProductRow key={index}  {...product} onClick={() => todoOnClick(product.name)} />
//                 ))
//             }
//         </ul>
//     </div>
// );


// ProductList.propTypes = {
//     products: PropTypes.array.isRequired,
//     todoOnClick: PropTypes.func.isRequired
// };

// export default ProductList;
