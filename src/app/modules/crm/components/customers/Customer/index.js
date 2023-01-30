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
    this.state = {
      ...this.state,
      isShowFilter: false
    };
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "firstName",
        width: 200,
        render: (text, row) => {
          const menu = (
            <Menu>
              <Menu.Item><this.Link to={`/customer-profile/${row.id}`}><this.Translate id="text_view" /></this.Link></Menu.Item>
              <Menu.Item onClick={() => this.showFormEdit(row)}><this.Translate id="text_edit" /></Menu.Item>
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
        render: company => company ? company : ""
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
      }
    ];
    this.formCreate = <FormCreate/>;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.columnExpend = new ColumnExpend();
    // this.isShowExpandable = true;
    this.rowClassName = record => record && record.contacts && record.contacts.length === 0 ? "standard-product-row" : "";
    this.service = CustomerService;
    this.action = CustomerAction;
    this.groupCustomerList = [{name: <this.Translate id="text_all_group" />, id: 0}];
    this.customerTypes = [
      {name: <this.Translate id="text_all_group"/>, value: null},
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
    this.timer = null;
    this.pathname = "/customer";
  }

  componentDidMount(){
    this.props.dispatch(GroupCustomerAction.fetch(this.pageSize));
    const params = new URLSearchParams(document.location.search);

    if (params.get("search")) {
      this.props.form.setFieldsValue({search: params.get("search")});
    }

    if (params.get("groupId")) {
      this.props.form.setFieldsValue({groupCustomerId: params.get("groupId")});
    }

    if (params.get("type")) {
      this.props.form.setFieldsValue({type: Number(params.get("type"))});
    }

    this.fetchList(true);
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

  fetchList(withPagination = false) {
    let offset = this.state.current;
    let limit = this.pageSize;
    let searchKey = "";
    let filter = {};
    const params = new URLSearchParams(document.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("current")) {
      offset = Number(params.get("current"));
    }

    if (params.get("search")) {
      searchKey = JSON.stringify({column: this.columnFilterWithKey, value: params.get("search")});
    }

    if (params.get("groupId")) {
      filter["groupCustomerId"] = [params.get("groupId")];
    }

    if (params.get("type") >= 0 && params.get("type") !== null) {
      filter["type"] = [params.get("type")];
    }

    if (filter) {
      filter = JSON.stringify(filter);
    }

    if (!withPagination) {
      offset = 1;
      this.setState({current: 1});
      params.delete("current");
      this.Util.pushParamsToURL(this.pathName, params.toString());
    }

    offset = (offset - 1) * limit;
    this.props.dispatch(this.action.fetch(limit, offset, "", "", filter, searchKey));
  }

  onSearchKey = (e) => {
    clearTimeout(this.timer);
    const value = e.target.value;
    const params = new URLSearchParams(document.location.search);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.timer = setTimeout(() => {
      this.fetchList();
    }, 800);
  }

  onChangeGroup = (value) => {
    const params = new URLSearchParams(document.location.search);
    if (value) {
      params.set("groupId", value);
    } else {
      params.delete("groupId");
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onChangeType = (value) => {
    const params = new URLSearchParams(document.location.search);
    if (value >= 0 && value !== null) {
      params.set("type", value);
    } else {
      params.delete("type");
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onShowSizeChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onChangePagination = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
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

  renderBreadCrumb() {}

  renderTableList() {
    const fetchingProp = this.props[this.fetchingProp];
    return (
      <div className="table-wrapper" style={{marginTop: 10}}>
        <this.Row>
          <this.Col span={3} style={{marginBottom: 0}}>
            <h3 style={{marginBottom: 0, fontWeight: 600}}><this.Translate id="text_customer" /></h3>
          </this.Col>
          <this.Col span={21} style={{display: "flex", justifyContent: "flex-end"}}>
            <this.InputText
              name="search"
              prefix={<this.Icon type="search" />}
              placeholder= {this.CATranslate("text_search_code", this.props.locale)}
              allowClear={true}
              style={{width: 220, marginBottom: 0}}
              onChange={this.onSearchKey}
              form={this.props.form} />
            <this.Select
              name="groupCustomerId"
              dataSource={this.groupCustomerList.concat(this.props.customerGroup.list)}
              defaultValue={this.groupCustomerList[0].id}
              valueKey="id"
              style={{width: 180, marginLeft: 10, marginBottom: 0}}
              onChange={this.onChangeGroup}
              form={this.props.form} />
            <this.Select
              name="type"
              dataSource={this.customerTypes}
              defaultValue={null}
              style={{width: 180, marginLeft: 10, marginBottom: 0}}
              onChange={this.onChangeType}
              form={this.props.form} />
            <div style={{display: "flex", marginLeft: 10, marginTop: 4}}>
              {this.renderButtonAddNew()}
              {this.renderButtonDelete()}
            </div>
          </this.Col>
        </this.Row>
        {this.renderTable(fetchingProp)}
        <div style={{marginTop: 15}}>
          {this.renderPagination(fetchingProp)}
        </div>
        <this.clearFloating/>
      </div>
    );
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