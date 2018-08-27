import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/products/Brand/FormCreate";
import FormUpdate from "../../../containers/products/Brand/FormUpdate";
import Constant from "../../../constants/products/brand";
import BrandAction from "../../../actions/products/brand";
import ProductsUnitService from "../../../services/products/brand";
import "./index.css";

export default class Lists extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "brand";
    this.addingProp = "brandAdd";
    this.updatingProp = "brandUpdate";
    this.service = ProductsUnitService;
    this.columnFilterWithKey = ["name"];
    this.action = BrandAction;
    this.RESET_CONSTANT = Constant.RESET_BRAND;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(BrandAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(BrandAction.showForm(rowData));
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
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_brand_description" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      this.columnStatus
    ];
  }
}