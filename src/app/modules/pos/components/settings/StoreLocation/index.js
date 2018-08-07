import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/StoreLocation/FormCreate";
import FormUpdate from "../../../containers/settings/StoreLocation/FormUpdate";
import Constant from "../../../constants/settings/storeLocation";
import StoreLocationAction from "../../../action/settings/storeLocation";
import StoreLocationService from "../../../services/settings/StoreLocationService";

export default class StoreLocationList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.title = "Store Location";
    this.fetchingProp = "storeLocation";
    this.addingProp = "storeLocationAdd";
    this.updatingProp = "storeLocationUpdate";
    this.service = StoreLocationService;
    this.action = StoreLocationAction;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(StoreLocationAction.showForm());
    this.setState({
      modalConten: <FormCreate />
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(StoreLocationAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  render() {
    return super.render();
  }
}