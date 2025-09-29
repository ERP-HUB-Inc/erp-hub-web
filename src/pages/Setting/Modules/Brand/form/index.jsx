import React from "react";
import BrandService from "@services/BrandService";
import DataTable from "@layout/datatable";
import { Translate } from "@redux/index";
import FormCreate from "../form.create";
import FormUpdate from "../form.update";
import Constant from "../redux/constant";
import BrandAction from "../redux/action";

export default class Lists extends DataTable {
  constructor(props) {
    super(props);
    this.module = "brands";
    this.title = <Translate id="text_brands" />;
    this.placeholder = "Search brands...";
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name"
      }
    ].concat([this.renderActionColumn()]);;
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.service = BrandService;
    this.action = BrandAction;
    this.columnFilterWithKey = ["name"];
    this.RESET_CONSTANT = Constant.RESET_BRAND;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added || nextProps.update.updated) {
      this.props.dispatch(BrandAction.reset());
      this.props.dispatch(BrandAction.reset(Constant.RESET_BRAND));
      this.fetchData();
    }
  }
}
