import React from "react";
import { connect } from "react-redux";
import ReactGA from "react-ga4";
import moment from "moment";
import { Translate } from "@redux/index";
import ReactToPrint from "react-to-print";
import {
  Icon,
  Dropdown,
  Menu,
  Popover,
  Checkbox,
  Button,
  Divider,
  Form,
  Pagination,
  message,
  Modal,
  Row,
  Col,
  Card,
  Statistic,
  Input,
  Table,
  Tabs,
  DatePicker,
  Select
} from "antd";
import SalesOrderPrint from "./Invoice/sales-order-print";
import PackingSlip from "./Invoice/packing-slip";
import DeliveryNote from "./Invoice/delivery-note";
import history from "../../../../common/router/history";
import Component from "../../../../common/components/Component";
import SaleOrderService from "@services/SaleOrderService";
import Enum from "../../../enums";
import { PageHeader } from "@components/PageHeader";
import { MonetaryValue } from "@components/index";
import { QuantityValue } from "@components/stateless/quantity.value";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const MAX_DATE_RANGE_DAYS = 365;
const DATE_FILTERS = {
  today: {
    label: "Today",
    getRange: () => [moment(), moment()]
  },
  last7Days: {
    label: "Last 7 days",
    getRange: () => [moment().subtract(6, "days"), moment()]
  },
  thisMonth: {
    label: "This month",
    getRange: () => [moment().startOf("month"), moment()]
  },
  last30Days: {
    label: "Last 30 days",
    getRange: () => [moment().subtract(29, "days"), moment()]
  },
  last365Days: {
    label: "Last 365 days",
    getRange: () => [moment().subtract(365, "days"), moment()]
  },
  custom: {
    label: "Custom range"
  }
};
const DEFAULT_DATE_FILTER = "last365Days";

