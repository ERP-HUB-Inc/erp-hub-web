import React, { Component } from "react";
import ProductList from "../containers/ProductList";
import AddProduct from "../containers/AddProduct";

export default class App extends Component {
    render() {
        return (
            <div>
                <AddProduct/>
                <ProductList />
            </div>
        );
    }
}