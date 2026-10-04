import React from "react";
import { Menu, Dropdown, Row, Col, Input, Table, Icon } from "antd";
import { PageHeader } from "@components/PageHeader";
import List from "../../List";
import FormCreate from "../../../containers/customers/Customer/FormCreate";
import FormUpdate from "../../../containers/customers/Customer/FormUpdate";
import Constant from "../../../constants/customers/customer";
import CustomerAction from "../../../actions/customers/customer";
import CustomerService from "@services/CustomerService";
import GroupCustomerService from "../../../services/customers/GroupService";
import Enum from "../../../enum";
import "./index.css";

export default class CustomerList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isShowFilter: false,
      customerList: {
        fetching: false,
        fetched: false,
        pagination: {
          limit: this.pageSize,
          offset: 0,
          total: 0
        },
        list: [],
        error: null
      },
      customerGroup: {
        fetching: false,
        fetched: false,
        pagination: {
          limit: this.pageSize,
          offset: 0,
          total: 0
        },
        list: [],
        error: null
      }
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
    this.formUpdate = <FormUpdate/>;
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
    this.searchTimer = null;
    this.pathname = "/customer";
    this.placeholder = this.CATranslate("text_search_code", this.props.locale);
  }

  componentDidMount(){
    this.fetchCustomerGroups();
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

  componentDidUpdate(prevProps) {
    if ((!prevProps.add.added && this.props.add.added) || (!prevProps.update.updated && this.props.update.updated)) {
      this.fetchList(true);
    }

    if (!prevProps.groupCustomersAdd.added && this.props.groupCustomersAdd.added) {
      this.fetchCustomerGroups();
    }

    if (!prevProps.update.updated && this.props.update.updated) {
      this.props.dispatch(CustomerAction.reset(Constant.RESET_DETAIL_CUSTOMERS));
    }

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

  fetchCustomerGroups() {
    this.setState(prevState => ({
      customerGroup: {
        ...prevState.customerGroup,
        fetching: true,
        error: null
      }
    }));

    GroupCustomerService.lists(this.pageSize)
      .then(response => {
        this.setState(prevState => ({
          customerGroup: {
            ...prevState.customerGroup,
            fetching: false,
            fetched: true,
            pagination: response.data.pagination,
            list: response.data.data
          }
        }));
      })
      .catch(error => {
        this.setState(prevState => ({
          customerGroup: {
            ...prevState.customerGroup,
            fetching: false,
            error
          }
        }));
      });
  }

  fetchList(withPagination = false, sortField = "", sortOrder = "") {
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
      this.setState({current: offset});
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
      this.Util.pushParamsToURL(this.pathname, params.toString());
    }

    offset = (offset - 1) * limit;
    this.setState(prevState => ({
      customerList: {
        ...prevState.customerList,
        fetching: true,
        error: null
      }
    }));

    CustomerService.get({ limit, offset, sortField, sortOrder, filter, searchKey })
      .then(response => {
        this.setState(prevState => ({
          customerList: {
            ...prevState.customerList,
            fetching: false,
            fetched: true,
            pagination: response.data.pagination,
            list: response.data.data
          }
        }));
      })
      .catch(error => {
        this.setState(prevState => ({
          customerList: {
            ...prevState.customerList,
            fetching: false,
            error
          }
        }));
      });
  }

  onChange = (pagination, filters, sorter) => {
    if (!sorter || !sorter.order) {
      return;
    }

    const sortField = sorter && sorter.field ? sorter.field : "";
    const sortOrder = this.sortOrder(sorter.order);
    const current = pagination && pagination.current ? pagination.current : this.state.current;
    const pageSize = pagination && pagination.pageSize ? pagination.pageSize : this.pageSize;
    const params = new URLSearchParams(document.location.search);

    params.set("limit", pageSize);
    params.set("current", current);

    this.setState({current, isClickFilter: false});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true, sortField, sortOrder);
  }

  onSearchKey = (e) => {
    clearTimeout(this.searchTimer);
    const value = e.target.value;
    const params = new URLSearchParams(document.location.search);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    params.delete("current");
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.searchTimer = setTimeout(() => {
      this.fetchList();
    }, 300);
  }

  onChangeGroup = (value) => {
    const params = new URLSearchParams(document.location.search);
    if (value) {
      params.set("groupId", value);
    } else {
      params.delete("groupId");
    }

    params.delete("current");
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

    params.delete("current");
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onShowSizeChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("current", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onChangePagination = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("current", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
  }

  handleDelete() {
    if (this.service) {
      this.setState({deleting: true});
      this.service.archive(this.state.selectedListIds)
        .then(() => {
          this.fetchList(true);
          this.setState({
            selectedRowKeys: [],
            selectedListIds: [],
            selectedRows: [],
            modalVisible: false,
            deleting: false
          });
        })
        .catch(() => {
          this.setState({deleting: false});
        });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.searchTimer);
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
    const fetchingProps = this.state.customerList;
    const params = new URLSearchParams(document.location.search);
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        name: record.name
      })
    };

    return (
      <div className="table-wrapper">
        <PageHeader
          title={<this.Translate id="text_customer" />}
          subtitle="Manage customer records and contact details"
          breadcrumbs={[
            {text: "Dashboard", href: "/dashboard"},
            {text: <this.Translate id="text_customer" />}
          ]}
          actions={[
            {
              text: <this.Translate id="text_add_new" />,
              type: "primary",
              icon: "plus",
              onClick: this.handleShowFormAdd,
              disabled: this.state.loadingPopup || fetchingProps.fetching
            },
            this.renderButtonDelete()
          ]}
        />

        <div style={{paddingLeft: 40, paddingRight: 40, paddingTop: 25}}>
          <Row style={{marginBottom: 10}}>
            <Col md={24} style={{display: "flex", justifyContent: "flex-end", flexWrap: "wrap"}}>
              <Input
                name="search"
                placeholder={this.placeholder}
                suffix={<Icon type="search" />}
                defaultValue={params.get("search") ? params.get("search") : ""}
                allowClear={true}
                style={{width: 260, marginRight: 10, marginBottom: 10}}
                onChange={this.onSearchKey}
              />
              <this.Select
                name="groupCustomerId"
                dataSource={this.groupCustomerList.concat(this.state.customerGroup.list)}
                defaultValue={this.groupCustomerList[0].id}
                valueKey="id"
                style={{width: 180, marginRight: 10, marginBottom: 10}}
                onChange={this.onChangeGroup}
                form={this.props.form} />
              <this.Select
                name="type"
                dataSource={this.customerTypes}
                defaultValue={null}
                style={{width: 180, marginBottom: 10}}
                onChange={this.onChangeType}
                form={this.props.form} />
            </Col>
          </Row>

          <Table
            rowKey="id"
            bordered
            rowSelection={rowSelection}
            loading={fetchingProps.fetching}
            columns={this.columns}
            dataSource={fetchingProps.list}
            onChange={this.onChange}
            onRow={record => ({
              onDoubleClick: () => this.handleShowFormEdit(record),
              onClick: event => this.handleOnTapHandler(event, record)
            })}
            pagination={{
              total: fetchingProps.pagination.total,
              pageSize: fetchingProps.pagination.limit,
              current: this.state.current,
              pageSizeOptions: this.pageSizeOptions,
              showTotal: total => `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`,
              showSizeChanger: true,
              onShowSizeChange: this.onShowSizeChange,
              onChange: this.onChangePagination
            }}
            locale={{emptyText: <this.Translate id="table_empty_data" />}}
            size="middle"
          />
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
