import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/customers/Customer/FormCreate";
import FormUpdate from "../../../containers/customers/Customer/FormUpdate";
import Constant from "../../../constants/customers/customer";
import CustomerAction from "../../../actions/customers/customer";
import GroupCustomerAction from "../../../actions/customers/group";
import CustomerService from "../../../services/customers/CustomerService";
import Enum from "../../../enum";
import "./index.css";

export default class CustomerList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.columnExpend = new ColumnExpend();
    // this.isShowExpandable = true;
    this.rowClassName = record => record && record.contacts && record.contacts.length === 0 ? "standard-product-row" : "";
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
    this.RESET_CONSTANT = Constant.RESET_CUSTOMERS;
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

  componentDidUpdate() {
    if (this.props.detail.fetched) {
      this.setState({loadingPopup: false});
      this.props.dispatch(CustomerAction.reset(Constant.RESET_DETAIL_PARTIAL_CUSTOMERS));
    }

    let errorCode = "";
    if (this.props.add.error) {
      errorCode = this.Util.getErrorCodeFromState(this.props.add.error);
    } else if (this.props.update.error) {
      errorCode = this.Util.getErrorCodeFromState(this.props.update.error);
    }

    if (errorCode) {
      let message = "Something went wrong";
      if (errorCode === Enum.CUSTOMER_EXIST) {
        message = this.CATranslate("error_exist_customer", this.props.locale);
      }

      this.Message.error(message);
      this.props.dispatch(CustomerAction.reset(Constant.RESET_ADD_CUSTOMERS));
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
      loadingPopup: true,
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
    const {customerGroup, locale, form} = this.props;
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
                  label={<this.Translate id="text_search" />}
                  placeholder= {this.CATranslate("text_search_code", locale)}
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="groupCustomerId"
                  label={<this.Translate id="text_group" />}
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
}

class ColumnExpend extends List {
  constructor(props) {
    super(props);
    return [
      {
        dataIndex: "blank1",
        key: "blank1",
        width: 20,
        render: () => {},
      },
      {
        dataIndex: "name",
        key: "name",
        width: 200
      },
      {
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        width: 150
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
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "firstName",
        sorter: true,
        width: 200,
        render: (text, row) => text + " " + row.lastName
      },
      {
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        sorter: true,
        width: 150,
        render: phoneNumber => phoneNumber ? this.Util.formtTextError(phoneNumber) : this.emptyText
      },
      {
        title: <this.Translate id="text_address" />,
        dataIndex: "address",
        key: "address",
        sorter: true,
        render: address => address ? this.Util.formtTextError(address) : this.emptyText
      },
      {
        title: <this.Translate id="text_email" />,
        dataIndex: "email",
        key: "email",
        sorter: true,
        render: email => email ? this.Util.formtTextError(email) : this.emptyText
      },
      {
        title: <this.Translate id="text_credit" />,
        dataIndex: "credit",
        key: "credit",
        sorter: true,
        align: "right",
        render: credit => credit ? this.formatCurrency(credit) : this.formatCurrency(0)
      },
      {
        title: <this.Translate id="text_group" />,
        dataIndex: "groupCustomer",
        key: "groupCustomer",
        sorter: true,
        render: groupCustomer => groupCustomer ? <span className="text-capitalize">{groupCustomer.name}</span> : this.emptyText
      },
      this.columnStatus
    ];
  }
}


