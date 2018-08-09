import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/settings/StoreLocation/FormCreate";
import FormUpdate from "../../../containers/settings/StoreLocation/FormUpdate";
import StoreLocationAction from "../../../action/settings/storeLocation";
import StoreLocationService from "../../../services/settings/StoreLocationService";

export default class StoreLocationList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
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

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      this.columnNo,
      {
        title: "Name",
        dataIndex: "name",
        sorter: true
      },
      {
        title: "Code",
        dataIndex: "code",
        sorter: true
      },
      {
        title: "Address",
        dataIndex: "address",
        sorter: true
      },
      this.columnUpdatedAt,
      this.columnStatus
    ];
  }
}