export default class SaleOrderPage extends Component {
  constructor(props) {
    super(props);
    this.columnSettingsKey = "sale_order_table_visible_columns";
    this.requiredColumns = ["number", "action"];
    this.defaultVisibleColumns = [
      "number",
      "registerDate",
      "status",
      "firstName",
      "phoneNumber",
      "totalItem",
      "subTotal",
      "discount",
      "totalSale",
    ];
    this.allColumns = [
      {
        title: <Translate id="text_sale_order_no" />,
        settingLabel: "text_sale_order_no",
        dataIndex: "number",
        key: "number",
        width: 180,
        render: (number) => <div className="wrap-product-name" style={{display: "flex"}}>{number}</div>
      },
      {
        title: <Translate id="text_date" />,
        settingLabel: "text_date",
        dataIndex: "registerDate",
        key: "registerDate",
        width: 180,
        render: (registerDate) => this.Util.formatDate(registerDate, "DD/MM/YYYY HH:mm")
      },
      {
        title: <Translate id="text_status" />,
        settingLabel: "text_status",
        dataIndex: "status",
        key: "status",
        width: 120,
        align: "center",
        render: (status) => status
      },
      {
        title: <Translate id="text_customer" />,
        settingLabel: "text_customer",
        dataIndex: "firstName",
        key: "firstName",
        render: (firstName, record) => record.customerId === "WALK_IN" ? "Walk-In" : `${firstName} ${record.lastName}`
      },
      {
        title: <Translate id="text_contact_number" />,
        settingLabel: "text_contact_number",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        render: phoneNumber => phoneNumber
      },
      {
        title: <Translate id="text_shipping_status" />,
        settingLabel: "text_shipping_status",
        dataIndex: "shippingStatus",
        key: "shippingStatus",
        render: shippingStatus => shippingStatus || "Unknown"
      },
      {
        title: <Translate id="text_expected_shipment_date" />,
        settingLabel: "text_expected_shipment_date",
        dataIndex: "expectedShipmentDate",
        key: "expectedShipmentDate",
        width: 200,
        render: (expectedShipmentDate) => this.Util.formatDate(expectedShipmentDate, "DD/MM/YYYY")
      },
      {
        title: <Translate id="text_total_items" />,
        settingLabel: "text_total_items",
        dataIndex: "totalItem",
        key: "totalItem",
        align: "center",
        render: (totalItem) => {
          return <QuantityValue
                quantity={totalItem}
                showSign={true}
                sign={"-"}
                type={"OUT"}
                unit="Items"
                decimals={0}
          />;
        }
      },
      {
        title: <Translate id="text_deposit" />,
        settingLabel: "text_deposit",
        dataIndex: "deposit",
        key: "deposit",
        align: "right",
        render: deposit => this.Util.formatCurrency(deposit)
      },
      {
        title: <Translate id="text_sub_total" />,
        settingLabel: "text_sub_total",
        dataIndex: "subTotal",
        key: "subTotal",
        align: "right",
        render: (subTotal) => <MonetaryValue amount={Number(subTotal)} />,
      },
      {
        title: <Translate id="text_vat" />,
        settingLabel: "text_vat",
        dataIndex: "tax",
        key: "tax",
        align: "right",
        render: (text, record) => {
          if (!record.totalExcludeTax) record.totalExcludeTax = record.total;
          return this.formatCurrency(record.total - record.totalExcludeTax);
        }
      },
      {
        title: <Translate id="text_discount" />,
        settingLabel: "text_discount",
        dataIndex: "discount",
        key: "discount",
        align: "right",
        render: (discount) => <MonetaryValue type="OUT" showSign={true} amount={Number(discount)} />,
      },
      {
        title: <Translate id="text_sale_total" />,
        settingLabel: "text_sale_total",
        dataIndex: "total",
        key: "totalSale",
        align: "right",
        render: (total) => <MonetaryValue amount={Number(total)} />
      },
      {
        title: <Translate id="text_action" />,
        settingLabel: "text_action",
        key: "action",
        align: "center",
        width: 80,
        render: (text, record) => {
          const menu = (
            <Menu>
              <Menu.Item>
                <this.Link to={`/transactions/sale-order/detail/${record.id}`}>
                  <Icon type="eye" style={{marginRight: 10}} />
                  <Translate id="text_view" />
                </this.Link>
              </Menu.Item>
              <Menu.Item>
                <this.Link to={`/transactions/sale-order/update/${record.id}`}>
                  <Icon type="edit" style={{marginRight: 10}} /> <Translate id="text_edit" />
                </this.Link>
              </Menu.Item>
              <Menu.Item>
                <this.Link target="_blank" to={`/transactions/sale-order/create?id=${record.id}&action=clone`}>
                  <Icon type="copy" style={{marginRight: 10}} /> <Translate id="text_clone" />
                </this.Link>
              </Menu.Item>
              <Menu.Item>
                <this.Link to={`/transactions/create-invoice?saleOrderId=${record.id}&action=convertToInvoice`}>
                  <Icon type="retweet" style={{marginRight: 10}} /> <Translate id="text_convert_to_invoice" />
                </this.Link>
              </Menu.Item>
              <Divider style={{marginTop: 4, marginBottom: 4}} />
              <Menu.Item>
                <div>
                  <ReactToPrint
                    trigger={() => {
                      return (
                        <div>
                          <Icon type="printer" style={{marginRight: 10}} />
                          <Translate id="text_print" />
                        </div>
                      );
                    }}
                    content={() => this.componentRef}
                    onBeforeGetContent={() => this.fetchSalesOrderById(record.id)}
                  />
                </div>
              </Menu.Item>
              <Menu.Item>
                <div>
                  <ReactToPrint
                    trigger={() => {
                      return (
                        <div>
                          <Icon type="file-protect" style={{marginRight: 10}} />
                          <Translate id="text_packing_slip" />
                        </div>
                      );
                    }}
                    content={() => this.packingSlipRef}
                    onBeforeGetContent={() => this.fetchSalesOrderById(record.id)}
                  />
                </div>
              </Menu.Item>
              <Menu.Item>
                <div>
                  <ReactToPrint
                    trigger={() => {
                      return (
                        <div>
                          <Icon type="file-text" style={{marginRight: 10}} />
                          <Translate id="text_delivery_note" />
                        </div>
                      );
                    }}
                    content={() => this.deliveryNoteRef}
                    onBeforeGetContent={() => this.fetchSalesOrderById(record.id)}
                  />
                </div>
              </Menu.Item>
              <Divider style={{marginTop: 4, marginBottom: 4}} />
              <Menu.Item onClick={() => this.handleVoid(record.id)}>
                <Icon type="close" /> <Translate id="text_void" />
              </Menu.Item>
              <Menu.Item onClick={() => this.handleDelete(record.id)} style={{color: "red"}} >
                <Icon type="delete" /> <Translate id="text_delete" />
              </Menu.Item>
            </Menu>
          );

          return (
            <Dropdown overlay={menu} placement="bottomLeft">
              <Button icon="more" />
            </Dropdown>
          );
        }
      },
    ];
    this.state = {
      data: [],
      pagination: {},
      summaryData: {},
      activeTab: "allSales",
      current: 1,
      formData: null,
      loading: false,
      loadingButton: false,
      isShowFilter: true,
      isHasAccessPermission: null,
      visibleColumns: this.defaultVisibleColumns,
      dateFilter: DEFAULT_DATE_FILTER
    };
    this.title = <Translate id="text_orders"/>;
    this.pageSize = 25;
    this.fetchingProp = "list";
    // this.pathname = "/transactions/sales-order";
    this.pathname = "/sales";
    this.permissionModuleCode = "sales_order";
    this.tabStatusMap = {
      allSales: -1,
      draftSales: Enum.SALE_ORDER_STATUS.DRAFT,
      toInvoiceSales: Enum.SALE_ORDER_STATUS.CONFIRMED,
      shippingSales: "SHIPPING",
      completedSales: Enum.SALE_ORDER_STATUS.CLOSED,
      voidSales: Enum.SALE_ORDER_STATUS.VOID,
    };
    this.SALE_ORDER_STATUS_STR = {
      [Enum.SALE_ORDER_STATUS.DRAFT]: { title: <Translate id="text_draft" />, color: "#bfbfbf" },
      [Enum.SALE_ORDER_STATUS.CONFIRMED]: { title: <Translate id="text_confirm" />, color: "#1890ff" },
      [Enum.SALE_ORDER_STATUS.CLOSED]: { title: <Translate id="text_closed" />, color: "#f50"},
      [Enum.SALE_ORDER_STATUS.VOID]: {title: <Translate id="text_void"/>, color: "#d9d9d9"}
    };
    this.status_options = [{name: <Translate id="text_all_status"/>, value: -1}];
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    let initialActiveTab = this.state.activeTab;
    const nextState = {};

    if (params.get("limit")) {
      this.pageSize = params.get("limit");
    }

    if (params.get("offset")) {
      nextState.current = parseInt(params.get("offset"));
    }

    if (params.get("status") != null) {
      initialActiveTab = this.getTabKeyByStatus(Number(params.get("status")));
    }

    if (params.get("workflow")) {
      initialActiveTab = params.get("workflow");
    }

    this.ensureDefaultDateRange(params);
    nextState.activeTab = initialActiveTab;
    nextState.dateFilter = this.getDateFilterKeyFromParams(params);
    this.setState(nextState);

    Object.keys(this.SALE_ORDER_STATUS_STR).forEach((prop) => {
      this.status_options.push( {name: this.SALE_ORDER_STATUS_STR[prop].title, value: prop});
    });

    this.loadVisibleColumns();
    this.fetchSummary();
    this.fetchList(true, initialActiveTab);
  }

