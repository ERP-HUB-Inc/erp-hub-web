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
      },
      {
        title: <this.Translate id="text_parent_category" />,
        dataIndex: "parentId",
        key: "parentId",
        render: (parentId, record) => record.parent && record.parent.name
      },
      {
        title: <this.Translate id="text_feature_category" />,
        dataIndex: "isFeature",
        key: "isFeature",
        render: (isFeature) => {
          const isFeatureObj = {
            title: "close",
            color: "#bfbfbf"
          };

          if (isFeature) {
            isFeatureObj.title = "check";
            isFeatureObj.color = "#87d068";
          }

          return <this.Tag style={{width: 90, textAlign: "center"}} color={isFeatureObj.color}><this.Icon type={isFeatureObj.title} /></this.Tag>;
        }
      }
    ];
    this.formCreate = <FormCreate />;
    this.formUpdate = <FormUpdate />;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.localStorageKey = Enum.LOCAL_SCHEMA.PRODUCT_TYPE;
    this.service = ProductTypeService;
    this.action = ProductTypeAction;
    this.RESET_CONSTANT = Constant.RESET_CATEGORY;
    this.handleShowFormEdit = this.showFormEdit.bind(this);
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
      this.props.dispatch(ProductTypeAction.reset(Constant.RESET_DETAIL_CATEGORY));
      this.fetchData();
    }
  }
}