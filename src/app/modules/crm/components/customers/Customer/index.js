import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/customers/Customer/FormCreate";
import FormUpdate from "../../../containers/customers/Customer/FormUpdate";
import Constant from "../../../constants/customers/customer";
import CustomerAction from "../../../actions/customers/customer";
import GroupCustomerAction from "../../../actions/customers/group";
import CustomerService from "../../../services/customers/CustomerService";
import "./index.css";

export default class CustomerList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.columnExpend = new ColumnExpend(); 
    this.isShowExpandable = true;
    this.service = CustomerService;
    this.action = CustomerAction;
    this.groupCustomerList = [{name: <this.Translate id="text_all_group" />, id: 0}];
  
    this.columnFilterWithKey = [
      "firstName",
      "lastName",
      "address",
      "company",
      "email",
      "phoneNumber",
      "name"
    ];
    this.RESET_CONSTANT = Constant.RESET_MANAGEMENT_CUSTOMERS;
  }

  componentDidMount(){
    this.props.dispatch(GroupCustomerAction.fetch(this.pageSize));
    super.componentDidMount();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.update.updated) {
      this.props.dispatch(CustomerAction.fetch(this.pageSize));
      this.props.dispatch(CustomerAction.reset(Constant.RESET_DETAIL_CUSTOMERS));
    }
  }

  expandedRender(record){
    return( 
      <div className="sub-table">
        <this.SubTable 
          columns={this.columnExpend}
          dataSource={record.contacts}
          locale={{emptyText: <this.Translate id="text_no_contact" />}}/>
      </div>
    );
  }

  showFormEdit(rowData) {
    this.props.dispatch(CustomerAction.requestAndShowForm(rowData));
    this.setState({
      modalConten: <FormUpdate />
    });
  }

  handleSubmitFilter(e) {
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const {dispatch} = this.props;
          const status = values.status === this.Enum.ALL_STATE ? [this.Enum.ACTIVE, this.Enum.DEACTIVE] : [values.status];
          let filter = {status};

          if ((values.groupCustomerId - this.groupCustomerList.value) !== 0) {
            filter["groupCustomerId"] = [values.groupCustomerId];
          }

          filter = JSON.stringify(filter);

          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey));
          this.setState({isClickFilter: true});
        }
      });
    }
  }

  renderFilterRecord() {
    const {customerGroup, form} = this.props;
    if (customerGroup) {
      const fetchingProps = this.props[this.fetchingProp];
      return (
        form == null ?
          ""
          :
          <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
            <this.Row className="main-search-layout form-group">
              <this.Col md="3">
                <this.InputText
                  name="key"
                  label="Search"
                  placeholder="Search for code, name and address"
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="groupCustomerId"
                  label={<this.Translate id="input_management_customer_customer_group" />}
                  dataSource={this.groupCustomerList.concat(customerGroup.list)}
                  defaultValue={this.groupCustomerList[0].id}
                  valueKey="id"
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="status"
                  label={<this.Translate id="text_status" />}
                  placeholder="Please select status"
                  dataSource={this.statusList}
                  defaultValue={this.Enum.ALL_STATE}
                  form={form}
                />
              </this.Col>
              <this.Col md="2"  className="wrap-btn-search">
                <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                  <label htmlFor="status" className="" title=""></label>
                </div>
                <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                  <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
                </this.Button>
              </this.Col>
            </this.Row>
          </this.Form>
      ); 
    }
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
        width: "250px",
        render: () => {}
      },
      {
        dataIndex: "name",
        width: "311px",
        key: "name"
      },
      {
        dataIndex: "phoneNumber",
        width: "231px",
        key: "phoneNumber"
      },
      {
        dataIndex: "address",
        key: "address"
      },
      {
        dataIndex: "",
        render: () => {}
      },
      {
        dataIndex: "",
        render: () => {}
      },
      {
        dataIndex: "",
        render: () => {}
      }
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
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true,
        render: (phoneNumber) => this.Util.formtTextError(phoneNumber)
      },
      {
        title: <this.Translate id="text_address" />,
        dataIndex: "address",
        key: "address",
        sorter: true,
        render: (address) => this.Util.formtTextError(address)
      },
      {
        title: <this.Translate id="text_email" />,
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
        render: (groupCustomer) => groupCustomer !=null  ? <span className="text-capitalize">{groupCustomer.name}</span> : "-"
      },
      this.columnStatus
    ];
  }
}


