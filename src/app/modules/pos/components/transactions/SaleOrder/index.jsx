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
  Input,
  Table,
  Tabs,
  DatePicker,
  Select,
  Tooltip
} from "antd";
import { ShoppingCart, MessagesSquare, Package, Wallet, AlertCircle, RefreshCw, Phone, Music2, Store, Building2, Send, Globe2 } from "lucide-react";
import SalesOrderPrint from "./Invoice/sales-order-print";
import PackingSlip from "./Invoice/packing-slip";
import DeliveryNote from "./Invoice/delivery-note";
import Component from "../../../../common/components/Component";
import SaleOrderService from "@services/SaleOrderService";
import PaymentMethodService from "@services/PaymentMethodService";
import Enum from "../../../enums";
import QuickSaleModal from "./quick-sale-modal";
import "./sale-order-list.css";

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
const toFiniteNumber = value => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const getBreakdownLabel = entry => typeof entry === "string"
  ? entry
  : entry && (entry.name || entry.label || entry.sourceName || entry.providerName || entry.source || entry.provider || entry.sourceId || entry.providerId || entry.code) || "Other";
const getBreakdownCount = entry => typeof entry === "number"
  ? toFiniteNumber(entry)
  : entry ? toFiniteNumber(entry.orderCount ?? entry.count ?? entry.parcelCount ?? entry.shipmentCount) : null;
const ORDER_ORIGIN_LABELS = {
  manual: "Phone Call",
  telegram: "Telegram",
  facebook: "Messenger",
  facebook_page: "Messenger",
  tiktok: "TikTok Shop",
  walk_in: "Walk-In",
  b2b: "B2B Trade"
};
const getOrderChannelLabel = record => {
  if (record.channel) return record.channel;
  const origin = String(record.originId || "").toLowerCase();
  if (ORDER_ORIGIN_LABELS[origin]) return ORDER_ORIGIN_LABELS[origin];
  if (origin) return origin.replace(/[_-]+/g, " ").replace(/\b\w/g, character => character.toUpperCase());
  return String(record.orderChannel || "").replace(/[_-]+/g, " ");
};
const getOrderChannelIcon = record => {
  const source = `${record.originId || ""} ${record.channel || ""} ${record.orderChannel || ""}`.toLowerCase();
  if (/telegram/.test(source)) return Send;
  if (/facebook|messenger/.test(source)) return MessagesSquare;
  if (/tiktok|tik.?tok/.test(source)) return Music2;
  if (/walk.?in|in.?store/.test(source)) return Store;
  if (/b2b|business|trade/.test(source)) return Building2;
  if (/manual|phone|call/.test(source)) return Phone;
  return Globe2;
};

const FULFILLMENT_STATUSES = [
  "ORDERED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "CANCELED",
  "PENDING", "READY", "READY_FOR_DISPATCH", "IN_TRANSIT", "OUT_FOR_DELIVERY",
  "FULFILLED", "UNFULFILLED"
];

const getPaymentDisplay = (record, paymentMethods = []) => {
  const payment = Array.isArray(record.transactionPayment) ? record.transactionPayment[0] : null;
  const rawRelatedMethod = record.paymentMethod || (payment && payment.paymentMethod);
  const relatedMethod = Array.isArray(rawRelatedMethod) ? rawRelatedMethod[0] : rawRelatedMethod;
  const relatedMethodName = typeof relatedMethod === "string" ? relatedMethod : relatedMethod && (relatedMethod.name || relatedMethod.label || relatedMethod.methodName);
  const paymentMethodId = record.paymentMethodId || relatedMethod && relatedMethod.id || (payment && payment.paymentMethodId);
  const configuredMethod = paymentMethods.find(method => String(method.id) === String(paymentMethodId));
  const rawMethod = record.paymentMethodName || relatedMethodName || (configuredMethod && (configuredMethod.name || configuredMethod.label)) || "";
  const rawStatus = record.paymentStatus || record.paymentState || (payment && payment.status) || "";
  const combinedStatus = !rawStatus && /\s+(paid|pending)$/i.test(rawMethod)
    ? rawMethod.match(/\s+(paid|pending)$/i)[1]
    : "";
  const method = combinedStatus ? rawMethod.replace(/\s+(paid|pending)$/i, "") : rawMethod;

  return { method, status: rawStatus || combinedStatus };
};

