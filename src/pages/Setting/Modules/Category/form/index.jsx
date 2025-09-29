import React from "react";
import Enum from "@enums/index";
import Datatable from "@layout/datatable";
import CategoryService from "@services/CategoryService";
import { Translate } from "@redux/index";
import FormCreate from "../form.create";
import FormUpdate from "../form.update";
import Constant from "../redux/constant";
import CategoryAction from "../redux/action";

export default class CategoryPage extends Datatable {
  constructor(props) {
    super(props);
    this.module = "products";
    this.title = <Translate id="text_categories" />;
    this.placeholder = "Search categories...";
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name"
      }
    ].concat([this.renderActionColumn()]);
    this.formCreate = <FormCreate />;
    this.formUpdate = <FormUpdate />;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.localStorageKey = Enum.LOCAL_SCHEMA.PRODUCT_TYPE;
    this.service = CategoryService;
    this.action = CategoryAction;
    this.RESET_CONSTANT = Constant.RESET_CATEGORY;
    this.handleShowFormEdit = this.showFormEdit.bind(this);
  }

  showFormEdit(rowData) {
    this.props.dispatch(CategoryAction.requestAndShowForm(rowData));
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added || nextProps.update.updated) {
      this.props.dispatch(CategoryAction.reset());
      this.props.dispatch(CategoryAction.reset(Constant.RESET_DETAIL_CATEGORY));
      this.props.dispatch(this.action.fetch(this.pageSize));
    }
  }
}