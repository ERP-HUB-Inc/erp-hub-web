import React from "react";
import { Menu, Dropdown } from "antd";
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
    this.customerTypes = [
      {name: <this.Translate id="text_all_group"/>, value: 4},
      {name: <this.Translate id="text_retail_sale"/>, value: Enum.CUSTOMER_TYPE.RETAIL_SALE},
      {name: <this.Translate id="text_whole_sale"/>, value: Enum.CUSTOMER_TYPE.WHOLE_SALE},
      {name: <this.Translate id="text_distributor"/>, value: Enum.CUSTOMER_TYPE.DISTRIBUTOR}
    ];
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

          if ((values.groupCustomerId - this.groupCustomerList[0].id) !== 0) {
            filter["groupCustomerId"] = [values.groupCustomerId];
          }
  

          if(values.type === 4){
            filter["type"] = [Enum.CUSTOMER_TYPE.RETAIL_SALE,Enum.CUSTOMER_TYPE.WHOLE_SALE,Enum.CUSTOMER_TYPE.DISTRIBUTOR];
          }else{
            filter["type"] = [values.type];
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
                  name="type"
                  label={<this.Translate id="text_type" />}
                  dataSource={this.customerTypes}
                  defaultValue={4}
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

    this.customerTypes = [
      {
        title: <this.Translate id="text_retail_sale" />,
        value: Enum.CUSTOMER_TYPE.RETAIL_SALE
      },
      {
        title: <this.Translate id="text_whole_sale" />,
        value: Enum.CUSTOMER_TYPE.WHOLE_SALE
      },
      {
        title: <this.Translate id="text_distributor" />,
        value: Enum.CUSTOMER_TYPE.DISTRIBUTOR
      }
    ];
    
    return [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "firstName",
        width: 200,
        render: (text, row) => {
          const menu = (
            <Menu>
              <Menu.Item><this.Link to={`/customer-profile/${row.id}`}><this.Translate id="text_view" /> <this.Translate id="text_profile" /></this.Link></Menu.Item>
            </Menu>
          );
          return <div className="wrap-product-name" style={{display: "flex"}}>
            {text + " " + row.lastName}
            <Dropdown className="product-row-option" overlay={menu}>
              {/*eslint-disable-next-line*/}
              <a className="ant-dropdown-link" href="#" onClick={e => e.preventDefault()} style={{marginLeft: 10}}>
                <this.Translate id="text_option" /> <this.Icon type="down" />
              </a>
            </Dropdown>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_company" />,
        dataIndex: "company",
        key: "company",
        render: company => company ? company : this.emptyText
      },
      {
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        width: 160,
        render: phoneNumber => phoneNumber ? this.Util.formtTextError(phoneNumber) : this.emptyText
      },
      {
        title: <this.Translate id="text_address" />,
        dataIndex: "address",
        key: "address",
        render: address => address ? this.Util.formtTextError(address) : this.emptyText
      },
      {
        title: <this.Translate id="text_group" />,
        dataIndex: "groupCustomer",
        key: "groupCustomer",
        render: groupCustomer => groupCustomer ? <span className="text-capitalize">{groupCustomer.name}</span> : this.emptyText
      },
      {
        title: <this.Translate id="text_type" />,
        dataIndex: "type",
        key: "type",
        render: type => {
          const customerType = this.customerTypes.find(customer => customer.value === type);
          return <this.Tag color="blue" className="text-center label-stock-status" style={{width: 100}}>{customerType ? customerType.title : this.emptyText}</this.Tag>;
        }
      }
    ];
  }
}