const getFulfillmentDisplay = record => {
  const provider = record.fulfillmentProviderName || record.fulfillmentProvider || record.shippingProviderName || record.shippingProvider || record.deliveryProvider || record.shippingMethodName || record.fulfillmentProviderId || "";
  const shippingValue = record.shippingStatus || "";
  const isShippingStatus = FULFILLMENT_STATUSES.includes(String(shippingValue).toUpperCase());

  if (provider) return provider;
  if (shippingValue && !isShippingStatus) return shippingValue;
  if (record.customerId === "WALK_IN") return "In-Store";
  return "";
};

const getFulfillmentProviderLogoSource = provider => {
  const identity = String(provider || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (identity.includes("jnt") || identity.includes("j t")) return "/fulfillments/jnt_express.png";
  if (identity.includes("grab")) return "/fulfillments/grab_express.png";
  if (identity.includes("vireak") || identity.includes("virak") || identity.includes("buntham")) return "/fulfillments/vireak-buntham.png";
  return "";
};
const renderFulfillmentProvider = provider => {
  const inStore = /^in[- ]?store$/i.test(provider);
  const logoSource = getFulfillmentProviderLogoSource(provider);
  return (
    <span
      className={`sale-order-fulfillment-icon-box${inStore ? " sale-order-fulfillment-in-store" : ""}`}
      title={provider}
      aria-label={`Fulfillment provider: ${provider}`}
      role="img"
    >
      {logoSource ? <img src={logoSource} alt="" /> : <Icon type={inStore ? "shop" : "car"} />}
    </span>
  );
};

const formatBadgeLabel = value => String(value).replace(/_/g, " ");

export default class SaleOrderPage extends Component {
  constructor(props) {
    super(props);
    this.allOrdersCountRequestId = 0;
    this.dashboardSummaryRequestId = 0;
    this.columnSettingsKey = "sale_order_table_visible_columns";
    this.requiredColumns = ["orderChannel", "action"];
    this.defaultVisibleColumns = [
      "orderChannel",
      "firstName",
      "shippingAddress",
      "itemSummary",
      "paymentSummary",
      "shippingStatus",
      "totalSale",
      "action"
    ];
    this.allColumns = [
      {
        title: "Order & Channel",
        settingLabel: "text_order_channel",
        dataIndex: "number",
        key: "orderChannel",
        width: 205,
        render: (number, record) => {
          const channel = getOrderChannelLabel(record);
          const channelIcon = getOrderChannelIcon(record);
          return (
            <div className="sale-order-order-cell">
              <span
                className="sale-order-channel-icon"
                title={channel || "Order channel"}
                aria-label={channel || "Order channel"}
              >
                {React.createElement(channelIcon, { size: 15, strokeWidth: 2 })}
              </span>
              <div className="sale-order-number-cell">
                <strong>{number}</strong>
                <span>{this.Util.formatDate(record.registerDate, "h:mm A • MMM D")}</span>
                {channel && <small>{channel}</small>}
              </div>
            </div>
          );
        }
      },
      {
        title: <Translate id="text_status" />,
        settingLabel: "text_status",
        dataIndex: "status",
        key: "status",
        width: 120,
        align: "center",
        render: (status) => {
          const statusInfo = this.SALE_ORDER_STATUS_STR[status];
          const statusName = statusInfo && typeof statusInfo.title !== "string"
            ? String(statusInfo.title.props.id || status).replace(/^text_/, "").replace(/_/g, " ")
            : String(status || "Unknown");
          return <span className={`sale-order-status sale-order-status-${String(statusName).toLowerCase().replace(/[^a-z]+/g, "-")}`}>{statusInfo ? statusInfo.title : statusName}</span>;
        }
      },
      {
        title: <Translate id="text_customer" />,
        settingLabel: "text_customer",
        dataIndex: "firstName",
        key: "firstName",
        render: (firstName, record) => (
          <div className="sale-order-customer-cell">
            <strong>{record.customerId === "WALK_IN" ? "Walk-In" : `${firstName || ""} ${record.lastName || ""}`.trim()}</strong>
            {record.phoneNumber && (
              <span className="sale-order-customer-phone">
                {record.phoneNumber}
                <Button
                  type="link"
                  size="small"
                  className="sale-order-copy-phone"
                  title="Copy phone number"
                  aria-label={`Copy phone number ${record.phoneNumber}`}
                  onClick={event => this.copyPhoneNumber(record.phoneNumber, event)}
                >
                  <Icon type="copy" />
                </Button>
              </span>
            )}
          </div>
        )
      },
      {
        title: "Delivery address",
        settingLabel: "text_delivery_address",
        dataIndex: "shippingAddress",
        key: "shippingAddress",
        render: address => address || <span className="sale-order-muted">—</span>
      },
      {
        title: "Items Summary",
        settingLabel: "text_item_summary",
        dataIndex: "totalItem",
        key: "itemSummary",
        render: (totalItem, record) => {
          const items = record.itemSummary
            ? String(record.itemSummary).split(/,\s*/).filter(Boolean)
            : [];
          const itemCount = Number(totalItem) || items.length;
          if (!itemCount && !items.length) return <span className="sale-order-muted">—</span>;

          const summary = <strong>{itemCount || items.length} items</strong>;
          if (!items.length) return summary;

          return (
            <Tooltip
              title={<div className="sale-order-item-summary-tooltip">{items.map((item, index) => <div key={`${index}-${item}`}>{item}</div>)}</div>}
              overlayClassName="sale-order-item-summary-tooltip-overlay"
              placement="topLeft"
              trigger={["hover", "focus"]}
            >
              <span className="sale-order-item-summary-trigger" tabIndex={0} aria-label={`Show ${items.length} order items`}>{summary}</span>
            </Tooltip>
          );
        }
      },
      {
        title: "Payment",
        settingLabel: "text_payment",
        dataIndex: "paymentMethodName",
        key: "paymentSummary",
        render: (paymentMethodName, record) => {
          const paymentDisplay = getPaymentDisplay({ ...record, paymentMethodName }, this.state.paymentMethods);
          if (!paymentDisplay.method && !paymentDisplay.status) return <span className="sale-order-muted">—</span>;

          const statusLabel = paymentDisplay.status && formatBadgeLabel(paymentDisplay.status);
          const statusTone = statusLabel && /^(paid|confirmed)$/i.test(statusLabel)
            ? "paid"
            : statusLabel && /^pending$/i.test(statusLabel)
              ? "pending"
              : "neutral";

          return (
            <span className="sale-order-badge-stack">
              {paymentDisplay.method && <span className="sale-order-payment" title={paymentDisplay.method}>{paymentDisplay.method}</span>}
              {statusLabel && <span className={`sale-order-payment-status sale-order-payment-status-${statusTone}`} title={statusLabel}>{statusLabel}</span>}
            </span>
          );
        }
      },
      {
        title: "Fulfillment",
        settingLabel: "text_fulfillment",
        dataIndex: "shippingStatus",
        key: "shippingStatus",
        render: (shippingStatus, record) => {
          const provider = getFulfillmentDisplay({ ...record, shippingStatus });
          const progress = shippingStatus ? String(shippingStatus).replace(/_/g, " ") : "";
          const dispatchStatus = String(record.dispatchStatus || "").toUpperCase();
          if (!provider && !progress && !dispatchStatus) return <span className="sale-order-muted">—</span>;

          return (
            <div className="sale-order-fulfillment-cell">
              {provider && renderFulfillmentProvider(provider)}
              {progress && <span className={`sale-order-shipping-progress sale-order-shipping-${String(shippingStatus).toLowerCase().replace(/_/g, "-")}`}>{progress}</span>}
              {dispatchStatus === "QUEUED" && <small className="sale-order-dispatch-progress">Dispatch queued</small>}
            </div>
          );
        }
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
        title: <Translate id="text_deposit" />,
        settingLabel: "text_deposit",
        dataIndex: "deposit",
        key: "deposit",
        align: "right",
        render: deposit => this.Util.formatCurrency(deposit)
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
        title: "Total",
        settingLabel: "text_total",
        dataIndex: "total",
        key: "totalSale",
        align: "right",
        render: (total, record) => {
          const feeValue = record.fulfillmentProviderId && record.fulfillmentFee !== null && record.fulfillmentFee !== undefined
            ? record.fulfillmentFee
            : record.deliveryFee;
          const deliveryFee = Number(feeValue);
          const discount = Number(record.discount);
          const provider = getFulfillmentDisplay(record);
          const hasDeliveryFee = feeValue !== null && feeValue !== undefined && feeValue !== "" && Number.isFinite(deliveryFee);
          const hasDiscount = Number.isFinite(discount) && discount > 0;
          const isDeliveryProvider = provider && !/^in[- ]?store$/i.test(provider);

          return (
            <div className="sale-order-total-cell">
              <strong className="sale-order-total-value">{this.Util.formatCurrency(Number(total) || 0)}</strong>
              {hasDeliveryFee && deliveryFee > 0 && (
                <span className="sale-order-total-note sale-order-total-note-delivery">+{this.Util.formatCurrency(deliveryFee)} Deliv</span>
              )}
              {hasDeliveryFee && deliveryFee === 0 && isDeliveryProvider && (
                <span className="sale-order-total-note sale-order-total-note-delivery">Free Ship</span>
              )}
              {hasDiscount && (
                <span className="sale-order-total-note sale-order-total-note-discount">-{this.Util.formatCurrency(discount)} Discount</span>
              )}
            </div>
          );
        }
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
                <this.Link to={`/sales/update/${record.id}`}>
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
      allOrdersTotal: null,
      summaryData: {},
      summaryLoading: true,
      summaryError: false,
      dashboardSummary: null,
      dashboardSummaryLoading: true,
      dashboardSummaryError: false,
      activeTab: "allSales",
      current: 1,
      formData: null,
      loading: false,
      loadingButton: false,
      paymentMethods: [],
      isShowFilter: true,
      isHasAccessPermission: null,
      visibleColumns: this.defaultVisibleColumns,
      dateFilter: DEFAULT_DATE_FILTER,
      quickSaleVisible: false
    };
    this.title = <Translate id="text_orders"/>;
    this.pageSize = 25;
    this.fetchingProp = "list";
    // this.pathname = "/transactions/sales-order";
    this.pathname = "/sales";
    this.permissionModuleCode = "sales_order";
    this.tabStatusMap = {
      allSales: -1,
      confirmSales: [Enum.SALE_ORDER_STATUS.CONFIRMED, "CONFIRMED"],
      shippingSales: "SHIPPING",
      completedSales: ["COMPLETED", Enum.SALE_ORDER_STATUS.CLOSED, "CLOSED"],
      voidSales: [Enum.SALE_ORDER_STATUS.VOID, "VOID"],
    };
    this.SALE_ORDER_STATUS_STR = {
      [Enum.SALE_ORDER_STATUS.DRAFT]: { title: <Translate id="text_draft" />, color: "#bfbfbf" },
      [Enum.SALE_ORDER_STATUS.CONFIRMED]: { title: <Translate id="text_confirm" />, color: "#1890ff" },
      [Enum.SALE_ORDER_STATUS.CLOSED]: { title: <Translate id="text_closed" />, color: "#f50"},
      [Enum.SALE_ORDER_STATUS.VOID]: {title: <Translate id="text_void"/>, color: "#d9d9d9"},
      DRAFT: { title: <Translate id="text_draft" />, color: "#bfbfbf" },
      PLACED: { title: "Placed", color: "#722ed1" },
      CONFIRMED: { title: <Translate id="text_confirm" />, color: "#1890ff" },
      COMPLETED: { title: "Completed", color: "#52c41a" },
      CLOSED: { title: <Translate id="text_closed" />, color: "#f50" },
      VOID: { title: <Translate id="text_void" />, color: "#d9d9d9" }
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
      initialActiveTab = this.getTabKeyByStatus(params.get("status"));
    }

    if (params.get("workflow")) {
      const workflow = params.get("workflow");
      const legacyWorkflowTabs = {
        draftSales: "allSales",
        toInvoiceSales: "confirmSales",
        placedSales: "allSales",
        confirmedSales: "confirmSales",
        inProgressSales: "confirmSales",
        closedSales: "completedSales"
      };
      initialActiveTab = legacyWorkflowTabs[workflow] || workflow;
    }

    this.ensureDefaultDateRange(params);
    nextState.activeTab = initialActiveTab;
    nextState.dateFilter = this.getDateFilterKeyFromParams(params);
    this.setState(nextState);

    [Enum.SALE_ORDER_STATUS.DRAFT, Enum.SALE_ORDER_STATUS.CONFIRMED, Enum.SALE_ORDER_STATUS.CLOSED, Enum.SALE_ORDER_STATUS.VOID].forEach((prop) => {
      this.status_options.push( {name: this.SALE_ORDER_STATUS_STR[prop].title, value: prop});
    });

    this.loadVisibleColumns();
    PaymentMethodService.get({ limit: 100 }).then(response => {
      const methods = response && response.data && response.data.data;
      this.setState({ paymentMethods: Array.isArray(methods) ? methods : [] });
    }).catch(() => this.setState({ paymentMethods: [] }));
    this.fetchSummary();
    this.fetchDashboardSummary(params.get("start"), params.get("end"));
    this.fetchList(true, initialActiveTab);
    if (this.searchInput) this.searchInput.focus();
  }

  loadVisibleColumns = () => {
    try {
      const savedColumns = JSON.parse(localStorage.getItem(this.columnSettingsKey));
      if (Array.isArray(savedColumns) && savedColumns.length > 0) {
        const validColumns = savedColumns.filter(columnKey =>
          this.allColumns.some(column => column.key === columnKey)
        );

        if (validColumns.length > 0) {
          const nextColumns = Array.from(new Set([
            ...this.defaultVisibleColumns,
            ...this.requiredColumns,
            ...validColumns
          ]));
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
    this.fetchDashboardSummary(params.get("start"), params.get("end"));
    this.fetchList();
  }

  fetchList(withPagination= false, activeTab = this.state.activeTab) {
    const allOrdersCountRequestId = ++this.allOrdersCountRequestId;
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
      const rawStatus = params.get("status");
      const normalizedStatus = Number.isNaN(Number(rawStatus)) ? rawStatus.toUpperCase() : String(Number(rawStatus));
      const statusAliases = {
        "0": [Enum.SALE_ORDER_STATUS.DRAFT, "DRAFT"],
        DRAFT: [Enum.SALE_ORDER_STATUS.DRAFT, "DRAFT"],
        "1": [Enum.SALE_ORDER_STATUS.CONFIRMED, "CONFIRMED"],
        CONFIRMED: [Enum.SALE_ORDER_STATUS.CONFIRMED, "CONFIRMED"],
        "2": [Enum.SALE_ORDER_STATUS.CLOSED, "CLOSED"],
        CLOSED: [Enum.SALE_ORDER_STATUS.CLOSED, "CLOSED"],
        "4": [Enum.SALE_ORDER_STATUS.VOID, "VOID"],
        VOID: [Enum.SALE_ORDER_STATUS.VOID, "VOID"]
      };
      filter.status = statusAliases[normalizedStatus] || rawStatus;
    }

    offset = (offset - 1) * limit;

    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());

    this.setState({loading: true, allOrdersTotal: null});
    SaleOrderService.get({limit, offset, filter: JSON.stringify(filter), searchKey, rangFilter: ranges})
    .then((response) => {
        if (response.data && response.data.data) {
          this.setState({
            data: response.data.data,
            pagination: response.data.pagination,
            ...(activeTab === "allSales" && allOrdersCountRequestId === this.allOrdersCountRequestId
              ? {allOrdersTotal: Number(response.data.pagination && response.data.pagination.total) || 0}
              : {}),
          });
        }
    })
    .catch(() => message.error("Error"))
    .finally(() => this.setState({loading: false, loadingButton: false}));

    if (activeTab !== "allSales") {
      SaleOrderService.get({limit: 1, offset: 0, filter: "{}", searchKey, rangFilter: ranges})
        .then(response => {
          if (allOrdersCountRequestId !== this.allOrdersCountRequestId) return;
          const total = response.data && response.data.pagination && response.data.pagination.total;
          this.setState({allOrdersTotal: Number.isFinite(Number(total)) ? Number(total) : null});
        })
        .catch(() => {
          if (allOrdersCountRequestId === this.allOrdersCountRequestId) this.setState({allOrdersTotal: null});
        });
    }
  }

  fetchSummary() {
    this.setState({summaryLoading: true, summaryError: false});
    SaleOrderService.summary()
      .then(({data}) => {
        this.setState({summaryData: data && data.data && typeof data.data === "object" ? data.data : {}});
      })
      .catch(() => this.setState({summaryError: true}))
      .finally(() => this.setState({summaryLoading: false}));
  }

  fetchDashboardSummary(start, end) {
    const params = new URLSearchParams(window.location.search);
    this.ensureDefaultDateRange(params);
    const rangeStart = start || params.get("start");
    const rangeEnd = end || params.get("end");
    const requestId = ++this.dashboardSummaryRequestId;

    this.setState({dashboardSummaryLoading: true, dashboardSummaryError: false});
    SaleOrderService.dashboardSummary(rangeStart, rangeEnd)
      .then(response => {
        if (requestId !== this.dashboardSummaryRequestId) return;
        const responseData = response && response.data;
        const summary = responseData && responseData.data && typeof responseData.data === "object"
          ? responseData.data
          : responseData;
        this.setState({dashboardSummary: summary && typeof summary === "object" ? summary : null});
      })
      .catch(() => {
        if (requestId === this.dashboardSummaryRequestId) {
          this.setState({dashboardSummary: null, dashboardSummaryError: true});
        }
      })
      .finally(() => {
        if (requestId === this.dashboardSummaryRequestId) {
          this.setState({dashboardSummaryLoading: false});
        }
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
          this.fetchDashboardSummary();
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
          this.fetchDashboardSummary();
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
        this.fetchDashboardSummary(params.get("start"), params.get("end"));
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

  navigateToCreate = () => {
    const pathname = this.props.location && this.props.location.pathname || "";
    this.props.history.push(pathname.indexOf("/sales") === 0 ? "/sales/create" : "/transactions/sale-order/create");
  }

  renderButtonAddNew() {
    return <this.Button
        type="info"
        id="btnAdd"
        className="mg-right"
        onClick={this.navigateToCreate}>
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
      this.fetchDashboardSummary();
    });
  }

  copyPhoneNumber = (phoneNumber, event) => {
    event.stopPropagation();
    const copyFallback = () => {
      const input = document.createElement("textarea");
      input.value = phoneNumber;
      input.setAttribute("readonly", "");
      input.style.position = "absolute";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(input);
      return copied;
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(phoneNumber)
        .then(() => message.success("Phone number copied"))
        .catch(() => {
          if (copyFallback()) {
            message.success("Phone number copied");
          } else {
            message.error("Could not copy phone number");
          }
        });
      return;
    }

    if (copyFallback()) {
      message.success("Phone number copied");
    } else {
      message.error("Could not copy phone number");
    }
  }

  getTabKeyByStatus = (status) => {
    const normalizedStatus = typeof status === "string" && Number.isNaN(Number(status))
      ? status.toUpperCase()
      : Number(status);

    switch (normalizedStatus) {
      case Enum.SALE_ORDER_STATUS.DRAFT:
      case "DRAFT":
        return "allSales";
      case Enum.SALE_ORDER_STATUS.CONFIRMED:
      case "CONFIRMED":
        return "confirmSales";
      case "PLACED":
        return "allSales";
      case "COMPLETED":
      case Enum.SALE_ORDER_STATUS.CLOSED:
      case "CLOSED":
        return "completedSales";
      case Enum.SALE_ORDER_STATUS.VOID:
      case "VOID":
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
      case "confirmSales":
        workflowFilter.status = this.tabStatusMap.confirmSales;
        break;
      case "shippingSales":
        workflowFilter.status = [Enum.SALE_ORDER_STATUS.CONFIRMED, "CONFIRMED"];
        workflowFilter.shippingStatus = ["ORDERED", "PACKED", "SHIPPED"];
        break;
      case "completedSales":
        workflowFilter.status = this.tabStatusMap.completedSales;
        break;
      case "voidSales":
        workflowFilter.status = this.tabStatusMap.voidSales;
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
      <div className="sale-order-list-content">
        <Row className="sale-order-toolbar" gutter={12}>
          <Col xs={24} xl={15}>
            <div className="sale-order-filters">
              <Input
                  ref={(input) => { this.searchInput = input; }}
                  name="search"
                  placeholder="Search order number, customer, or phone"
                  prefix={<Icon type="search" />}
                  defaultValue={params.get("search") ? params.get("search") : ""}
                  style={{ height: 32, width: 350, maxWidth: "100%" }}
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
          <Col xs={24} xl={9}>
            <div className="sale-order-toolbar-actions">
              <Button onClick={this.handleRefresh} loading={this.state.loadingButton}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <RefreshCw size={14} aria-hidden="true" />
                  <span>Refresh</span>
                </span>
              </Button>
              {this.renderColumnSettings()}
            </div>
          </Col>
        </Row>
        <div className="sale-order-date-caption">
          {this.getShowingDateLabel()}
        </div>
        <Table
            className="sale-order-table"
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
            rowSelection={{ columnWidth: 42 }}
            onChange={this.onChange}
            size="middle"
            scroll={{ x: "max-content" }}
        />
      </div>
    );
  }

  render() {
    const {summaryData} = this.state;
    const totalOrders = this.state.allOrdersTotal == null ? "—" : Number(this.state.allOrdersTotal);
    const dashboard = this.state.dashboardSummary || {};
    const getCount = value => toFiniteNumber(value);
    const formatAmounts = values => (Array.isArray(values) ? values : [])
      .map(item => {
        const amount = toFiniteNumber(item && (item.amount ?? item.totalAmount ?? item.total ?? item.value));
        if (amount === null) return null;
        const currencyCode = item.currencyCode || item.code || item.currency || "";
        return this.Util.formatCurrency(amount, currencyCode ? `${currencyCode} ` : "");
      })
      .filter(Boolean)
      .join(" · ");
    const today = dashboard.todayComparison && dashboard.todayComparison.today || {};
    const yesterday = dashboard.todayComparison && dashboard.todayComparison.yesterday || {};
    const todayCount = getCount(today.orderCount);
    const yesterdayCount = getCount(yesterday.orderCount);
    let todayComparisonNote = "Order comparison unavailable";
    let todayComparisonTone = "neutral";
    if (todayCount !== null && yesterdayCount !== null) {
      if (yesterdayCount === 0 && todayCount > 0) {
        todayComparisonNote = `New today · ${yesterdayCount} yesterday`;
        todayComparisonTone = "positive";
      } else if (yesterdayCount === 0) {
        todayComparisonNote = "No orders today or yesterday";
      } else {
        const change = Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100);
        todayComparisonNote = change === 0
          ? `No change vs yesterday (${yesterdayCount} orders)`
          : `${change > 0 ? "↑" : "↓"} ${Math.abs(change)}% vs yesterday (${yesterdayCount} orders)`;
        todayComparisonTone = change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
      }
    }

    const sourceLabels = {telegram: "Telegram", fb: "Facebook", facebook: "Facebook", tiktok: "TikTok"};
    const sourceDetails = (Array.isArray(dashboard.chatSocial && dashboard.chatSocial.bySource) ? dashboard.chatSocial.bySource : [])
      .map(entry => {
        const rawLabel = String(getBreakdownLabel(entry));
        const label = sourceLabels[rawLabel.toLowerCase()] || rawLabel;
        return {label, value: getBreakdownCount(entry)};
      });
    const chatSocialCount = getCount(dashboard.chatSocial && dashboard.chatSocial.orderCount);
    const providerDetails = (Array.isArray(dashboard.readyForDispatch && dashboard.readyForDispatch.byProvider) ? dashboard.readyForDispatch.byProvider : [])
      .map(entry => ({label: getBreakdownLabel(entry), value: getBreakdownCount(entry)}));
    const dispatchOrderCount = getCount(dashboard.readyForDispatch && dashboard.readyForDispatch.orderCount);
    const dispatchParcelCount = getCount(dashboard.readyForDispatch && dashboard.readyForDispatch.parcelCount);
    const missingWaybills = getCount(dashboard.readyForDispatch && dashboard.readyForDispatch.missingWaybillCount);
    const dispatchNote = missingWaybills === null
      ? "Waybill coverage unavailable"
      : missingWaybills > 0
        ? `Requires waybills · ${missingWaybills}`
        : "All waybills ready";
    const dispatchTone = missingWaybills === null ? "neutral" : missingWaybills > 0 ? "negative" : "positive";
    const dashboardErrorNote = this.state.dashboardSummaryError ? "Could not load dashboard statistics." : "Statistics unavailable from the API.";
    const selectedRange = dashboard.selectedRange || {};
    const formatScopeDate = value => value ? moment(value).format("MMM D, YYYY") : "";
    const scopeStart = formatScopeDate(selectedRange.start || new URLSearchParams(window.location.search).get("start"));
    const scopeEnd = formatScopeDate(selectedRange.end || new URLSearchParams(window.location.search).get("end"));
    const dashboardScope = [scopeStart, scopeEnd].filter(Boolean).join(" – ");
    const statsLoading = this.state.dashboardSummaryLoading;
    const summaryCards = [
      {
        label: "Today’s orders",
        Icon: ShoppingCart,
        tone: "green",
        value: todayCount === null ? "—" : todayCount,
        secondary: formatAmounts(today.amountByCurrency) || "—",
        note: this.state.dashboardSummaryError ? dashboardErrorNote : todayComparisonNote,
        noteTone: todayComparisonTone
      },
      {
        label: "Chat & social orders",
        Icon: MessagesSquare,
        tone: "purple",
        value: getCount(dashboard.chatSocial && dashboard.chatSocial.orderCount) ?? "—",
        secondary: formatAmounts(dashboard.chatSocial && dashboard.chatSocial.amountByCurrency) || "—",
        details: sourceDetails,
        note: this.state.dashboardSummaryError
          ? dashboardErrorNote
          : sourceDetails.length ? "Orders by source" : chatSocialCount === 0 ? "No chat or social orders in this range" : "Source breakdown unavailable",
        noteTone: "neutral"
      },
      {
        label: "Ready for dispatch",
        Icon: Package,
        tone: "blue",
        value: getCount(dashboard.readyForDispatch && dashboard.readyForDispatch.orderCount) ?? "—",
        secondary: dispatchParcelCount === null
          ? "orders"
          : `${dispatchParcelCount} parcels`,
        details: providerDetails,
        note: this.state.dashboardSummaryError
          ? dashboardErrorNote
          : providerDetails.length ? dispatchNote : dispatchOrderCount === 0 ? "No dispatch needed" : dispatchNote,
        noteTone: this.state.dashboardSummaryError ? "negative" : dispatchTone
      },
      {
        label: "Unpaid & COD in-transit",
        Icon: Wallet,
        tone: "slate",
        value: getCount(dashboard.unpaidAndCodInTransit && dashboard.unpaidAndCodInTransit.orderCount) ?? "—",
        secondary: formatAmounts(dashboard.unpaidAndCodInTransit && dashboard.unpaidAndCodInTransit.outstandingByCurrency) || "—",
        details: [
          {label: "COD in transit", value: getCount(dashboard.unpaidAndCodInTransit && dashboard.unpaidAndCodInTransit.codInTransitCount)},
          {label: "Awaiting bank verification", value: getCount(dashboard.unpaidAndCodInTransit && dashboard.unpaidAndCodInTransit.awaitingBankVerificationCount)}
        ],
        note: this.state.dashboardSummaryError ? dashboardErrorNote : "Outstanding orders in the selected range",
        noteTone: "neutral"
      }
    ];

    return (
      <div className="sale-order-page">
        <div className="sale-order-page-header">
          <div>
            <div className="sale-order-title-row">
              <h1>Sales Orders</h1>
              <span className="sale-order-total-badge">{totalOrders} Total</span>
            </div>
            <p>Track and manage customer orders through fulfillment.</p>
          </div>
          <div className="sale-order-header-actions">
            <Button size="large" className="sale-order-quick-button" type="primary" onClick={() => this.setState({quickSaleVisible: true})}>
              <Icon type="thunderbolt" /> Quick Sale (Chat Paste) <span className="sale-order-ai-tag">AUTO</span>
            </Button>
            <Button size="large" onClick={() => {
              ReactGA.event({ category: "Action Button", action: "Add New SO", label: "ERP HUB Web" });
              this.navigateToCreate();
            }}>
              <Icon type="plus" /> Manual Order
            </Button>
            <Button size="large" disabled title="Waybill printing is not available in the current Sales Order API">
              <Icon type="printer" /> Batch Print Waybills
            </Button>
          </div>
        </div>

        {dashboardScope && <div className="sale-order-summary-range">
          Statistics: {dashboardScope}{dashboard.timeZone ? ` · ${dashboard.timeZone}` : ""}
        </div>}
        <Row className="sale-order-summary" gutter={16}>
          {summaryCards.map(card => (
            <Col key={card.label} xs={24} sm={12} xl={6}>
              <Card className={`sale-order-summary-card sale-order-summary-${card.tone}`} bordered={false} aria-busy={statsLoading}>
                {statsLoading ? <div className="sale-order-summary-skeleton" aria-label="Loading Sales Order statistics"><i /><i /><i /></div> : <>
                  <div className="sale-order-summary-topline">
                    <span>{card.label}</span>
                    <span className="sale-order-summary-icon"><card.Icon size={19} strokeWidth={1.8} /></span>
                  </div>
                  <div className="sale-order-summary-metric">
                    <strong>{card.value}</strong>
                    <span>{card.secondary}</span>
                  </div>
                  {card.details && card.details.length > 0 && <div className="sale-order-summary-details">
                    {card.details.map((detail, index) => (
                      <span className="sale-order-summary-detail" key={`${detail.label}-${index}`}>
                        <span>{detail.label}</span>
                        <strong>{detail.value === null || detail.value === undefined ? "—" : detail.value}</strong>
                      </span>
                    ))}
                  </div>}
                  <div className={`sale-order-summary-note sale-order-summary-note-${card.noteTone || "neutral"}`}>
                    {card.noteTone === "negative" && !this.state.dashboardSummaryError && <AlertCircle size={13} />}
                    {card.note}
                  </div>
                </>}
              </Card>
            </Col>
          ))}
        </Row>

        <div className="sale-order-table-panel">
          <Tabs className="sale-order-tabs" activeKey={this.state.activeTab} onChange={this.handleTabChange}>
                <TabPane
                  tab={`All (${totalOrders})`}
                  key="allSales"
                />
                <TabPane
                  tab={`Confirm (${summaryData.confirmed || 0})`}
                  key="confirmSales"
                />
                <TabPane
                  tab="To Pack & Ship"
                  key="shippingSales"
                />
                <TabPane
                  tab={`Completed${typeof summaryData.completed === "number" || typeof summaryData.closed === "number" ? ` (${(Number(summaryData.completed) || 0) + (Number(summaryData.closed) || 0)})` : ""}`}
                  key="completedSales"
                />
                <TabPane
                  tab={`Cancelled / Void (${summaryData.void ? summaryData.void : 0})`}
                  key="voidSales"
                />
          </Tabs>
          {this.renderSaleOrderTable()}
        </div>
        <QuickSaleModal
          visible={this.state.quickSaleVisible}
          onCancel={() => this.setState({quickSaleVisible: false})}
          onCreated={() => {
            this.fetchList(true);
            this.fetchSummary();
            this.fetchDashboardSummary();
          }}
        />
      </div>
    );
  }
}
