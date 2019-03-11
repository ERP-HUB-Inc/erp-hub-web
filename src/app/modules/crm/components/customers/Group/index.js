import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/customers/Group/FormCreate";
import FormUpdate from "../../../containers/customers/Group/FormUpdate";
import Constant from "../../../constants/customers/group";
import GroupCutomerAction from "../../../actions/customers/group";
import CutomerService from "../../../services/customers/GroupService";

export default class GroupCustomerList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.generalSearchLabel = "text_name";
    this.placeHolderForGeneralSearch = "text_name";
    this.callBackOnShowEditForm = this.showFormEdit;
    this.service = CutomerService;
    this.action = GroupCutomerAction;
    this.columnFilterWithKey = ["name"];
    this.RESET_CONSTANT = Constant.RESET_MANAGEMENT_GROUP_CUSTOMERS;
  }

  showFormEdit(rowData) {
    this.props.dispatch(GroupCutomerAction.showForm(rowData));
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
      {
        title:<this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name"
      },
      this.columnStatus
    ];
  }
}


