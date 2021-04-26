import React from "react";
import List from "../../List";
import Enum from "../../../enums";
import Util from "../../../utils";
import FormCreate from "../../../containers/products/ProductsType/FormCreate";
import FormUpdate from "../../../containers/products/ProductsType/FormUpdate";
import Constant from "../../../constants/products/productsType";
import ProductTypeService from "../../../services/products/ProductsTypeService";
import ProductTypeAction from "../../../actions/products/productsType";

export default class ProductTypeList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.columnFilterWithKey = ["productTypeDescriptions"];
    this.localStorageKey = Enum.LOCAL_SCHEMA.PRODUCT_TYPE;
    this.service = ProductTypeService;
    this.action = ProductTypeAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCTS_TYPE;
  }

  showFormEdit(rowData) {
    this.props.dispatch(ProductTypeAction.requestAndShowForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added || nextProps.update.updated) {
      this.props.dispatch(ProductTypeAction.reset());
      this.props.dispatch(ProductTypeAction.reset(Constant.RESET_DETAIL_PRODUCTS_TYPE));
      this.props.dispatch(ProductTypeAction.fetch(this.pageSize));
    }
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true,
        render: (name, record) => Util.getProductTypeName(record)
      },
      this.columnStatus
    ];
  }
}