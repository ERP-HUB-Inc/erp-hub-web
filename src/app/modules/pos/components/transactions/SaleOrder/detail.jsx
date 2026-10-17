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
  Empty,
  Drawer,
  Select,
  Modal,
  Input,
  InputNumber
} from "antd";
import ReactToPrint from "react-to-print";
import {
  ArrowLeft,
  ChevronRight,
  Package,
  PackageCheck,
  PackageOpen,
  UserRound,
  MapPin,
  Mail,
  Phone,
  CircleDollarSign,
  CircleAlert,
  Truck,
  Check,
  CheckCircle2,
  Send,
  Route,
  BadgeCheck,
  Clock,
  Clock3,
  Printer,
  Copy,
  XCircle,
  ReceiptText,
  Building2,
  CalendarDays,
  FileText,
  Edit3,
  Eye,
  SquarePen,
  CircleGauge,
  Settings,
  MessagesSquare,
  Music2,
  Store,
  Globe2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../../common/elements/ant-ui";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import Util from "../../../../common/util";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import SaleOrderService from "../../../services/transactions/SaleOrderService";
import CustomerService from "@services/CustomerService";
import PaymentMethodService from "@services/PaymentMethodService";
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

function getApiErrorMessage(error) {
  const data = error && error.response && error.response.data;
  const value = data && data.message && data.message.error && data.message.error.message
    || data && data.error && data.error.message
    || data && data.message
    || error && error.message;
  return typeof value === "string" && value.trim() ? value : "The Sales Order action could not be completed.";
}

function getInvoiceTemplateOption(value) {
  if (!hasValue(value)) return Enum.PAPER_SIZE.EXCLUDE_TAX;
  const numericValue = Number.parseInt(value, 10);
  return Number.isNaN(numericValue) ? value : numericValue;
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
    loadingTab: false,
    historyDrawerVisible: false,
    invoicePreviewTemplate: null,
    packingSlipPaperSize: "a4",
    locationEditOpen: false,
    locationSaving: false,
    locationResolving: false,
    locationAddress: "",
    locationProvince: "",
    locationCity: "",
    locationMapsUrl: "",
    locationGeolocation: null,
    paymentMethods: [],
    paymentModalVisible: false,
    paymentSaving: false,
    paymentRefreshFailed: false,
    paymentMethodId: undefined,
    paymentAmount: undefined,
    paymentReferenceNo: "",
    paymentNote: "",
    paymentError: "",
    paymentIdempotencyKey: "",
    lifecycleAction: "",
    fulfillmentHistoryVisible: false,
    fulfillmentHistory: [],
    fulfillmentHistoryLoading: false,
    fulfillmentHistoryError: ""
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
    PaymentMethodService.get({ limit: 100 })
      .then(response => {
        const methods = response && response.data && response.data.data;
        this.setState({ paymentMethods: Array.isArray(methods) ? methods : [] });
      })
      .catch(() => this.setState({ paymentMethods: [] }));
  }

  runLifecycleAction = async (action, id = this.state.formData.id) => {
    if (this.state.lifecycleAction) return;
    const actions = {
      confirm: { request: SaleOrderService.markAsConfirm, success: "Order confirmed." },
      packed: { request: SaleOrderService.markPacked, success: "Order marked as packed." },
      dispatch: { request: SaleOrderService.dispatch, success: "Carrier pickup requested." },
      shipped: { request: SaleOrderService.markShipped, success: "Order marked as shipped." },
      inTransit: { request: SaleOrderService.markInTransit, success: "Delivery marked in transit." },
      delivered: { request: SaleOrderService.markDelivered, success: "Order marked as delivered." }
    };
    const selectedAction = actions[action];
    if (!selectedAction || !id) return;
    let actionSucceeded = false;
    this.setState({ lifecycleAction: action });
    try {
      await selectedAction.request.call(SaleOrderService, id);
      actionSucceeded = true;
      const response = await SaleOrderService.detail(id);
      const latestOrder = response && response.data && (response.data.data || response.data);
      if (!latestOrder || typeof latestOrder !== "object") throw new Error("Order refresh returned no data.");
      this.setState({ formData: latestOrder });
      if (this.state.fulfillmentHistoryVisible) this.loadFulfillmentHistory(id);
      message.success(selectedAction.success);
    } catch (error) {
      message.error(actionSucceeded
        ? "The action succeeded, but the order could not be refreshed. Reload the page to see its current status."
        : getApiErrorMessage(error));
    } finally {
      this.setState({ lifecycleAction: "" });
    }
  }

  openFulfillmentHistory = () => {
    this.setState({ fulfillmentHistoryVisible: true });
    this.loadFulfillmentHistory(this.state.formData.id);
  }

  loadFulfillmentHistory = async (id = this.state.formData.id) => {
    if (!id) return;
    this.setState({ fulfillmentHistoryLoading: true, fulfillmentHistoryError: "" });
    try {
      const response = await SaleOrderService.fulfillmentHistory(id);
      const payload = response && response.data;
      const historyRows = Array.isArray(payload) ? payload : payload && Array.isArray(payload.data) ? payload.data : [];
      const sortedRows = historyRows.slice().sort((left, right) => moment(left.createdAt).valueOf() - moment(right.createdAt).valueOf());
      this.setState({ fulfillmentHistory: sortedRows });
    } catch (error) {
      this.setState({ fulfillmentHistory: [], fulfillmentHistoryError: getApiErrorMessage(error) });
    } finally {
      this.setState({ fulfillmentHistoryLoading: false });
    }
  }

  getFulfillmentHistoryTitle = (entry) => {
    const toStatus = String(entry.toStatus || "").replace(/_/g, " ");
    if (entry.action === "ORDER_CONFIRMED") return "Order confirmed";
    if (entry.action === "DISPATCH_REQUESTED") return "Carrier pickup requested";
    if (entry.action === "STATUS_CHANGED") return toStatus ? `Status changed to ${toStatus}` : "Fulfillment status changed";
    return String(entry.action || toStatus || "Fulfillment updated").replace(/_/g, " ");
  }

  getFulfillmentHistoryIcon = (entry) => {
    const action = String(entry.action || "").toUpperCase();
    const status = String(entry.toStatus || "").toUpperCase();
    if (action === "ORDER_CONFIRMED" || status === "ORDERED") return <CheckCircle2 size={15} />;
    if (action === "DISPATCH_REQUESTED") return <Send size={15} />;
    if (status === "PACKED") return <PackageCheck size={15} />;
    if (status === "SHIPPED") return <Truck size={15} />;
    if (status === "IN_TRANSIT") return <Route size={15} />;
    if (status === "DELIVERED" || status === "FULFILLED") return <BadgeCheck size={15} />;
    return <Clock3 size={15} />;
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

  openLocationEditor = () => {
    const order = this.state.formData;
    const savedGeolocation = order.geolocation || order.customer?.geolocation || null;
    this.setState({
      locationEditOpen: true,
      locationAddress: order.shippingAddress || order.address || "",
      locationProvince: order.fulfillmentProvince || "",
      locationCity: order.fulfillmentCity || "",
      locationMapsUrl: "",
      locationGeolocation: savedGeolocation && typeof savedGeolocation === "object" ? savedGeolocation : null
    });
  }

  resolveEditedLocation = async () => {
    const googleMapsUrl = this.state.locationMapsUrl.trim();
    if (!googleMapsUrl) return message.warning("Paste a Google Maps share link first.");
    this.setState({ locationResolving: true });
    try {
      const response = await CustomerService.resolveLocation(googleMapsUrl);
      const result = response && response.data && (response.data.data || response.data);
      const latitude = Number(result && result.latitude);
      const longitude = Number(result && result.longitude);
      if (!result || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 || !result.formattedAddress) {
        throw new Error("The location service returned incomplete location details.");
      }
      this.setState({
        locationAddress: result.formattedAddress,
        locationProvince: result.province || this.state.locationProvince,
        locationCity: result.city || this.state.locationCity,
        locationGeolocation: { latitude, longitude }
      });
      message.success("Location found. Review the address, then save.");
    } catch (error) {
      const data = error && error.response && error.response.data;
      const errorMessage = data && data.message && data.message.error && data.message.error.message || data && data.message || error.message || "Could not resolve this Google Maps link.";
      message.error(typeof errorMessage === "string" ? errorMessage : "Could not resolve this Google Maps link.");
    } finally {
      this.setState({ locationResolving: false });
    }
  }

  saveLocationEdit = async () => {
    if (this.state.locationResolving || this.state.locationSaving) return;
    const order = this.state.formData;
    const address = this.state.locationAddress.trim();
    if (!address) return message.warning("Enter a shipping address before saving.");
    this.setState({ locationSaving: true });
    const updates = {
      shippingAddress: address,
      fulfillmentProvince: this.state.locationProvince.trim(),
      fulfillmentCity: this.state.locationCity.trim(),
      ...(this.state.locationGeolocation ? { geolocation: this.state.locationGeolocation } : {})
    };
    try {
      await SaleOrderService.updateLocation(order.id, updates);
      this.setState(state => ({
        locationEditOpen: false,
        formData: { ...state.formData, ...updates, address }
      }));
      message.success("Shipping location updated.");
    } catch (error) {
      const data = error && error.response && error.response.data;
      const errorMessage = data && data.message && data.message.error && data.message.error.message || data && data.message || error.message || "Could not update the shipping location.";
      message.error(typeof errorMessage === "string" ? errorMessage : "Could not update the shipping location.");
    } finally {
      this.setState({ locationSaving: false });
    }
  }

  getInvoiceData = () => {
    const {invoiceDetail} = this.state;
    if (!Object.keys(invoiceDetail).length) {
      SaleOrderService.getInvoiceBySaleOrderId(this.state.formData.id)
      .then(response => {
        this.setState(state => ({
          invoiceDetail: response.data,
          invoicePreviewTemplate: state.invoicePreviewTemplate === null
            ? getInvoiceTemplateOption(response.data && response.data.template)
            : state.invoicePreviewTemplate
        }));
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
        this.setState(state => ({
          invoiceDetail: response.data,
          invoicePreviewTemplate: state.invoicePreviewTemplate === null
            ? getInvoiceTemplateOption(response.data && response.data.template)
            : state.invoicePreviewTemplate
        }));
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

  getOrderChannelLabel = (formData) => {
    const origin = String(formData.originId || "").trim().toLowerCase();
    const originLabels = {
      manual: "Phone Call",
      call: "Phone Call",
      phone: "Phone Call",
      telegram: "Telegram",
      facebook: "Messenger",
      facebook_page: "Messenger",
      messenger: "Messenger",
      tiktok: "TikTok Shop",
      walk_in: "Walk-In",
      b2b: "B2B Trade"
    };
    if (originLabels[origin]) return originLabels[origin];
    if (formData.channel && String(formData.channel).toUpperCase() !== "MANUAL") return formData.channel;

    const orderChannel = String(formData.orderChannel || "").trim();
    if (orderChannel) return orderChannel.replace(/[_-]+/g, " ").replace(/\b\w/g, character => character.toUpperCase());
    return formData.channel || EMPTY_VALUE;
  }

  getOrderChannelIcon = (formData) => {
    const source = `${formData.originId || ""} ${formData.channel || ""} ${formData.orderChannel || ""}`.toLowerCase();
    if (/telegram/.test(source)) return <Send size={14} />;
    if (/facebook|messenger/.test(source)) return <MessagesSquare size={14} />;
    if (/tiktok|tik.?tok/.test(source)) return <Music2 size={14} />;
    if (/walk.?in|in.?store/.test(source)) return <Store size={14} />;
    if (/b2b|business|trade/.test(source)) return <Building2 size={14} />;
    if (/manual|phone|call/.test(source)) return <Phone size={14} />;
    return <Globe2 size={14} />;
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

  getPaymentMethodName = (formData) => {
    const payment = Array.isArray(formData.transactionPayment) ? formData.transactionPayment[0] : null;
    const rawMethod = formData.paymentMethod || (payment && payment.paymentMethod);
    const relatedMethod = Array.isArray(rawMethod) ? rawMethod[0] : rawMethod;
    const methodId = formData.paymentMethodId || relatedMethod && relatedMethod.id || payment && payment.paymentMethodId;
    const relatedName = typeof relatedMethod === "string" && relatedMethod !== String(methodId || "")
      ? relatedMethod
      : relatedMethod && (relatedMethod.name || relatedMethod.label || relatedMethod.methodName);
    const configuredMethod = this.state.paymentMethods.find(method => String(method.id) === String(methodId));
    return formData.paymentMethodName || relatedName || configuredMethod && (configuredMethod.name || configuredMethod.label) || EMPTY_VALUE;
  }

  getPaymentTerms = (formData) => {
    const rawTerms = formData.paymentTerms || formData.paymentTerm || formData.payTerm;
    if (typeof rawTerms === "string" && rawTerms.trim()) return rawTerms;
    if (rawTerms && typeof rawTerms === "object") {
      const label = rawTerms.name || rawTerms.label || rawTerms.description;
      if (label) return label;
    }
    const rawDays = formData.payTermNumber ?? formData.paymentTermDays;
    if (rawDays === undefined || rawDays === null || rawDays === "") return EMPTY_VALUE;
    const days = Number(rawDays);
    if (!Number.isFinite(days) || days < 0) return EMPTY_VALUE;
    return days === 0 ? "Due on Receipt" : `Net ${days} day${days === 1 ? "" : "s"}`;
  }

  getOrderCurrency = (formData) => {
    const currency = formData.currencyCode || formData.currency || formData.currencyName;
    if (typeof currency === "string" && currency.trim()) return currency;
    if (currency && typeof currency === "object") return currency.code || currency.currencyCode || currency.name || EMPTY_VALUE;
    return EMPTY_VALUE;
  }

  getOrderItems = (formData) => {
    return Array.isArray(formData.transactionEntries)
      ? formData.transactionEntries.filter(entry => Number(entry.status) !== 3)
      : [];
  }

  getDeliveryFee = (formData) => {
    const fee = formData.fulfillmentProviderId && hasValue(formData.fulfillmentFee)
      ? formData.fulfillmentFee
      : formData.deliveryFee;
    return hasValue(fee) ? toNumber(fee) : 0;
  }

  getPaymentState = (formData) => {
    const transactionPayments = Array.isArray(formData.transactionPayment) ? formData.transactionPayment : [];
    const tender = transactionPayments.reduce((sum, payment) => sum + toNumber(payment.tender || payment.amount), 0);
    const deposit = toNumber(formData.deposit);
    const total = this.getGrandTotal(formData);
    const balance = Math.max(total - deposit - tender, 0);

    if (total <= 0) {
      return { label: "No charge", color: "default", paid: 0, balance };
    }

    if (balance <= 0) {
      return { label: "Paid", color: "green", paid: total, balance: 0 };
    }

    if (deposit + tender > 0) {
      return { label: "Partially paid", color: "orange", paid: deposit + tender, balance };
    }

    return { label: "Unpaid", color: "red", paid: 0, balance };
  }

  openPaymentModal = () => {
    const formData = this.state.formData;
    const currentMethodId = formData.paymentMethodId || (formData.paymentMethod && formData.paymentMethod.id);
    const pendingRetry = Boolean(this.state.paymentIdempotencyKey);
    this.setState({
      paymentModalVisible: true,
      paymentMethodId: pendingRetry ? this.state.paymentMethodId : currentMethodId ? String(currentMethodId) : undefined,
      paymentAmount: pendingRetry ? this.state.paymentAmount : this.getPaymentState(formData).balance,
      paymentReferenceNo: pendingRetry ? this.state.paymentReferenceNo : "",
      paymentNote: pendingRetry ? this.state.paymentNote : "",
      paymentError: ""
    });
  }

  recordPayment = async () => {
    const { formData, paymentMethodId, paymentAmount } = this.state;
    const amount = Number(paymentAmount);
    if (!paymentMethodId) {
      this.setState({ paymentError: "Select a payment method." });
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      this.setState({ paymentError: "Enter an amount greater than zero." });
      return;
    }
    if (this.state.paymentRefreshFailed) {
      this.setState({ paymentError: "Reload the order before recording another payment." });
      return;
    }

    const idempotencyKey = this.state.paymentIdempotencyKey || `payment-${formData.id}-${Date.now()}`;
    const payload = {
      paymentMethodId,
      amount,
      ...(this.state.paymentReferenceNo.trim() ? { referenceNo: this.state.paymentReferenceNo.trim() } : {}),
      ...(this.state.paymentNote.trim() ? { note: this.state.paymentNote.trim() } : {})
    };
    this.setState({ paymentSaving: true, paymentError: "", paymentIdempotencyKey: idempotencyKey });
    try {
      await SaleOrderService.recordPayment(formData.id, payload, idempotencyKey);
      this.setState({ paymentModalVisible: false, paymentIdempotencyKey: "", paymentReferenceNo: "", paymentNote: "" });
      message.success("Payment recorded.");
      try {
        const response = await SaleOrderService.detail(formData.id);
        const latestOrder = response && response.data && (response.data.data || response.data);
        if (!latestOrder || typeof latestOrder !== "object") throw new Error("Order refresh returned no data.");
        this.setState({ formData: latestOrder, paymentRefreshFailed: false });
      } catch (refreshError) {
        this.setState({ paymentRefreshFailed: true });
        message.warning("Payment was recorded, but the order could not be refreshed. Reload the page before recording another payment.");
      }
    } catch (error) {
      this.setState({ paymentError: getApiErrorMessage(error) });
    } finally {
      this.setState({ paymentSaving: false });
    }
  }

  getTaxAmount = (formData) => {
    const total = toNumber(formData.total);
    const totalExcludeTax = hasValue(formData.totalExcludeTax) ? toNumber(formData.totalExcludeTax) : total;

    return Math.max(total - totalExcludeTax, 0);
  }

  getGrandTotal = (formData) => {
    const total = toNumber(formData.total);
    const discount = toNumber(formData.discount);

    // API orders with subTotal already include deliveryFee in `total`.
    // Older records may not have subTotal, so retain the legacy calculation for them.
    return hasValue(formData.subTotal)
      ? total - discount
      : total - discount + this.getDeliveryFee(formData);
  }

  getFulfillmentState = (formData) => {
    if (formData.shippingStatus) {
      const shippingStatus = String(formData.shippingStatus).toUpperCase();
      const color = shippingStatus === "DELIVERED" || shippingStatus === "FULFILLED"
        ? "green"
        : shippingStatus === "CANCELLED" || shippingStatus === "CANCELED"
          ? "red"
          : shippingStatus === "IN_TRANSIT" || shippingStatus === "SHIPPED"
            ? "blue"
            : "orange";
      return { label: shippingStatus.replace(/_/g, " "), color };
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

  getCustomerSocialLinks = (formData) => {
    const candidates = [
      {label: "Facebook", value: formData.facebook || formData.facebookUrl || formData.customer?.facebook || formData.customer?.facebookUrl},
      {label: "Instagram", value: formData.instagram || formData.instagramUrl || formData.customer?.instagram || formData.customer?.instagramUrl},
      {label: "Telegram", value: formData.telegram || formData.telegramUrl || formData.customer?.telegram || formData.customer?.telegramUrl},
      {label: "TikTok", value: formData.tiktok || formData.tiktokUrl || formData.customer?.tiktok || formData.customer?.tiktokUrl},
      {label: "Messenger", value: formData.messenger || formData.messengerUrl || formData.customer?.messenger || formData.customer?.messengerUrl}
    ];

    return candidates.filter(link => hasValue(link.value));
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
    channel: this.getOrderChannelLabel(formData),
    channelIcon: this.getOrderChannelIcon(formData)
  })

  getLifecycleData = (formData) => {
    const paymentState = this.getPaymentState(formData);
    const fulfillmentState = this.getFulfillmentState(formData);
    const isConfirmed = ["CONFIRMED", "1"].includes(String(formData.status || "").toUpperCase()) || this.isClosedStatus(formData.status);
    const isFulfilled = ["DELIVERED", "FULFILLED"].includes(String(formData.shippingStatus || "").toUpperCase());
    const isClosed = this.isClosedStatus(formData.status);
    const isPaid = paymentState.balance <= 0;
    const placedDate = this.formatShortDate(formData.registerDate) !== EMPTY_VALUE ? moment(formData.registerDate).format("MMM DD, HH:mm") : EMPTY_VALUE;
    const confirmedDate = this.formatShortDate(formData.confirmedAt) !== EMPTY_VALUE ? moment(formData.confirmedAt).format("MMM DD, HH:mm") : "Confirmed";
    const paymentEventDate = this.formatDateTime(isPaid ? formData.settledAt : formData.paymentPendingAt);
    const closedEventDate = this.formatDateTime(formData.closedAt);

    return [
      {
        title: "Order Placed",
        detail: placedDate,
        state: "completed"
      },
      {
        title: "Confirmed",
        detail: isConfirmed ? confirmedDate : "Awaiting confirmation",
        state: isConfirmed ? "completed" : "current"
      },
      {
        title: "Fulfilled & Handed",
        detail: isFulfilled ? fulfillmentState.label : "Awaiting fulfillment",
        state: isFulfilled ? "completed" : (isConfirmed ? "current" : "future")
      },
      {
        title: "Payment Pending",
        detail: isPaid
          ? `Settled${paymentEventDate !== EMPTY_VALUE ? ` · ${paymentEventDate}` : ""}`
          : `${this.formatMoney(paymentState.balance)} Outstanding${paymentEventDate !== EMPTY_VALUE ? ` · ${paymentEventDate}` : ""}`,
        state: isPaid ? "completed" : "current"
      },
      {
        title: "Order Closed",
        detail: isClosed
          ? `Closed${closedEventDate !== EMPTY_VALUE ? ` · ${closedEventDate}` : ""}`
          : "Pending final settlement",
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
      title: "Invoice",
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

    if (["CONFIRMED", "1"].includes(String(formData.status || "").toUpperCase()) || this.isClosedStatus(formData.status)) {
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
        <button
          className="so-history-button"
          onClick={() => this.setState({historyDrawerVisible: true})}
          aria-label="Order history and audit logs"
          type="button"
        >
          <Clock size={16} />
        </button>
        <Dropdown overlay={this.renderActionMenu(formData)} placement="bottomRight">
          <button className="so-settings-button" onClick={e => e.preventDefault()} aria-label="Sale order actions">
            <Settings size={16} />
          </button>
        </Dropdown>
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
            <Tag color="blue" className="so-status-tag"><span className="so-channel-badge">{header.channelIcon}{header.channel}</span></Tag>
          </div>
          <h1>Order #{header.number}</h1>
          <div className="so-header-meta">
            <MetaItem icon={<CalendarDays size={14} />} label="Created" value={header.createdAt} />
            <MetaItem icon={<UserRound size={14} />} label="Customer" value={header.customer} />
            <MetaItem icon={<Building2 size={14} />} label="Location" value={header.location} />
            <MetaItem icon={header.channelIcon} label="Channel" value={header.channel} />
          </div>
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
              <div className="so-lifecycle-title">
                <span>{step.title}</span>
                {step.title === "Fulfilled & Handed" && <button type="button" className="so-lifecycle-history-button" onClick={this.openFulfillmentHistory} aria-label="View fulfillment history" title="View fulfillment history"><Clock size={14} /></button>}
              </div>
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
              <span className="so-table-money">Price</span>
              <span className="so-table-number">Qty</span>
              <span className="so-table-money">Tax</span>
              <span className="so-table-money">Total</span>
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
    const sku = entry.sku || entry.barcode || entry.variantSku || entry.productVariantSku;
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
    const subtotal = hasValue(formData.subTotal)
      ? toNumber(formData.subTotal)
      : hasValue(formData.totalExcludeTax)
        ? toNumber(formData.totalExcludeTax)
        : total;
    const discount = toNumber(formData.discount);
    const deliveryFeeValue = formData.fulfillmentProviderId && hasValue(formData.fulfillmentFee)
      ? formData.fulfillmentFee
      : formData.deliveryFee;
    const deliveryFee = this.getDeliveryFee(formData);
    const tax = this.getTaxAmount(formData);
    const deposit = toNumber(formData.deposit);
    const transactionPayments = Array.isArray(formData.transactionPayment) ? formData.transactionPayment : [];
    const paidToDate = deposit + transactionPayments.reduce((sum, payment) => sum + toNumber(payment.tender || payment.amount), 0);
    const grandTotal = this.getGrandTotal(formData);
    const paymentState = this.getPaymentState(formData);
    const totalUnits = items.reduce((summary, item) => summary + toNumber(item.quantity), 0);
    const isFulfilled = this.getFulfillmentState(formData).label === "Fulfilled";

    return (
      <DetailCard
        title="Payment & Settlement Breakdown"
        icon={<CircleDollarSign size={16} />}
        action={<div className="so-payment-actions">{paymentState.balance > 0 ? <Button type="primary" disabled={this.state.paymentRefreshFailed} onClick={this.openPaymentModal}>Record payment</Button> : null}<Tag color={paymentState.color}>{paymentState.label}</Tag></div>}
        uppercase
      >
        <div className="so-payment-grid">
          <div>
            <div className="so-payment-meta-panel">
              <MetaItem label="Payment Terms" value={this.getPaymentTerms(formData)} />
              <MetaItem label="Preferred Method" value={this.getPaymentMethodName(formData)} />
              <MetaItem label="Currency" value={this.getOrderCurrency(formData)} />
            </div>
            {isFulfilled && paymentState.balance > 0 ? (
              <div className="so-payment-warning">
                <CircleAlert size={16} />
                <span>Goods were dispatched prior to complete payment confirmation. Please collect balance upon hand-off or invoice settlement.</span>
              </div>
            ) : null}
          </div>
          <div className="so-summary-list">
            <SummaryRow label={`Subtotal (${items.length} item${items.length === 1 ? "" : "s"}, ${totalUnits} units)`} value={this.formatMoney(subtotal)} />
            <SummaryRow label="Discount" value={discount ? `-${this.formatMoney(discount)}` : this.formatMoney(0)} danger={discount > 0} />
            {hasValue(deliveryFeeValue) && <SummaryRow label="Delivery Fee" value={this.formatMoney(deliveryFee)} />}
            <SummaryRow label="Estimated Tax" value={this.formatMoney(tax)} />
            <Divider className="so-summary-divider" />
            <SummaryRow label="Grand Total" value={this.formatMoney(grandTotal)} strong />
            <SummaryRow label="Total Paid to Date" value={this.formatMoney(paidToDate)} />
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
      {this.renderCustomerSocialLinks(formData)}
      {this.renderCustomerShippingAddress(formData, customerName)}
    </DetailCard>
  )

  renderCustomerSocialLinks = (formData) => {
    const socialLinks = this.getCustomerSocialLinks(formData);

    return (
      <div className="so-social-links-section">
        <div className="so-customer-map-title">Contact Links</div>
        {socialLinks.length ? (
          <div className="so-social-links">
            {socialLinks.map(link => (
              <a
                href={link.value}
                key={link.label}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : (
          <div className="so-empty-text">No social links</div>
        )}
      </div>
    );
  }

  renderCustomerShippingAddress = (formData, customerName) => {
    const shippingAddress = this.getShippingAddress(formData);
    const geolocation = formData.geolocation || formData.customer?.geolocation;
    const latitude = Number(geolocation && geolocation.latitude);
    const longitude = Number(geolocation && geolocation.longitude);
    const hasCoordinates = Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
    const mapEmbedUrl = hasCoordinates
      ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
      : "";

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
            onClick={this.openLocationEditor}
          >
            Quick edit
          </button>
        </div>
        <div className="so-map-preview" aria-label="Shipping address map preview">
          {hasCoordinates ? (
            <iframe
              title={`Google Maps location for ${customerName}`}
              src={mapEmbedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="so-map-empty"><MapPin size={18} /><span>Map location hasn’t been added</span></div>
          )}
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
    const orderStatus = String(formData.status || "").toUpperCase();
    const shippingStatus = String(formData.shippingStatus || "").toUpperCase();
    const dispatchStatus = String(formData.dispatchStatus || "").toUpperCase();
    const isConfirmed = ["CONFIRMED", "1"].includes(orderStatus);
    const canConfirm = ["DRAFT", "PLACED", "0"].includes(orderStatus);
    const hasFulfillment = Boolean(formData.fulfillmentMode || formData.fulfillmentProviderId);
    const transitions = [];
    if (canConfirm) transitions.push({ key: "confirm", label: "Confirm order" });
    if (isConfirmed && shippingStatus === "ORDERED") transitions.push({ key: "packed", label: "Mark packed" });
    if (isConfirmed && shippingStatus === "PACKED" && dispatchStatus !== "QUEUED") transitions.push({ key: "dispatch", label: "Request carrier pickup", disabled: !hasFulfillment });
    if (dispatchStatus === "QUEUED") transitions.push({ key: "shipped", label: "Mark shipped" });
    if (shippingStatus === "SHIPPED") transitions.push({ key: "inTransit", label: "Mark in transit" });
    if (shippingStatus === "IN_TRANSIT") transitions.push({ key: "delivered", label: "Mark delivered" });

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
          <MetaItem label="Dispatch Status" value={formData.dispatchStatus || EMPTY_VALUE} />
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
        {transitions.length > 0 && <div className="so-order-transition-actions">
          <div className="so-internal-block-title">Next action</div>
          <div className="so-order-transition-buttons">
            {transitions.map((transition, index) => <Button
              key={transition.key}
              type={index === 0 ? "primary" : "default"}
              disabled={Boolean(this.state.lifecycleAction) || transition.disabled}
              loading={this.state.lifecycleAction === transition.key}
              onClick={() => this.runLifecycleAction(transition.key, formData.id)}
            >{transition.label}</Button>)}
          </div>
          {transitions.some(transition => transition.key === "dispatch" && transition.disabled) && <small className="so-transition-hint">Set a fulfillment mode or provider before requesting carrier pickup.</small>}
        </div>}
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
          <div className="so-tax-invoice-preview-stage">
            <div className="so-tax-invoice-preview-toolbar">
              <div>
                <strong>Invoice Preview</strong>
                <span>Choose a saved invoice template to preview.</span>
              </div>
              <div className="so-invoice-preview-controls">
                <Select
                  aria-label="Invoice template"
                  value={getInvoiceTemplateOption(this.state.invoicePreviewTemplate !== null
                    ? this.state.invoicePreviewTemplate
                    : this.state.invoiceDetail.template)}
                  onChange={invoicePreviewTemplate => this.setState({invoicePreviewTemplate})}
                  dropdownMatchSelectWidth={false}
                >
                <Select.OptGroup label="Standard">
                  <Select.Option value={Enum.PAPER_SIZE.EXCLUDE_TAX}>Template 1 · No tax</Select.Option>
                  <Select.Option value={Enum.PAPER_SIZE.INCLUDE_TAX}>Template 2 · Tax invoice</Select.Option>
                </Select.OptGroup>
                <Select.OptGroup label="Non-official">
                  <Select.Option value="non-official">Template 3 · Non-official</Select.Option>
                  <Select.Option value="non-official-2">Template 4 · Multi-copy</Select.Option>
                </Select.OptGroup>
                <Select.OptGroup label="Professional">
                  <Select.Option value="professional">Template 5 · Professional</Select.Option>
                  <Select.Option value="professional-compact">Template 6 · Compact</Select.Option>
                  <Select.Option value="professional-navy">Template 7 · Navy</Select.Option>
                  <Select.Option value="professional-classic">Template 8 · Classic</Select.Option>
                  <Select.Option value="professional-minimal">Template 9 · Minimal</Select.Option>
                </Select.OptGroup>
                </Select>
                <ReactToPrint
                  content={() => this.invoiceRef}
                  documentTitle={`Invoice ${this.state.invoiceDetail.invoiceNumber || formData.number || ""}`}
                  trigger={() => <Button type="primary"><Printer size={14} /><span style={{marginLeft: 7}}>Print Invoice</span></Button>}
                />
              </div>
            </div>
            {this.state.loadingTab ?
              <LoadingComponent />
              :
              <CAInvoice
                formData={this.state.invoiceDetail}
                template={getInvoiceTemplateOption(this.state.invoicePreviewTemplate !== null
                  ? this.state.invoicePreviewTemplate
                  : this.state.invoiceDetail.template)}
                ref={ref => this.invoiceRef = ref}
                notFoundContent={<Translate id="text_sale_order_is_closed" />}
              />
            }
          </div>
        );
      case tabs.PACKING_SLIP:
        return (
          <div className="so-packing-slip-preview-stage">
            <div className="so-packing-slip-preview-toolbar">
              <div>
                <strong>Packing Slip Preview</strong>
                <span>Choose paper size for preview and printing.</span>
              </div>
              <div className="so-packing-slip-preview-controls">
                <Select
                  aria-label="Packing slip paper size"
                  value={this.state.packingSlipPaperSize}
                  onChange={packingSlipPaperSize => this.setState({packingSlipPaperSize})}
                  dropdownMatchSelectWidth={false}
                >
                  <Select.Option value="a4">A4 · 210 × 297 mm</Select.Option>
                  <Select.Option value="a5">A5 · 148 × 210 mm</Select.Option>
                  <Select.Option value="80mm">80 mm · Thermal</Select.Option>
                  <Select.Option value="58mm">58 mm · Compact thermal</Select.Option>
                </Select>
                <ReactToPrint
                  content={() => this.packingSlipRef}
                  documentTitle={`Packing Slip ${formData.number || ""}`}
                  trigger={() => <Button type="primary"><Printer size={14} /><span style={{marginLeft: 7}}>Print Packing Slip</span></Button>}
                />
              </div>
            </div>
            <PackingSlipTem
              formData={formData}
              paperSize={this.state.packingSlipPaperSize}
              ref={ref => (this.packingSlipRef = ref)}
            />
          </div>
        );
      case tabs.DELIVERY_NOTE:
        return (
          <div className="so-delivery-note-preview-stage">
            <div className="so-delivery-note-preview-toolbar">
              <div>
                <strong>Delivery Note Preview</strong>
                <span>Review the shipment details before printing.</span>
              </div>
              <ReactToPrint
                content={() => this.deliveryNoteRef}
                documentTitle={`Delivery Note ${formData.number || ""}`}
                trigger={() => <Button type="primary"><Printer size={14} /><span style={{marginLeft: 7}}>Print Delivery Note</span></Button>}
              />
            </div>
            <DeliveryNote formData={formData} ref={ref => (this.deliveryNoteRef = ref)} />
          </div>
        );
      case tabs.SALE_ORDER:
      default:
        return (
          <div className="so-invoice-preview-stage">
            <SaleOrderInvoice formData={formData} />
          </div>
        );
    }
  }

  renderHistoryTimeline = (formData) => {
    const events = this.getAuditEvents(formData);

    return (
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
    );
  }

  renderHistoryDrawer = (formData) => (
    <Drawer
      title="Order History & Audit Logs"
      placement="right"
      width="min(420px, 100vw)"
      visible={this.state.historyDrawerVisible}
      onClose={() => this.setState({historyDrawerVisible: false})}
    >
      {this.renderHistoryTimeline(formData)}
    </Drawer>
  )

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
              {this.renderHistoryDrawer(formData)}
              <Modal
                title="Quick edit shipping location"
                visible={this.state.locationEditOpen}
                onCancel={() => this.setState({ locationEditOpen: false })}
                onOk={this.saveLocationEdit}
                okText="Save location"
                confirmLoading={this.state.locationSaving}
                okButtonProps={{ disabled: this.state.locationResolving }}
                destroyOnClose
              >
                <div className="so-location-edit">
                  <p>Update the delivery destination without changing the order items or payment details.</p>
                  <label htmlFor="so-location-share-link">Google Maps share link</label>
                  <div className="so-location-edit-link">
                    <Input
                      id="so-location-share-link"
                      value={this.state.locationMapsUrl}
                      onChange={event => this.setState({ locationMapsUrl: event.target.value })}
                      onPressEnter={event => { event.preventDefault(); this.resolveEditedLocation(); }}
                      placeholder="Paste a maps.app.goo.gl link"
                    />
                    <Button type="default" loading={this.state.locationResolving} onClick={this.resolveEditedLocation}>Find address</Button>
                  </div>
                  <label htmlFor="so-location-address">Shipping address</label>
                  <Input.TextArea id="so-location-address" rows={3} value={this.state.locationAddress} onChange={event => this.setState({ locationAddress: event.target.value })} placeholder="Enter delivery address" />
                  <div className="so-location-edit-fields">
                    <div><label htmlFor="so-location-province">Province</label><Input id="so-location-province" value={this.state.locationProvince} onChange={event => this.setState({ locationProvince: event.target.value })} /></div>
                    <div><label htmlFor="so-location-city">City</label><Input id="so-location-city" value={this.state.locationCity} onChange={event => this.setState({ locationCity: event.target.value })} /></div>
                  </div>
                  {this.state.locationGeolocation && Number.isFinite(Number(this.state.locationGeolocation.latitude)) && Number.isFinite(Number(this.state.locationGeolocation.longitude)) && <div className="so-location-edit-coordinates"><MapPin size={15} /> Coordinates {Number(this.state.locationGeolocation.latitude).toFixed(6)}, {Number(this.state.locationGeolocation.longitude).toFixed(6)}</div>}
                </div>
              </Modal>
              <Modal
                title="Record payment"
                visible={this.state.paymentModalVisible}
                onCancel={() => !this.state.paymentSaving && this.setState({ paymentModalVisible: false })}
                onOk={this.recordPayment}
                okText="Record payment"
                confirmLoading={this.state.paymentSaving}
                destroyOnClose
              >
                <div className="so-record-payment-form">
                  <p>Record a payment against order <strong>{formData.number || formData.id}</strong>.</p>
                  <label htmlFor="so-payment-method">Payment method</label>
                  <Select
                    id="so-payment-method"
                    value={this.state.paymentMethodId}
                    onChange={value => this.setState({ paymentMethodId: value, paymentIdempotencyKey: "", paymentError: "" })}
                    placeholder="Select payment method"
                    showSearch
                    optionFilterProp="children"
                  >
                    {this.state.paymentMethods.map(method => (
                      <Select.Option key={method.id} value={String(method.id)}>
                        {method.name || method.label || method.methodName || String(method.id)}
                      </Select.Option>
                    ))}
                  </Select>
                  <label htmlFor="so-payment-amount">Amount</label>
                  <InputNumber
                    id="so-payment-amount"
                    min={0.01}
                    precision={2}
                    value={this.state.paymentAmount}
                    onChange={value => this.setState({ paymentAmount: value, paymentIdempotencyKey: "", paymentError: "" })}
                    style={{ width: "100%" }}
                    placeholder="Enter amount"
                  />
                  <label htmlFor="so-payment-reference">Reference number <span>(optional)</span></label>
                  <Input
                    id="so-payment-reference"
                    value={this.state.paymentReferenceNo}
                    onChange={event => this.setState({ paymentReferenceNo: event.target.value, paymentIdempotencyKey: "" })}
                    placeholder="Receipt or transaction reference"
                  />
                  <label htmlFor="so-payment-note">Note <span>(optional)</span></label>
                  <Input.TextArea
                    id="so-payment-note"
                    rows={3}
                    value={this.state.paymentNote}
                    onChange={event => this.setState({ paymentNote: event.target.value, paymentIdempotencyKey: "" })}
                    placeholder="Add a note about this payment"
                  />
                  {this.state.paymentError ? <div className="so-record-payment-error" role="alert">{this.state.paymentError}</div> : null}
                </div>
              </Modal>
              <Drawer
                title="Fulfillment history"
                placement="right"
                width={420}
                visible={this.state.fulfillmentHistoryVisible}
                onClose={() => this.setState({ fulfillmentHistoryVisible: false })}
                className="so-fulfillment-history-drawer"
              >
                <div className="so-fulfillment-history-intro">
                  <strong>{formData.number || "Sales Order"}</strong>
                  <span>Delivery status changes and carrier actions</span>
                </div>
                {this.state.fulfillmentHistoryLoading ? (
                  <div className="so-fulfillment-history-state"><Spin tip="Loading fulfillment history…" /></div>
                ) : this.state.fulfillmentHistoryError ? (
                  <div className="so-fulfillment-history-error" role="alert">
                    <span>{this.state.fulfillmentHistoryError}</span>
                    <Button type="default" onClick={() => this.loadFulfillmentHistory(formData.id)}>Try again</Button>
                  </div>
                ) : this.state.fulfillmentHistory.length ? (
                  <div className="so-fulfillment-history-list">
                    {this.state.fulfillmentHistory.map((entry, index) => {
                      const fromStatus = String(entry.fromStatus || "").replace(/_/g, " ");
                      const toStatus = String(entry.toStatus || "").replace(/_/g, " ");
                      const statusTransition = fromStatus && toStatus && fromStatus !== toStatus ? `${fromStatus} → ${toStatus}` : toStatus;
                      return <div className="so-fulfillment-history-entry" key={entry.id || `${entry.createdAt}-${index}`}>
                        <span className={`so-fulfillment-history-dot${index === this.state.fulfillmentHistory.length - 1 ? " is-latest" : ""}`} />
                        {index < this.state.fulfillmentHistory.length - 1 && <span className="so-fulfillment-history-line" />}
                        <div className="so-fulfillment-history-content">
                          <div className="so-fulfillment-history-head"><span className={`so-fulfillment-history-icon is-${String(entry.action === "DISPATCH_REQUESTED" ? entry.action : entry.toStatus || entry.action || "event").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{this.getFulfillmentHistoryIcon(entry)}</span><strong>{this.getFulfillmentHistoryTitle(entry)}</strong><time>{this.formatDateTime(entry.createdAt)}</time></div>
                          {statusTransition && <span className="so-fulfillment-history-transition">{statusTransition}</span>}
                          <span className="so-fulfillment-history-actor">By {entry.userName || "System"}</span>
                          {entry.note && <p>{entry.note}</p>}
                        </div>
                      </div>;
                    })}
                  </div>
                ) : (
                  <Empty description="No fulfillment history recorded yet." />
                )}
              </Drawer>
              {this.renderHeader(formData, customerName)}
              {this.renderProgress(formData)}
              <div className="so-detail-grid">
                <main className="so-main-column">
                  {this.renderProducts(formData)}
                  {this.renderPaymentDetails(formData)}
                  {this.renderDocuments(formData)}
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