  loadVisibleColumns = () => {
    try {
      const savedColumns = JSON.parse(localStorage.getItem(this.columnSettingsKey));
      if (Array.isArray(savedColumns) && savedColumns.length > 0) {
        const validColumns = savedColumns.filter(columnKey =>
          this.allColumns.some(column => column.key === columnKey)
        );

        if (validColumns.length > 0) {
          const nextColumns = Array.from(new Set([...this.requiredColumns, ...validColumns]));
          this.setState({visibleColumns: nextColumns});
          return;
        }
      }
    } catch (error) {
      // Ignore invalid localStorage payloads and fall back to defaults.
    }

    this.setState({visibleColumns: this.defaultVisibleColumns});
  }

  saveVisibleColumns = (visibleColumns) => {
    try {
      localStorage.setItem(this.columnSettingsKey, JSON.stringify(visibleColumns));
    } catch (error) {
      // Ignore storage failures so the table still works without persistence.
    }
  }

  handleToggleColumn = (columnKey) => {
    this.setState((prevState) => {
      const isVisible = prevState.visibleColumns.includes(columnKey);
      let nextColumns = prevState.visibleColumns;

      if (isVisible) {
        if (this.requiredColumns.includes(columnKey) || prevState.visibleColumns.length === 1) {
          return null;
        }

        nextColumns = prevState.visibleColumns.filter(key => key !== columnKey);
      } else {
        nextColumns = [...prevState.visibleColumns, columnKey];
      }

      this.saveVisibleColumns(nextColumns);
      return {visibleColumns: nextColumns};
    });
  }

