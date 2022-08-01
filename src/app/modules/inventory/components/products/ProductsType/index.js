import React from "react";
import Enum from "../../../enums";
import FormCreate from "../../../containers/products/ProductsType/FormCreate";
import FormUpdate from "../../../containers/products/ProductsType/FormUpdate";
import Constant from "../../../constants/products/productsType";
import ProductTypeService from "../../../services/products/ProductsTypeService";
import ProductTypeAction from "../../../actions/products/productsType";
import DataTable from "../../../../common/components/shares/List/DataTable";

export default class ProductTypeList extends DataTable {
  constructor(props) {
    super(props);
    this.module = "products";
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name"
      }
    ];
    this.formCreate = <FormCreate />;
    this.formUpdate = <FormUpdate />;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.localStorageKey = Enum.LOCAL_SCHEMA.PRODUCT_TYPE;
    this.service = ProductTypeService;
    this.action = ProductTypeAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCTS_TYPE;
  }

  showFormEdit(rowData) {
    this.props.dispatch(ProductTypeAction.requestAndShowForm(rowData));
    this.setState({
      modalContent: <FormUpdate/>
    });
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added || nextProps.update.updated) {
      this.props.dispatch(ProductTypeAction.reset());
      this.props.dispatch(ProductTypeAction.reset(Constant.RESET_DETAIL_PRODUCTS_TYPE));
      this.fetchData();
    }
  }
}