import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/customers/ManageCustomers/FormCreate";
import FormUpdate from "../../../containers/customers/ManageCustomers/FormUpdate";
import Constant from "../../../constants/customers/managementCutomers";
import CustomerAction from "../../../actions/customers/manageCustomers";
import CustomerService from "../../../services/customers/manageCustomer";
import "./index.css";

export default class CustomerList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.title = "Manage Customer";
    this.columnExpend = new ColumnExpend(); 
    this.fetchingProp = "manageCustomers";
    this.addingProp = "manageCustomersAdd";
    this.updatingProp = "manageCustomersUpdate";
    this.isShowExpandable = true;
    this.service = CustomerService;
    this.action = CustomerAction;
    this.RESET_CONSTANT = Constant.RESET_MANAGEMENT_CUSTOMERS;
  }

  componentWillReceiveProps(nextProps) {
    const {manageCustomersUpdate} = nextProps;
    if (manageCustomersUpdate.updated) {
      const {dispatch} = this.props;
      dispatch(CustomerAction.fetch(this.pageSize));
      dispatch(CustomerAction.reset());
    }
  }

  expandedRender(record){
    return( 
      <div className="sub-table">
        <this.SubTable 
          columns={this.columnExpend}
          dataSource={record.contacts}
          noDataContent="No Rows found"
        />
      </div>
    );
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(CustomerAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(CustomerAction.showForm(rowData));
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
        dataIndex: "createdAt",  
        key: "createdAt",
        width: 250,
        render: value => this.formatDate(value),
      },
      {
        dataIndex: "name",
        key: "name"
      },
      {
        dataIndex: "phoneNumber",
        key: "phoneNumber"
      },
      {
        dataIndex: "address",
        key: "address"
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
        title: <this.Translate id="col_management_customer_group_cutomer" />,
        dataIndex: "groupCustomer",
        key: "groupCustomer",
        sorter: true,
        render: (groupCustomer) => groupCustomer !=null  ? groupCustomer.name : "-"
      },
      this.columnStatus
    ];
  }
}