  handleSelectAllColumns = (checked) => {
    const nextColumns = checked
      ? this.allColumns.map(column => column.key)
      : [...this.requiredColumns];

    this.saveVisibleColumns(nextColumns);
    this.setState({visibleColumns: nextColumns});
  }

  handleResetColumns = () => {
    const nextColumns = this.defaultVisibleColumns.slice();
    this.saveVisibleColumns(nextColumns);
    this.setState({visibleColumns: nextColumns});
  }

  renderColumnSettings = () => {
    const {visibleColumns} = this.state;
    const allVisible = visibleColumns.length === this.allColumns.length;
    const isIndeterminate = visibleColumns.length > 0 && !allVisible;

    return (
      <Popover
        trigger="click"
        placement="bottomRight"
        content={
          <div style={{ width: 260 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Checkbox
                checked={allVisible}
                indeterminate={isIndeterminate}
                onChange={(e) => this.handleSelectAllColumns(e.target.checked)}
              >
                Show all
              </Checkbox>
              <Button size="small" onClick={this.handleResetColumns}>
                Reset
              </Button>
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {this.allColumns.map((column) => {
                const checked = visibleColumns.includes(column.key);
                const disabled = this.requiredColumns.includes(column.key);

                return (
                  <div key={column.key} style={{ marginBottom: 8 }}>
                    <Checkbox
                      checked={checked}
                      disabled={disabled}
                      onChange={() => this.handleToggleColumn(column.key)}
                    >
                      <Translate id={column.settingLabel} />
                    </Checkbox>
                  </div>
                );
              })}
            </div>
          </div>
        }
      >
        <Button style={{ marginLeft: 10 }}>
          <Icon type="setting" />
          <span style={{ marginLeft: 6 }}>Columns</span>
        </Button>
      </Popover>
    );
  }

  getVisibleColumns = () => {
    const {visibleColumns} = this.state;
    return this.allColumns.filter(column => visibleColumns.includes(column.key));
  }

  ensureDefaultDateRange = (params) => {
    if (!params.get("start") || !params.get("end")) {
      const defaultRange = DATE_FILTERS[DEFAULT_DATE_FILTER].getRange();
      params.set("start", this.formatDateParam(defaultRange[0]));
      params.set("end", this.formatDateParam(defaultRange[1]));
      this.Util.pushParamsToURL(this.pathname, params.toString());
    }
  }

  formatDateParam = (date) => moment(date).format("YYYY-MM-DD")

  getRangeFromParams = () => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get("start") || !params.get("end")) {
      return DATE_FILTERS[DEFAULT_DATE_FILTER].getRange();
    }

    return [
      moment(params.get("start")),
      moment(params.get("end"))
    ];
  }

  getDateFilterKeyFromParams = (params = new URLSearchParams(window.location.search)) => {
    if (!params.get("start") || !params.get("end")) {
      return DEFAULT_DATE_FILTER;
    }

    const start = params.get("start");
    const end = params.get("end");
    const matchedFilter = Object.keys(DATE_FILTERS).find((key) => {
      if (!DATE_FILTERS[key].getRange) {
        return false;
      }

      const range = DATE_FILTERS[key].getRange();
      return this.formatDateParam(range[0]) === start && this.formatDateParam(range[1]) === end;
    });

    return matchedFilter || "custom";
  }

