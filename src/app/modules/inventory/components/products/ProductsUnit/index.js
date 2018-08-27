import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/products/ProductsUnit/FormCreate";
import FormUpdate from "../../../containers/products/ProductsUnit/FormUpdate";
import Constant from "../../../constants/products/productsUnit";
import ProductsUnitAction from "../../../actions/products/productsUnit";
import ProductsUnitService from "../../../services/products/productsUnit";
import "./index.css";

export default class Lists extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "productsUnit";
    this.addingProp = "productsUnitAdd";
    this.updatingProp = "productsUnitUpdate";
    this.columnFilterWithKey = ["name"];
    this.service = ProductsUnitService;
    this.action = ProductsUnitAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCTS_UNIT;
  }

  handleShowFormAdd() {
    const {dispatch} = this.props;
    dispatch(ProductsUnitAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const {dispatch} = this.props;
    dispatch(ProductsUnitAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  render() {
    return super.render();
  }

}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_products_unit_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_number_in_unit" />,
        dataIndex: "multiple",
        key: "multiple",
        sorter: true
      },
      this.columnStatus
    ];
  }
}