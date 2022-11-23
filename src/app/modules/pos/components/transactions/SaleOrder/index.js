import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import ReactToPrint from "react-to-print";
import {
  DatePicker,
  Menu,
  Icon,
  Dropdown,
  Tag,
  Form,
  Pagination,
  message,
  Row,
  Col,
  Card,
  Statistic,
  Select,
  Input
} from "antd";
import history from "../../../../common/router/history";
import Component from "../../../../common/components/Component";
import SaleOrderService from "../../../services/transactions/SaleOrderService";
import Enum from "../../../enums";
import {PackingSlipTem} from "./Invoice/packingSlipTem";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";
import PrivilegeService from "../../../services/settings/PrivilegeService";

class SaleOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      summaryData: {},
      current: 1,
      formData: null,
      loading: false,
      loadingButton: false,
      isShowFilter: true,
      isHasAccessPermission: null
    };
    this.title = <this.Translate id="text_sales"/>;
    this.pageSize = 50;
    this.fetchingProp = "list";
    this.pathname = "/transactions/sales-order";
    this.permissionModuleCode = "sales_order";
    this.SALE_ORDER_STATUS_STR = {
      [Enum.SALE_ORDER_STATUS.DRAFT]: { title: <this.Translate id="text_draft" />, color: "#bfbfbf" },
      [Enum.SALE_ORDER_STATUS.CONFIRMED]: { title: <this.Translate id="text_confirm" />, color: "#1890ff" },
      [Enum.SALE_ORDER_STATUS.CLOSED]: { title: <this.Translate id="text_closed" />, color: "#f50"},
      [Enum.SALE_ORDER_STATUS.VOID]: {title: <this.Translate id="text_void"/>, color: "#d9d9d9"}
    };
    this.status_options = [{name: <this.Translate id="text_all_status"/>, value: -1}];
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "registerDate",
        key: "registerDate",
        width: 140,
        render: (registerDate) => this.Util.formatDate(registerDate, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        width: 120,
        align: "center",
        render: (status) => {
          const statusValue = this.SALE_ORDER_STATUS_STR[status];
          const statusColor = statusValue.color;
          const stepTitle = statusValue.title;
          return <Tag color={statusColor} style={{width: 100, textAlign: "center"}}>{stepTitle}</Tag>;
        }
      },
      {
        title: <this.Translate id="text_sale_order_no" />,
        dataIndex: "number",
        key: "number",
        width: 180,
        render: (number, record) => {
          const menu = (
            <Menu>
              <Menu.Item>
                <this.Link to={`/transactions/sale-order/update/${record.id}`}>
                  <Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit" />
                </this.Link>
              </Menu.Item>
              <Menu.Item>
                <this.Link target="_blank" to={`/transactions/sale-order/create?id=${record.id}&action=clone`}>
                  <Icon type="copy" style={{marginRight: 10}} /> <this.Translate id="text_clone" />
                </this.Link>
              </Menu.Item>
              <Menu.Item>
                <this.Link to={`/transactions/sale-order/detail/${record.id}`}>
                  <Icon type="eye" style={{marginRight: 10}} />
                  <this.Translate id="text_view_detail" />
                </this.Link>
              </Menu.Item>
              <Menu.Item>
                  <div>
                    <ReactToPrint
                        trigger={() => {
                          return (
                              <div>
                                <Icon type="printer" style={{marginRight: 10}} />
                                <this.Translate id="text_print_packing_slip" />
                              </div>
                          );
                        }}
                        content={() => this.componentRef}
                        onBeforeGetContent={()=>this.fetchTransactionDetail(record.id)}
                    />
                  </div>
              </Menu.Item>
            </Menu>
          );
          return <div className="wrap-product-name" style={{display: "flex"}}>
            {number}
            <Dropdown className="product-row-option" overlay={menu}>
              <a className="ant-dropdown-link" href="javascipt:(void)" onClick={e => e.preventDefault()} style={{marginLeft: 10}}>
                <this.Translate id="text_option" /> <Icon type="down" />
              </a>
            </Dropdown>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "firstName",
        key: "firstName",
        render: (firstName, record) => `${firstName} ${record.lastName}`
      },
      {
        title: <this.Translate id="text_expected_shipment_date" />,
        dataIndex: "expectedShipmentDate",
        key: "expectedShipmentDate",
        width: 200,
        render: (expectedShipmentDate) => this.Util.formatDate(expectedShipmentDate, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_sub_total" />,
        dataIndex: "totalExcludeTax",
        key: "totalExcludeTax",
        align: "right",
        render: (totalExcludeTax, record) => {
          if (!totalExcludeTax) {
            totalExcludeTax = record.total;
          }
          return this.Util.formatCurrency(totalExcludeTax);
        }
      },
      {
        title: <this.Translate id="text_vat" />,
        dataIndex: "tax",
        key: "tax",
        align: "right",
        render: (text, record) => {
          if (!record.totalExcludeTax) record.totalExcludeTax = record.total;
          return this.formatCurrency(record.total - record.totalExcludeTax);
        }
      },
      {
        title: <this.Translate id="text_discount" />,
        dataIndex: "discount",
        key: "discount",
        align: "right",
        render: (discount, record) => this.Util.formatCurrency(discount)
      },
      {
        title: <this.Translate id="text_sale_total" />,
        dataIndex: "total",
        key: "totalSale",
        align: "right",
        render: (total, record) => {
          total = total - this.Util.floor(this.Util.floor(record.discount));
          if (total < 0) total = 0;
          return this.Util.formatCurrency(total);
        }
      },
    ];
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("limit")) {
      this.pageSize = params.get("limit");
    }

    if (params.get("offset")) {
      this.setState({current: parseInt(params.get("offset"))});
    }

    Object.keys(this.SALE_ORDER_STATUS_STR).forEach((prop) => {
      this.status_options.push( {name: this.SALE_ORDER_STATUS_STR[prop].title, value: prop});
    });

    SaleOrderService.summary().then(({data})=>{
      this.setState({summaryData: data.data});
    });

    this.getPermission();
    this.fetchList(true);
  }

  getPermission(){
    PrivilegeService.checkPermission(this.permissionModuleCode, "view")
        .then(({data}) => this.setState({isHasAccessPermission: data}))
        .catch(() => this.setState({isHasAccessPermission: false}));
  }

  fetchList(withPagination= false) {
    let searchKey = "";
    let filter = {};
    let limit = this.pageSize;
    let ranges = "";
    let offset = this.state.current;
    const params = new URLSearchParams(window.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("search")) {
      searchKey = JSON.stringify({column: this.columnFilterWithKey, value: params.get("search")});
    }

    if (params.get("start")) {
      ranges = JSON.stringify({column: "registerDate", value: [params.get("start"), params.get("end")]});
    }

    if (params.get("status")) {
      filter.status = Number(params.get("status"));
    }

    offset = (offset - 1) * limit;

    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());

    this.setState({loading: true});
    SaleOrderService.lists(limit, offset, "", "", JSON.stringify(filter), searchKey, ranges)
    .then(response => {
      this.setState({data: response && response.data});
    })
    .catch(() => message.error("Error"))
    .finally(() => this.setState({loading: false, loadingButton: false}));
  }

  async fetchTransactionDetail(id){
     const formData = await SaleOrderService.detail(id);
    this.setState({formData: formData.data});
  }

  handleSubmitFilter = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = new URLSearchParams(window.location.search);
        if (values.search && values.search.trim()) {
          params.set("search", values.search.trim());
        } else {
          params.delete("search");
        }

        if (values.registerDate && values.registerDate.length) {
          params.set("start", moment(values.registerDate[0]).format("YYYY-MM-DD"));
          params.set("end", moment(values.registerDate[1]).format("YYYY-MM-DD"));
        } else {
          params.delete("start");
          params.delete("end");
        }

        if (values.status && values.status >= 0) {
          params.set("status", values.status);
        } else {
          params.delete("status");
        }

        this.Util.pushParamsToURL(this.pathname, params.toString());
        this.setState({loadingButton: true});
        this.fetchList();
      }
    });
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

  buttonActionCollection() {
    return [this.renderButtonAddNew()];
  }

  renderButtonAddNew() {
    return <this.Button
        type="info"
        id="btnAdd"
        className="mg-right text-uppercase"
        onClick={() => history.push({pathname: "/transactions/sale-order/create"})}>
        <span className="icon-add icon-padding-right"></span>
        <this.Translate id="text_add_new" />
      </this.Button>;
  }

  renderPagination(fetchingProp, className = "float-right") {
    const data = this.state.data && this.state.data.pagination;
    let pagination = {
      total: data && data.total,
      pageSize: data && data.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions
    };

    const showTotal = total => {
      return `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
    };

    return( 
      pagination.total > 0 ?
        <div className={className}>
          <Pagination 
            size="small" 
            showTotal={showTotal} 
            showSizeChanger
            defaultCurrent={this.state.current}
            defaultPageSize={this.pageSize}
            onShowSizeChange={this.onShowSizeChange} 
            onChange={this.onChangePagination} 
            {...pagination} />
            <PackingSlipTem formData={this.state.formData} ref={el => (this.componentRef = el)} />
        </div>
        :
        ""
    );
  }

  handleSearch = (e) => {
    const queryParams = new URLSearchParams(document.location.search);
    const search = e.target.value ? e.target.value.trim() : "";

    if (search){
      queryParams.set("search", search);
    }else{
      queryParams.delete("search");
    }
    this.Util.pushParamsToURL(this.pathname,  queryParams.toString());

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchList();
    }, 1000);
  }

  handleChangeDate = (dates) => {
    const params = new URLSearchParams(document.location.search);
    if (dates.length) {
      params.set("start", moment(dates[0]).format("YYYY-MM-DD"));
      params.set("end", moment(dates[1]).format("YYYY-MM-DD"));
    } else {
      params.delete("start");
      params.delete("end");
    }
    this.Util.pushParamsToURL(this.pathname,  params.toString());
    this.fetchList();
  }

  handleChangeStatus = (status) => {
    const params = new URLSearchParams(document.location.search);
    if (status && status >= 0){
      params.set("status", status);
    }else{
      params.delete("status");
    }
    this.Util.pushParamsToURL(this.pathname,  params.toString());
    this.fetchList();
  }

  render() {

    const {summaryData} = this.state;
    const params = new URLSearchParams(window.location.search);

    return (
        <React.Fragment>
          {this.Util.isNotCheckingPermissionV2(this.state.isHasAccessPermission) &&
          (this.state.isHasAccessPermission ?
              <React.Fragment>
                <Row gutter={16} style={{marginTop: 15, marginBottom: 15}}>
                  <Col span={8}>
                    <Card>
                      <Statistic
                          title={<this.Translate id="text_confirmed"/>}
                          value={summaryData.confirmed ? summaryData.confirmed : 0 }
                          precision="0"
                          valueStyle={{color: "rgb(24, 144, 255)"}}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Statistic
                          title={<this.Translate id="text_closed"/>}
                          value={summaryData.closed ? summaryData.closed : 0 }
                          precision="0"
                          valueStyle={{ color: "#3f8600" }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Statistic
                          title={<this.Translate id="text_void"/>}
                          value={summaryData.void ? summaryData.void : 0 }
                          precision="0"
                          valueStyle={{ color: "#cf1322" }}
                      />
                    </Card>
                  </Col>
                </Row>
                <div className="content-list">
                  <div style={{height: "100%"}}>
                    <div className="table-wrapper">
                      <Row>
                        <Col span={6} style={{marginBottom: 0}}>
                          <h3 style={{marginBottom: 0, fontWeight: 600}}>{this.title}</h3>
                        </Col>
                        <Col span={18} style={{textAlign: "right", display: "flex", justifyContent: "end"}}>
                          <Input
                              name="search"
                              placeholder={this.CATranslate("text_search", this.props.locale)}
                              prefix={<Icon type="search" />}
                              defaultValue={params.get("search") ? params.get("search") : ""}
                              style={{height: 32, width: 200, marginRight: 10}}
                              allowClear={true}
                              onChange={this.handleSearch}
                          />
                          <DatePicker.RangePicker
                              name="dates"
                              defaultValue={params.get("start") && params.get("end") ? [moment(params.get("start")),moment(params.get("end"))] : null}
                              onChange={this.handleChangeDate}
                              style={{textAlign: "left", maxWidth: 300, marginRight: 10}}
                          />
                          <Select
                              defaultValue={params.get("status") == null ? this.status_options[0].value : params.get("status")}
                              onChange={this.handleChangeStatus}
                              style={{width: 200, marginRight: 10}}
                          >
                            {
                              this.status_options.map((statusOption, index) =>
                                  <Select.Option value={statusOption.value} key={index}>{statusOption.name}</Select.Option>
                              )
                            }
                          </Select>
                          <this.Button
                              type="info"
                              id="btnAdd"
                              className="text-uppercase"
                              disabled={this.state.loading}
                              onClick={() => history.push("/transactions/sale-order/create")}>
                            <span className="icon-add icon-padding-right"></span>
                            <this.Translate id="text_add_new" />
                          </this.Button>
                        </Col>

                      </Row>
                      <this.Table
                          bordered={true}
                          rowKey="id"
                          loading={this.state.loading}
                          columns={this.columns}
                          dataSource={this.state.data.data}
                          onChange={this.onChange}
                      />
                      <div style={{marginTop: 15}}>
                        {this.renderPagination(this.state.pagination)}
                      </div>
                      <this.clearFloating/>
                    </div>
                  </div>
                </div>
              </React.Fragment>
              :
              <NoPermissionV2/>
          )
          }
        </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const saleOrder =  Form.create(mapPropsToFields)(SaleOrder);
  
export default connect(mapStateToProps)(saleOrder);