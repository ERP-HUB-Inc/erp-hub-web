import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/products/Product/FormCreate";
import FormUpdate from "../../../containers/products/Product/FormUpdate";
import Constant from "../../../constants/products/product";
import ProductAction from "../../../actions/products/product";
import ProductService from "../../../services/products/ProductService";
import "./index.css";

export default class ProductList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "products";
    this.addingProp = "productAdd";
    this.updatingProp = "productUpdate";
    this.service = ProductService;
    this.columnFilterWithKey = ["name"];
    this.listScroll = {x: 1300};
    this.action = ProductAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCT;
  }

  handleShowFormAdd() {
    const {dispatch} = this.props;
    dispatch(ProductAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const {dispatch} = this.props;
    dispatch(ProductAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_products_brand_name" />,
        dataIndex: "name",
        key: "name1",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_name" />,
        dataIndex: "name",
        key: "name2",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_tag" />,
        dataIndex: "name",
        key: "name30",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_type" />,
        dataIndex: "name",
        key: "name33",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_brand" />,
        dataIndex: "name",
        key: "name4",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_supplier" />,
        dataIndex: "name",
        key: "name5",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_price" />,
        dataIndex: "name",
        key: "name6",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_quantity" />,
        dataIndex: "name",
        key: "name7",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_unit" />,
        dataIndex: "name",
        key: "name8",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_types" />,
        dataIndex: "name",
        key: "name9",
        sorter: true
      },
      this.columnStatus
    ];
  }
}