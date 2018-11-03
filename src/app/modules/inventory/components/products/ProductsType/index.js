import React from "react";
import List from "../../List";
import Util from "../../../utils";
import FormCreate from "../../../containers/products/ProductsType/FormCreate";
import FormUpdate from "../../../containers/products/ProductsType/FormUpdate";
import Constant from "../../../constants/products/productsType";
import ProductTypeService from "../../../services/products/productsType";
import ProductTypeAction from "../../../actions/products/productsType";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "productsType";
    this.columnFilterWithKey = ["productTypeDescriptions"];
    this.service = ProductTypeService;
    this.action = ProductTypeAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCTS_TYPE;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(ProductTypeAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const {dispatch} = this.props;
    dispatch(ProductTypeAction.requestAndShowForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  componentWillUpdate(nextProps) {
    const {productsTypeAdd, productsTypeUpdate} = nextProps;
    if (productsTypeAdd.added || productsTypeUpdate.updated) {
      const {dispatch} = this.props;
      dispatch(ProductTypeAction.reset());
      dispatch(ProductTypeAction.reset(Constant.RESET_DETAIL_PRODUCTS_TYPE));
      dispatch(ProductTypeAction.fetch(this.pageSize));
    }
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
        title: <this.Translate id="text_name" />,
        dataIndex: "productTypeDescriptions",
        key: "name",
        sorter: true,
        render: productTypeDescriptions => Util.getProductTypeDescription(productTypeDescriptions)
      },
      {
        title: <this.Translate id="text_description" />,
        dataIndex: "productTypeDescriptions",
        key: "description",
        sorter: true,
        render: productTypeDescriptions => Util.getProductTypeDescription(productTypeDescriptions, "description")
      },
      this.columnStatus
    ];
  }
}