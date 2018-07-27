import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/StoreLocation/FormCreate";
import FormUpdate from "../../../containers/settings/StoreLocation/FormUpdate";
import StoreLocationAction from "../../../action/settings/storeLocation";

export default class StoreLocationList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.title = "Store Location";
    this.fetchingProp = "storeLocation";
    this.addingProp = "storeLocationAdd";
    this.updatingProp = "storeLocationUpdate";
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(StoreLocationAction.fetch(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;
    super.onChange(pagination, filters, sorter);
    dispatch(StoreLocationAction.fetch(...this.filter));
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

  handleAdd() {
    super.handleAdd();
  }

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(StoreLocationAction.archive(this.state.selectedListIds));

    this.Message.info(this.messageSuccess);

    dispatch(StoreLocationAction.fetch(this.pageSize, this.state.current));

    this.setState({selectedRowKeys: []});
  }

  render() {
    return super.render();
  }
}