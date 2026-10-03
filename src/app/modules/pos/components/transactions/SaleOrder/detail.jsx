import React from "react";
import moment from "moment";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { 
  Spin, 
  Result,
  Menu,
  Dropdown,
  Divider,
  message,
  Form,
  Row,
  Col,
  Card,
  Tag,
  Avatar,
  Skeleton,
  Empty
} from "antd";
import {
  ArrowLeft,
  ChevronRight,
  Package,
  PackageOpen,
  UserRound,
  MapPin,
  Mail,
  Phone,
  CircleDollarSign,
  CircleAlert,
  CircleDot,
  Truck,
  CheckCircle2,
  Check,
  Clock,
  Clock3,
  MoreHorizontal,
  Printer,
  Copy,
  XCircle,
  ReceiptText,
  Building2,
  CalendarDays,
  FileText,
  Edit3,
  Eye,
  History,
  SquarePen,
  CircleGauge,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../../common/elements/ant-ui";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import Util from "../../../../common/util";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import SaleOrderService from "../../../services/transactions/SaleOrderService";
import SaleOrderInvoice from "./Invoice";
import CAInvoice from "../Invoice/CAInvoice";
import PackingSlipTem from "./Invoice/packing-slip";
import DeliveryNote from "./Invoice/delivery-note";
import "./detail.css";

const tabs = {
  SALE_ORDER: 1,
  INVOICE: 2,
  PACKING_SLIP: 3,
  DELIVERY_NOTE: 4
};

const EMPTY_VALUE = "-";
const WALK_IN_CUSTOMER_ID = "WALK_IN";

function toNumber(value) {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function getInitials(name) {
  if (!name || name === EMPTY_VALUE) return "SO";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join("");
}

function DetailCard({ title, icon, action, children, className = "", uppercase = false }) {
  return (
    <Card className={`so-detail-card ${className}`} bordered={false}>
      <div className="so-card-header">
        <div className={`so-card-title ${uppercase ? "is-uppercase" : ""}`}>
          {icon ? <span className="so-card-title-icon">{icon}</span> : null}
          <span>{title}</span>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

function MetaItem({ label, value, icon }) {
  if (!hasValue(value)) return null;

  return (
    <div className="so-meta-item">
      {icon ? <span className="so-meta-icon">{icon}</span> : null}
      <span className="so-meta-label">{label}</span>
      <span className="so-meta-value">{value}</span>
    </div>
  );
}

function SummaryRow({ label, value, strong, danger }) {
  if (!hasValue(value)) return null;

  return (
    <div className={`so-summary-row ${strong ? "is-strong" : ""} ${danger ? "is-danger" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

class SaleOrderDetail extends React.PureComponent{
  state = {
    loading: false,
    formData: {},
    invoiceDetail: {},
    activeKey: 1,
    loadingTab: false
  }
  SALE_ORDER_STATUS_STR = {
    [Enum.SALE_ORDER_STATUS.DRAFT]: { title: stringTranslate("text_draft", this.props.locale), color: "#bfbfbf" },
    [Enum.SALE_ORDER_STATUS.CONFIRMED]: { title: stringTranslate("text_confirm", this.props.locale), color: "#1890ff" },
    [Enum.SALE_ORDER_STATUS.CLOSED]: { title: stringTranslate("text_closed", this.props.locale), color: "#f50"},
    [Enum.SALE_ORDER_STATUS.VOID]: {title: stringTranslate("text_void", this.props.locale), color: "#d9d9d9"},
    DRAFT: { title: stringTranslate("text_draft", this.props.locale), color: "#bfbfbf" },
    CONFIRMED: { title: stringTranslate("text_confirm", this.props.locale), color: "#1890ff" },
    CLOSED: { title: stringTranslate("text_closed", this.props.locale), color: "#f50"},
    COMPLETED: { title: stringTranslate("text_completed", this.props.locale), color: "#52c41a"},
    VOID: {title: stringTranslate("text_void", this.props.locale), color: "#d9d9d9"}
  };
  util = new Util();

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({loading: true});
    SaleOrderService.detail(id)
    .then(response => this.setState({formData: response.data}))
    .catch(() => this.setState({formData: {}}))
    .finally(() => this.setState({loading: false}));
  }

  handleMakeAsConfirm(id) {
    SaleOrderService.markAsConfirm(id)
    .then(() => {
      message.success("Make confirm success");
      this.setState(preState => {
        return {
          formData: {
            ...preState.formData,
            status: Enum.SALE_ORDER_STATUS.CONFIRMED
          }
        };
      });
    })
    .catch(() => message.error("Error!....."));
  }

  handleVoid(id) {
    this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
    .then(willVoid => {
      if (willVoid) {
        SaleOrderService.void(id)
        .then(() => message.success("Void success"))
        .catch(() => message.error("Error!......"));
      }
    });
  }

  handleDelete(id) {
    this.util.sweetAlertConfirm(stringTranslate("text_are_you_sure", this.props.locale))
    .then(willDelete => {
      if (willDelete) {
        SaleOrderService.delete(id)
        .then(() => {
          message.success("Delete invoice success");
          history.goBack();
        })
        .catch(() => message.error("Error!......"));
      }
    });
  }

  getInvoiceData = () => {
    const {invoiceDetail} = this.state;
    if (!Object.keys(invoiceDetail).length) {
      SaleOrderService.getInvoiceBySaleOrderId(this.state.formData.id)
      .then(response => {
        this.setState({invoiceDetail: response.data});
      });
    }
  } 

  onChangeTab = (key) => {
    key = parseInt(key);
    const id = this.props.match.params.id;
    if (key === tabs.INVOICE) {
      this.setState({loadingTab: true});
      SaleOrderService.getInvoiceBySaleOrderId(id)
      .then(response => {
        this.setState({invoiceDetail: response.data});
      })
      .finally(() => this.setState({loadingTab: false}));
    }
  }

  getStatus = (status) => {
    return this.SALE_ORDER_STATUS_STR[status] || {
      title: status || EMPTY_VALUE,
      color: "#bfbfbf"
    };
  }

  isClosedStatus = (status) => {
    return status === Enum.SALE_ORDER_STATUS.CLOSED || status === "CLOSED" || status === "COMPLETED";
  }

  getCustomerName = (formData) => {
    if (formData.customerId === WALK_IN_CUSTOMER_ID) return stringTranslate("text_walkin", this.props.locale) || "Walk In";

    const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(" ");
    return fullName || EMPTY_VALUE;
  }

  getCustomerLink = (formData, content) => {
    if (formData.customerId === WALK_IN_CUSTOMER_ID || !formData.customerId || content === EMPTY_VALUE) return content;

    return <Link to={`/customer-profile/${formData.customerId}`}>{content}</Link>;
  }

  getSaleType = (type) => {
    const saleType = {
      RETAIL: "Retail",
      WHOLE_SALE: "Wholesale"
    };

    return saleType[type] || type || EMPTY_VALUE;
  }

  formatDate = (value) => {
    if (!value || !moment(value).isValid()) return EMPTY_VALUE;

    return moment(value).format("dddd DD, YYYY");
  }

  formatShortDate = (value) => {
    if (!value || !moment(value).isValid()) return EMPTY_VALUE;

    return moment(value).format("MMM DD, YYYY");
  }

  formatDateTime = (value) => {
    if (!value || !moment(value).isValid()) return EMPTY_VALUE;

    return moment(value).format("MMM DD, YYYY HH:mm");
  }

  formatMoney = (value) => this.util.formatCurrency(toNumber(value))

  getOrderItems = (formData) => {
    return Array.isArray(formData.transactionEntries)
      ? formData.transactionEntries.filter(entry => Number(entry.status) !== 3)
      : [];
  }

  getPaymentState = (formData) => {
    const deposit = toNumber(formData.deposit);
    const total = toNumber(formData.total) - toNumber(formData.discount);
    const balance = Math.max(total - deposit, 0);

    if (total <= 0) {
      return { label: "No charge", color: "default", paid: 0, balance };
    }

    if (balance <= 0) {
      return { label: "Paid", color: "green", paid: total, balance: 0 };
    }

    if (deposit > 0) {
      return { label: "Partially paid", color: "orange", paid: deposit, balance };
    }

    return { label: "Unpaid", color: "red", paid: 0, balance };
  }

  getTaxAmount = (formData) => {
    const total = toNumber(formData.total);
    const totalExcludeTax = hasValue(formData.totalExcludeTax) ? toNumber(formData.totalExcludeTax) : total;

    return Math.max(total - totalExcludeTax, 0);
  }

  getGrandTotal = (formData) => toNumber(formData.total) - toNumber(formData.discount)

  getFulfillmentState = (formData) => {
    if (this.isClosedStatus(formData.status)) {
      return { label: "Fulfilled", color: "green" };
    }

    if (formData.shippingStatus) {
      return { label: formData.shippingStatus, color: "orange" };
    }

    return { label: "Unfulfilled", color: "orange" };
  }

  getAddressLines = (formData) => {
    const lines = [
      formData.address
    ].filter(Boolean);

    return lines.length ? lines : [];
  }

  getShippingAddress = (formData) => {
    const addressLines = this.getAddressLines(formData);

    if (addressLines.length) {
      return {
        lines: addressLines,
        isPlaceholder: false
      };
    }

    return {
      lines: [
        "Phnom Penh, Cambodia",
        "Map address not set for this customer yet"
      ],
      isPlaceholder: true
    };
  }

  getProductImage = (entry) => {
    const image = entry.image || entry.imageUrl || entry.productImage || entry.product?.image;
    if (!image) return null;

    if (typeof image === "string") {
      return image;
    }

    if (image.url) {
      return image.url;
    }

    return null;
  }

  getOrderHeaderData = (formData, customerName) => ({
    number: formData.number || EMPTY_VALUE,
    createdAt: this.formatDateTime(formData.registerDate),
    customer: this.getCustomerLink(formData, customerName),
    location: formData?.client?.businessName || EMPTY_VALUE,
    channel: this.getSaleType(formData.type)
  })

  getLifecycleData = (formData) => {
    const paymentState = this.getPaymentState(formData);
    const fulfillmentState = this.getFulfillmentState(formData);
    const isConfirmed = formData.status === Enum.SALE_ORDER_STATUS.CONFIRMED || formData.status === "CONFIRMED" || this.isClosedStatus(formData.status);
    const isFulfilled = fulfillmentState.label === "Fulfilled";
    const isClosed = this.isClosedStatus(formData.status);
    const isPaid = paymentState.balance <= 0;
    const placedDate = this.formatShortDate(formData.registerDate) !== EMPTY_VALUE ? moment(formData.registerDate).format("MMM DD, HH:mm") : EMPTY_VALUE;

    return [
      {
        title: "Order Placed",
        detail: placedDate,
        state: "completed"
      },
      {
        title: "Confirmed",
        detail: isConfirmed ? "Confirmed" : "Awaiting confirmation",
        state: isConfirmed ? "completed" : "current"
      },
      {
        title: "Fulfilled & Handed",
        detail: isFulfilled ? fulfillmentState.label : "Awaiting fulfillment",
        state: isFulfilled ? "completed" : (isConfirmed ? "current" : "future")
      },
      {
        title: "Payment Pending",
        detail: isPaid ? "Settled" : `${this.formatMoney(paymentState.balance)} Outstanding`,
        state: isPaid ? "completed" : "current"
      },
      {
        title: "Order Closed",
        detail: isClosed ? "Closed" : "Pending final settlement",
        state: isClosed ? "completed" : "future"
      }
    ];
  }

  getDocuments = (formData) => [
    {
      key: "1",
      title: "Sales Order",
      status: "OFFICIAL",
      color: "blue",
      reference: formData.number || EMPTY_VALUE,
      icon: <FileText size={18} />,
      action: "Preview"
    },
    {
      key: "2",
      title: "Tax Invoice",
      status: this.getPaymentState(formData).balance > 0 ? "UNPAID" : "PAID",
      color: this.getPaymentState(formData).balance > 0 ? "orange" : "green",
      reference: this.state.invoiceDetail.number || "Available after conversion",
      icon: <ReceiptText size={18} />,
      action: "Preview"
    },
    {
      key: "3",
      title: "Packing Slip",
      status: "READY",
      color: "blue",
      reference: formData.number || EMPTY_VALUE,
      icon: <PackageOpen size={18} />,
      action: "Print"
    },
    {
      key: "4",
      title: "Delivery Note",
      status: this.getFulfillmentState(formData).label,
      color: this.getFulfillmentState(formData).color,
      reference: formData.number || EMPTY_VALUE,
      icon: <Truck size={18} />,
      action: "Preview"
    }
  ]

  getAuditEvents = (formData) => {
    const events = [];
    const paymentState = this.getPaymentState(formData);
    const fulfillmentState = this.getFulfillmentState(formData);

    if (this.isClosedStatus(formData.status)) {
      events.push({
        title: "Order Closed",
        time: EMPTY_VALUE,
        description: "Sales order is closed."
      });
    }

    if (fulfillmentState.label !== "Unfulfilled") {
      events.push({
        title: "Fulfillment Status Updated",
        time: EMPTY_VALUE,
        description: fulfillmentState.label
      });
    }

    if (formData.status === Enum.SALE_ORDER_STATUS.CONFIRMED || formData.status === "CONFIRMED" || this.isClosedStatus(formData.status)) {
      events.push({
        title: "Order Confirmed",
        time: EMPTY_VALUE,
        description: "Order has been confirmed."
      });
    }

    if (paymentState.paid > 0) {
      events.push({
        title: "Payment Recorded",
        time: EMPTY_VALUE,
        description: `${this.formatMoney(paymentState.paid)} paid to date.`
      });
    }

    events.push({
      title: "Order Created",
      time: this.formatShortDate(formData.registerDate),
      description: `Sales order ${formData.number || EMPTY_VALUE} was created.`
    });

    return events;
  }

  renderActionMenu = (formData) => (
    <Menu className="so-action-menu">
      <Menu.Item key="edit" onClick={() => history.push({pathname: `/transactions/sale-order/update/${formData.id}`})}>
        <Edit3 size={14} /> <Translate id="text_edit" />
      </Menu.Item>
      <Menu.Item key="clone">
        <Link target="_blank" to={`/transactions/sale-order/create?id=${formData.id}&action=clone`} >
          <Copy size={14} /> <Translate id="text_clone" />
        </Link>
      </Menu.Item>
      <Menu.Item key="invoice">
        <Link target="_blank" to={`/transactions/create-invoice?saleOrderId=${formData.id}&action=convertToInvoice`}>
          <ReceiptText size={14} /> <Translate id="text_convert_to_invoice" />
        </Link>
      </Menu.Item>
      <Divider style={{marginTop: 4, marginBottom: 4}} />
      <Menu.Item key="confirm" onClick={() => this.handleMakeAsConfirm(formData.id)} disabled={this.isClosedStatus(formData.status)}>
        <CheckCircle2 size={14} /> <Translate id="text_mark_as_confirm" />
      </Menu.Item>
      <Divider style={{marginTop: 4, marginBottom: 4}} />
      <Menu.Item key="print" onClick={() => window.print()} title="Ctrl + P">
        <Printer size={14} /> <Translate id="text_print" />
      </Menu.Item>
      <Menu.Item key="packing" onClick={() => window.print()} title="Ctrl + P">
        <FileText size={14} /> <Translate id="text_packing_slip" />
      </Menu.Item>
      <Menu.Item key="delivery" onClick={() => window.print()} title="Ctrl + P">
        <Truck size={14} /> <Translate id="text_delivery_note" />
      </Menu.Item>
      <Divider style={{marginTop: 4, marginBottom: 4}} />
      <Menu.Item key="void" onClick={() => this.handleVoid(formData.id)}>
        <XCircle size={14} /> <Translate id="text_void" />
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => this.handleDelete(formData.id)} className="so-danger-menu-item">
        <XCircle size={14} /> <Translate id="text_delete" />
      </Menu.Item>
    </Menu>
  )

  renderTopNavigation = (formData) => (
    <div className="so-top-nav">
      <button className="so-back-button" onClick={() => history.goBack()} aria-label="Back">
        <ArrowLeft size={18} />
      </button>
      <div className="so-breadcrumb">
        <span>Sales</span>
        <ChevronRight size={14} />
        <span>Orders</span>
        <ChevronRight size={14} />
        <strong>{formData.number || "Sales Order"}</strong>
      </div>
      <div className="so-top-tools">
        <Tag color="green">Live Sync</Tag>
        <Clock size={16} />
        <Settings size={16} />
      </div>
    </div>
  )

  renderHeader = (formData, customerName) => {
    const paymentState = this.getPaymentState(formData);
    const fulfillmentState = this.getFulfillmentState(formData);
    const header = this.getOrderHeaderData(formData, customerName);

    return (
      <div className="so-detail-header">
        <div>
          <div className="so-title-row">
            <Tag color={fulfillmentState.color} className="so-status-tag">{fulfillmentState.label}</Tag>
            <Tag color={paymentState.color} className="so-status-tag">{paymentState.label}</Tag>
            <Tag color="blue" className="so-status-tag">{header.channel}</Tag>
          </div>
          <h1>Order #{header.number}</h1>
          <div className="so-header-meta">
            <MetaItem icon={<CalendarDays size={14} />} label="Created" value={header.createdAt} />
            <MetaItem icon={<UserRound size={14} />} label="Customer" value={header.customer} />
            <MetaItem icon={<Building2 size={14} />} label="Location" value={header.location} />
            <MetaItem icon={<CircleDot size={14} />} label="Channel" value={header.channel} />
          </div>
        </div>
        <div className="so-header-actions">
          <Button type="info" onClick={() => history.push({pathname: `/transactions/sale-order/update/${formData.id}`})}>
            <Edit3 size={14} />
            <span style={{marginLeft: 6}}><Translate id="text_edit" /></span>
          </Button>
          <Button onClick={() => window.print()}>
            <Printer size={14} />
            <span style={{marginLeft: 6}}>Print / PDF</span>
          </Button>
          <Button onClick={() => history.push({pathname: `/transactions/create-invoice?saleOrderId=${formData.id}&action=convertToInvoice`})}>
            <ReceiptText size={14} />
            <span style={{marginLeft: 6}}><Translate id="text_convert_to_invoice" /></span>
          </Button>
          <Dropdown overlay={this.renderActionMenu(formData)} placement="bottomRight">
            <button className="ant-btn so-more-button" onClick={e => e.preventDefault()}>
              <MoreHorizontal size={16} />
            </button>
          </Dropdown>
        </div>
      </div>
    );
  }

  renderProgress = (formData) => {
    const lifecycle = this.getLifecycleData(formData);
    const lastEvent = lifecycle.find(step => step.state === "current") || lifecycle[lifecycle.length - 1];

    return (
      <DetailCard
        title="Order Lifecycle"
        icon={<Clock3 size={16} />}
        action={<span className="so-card-subtitle">Last event: {lastEvent.detail || EMPTY_VALUE}</span>}
        uppercase
        className="so-lifecycle-card"
      >
        <div className="so-lifecycle">
          {lifecycle.map((step, index) => (
            <div className={`so-lifecycle-step is-${step.state}`} key={step.title}>
              <div className="so-lifecycle-line" />
              <div className="so-lifecycle-marker">
                {step.state === "completed" ? <Check size={14} /> : null}
              </div>
              <div className="so-lifecycle-title">{step.title}</div>
              <div className="so-lifecycle-detail">{step.detail || EMPTY_VALUE}</div>
            </div>
          ))}
        </div>
      </DetailCard>
    );
  }

  renderProducts = (formData) => {
    const items = this.getOrderItems(formData);
    const fulfillmentState = this.getFulfillmentState(formData);
    const totalUnits = items.reduce((total, item) => total + toNumber(item.quantity), 0);

    return (
      <DetailCard
        title="Line Items & Products"
        icon={<Package size={16} />}
        action={(
          <div className="so-card-actions">
            <Tag>{items.length} Item{items.length === 1 ? "" : "s"}</Tag>
            <Tag color={fulfillmentState.color}>{fulfillmentState.label}</Tag>
          </div>
        )}
        uppercase
      >
        {items.length ? (
          <div className="so-line-items">
            <div className="so-line-items-header">
              <span>Item / SKU</span>
              <span>Status</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Tax</span>
              <span>Total</span>
            </div>
            {items.map((entry, index) => this.renderProductRow(entry, index, fulfillmentState))}
            <div className="so-line-items-footer">
              <span>{totalUnits} unit{totalUnits === 1 ? "" : "s"} in this order.</span>
            </div>
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No products" />
        )}
      </DetailCard>
    );
  }

  renderProductRow = (entry, index, fulfillmentState) => {
    const quantity = toNumber(entry.quantity);
    const price = toNumber(entry.price);
    const lineTotal = hasValue(entry.amount) ? toNumber(entry.amount) : quantity * this.util.floor(price);
    const imageUrl = this.getProductImage(entry);
    const sku = entry.sku || entry.barcode || entry.productVariantId;
    const tax = toNumber(entry.tax);

    return (
      <div className="so-product-row" key={entry.id || `${entry.itemName}-${index}`}>
        <div className="so-product-item-cell">
          <div className="so-product-image">
            {imageUrl ? <img src={imageUrl} alt={entry.itemName || "Product"} /> : <Package size={24} />}
          </div>
          <div className="so-product-info">
            <div className="so-product-name">{entry.itemName || entry.description || EMPTY_VALUE}</div>
            <div className="so-product-muted">
              {sku ? <span>SKU: {sku}</span> : null}
              {entry.variantName ? <span>{entry.variantName}</span> : null}
              {entry.unitName ? <span>{entry.unitName}</span> : null}
            </div>
          </div>
        </div>
        <div><Tag color={fulfillmentState.color}>{fulfillmentState.label}</Tag></div>
        <div className="so-table-money">{this.formatMoney(price)}</div>
        <div className="so-table-number">{quantity || EMPTY_VALUE}</div>
        <div className="so-table-money">{this.formatMoney(tax)}</div>
        <div className="so-table-money is-strong">{this.formatMoney(lineTotal)}</div>
      </div>
    );
  }

  renderPaymentDetails = (formData) => {
    const items = this.getOrderItems(formData);
    const total = toNumber(formData.total);
    const totalExcludeTax = hasValue(formData.totalExcludeTax) ? toNumber(formData.totalExcludeTax) : total;
    const discount = toNumber(formData.discount);
    const tax = this.getTaxAmount(formData);
    const deposit = toNumber(formData.deposit);
    const grandTotal = this.getGrandTotal(formData);
    const paymentState = this.getPaymentState(formData);
    const totalUnits = items.reduce((summary, item) => summary + toNumber(item.quantity), 0);
    const isFulfilled = this.getFulfillmentState(formData).label === "Fulfilled";

    return (
      <DetailCard
        title="Payment & Settlement Breakdown"
        icon={<CircleDollarSign size={16} />}
        action={<Tag color={paymentState.color}>{paymentState.label}</Tag>}
        uppercase
      >
        <div className="so-payment-grid">
          <div>
            <div className="so-payment-meta-panel">
              <MetaItem label="Payment Terms" value="Due on Receipt" />
              <MetaItem label="Preferred Method" value={formData.paymentMethod || EMPTY_VALUE} />
              <MetaItem label="Currency" value={formData.currency || EMPTY_VALUE} />
            </div>
            {isFulfilled && paymentState.balance > 0 ? (
              <div className="so-payment-warning">
                <CircleAlert size={16} />
                <span>Goods were dispatched prior to complete payment confirmation. Please collect balance upon hand-off or invoice settlement.</span>
              </div>
            ) : null}
          </div>
          <div className="so-summary-list">
            <SummaryRow label={`Subtotal (${items.length} item${items.length === 1 ? "" : "s"}, ${totalUnits} units)`} value={this.formatMoney(totalExcludeTax)} />
            <SummaryRow label="Discount" value={discount ? `-${this.formatMoney(discount)}` : this.formatMoney(0)} danger={discount > 0} />
            <SummaryRow label="Estimated Tax" value={this.formatMoney(tax)} />
            <Divider className="so-summary-divider" />
            <SummaryRow label="Grand Total" value={this.formatMoney(grandTotal)} strong />
            <SummaryRow label="Total Paid to Date" value={this.formatMoney(deposit)} />
            <div className="so-balance-due">
              <div>
                <span>Balance Due</span>
                <strong>{this.formatMoney(paymentState.balance)}</strong>
              </div>
            </div>
          </div>
        </div>
      </DetailCard>
    );
  }

  renderCustomerCard = (formData, customerName) => (
    <DetailCard title="Customer" icon={<UserRound size={16} />} uppercase>
      <div className="so-customer-block">
        <Avatar size={44}>{getInitials(customerName)}</Avatar>
        <div>
          <div className="so-customer-name">{this.getCustomerLink(formData, customerName)}</div>
          <div className="so-muted">{formData.customerId && formData.customerId !== WALK_IN_CUSTOMER_ID ? `Customer #${formData.customerId}` : "Walk-in Customer"}</div>
        </div>
      </div>
      <div className="so-contact-list">
        <div><Mail size={14} /> <span>{formData.email || EMPTY_VALUE}</span></div>
        <div><Phone size={14} /> <span>{formData.phoneNumber || EMPTY_VALUE}</span></div>
      </div>
      {this.renderCustomerShippingAddress(formData, customerName)}
    </DetailCard>
  )

  renderCustomerShippingAddress = (formData, customerName) => {
    const shippingAddress = this.getShippingAddress(formData);

    return (
      <div className="so-customer-map-section">
        <div className="so-customer-map-header">
          <div>
            <div className="so-customer-map-title">Shipping Address</div>
            <div className="so-muted">Used for delivery and customer map location.</div>
          </div>
          <button
            className="so-link-button"
            type="button"
            onClick={() => history.push({pathname: `/transactions/sale-order/update/${formData.id}`})}
          >
            Edit location
          </button>
        </div>
        <div className="so-map-preview" aria-label="Shipping address map preview">
          <div className="so-map-grid" />
          <div className="so-map-route so-map-route-one" />
          <div className="so-map-route so-map-route-two" />
          <div className="so-map-pin">
            <MapPin size={18} />
          </div>
        </div>
        <div className="so-address so-customer-address-text">
          <strong>{customerName}</strong>
          {shippingAddress.lines.map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}
          {shippingAddress.isPlaceholder ? (
            <span className="so-placeholder-note">Placeholder until customer map address is available.</span>
          ) : null}
        </div>
      </div>
    );
  }

  renderFulfillmentCard = (formData, customerName) => {
    const addressLines = this.getAddressLines(formData);
    const fulfillmentState = this.getFulfillmentState(formData);
    const location = formData?.client?.businessName || EMPTY_VALUE;

    return (
      <DetailCard
        title="Fulfillment & Delivery"
        icon={<Truck size={16} />}
        action={<Tag color={fulfillmentState.color}>{fulfillmentState.label}</Tag>}
        uppercase
      >
        <div className="so-info-list">
          <MetaItem label="Method" value={addressLines.length ? "Delivery" : "In-Store Pickup / Counter Delivery"} />
          <MetaItem label="Pickup Location" value={location} />
        </div>
        <div className="so-internal-block">
          <div className="so-internal-block-title"><MapPin size={14} /> Shipping Address</div>
          {addressLines.length ? (
            <div className="so-address">
              <strong>{customerName}</strong>
              {addressLines.map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}
            </div>
          ) : (
            <div className="so-empty-text">Not required (Counter hand-off)</div>
          )}
        </div>
      </DetailCard>
    );
  }

  renderNoteCard = (formData) => (
    <DetailCard title="Order Notes" icon={<SquarePen size={16} />} uppercase>
      <div className="so-note-text">{formData.customerNote || formData.publicNote || "No notes added to this order yet."}</div>
    </DetailCard>
  )

  renderMetadataCard = (formData) => (
    <DetailCard title="Order Attributes" icon={<CircleGauge size={16} />} uppercase>
      <div className="so-info-list">
        <MetaItem label="Sales Type" value={this.getSaleType(formData.type)} />
        <MetaItem label="Location" value={formData?.client?.businessName} />
        <MetaItem label="Order Date" value={this.formatDateTime(formData.registerDate)} />
        <MetaItem label="Order Expiry" value={this.formatShortDate(formData.validDate)} />
        <MetaItem label="Expected Shipment" value={this.formatShortDate(formData.expectedShipmentDate)} />
        <MetaItem label="VAT TIN" value={formData.VATNo} />
      </div>
    </DetailCard>
  )

  renderDocuments = (formData) => {
    const documents = this.getDocuments(formData);

    return (
      <DetailCard
        title="Documents & Paperwork"
        icon={<FileText size={16} />}
        className="so-document-card"
        uppercase
      >
        <div className="so-document-grid">
          {documents.map(document => (
            <button
              className={`so-document-tile ${String(this.state.activeKey) === document.key ? "is-active" : ""}`}
              key={document.key}
              onClick={() => this.handleDocumentSelect(document.key)}
              type="button"
            >
              <div className="so-document-icon">{document.icon}</div>
              <div className="so-document-title">{document.title}</div>
              <Tag color={document.color}>{document.status}</Tag>
              <div className="so-document-reference">{document.reference}</div>
              <div className="so-document-action"><Eye size={13} /> {document.action}</div>
            </button>
          ))}
        </div>
        <div className="so-document-preview">
          {this.renderActiveDocument(formData)}
        </div>
      </DetailCard>
    );
  }

  handleDocumentSelect = (key) => {
    this.setState({activeKey: Number(key)});
    this.onChangeTab(key);
  }

  renderActiveDocument = (formData) => {
    switch (this.state.activeKey) {
      case tabs.INVOICE:
        return (
          <div className="invoice-page">
            {this.state.loadingTab ?
              <LoadingComponent />
              :
              <CAInvoice
                formData={this.state.invoiceDetail}
                ref={ref => this.invoiceRef = ref}
                notFoundContent={<Translate id="text_sale_order_is_closed" />}
              />
            }
          </div>
        );
      case tabs.PACKING_SLIP:
        return (
          <div style={{display: "flex", justifyContent: "center"}}>
            <div style={{padding: 20, width: "fit-content", background: "white"}}>
              <PackingSlipTem formData={formData} ref={ref => (this.packingSlipRef = ref)} />
            </div>
          </div>
        );
      case tabs.DELIVERY_NOTE:
        return (
          <div style={{display: "flex", justifyContent: "center"}}>
            <div style={{padding: 20, width: "fit-content", background: "white"}}>
              <DeliveryNote formData={formData} ref={ref => (this.deliveryNoteRef = ref)} />
            </div>
          </div>
        );
      case tabs.SALE_ORDER:
      default:
        return <SaleOrderInvoice formData={formData} />;
    }
  }

  renderHistory = (formData) => {
    const events = this.getAuditEvents(formData);

    return (
      <DetailCard
        title="Order History & Audit Logs"
        icon={<History size={16} />}
        action={<span className="so-card-subtitle">Chronological</span>}
        uppercase
      >
        <div className="so-timeline">
          {events.map((event, index) => (
            <div className="so-timeline-item" key={`${event.title}-${index}`}>
              <div className="so-timeline-dot" />
              <div>
                <div className="so-timeline-title">
                  <span>{event.title}</span>
                  <span>{event.time}</span>
                </div>
                <div className="so-timeline-description">{event.description}</div>
              </div>
            </div>
          ))}
        </div>
      </DetailCard>
    );
  }

  render() {
    const {formData} = this.state;
    const customerName = this.getCustomerName(formData);

    return (
      <div className="so-detail-page">
        {
          this.state.loading ?
            <div className="so-detail-skeleton">
              <Skeleton active paragraph={{rows: 2}} />
              <Row gutter={16}>
                <Col md={16} xs={24}><Skeleton active paragraph={{rows: 8}} /></Col>
                <Col md={8} xs={24}><Skeleton active paragraph={{rows: 8}} /></Col>
              </Row>
            </div>
          : 
          Object.keys(this.state.formData).length ?
            <React.Fragment>
              {this.renderTopNavigation(formData)}
              {this.renderHeader(formData, customerName)}
              {this.renderProgress(formData)}
              <div className="so-detail-grid">
                <main className="so-main-column">
                  {this.renderProducts(formData)}
                  {this.renderPaymentDetails(formData)}
                  {this.renderDocuments(formData)}
                  {this.renderHistory(formData)}
                </main>
                <aside className="so-side-column">
                  {this.renderCustomerCard(formData, customerName)}
                  {this.renderFulfillmentCard(formData, customerName)}
                  {this.renderNoteCard(formData)}
                  {this.renderMetadataCard(formData)}
                </aside>
              </div>
            </React.Fragment>
          :
            <Result  
              status={404}
              title="404"
              subTitle="Sale order not found"
              extra={<Button type="info" onClick={() => history.goBack()}><Translate id="text_back" /></Button>}
            />
        }
      </div>
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

const saleOrderDetail =  Form.create(mapPropsToFields)(SaleOrderDetail);

function LoadingComponent() {
  return <div style={{textAlign: "center", padding: "30px 0"}}>
    <Spin />
  </div>;
}
  
export default connect(mapStateToProps)(saleOrderDetail);
