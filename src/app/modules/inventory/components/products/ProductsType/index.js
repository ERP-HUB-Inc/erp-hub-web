import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/products/ProductsType/FormCreate";
import FormUpdate from "../../../containers/products/ProductsType/FormUpdate";
import Constant from "../../../constants/products/productsType";
import productTypeService from "../../../actions/products/productsType";
import ProductsUnitService from "../../../services/products/productsType";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "productsType";
    this.addingProp = "productsTypeAdd";
    this.updatingProp = "productsTypeUpdate";
    this.columnFilterWithKey = ["productTypeDescriptions"];
    this.service = ProductsUnitService;
    this.action = productTypeService;
    this.RESET_CONSTANT = Constant.RESET_PRODUCTS_TYPE;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(productTypeService.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(productTypeService.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  // componentWillReceiveProps(){
  //   const { dispatch } = this.props;
  //   dispatch(ProductsTypeAction.fetch());
  // }
  
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
        render: (productTypeDescriptions) => productTypeDescriptions.map((result) => result.description  )
      },
      this.columnStatus
    ];
  }
}