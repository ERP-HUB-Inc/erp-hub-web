import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/customers/ManageCustomers/FormCreate";
import FormUpdate from "../../../containers/customers/ManageCustomers/FormUpdate";
import Constant from "../../../constants/customers/managementCutomers";
import CutomerAction from "../../../actions/customers/manageCustomers";
import CutomerService from "../../../services/customers/manageCustomer";
import "./index.css";

export default class CustomerList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.title = "Manage Customer";
    this.ColumnExpend = new ColumnExpend(); 
    this.fetchingProp = "manageCustomers";
    this.addingProp = "manageCustomersAdd";
    this.updatingProp = "manageCustomersUpdate";
    this.service = CutomerService;
    this.action = CutomerAction;
    this.actionFetchColumnExpend = CutomerAction;
    this.RESET_CONSTANT = Constant.RESET_MANAGEMENT_CUSTOMERS;
  }

  expandedRender(record,indent){
    return( 
      <div className="sub-table">
        <this.Table 
          columns={ this.ColumnExpend } 
          pagination={ false }
          dataSource={ record.contacts }
          showHeader = { false }
          noDataContent="No Rows found"
        />
      </div>
    );
  }


  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(CutomerAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(CutomerAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  render() {
    return super.render();
  }

}



class ColumnExpend extends List {
  constructor(props) {
    super(props);
    return [
      {
        title: <this.Translate id="text_created_at" />,
        dataIndex: "createdAt",  
        key: "createdAt",
        width: 250,
        render: value => this.formatDate(value),
        sorter: true
      },
      {
        dataIndex: "name",
        key: "name",
        // colSpan:2
      },
      {
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        // colSpan:2
      },
      {
        dataIndex: "address",
        key: "address",
        // colSpan:2
      },
      {
        dataIndex: "",
        render: () => " " ,
        colSpan:5
      },
    ];
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_management_customer_name" />,
        dataIndex: "firstName",
        sorter: true,
        render: (text,row) => text + " " + row.lastName
      },
      {
        title: <this.Translate id="col_management_customer_phoneno" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true,
        render: (phoneNumber) => this.Util.formtTextError(phoneNumber)
      },
      {
        title: <this.Translate id="col_management_customer_group_address" />,
        dataIndex: "address",
        key: "address",
        sorter: true,
        render: (address) => this.Util.formtTextError(address)
      },
      {
        title: <this.Translate id="col_management_customer_email" />,
        dataIndex: "email",
        key: "email",
        sorter: true,
        render: (email) => this.Util.formtTextError(email)
      },
     
      {
        title: <this.Translate id="col_management_customer_description" />,
        dataIndex: "description",
        sorter: true,
        key: "description",
        render: (description) => this.Util.formtTextError(description)
      },
      {
        title: <this.Translate id="col_management_customer_group_cutomer" />,
        dataIndex: "groupCustomer",
        key: "groupCustomer",
        render: (groupCustomer) => groupCustomer !=null  ? groupCustomer.name : "-"
      },
      this.columnStatus
    ];
  }
}