  getRangeDayCount = (dates) => {
    if (!dates || dates.length < 2) {
      return 0;
    }

    return moment(dates[1]).startOf("day").diff(moment(dates[0]).startOf("day"), "days");
  }

  getShowingDateLabel = () => {
    const range = this.getRangeFromParams();
    return `Showing sales orders from ${range[0].format("MMM D, YYYY")} to ${range[1].format("MMM D, YYYY")}.`;
  }

  applyDateRange = (dates, dateFilter = "custom", confirmWideRange = true) => {
    if (!dates || dates.length < 2) {
      message.warning("Please select a date range. Sales orders default to the last 365 days.");
      return;
    }

    const dayCount = this.getRangeDayCount(dates);

    if (dayCount > MAX_DATE_RANGE_DAYS && confirmWideRange) {
      Modal.confirm({
        title: "Search more than 365 days?",
        content: "Large date ranges can be slow. Continue only if you intentionally need older sales orders.",
        okText: "Search anyway",
        cancelText: "Keep current range",
        onOk: () => this.applyDateRange(dates, dateFilter, false)
      });
      return;
    }

    const params = new URLSearchParams(document.location.search);
    params.set("start", this.formatDateParam(dates[0]));
    params.set("end", this.formatDateParam(dates[1]));
    params.delete("offset");

    this.setState({dateFilter, current: 1});
    this.Util.pushParamsToURL(this.pathname,  params.toString());
    this.fetchList();
  }

  fetchList(withPagination= false, activeTab = this.state.activeTab) {
    let searchKey = "";
    let filter = {};
    let limit = this.pageSize;
    let ranges = "";
    let offset = this.state.current;
    const params = new URLSearchParams(window.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    } else {
      limit = this.pageSize;
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("search")) {
      searchKey = JSON.stringify({column: this.columnFilterWithKey, value: params.get("search")});
    }

    this.ensureDefaultDateRange(params);
    ranges = JSON.stringify({column: "createdAt", value: [params.get("start"), params.get("end")]});

    filter = {
      ...filter,
      ...this.buildTabFilter(activeTab)
    };

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
    SaleOrderService.get({limit, offset, filter: JSON.stringify(filter), searchKey, rangFilter: ranges})
    .then((response) => {
        if (response.data && response.data.data) {
          this.setState({
            data: response.data.data,
            pagination: response.data.pagination,
          });
        }
    })
    .catch(() => message.error("Error"))
    .finally(() => this.setState({loading: false, loadingButton: false}));
  }

  fetchSummary() {
    SaleOrderService.summary().then(({data})=>{
      this.setState({summaryData: data.data});
    });
  }

  handleVoid(id) {
    this.Util.sweetAlertConfirm(this.CATranslate("text_are_you_sure", this.props.locale))
    .then(willVoid => {
      if (willVoid) {
        SaleOrderService.void(id)
        .then(() => {
          message.success("Void success");
          this.fetchList();
          this.fetchSummary();
        })
        .catch(() => message.error("Error!......"));
      }
    });
  }

  handleDelete(id) {
    this.Util.sweetAlertConfirm(this.CATranslate("text_are_you_sure", this.props.locale))
    .then(willDelete => {
      if (willDelete) {
        SaleOrderService.delete(id)
        .then(() => {
          message.success("Delete success");
          this.fetchList();
          this.fetchSummary();
        })
        .catch(() => message.error("Error!......"));
      }
    });
  }

  async fetchSalesOrderById(id) {
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
        className="mg-right"
        onClick={() => history.push({pathname: "/transactions/sale-order/create"})}>
        <span className="icon-add icon-padding-right"></span>
        <Translate id="text_add_new" />
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
            {...pagination}
          />
          <div style={{display: "none"}}>
            <SalesOrderPrint formData={this.state.formData} ref={el => (this.componentRef = el)} />
            <PackingSlip formData={this.state.formData} ref={el => (this.packingSlipRef = el)} />
            <DeliveryNote formData={this.state.formData} ref={el => (this.deliveryNoteRef = el)} />
          </div>
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
    this.applyDateRange(dates, "custom");
  }

