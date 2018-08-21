import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/products/ProductsType/FormCreate";
import FormUpdate from "../../../containers/products/ProductsType/FormUpdate";
import Constant from "../../../constants/products/productsType";
import BrandAction from "../../../actions/products/productsType";
import ProductsUnitService from "../../../services/products/productsType";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "productsType";
    this.addingProp = "productsTypeAdd";
    this.updatingProp = "productsTypeUpdate";
    this.service = ProductsUnitService;
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
        title: <this.Translate id="col_products_products_type_name" />,
        dataIndex: "productTypeDescriptions",
        key: "productTypeDescriptions",
        sorter: true,
        render: (productTypeDescriptions) => productTypeDescriptions.map((result) => result.name )
      },
      {
        title: <this.Translate id="col_products_products_type_description" />,
        dataIndex: "productTypeDescriptions",
        key: "description",
        sorter: true,
        render: (productTypeDescriptions) => productTypeDescriptions.map((result) => result.description )
      },
      this.columnStatus
    ];
  }
}