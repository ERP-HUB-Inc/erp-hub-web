import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/products/productsTag/FormCreate";
import FormUpdate from "../../../containers/products/productsTag/FormUpdate";
import Constant from "../../../constants/products/productsTag";
import ProductsTagAction from "../../../actions/products/productsTag";
import ProductsTagService from "../../../services/products/productsTag";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "productsTag";
    this.addingProp = "productsTagAdd";
    this.updatingProp = "productsTagUpdate";
    this.service = ProductsTagService;
    this.action = ProductsTagAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCTS_TAG;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(ProductsTagAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(ProductsTagAction.showForm(rowData));
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
        title: <this.Translate id="col_products_tag_name" />,
        dataIndex: "tag",
        key: "tag",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_tag_description" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      this.columnStatus
    ];
  }
}