  handleDateFilterChange = (dateFilter) => {
    if (dateFilter === "custom") {
      this.setState({dateFilter});
      return;
    }

    this.applyDateRange(DATE_FILTERS[dateFilter].getRange(), dateFilter);
  }

  handleChangeStatus = (status) => {
    const params = new URLSearchParams(document.location.search);
    const normalizedStatus = Number(status);
    if (!Number.isNaN(normalizedStatus) && normalizedStatus >= 0){
      params.set("status", normalizedStatus);
    }else{
      params.delete("status");
    }
    this.setState({activeTab: this.getTabKeyByStatus(normalizedStatus)});
    this.Util.pushParamsToURL(this.pathname,  params.toString());
    this.fetchList();
  }

  handleRefresh = () => {
    this.setState({loadingButton: true}, () => {
      this.fetchList(true);
    });
  }

  getTabKeyByStatus = (status) => {
    const normalizedStatus = Number(status);

    switch (normalizedStatus) {
      case Enum.SALE_ORDER_STATUS.DRAFT:
        return "draftSales";
      case Enum.SALE_ORDER_STATUS.CONFIRMED:
        return "toInvoiceSales";
      case Enum.SALE_ORDER_STATUS.CLOSED:
        return "completedSales";
      case Enum.SALE_ORDER_STATUS.VOID:
        return "voidSales";
      default:
        return "allSales";
    }
  }

  getStatusByTabKey = (tabKey) => {
    return this.tabStatusMap[tabKey];
  }

  handleTabChange = (activeKey) => {
    const params = new URLSearchParams(document.location.search);
    params.set("workflow", activeKey);
    params.delete("status");
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.setState({activeTab: activeKey});
    this.fetchList(false, activeKey);
  }

  buildTabFilter = (activeTab) => {
    const workflowFilter = {};

    switch (activeTab) {
      case "draftSales":
        workflowFilter.status = Enum.SALE_ORDER_STATUS.DRAFT;
        break;
      case "toInvoiceSales":
        workflowFilter.status = Enum.SALE_ORDER_STATUS.CONFIRMED;
        break;
      case "shippingSales":
        workflowFilter.status = Enum.SALE_ORDER_STATUS.CONFIRMED;
        workflowFilter.shippingStatus = ["ORDERED", "PACKED", "SHIPPED"];
        break;
      case "completedSales":
        workflowFilter.status = Enum.SALE_ORDER_STATUS.CLOSED;
        break;
      case "voidSales":
        workflowFilter.status = Enum.SALE_ORDER_STATUS.VOID;
        break;
      default:
        break;
    }

    return workflowFilter;
  }

