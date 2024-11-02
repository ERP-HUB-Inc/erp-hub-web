import React from "react";
import FormCreate from "../../../containers/products/Brand/FormCreate";
import FormUpdate from "../../../containers/products/Brand/FormUpdate";
import Constant from "../../../constants/products/brand";
import BrandAction from "../../../actions/products/brand";
import BrandService from "../../../services/products/BrandService";
import DataTable from "../../../../common/components/shares/List/DataTable";

export default class Lists extends DataTable {
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