  renderSaleOrderTable = () => {
    const params = new URLSearchParams(window.location.search);
    const selectedDateRange = this.getRangeFromParams();

    return (
      <React.Fragment>
        <Row style={{ marginBottom: 10 }} gutter={8}>
          <Col span={16}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Input
                  name="search"
                  placeholder="Search SO number, customer name, or phone"
                  prefix={<Icon type="search" />}
                  defaultValue={params.get("search") ? params.get("search") : ""}
                  style={{height: 32, width: 350, maxWidth: "100%"}}
                  allowClear={true}
                  onChange={this.handleSearch}
              />
              <Select
                value={this.state.dateFilter}
                onChange={this.handleDateFilterChange}
                style={{ width: 160 }}
              >
                {Object.keys(DATE_FILTERS).map((key) => (
                  <Select.Option key={key} value={key}>{DATE_FILTERS[key].label}</Select.Option>
                ))}
              </Select>
              <RangePicker
                value={selectedDateRange}
                allowClear={false}
                onChange={this.handleChangeDate}
                format="MMM D, YYYY"
                style={{ width: 300, maxWidth: "100%" }}
              />
            </div>
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            <Button style={{ marginRight: 10 }} onClick={this.handleRefresh} loading={this.state.loadingButton}>
              <Icon type="reload" />
              <span style={{ marginLeft: 6 }}>Reload</span>
            </Button>
            {this.renderColumnSettings()}
          </Col>
        </Row>
        <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 10 }}>
          {this.getShowingDateLabel()}
        </div>
        <Table
            bordered
            pagination={{
              total: this.state.pagination.total,
              pageSize: this.state.pagination.limit,
              current: this.state.current,
              pageSizeOptions: this.pageSizeOptions,
              showTotal: (total) =>
                `${this.CATranslate(
                  "text_total",
                  this.props.locale
                )} ${total} ${this.CATranslate(
                  "text_records",
                  this.props.locale
                )}`,
              showSizeChanger: true,
              defaultCurrent: this.state.current,
              defaultPageSize: this.pageSize,
              onShowSizeChange: this.onShowSizeChange,
              onChange: this.onChangePagination,
            }}
            rowKey="id"
            loading={this.state.loading}
            columns={this.getVisibleColumns()}
            dataSource={this.state.data}
            onChange={this.onChange}
            size="middle"
            scroll={{ x: "max-content" }}
        />
      </React.Fragment>
    );
  }

  render() {
    const {summaryData} = this.state;

    return (<React.Fragment>
          {/* <Row gutter={16} style={{marginTop: 15, marginBottom: 15}}>
            <Col span={8}>
              <Card>
                <Statistic
                    title={<Translate id="text_confirmed"/>}
                    value={summaryData.confirmed ? summaryData.confirmed : 0 }
                    precision="0"
                    valueStyle={{color: "rgb(24, 144, 255)"}}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                    title={<Translate id="text_closed"/>}
                    value={summaryData.closed ? summaryData.closed : 0 }
                    precision="0"
                    valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                    title={<Translate id="text_void"/>}
                    value={summaryData.void ? summaryData.void : 0 }
                    precision="0"
                    valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
          </Row> */}
          <div className="content-list">
            <div className="table-wrapper">
              <PageHeader
                title={`All Sales (${this.state?.pagination?.total || 0})`}
                subtitle="See and manage your orders"
                breadcrumbs={[
                  { text: "Dashboard", href: "/dashboard" },
                  { text: "Sales Orders" },
                ]}
                actions={[
                  {
                    text: "New Sales Order",
                    type: "primary",
                    icon: "plus",
                    onClick: () => {
                      ReactGA.event({
                        category: "Action Button",
                        action: "Add New SO",
                        label: "ERP HUB Web",
                      });

                      history.push("/sales/create");
                    },
                  },
                ]}
              />
              <Tabs
                activeKey={this.state.activeTab}
                onChange={this.handleTabChange}
              >
                <TabPane
                  tab={`All (${this.state?.pagination?.total || 0})`}
                  key="allSales"
                  style={{ paddingLeft: "40px", paddingRight: "40px" }}
                >
                  {this.renderSaleOrderTable()}
                </TabPane>
                <TabPane
                  tab={`Draft (${summaryData.draft ? summaryData.draft : 0})`}
                  key="draftSales"
                  style={{ paddingLeft: "40px", paddingRight: "40px" }}
                >
                  {this.renderSaleOrderTable()}
                </TabPane>
                <TabPane
                  tab={`To Invoice (${summaryData.confirmed ? summaryData.confirmed : 0})`}
                  key="toInvoiceSales"
                  style={{ paddingLeft: "40px", paddingRight: "40px" }}
                >
                  {this.renderSaleOrderTable()}
                </TabPane>
                <TabPane
                  tab="Shipping"
                  key="shippingSales"
                  style={{ paddingLeft: "40px", paddingRight: "40px" }}
                >
                  {this.renderSaleOrderTable()}
                </TabPane>
                <TabPane
                  tab={`Completed (${summaryData.closed ? summaryData.closed : 0})`}
                  key="completedSales"
                  style={{ paddingLeft: "40px", paddingRight: "40px" }}
                >
                  {this.renderSaleOrderTable()}
                </TabPane>
                <TabPane
                  tab={`Void (${summaryData.void ? summaryData.void : 0})`}
                  key="voidSales"
                  style={{ paddingLeft: "40px", paddingRight: "40px" }}
                >
                  {this.renderSaleOrderTable()}
                </TabPane>
              </Tabs>
            </div>
          </div>
        </React.Fragment>
    );
  }
}
