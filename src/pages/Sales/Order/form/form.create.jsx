import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Button, Checkbox, Input, InputNumber, message, Modal, Select, Spin } from "antd";
import { BadgeCheck, Barcode, CheckCircle2, ChevronDown, ClipboardList, Copy, CreditCard, Link2, MapPin, Minus, Package, Plus, Save, Search, ShieldCheck, Store, Trash2, Truck, UserRound, Wallet, Zap } from "lucide-react";
import Util from "../../../../app/modules/common/util";
import Enum from "../../../../app/modules/pos/enums";
import CustomerEnum from "../../../../app/modules/crm/enum";
import CustomerService from "@services/CustomerService";
import CustomerAction from "../../../../app/modules/crm/actions/customers/customer";
import EmployeeService from "../../../../app/modules/hr/services/employees/EmployeeService";
import LocationService from "@services/LocationService";
import ItemService from "../../../../services/ItemService";
import VariantService from "../../../../services/VariantService";
import PaymentMethodService from "../../../../services/PaymentMethodService";
import FulfillmentProviderService from "../../../../services/FulfillmentProviderService";
import ExchangeRateService from "../../../../app/modules/pos/services/settings/ExchangeRateService";
import SaleOrderService from "@services/SaleOrderService";
import { calculateOrderPreview, isInventoryTrackingEnabled } from "./orderFormUtils";
import cambodiaProvinces from "./cambodiaProvinces.json";
import "./index.css";

const { TextArea } = Input;
const util = new Util();
const listData = response => response && response.data && Array.isArray(response.data.data) ? response.data.data : [];
const getApiErrorMessage = exception => {
  const responseData = exception && exception.response && exception.response.data;
  const candidates = [
    responseData && responseData.message && responseData.message.error && responseData.message.error.message,
    responseData && responseData.error && responseData.error.message,
    responseData && responseData.message,
    responseData && responseData.errors,
    exception && exception.message
  ];
  const format = value => {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value)) {
      const messages = value.map(format).filter(Boolean);
      return messages.length ? messages.join(" ") : "";
    }
    if (value && typeof value === "object") {
      if (typeof value.message === "string") return value.message;
      return Object.keys(value).map(key => format(value[key])).filter(Boolean).join(" ");
    }
    return "";
  };
  return candidates.map(format).find(Boolean) || (exception && exception.request
    ? "Could not reach the server. Check your connection and try again."
    : "Could not save the order. Your entries are still here.");
};
const getFeePreview = response => {
  let data = response && response.data;
  if (data && data.data) data = data.data;
  const fee = Number(data && (data.fee ?? data.feeAmount ?? data.deliveryFee ?? data.amount));
  if (!Number.isFinite(fee)) return null;
  return { fee, currency: String(data.currencyCode || data.currency || "USD").toUpperCase() };
};
const money = value => `$${(Math.round((Number(value) || 0) * 100) / 100).toFixed(2)}`;
const channelOptions = [
  ["Phone Call", "Direct Manual"], ["Telegram", "Bot Direct"], ["Messenger", "Page Inbox"],
  ["TikTok Shop", "Social Cart"], ["Walk-In", "Store Counter"], ["B2B Trade", "Corporate Term"]
];
const paymentLabels = ["Cash on Delivery", "KHQR / Bakong", "ABA Transfer", "Net 15 / 30 Terms"];
const fulfillmentOptions = [["Courier Delivery", "Configured provider"], ["Self-Pickup", "Customer counter pick"], ["Scheduled Freight", "Bulk delivery"]];
const originByChannel = { "Phone Call": "manual", Telegram: "telegram", Messenger: "facebook", "TikTok Shop": "tiktok", "Walk-In": "walk_in", "B2B Trade": "b2b" };
const channelByOrigin = Object.keys(originByChannel).reduce((result, channel) => ({ ...result, [originByChannel[channel]]: channel }), {});
channelByOrigin.facebook_page = "Messenger";
const getFulfillmentMode = mode => ({ DELIVERY: "Courier Delivery", PICKUP: "Self-Pickup", FREIGHT: "Scheduled Freight" }[String(mode || "").toUpperCase()] || "Courier Delivery");
const getPaymentLabel = method => {
  const value = `${method && method.name || ""} ${method && method.code || ""}`.toLowerCase();
  if (/khqr|bakong/.test(value)) return "KHQR / Bakong";
  if (/aba|transfer|bank/.test(value)) return "ABA Transfer";
  if (/net|credit|term/.test(value)) return "Net 15 / 30 Terms";
  if (/cash|cod/.test(value)) return "Cash on Delivery";
  return "";
};
const getCustomerFromOrder = data => data.customer || {
  id: data.customerId,
  firstName: data.firstName,
  lastName: data.lastName,
  phoneNumber: data.phoneNumber,
  address: data.address || data.shippingAddress,
  type: data.customerType
};
const getOrderItem = (entry, index) => {
  const variant = entry.productVariant || entry.variant || {};
  const product = entry.product || variant.product || {};
  const productName = entry.itemName || entry.productName || entry.variantName || product.name || entry.description || "Item";
  return {
    key: `saved-${entry.id || index}`,
    entryId: entry.id || "",
    itemName: entry.itemName || productName,
    product: { ...product, id: entry.productId || product.id || variant.productId, name: productName, categoryId: entry.categoryId || product.categoryId, stockUnitId: entry.unitId || product.stockUnitId, enableInventoryTracking: entry.enableInventoryTracking ?? product.enableInventoryTracking ?? product.productType?.enableInventoryTracking ?? variant.enableInventoryTracking, unit: product.unit || { name: entry.unitName } },
    variant: { ...variant, id: entry.productVariantId || variant.id, name: variant.name || entry.variantName || "", price: entry.price, cost: entry.cost, unitId: entry.unitId || variant.unitId, unitName: entry.unitName || variant.unitName, availableQuantity: entry.availableQuantity ?? variant.availableQuantity },
    quantity: Number(entry.quantity || 1),
    price: Number(entry.price || 0),
    priceEdited: true,
    discount: Number(entry.discount || 0),
    discountType: entry.discountType || "USD",
    status: entry.status == null ? "1" : String(entry.status),
    tax: Number(entry.taxRate || entry.tax || 0)
  };
};
const getName = customer => [customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.company || "Customer";
const getVariants = product => Array.isArray(product.productVariants) ? product.productVariants : [];
const getProductName = product => product.name || product.namekm || product.nameKh || "Item";
const getApiLineDiscountType = value => String(value || "").toUpperCase() === "PERCENTAGE" ? "PERCENTAGE" : "AMOUNT";
const getStock = variant => variant && (variant.availableQuantity ?? variant.quantity ?? variant.inStock);
const getPrice = (variant, customer) => {
  if (customer && customer.type === CustomerEnum.CUSTOMER_TYPE.WHOLE_SALE) return Number(variant.wholePrice || variant.price || 0);
  if (customer && customer.type === CustomerEnum.CUSTOMER_TYPE.DISTRIBUTOR) return Number(variant.distributePrice || variant.price || 0);
  return Number(variant.price || variant.retailPrice || 0);
};
const getFeeRule = provider => (provider && provider.feeRules || [])
  .filter(value => value && (value.status == null || Number(value.status) === 1) && String(value.type).toUpperCase() === "FLAT" && Number(value.amount) >= 0)
  .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0))[0];

function Section({ title, Icon, extra, children, className = "" }) {
  return <section className={`new-so-card ${className}`}><div className="new-so-card-title"><h2><Icon size={19} />{title}</h2>{extra}</div>{children}</section>;
}

function NewSalesOrder({ dispatch, customerAdd, history, match, isUpdate = false }) {
  const orderId = isUpdate && match && match.params && match.params.id;
  const [channel, setChannel] = React.useState("Phone Call");
  const [originId, setOriginId] = React.useState("manual");
  const [customers, setCustomers] = React.useState([]);
  const [assignees, setAssignees] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [customer, setCustomer] = React.useState(null);
  const [customerLoading, setCustomerLoading] = React.useState(false);
  const [customerQuery, setCustomerQuery] = React.useState("");
  const [customerSearchDone, setCustomerSearchDone] = React.useState(false);
  const [customerCreateOpen, setCustomerCreateOpen] = React.useState(false);
  const [customerCreateError, setCustomerCreateError] = React.useState("");
  const [newCustomerName, setNewCustomerName] = React.useState("");
  const [newCustomerPhone, setNewCustomerPhone] = React.useState("");
  const [newCustomerAddress, setNewCustomerAddress] = React.useState("");
  const [newShippingContact, setNewShippingContact] = React.useState("");
  const [newShippingAddress, setNewShippingAddress] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = React.useState("");
  const [locationDetails, setLocationDetails] = React.useState(null);
  const [locationResolving, setLocationResolving] = React.useState(false);
  const [locationResolveError, setLocationResolveError] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [searching, setSearching] = React.useState(false);
  const [catalogOpen, setCatalogOpen] = React.useState(false);
  const [fulfillment, setFulfillment] = React.useState("Courier Delivery");
  const [providers, setProviders] = React.useState([]);
  const [providerId, setProviderId] = React.useState("");
  const [deliveryInstructions, setDeliveryInstructions] = React.useState("");
  const [internalNotes, setInternalNotes] = React.useState("");
  const [paymentMethods, setPaymentMethods] = React.useState([]);
  const [payment, setPayment] = React.useState("Cash on Delivery");
  const [paymentMethodId, setPaymentMethodId] = React.useState("");
  const [exchangeRate, setExchangeRate] = React.useState(null);
  const [orderDiscount, setOrderDiscount] = React.useState(0);
  const [discountType, setDiscountType] = React.useState("USD");
  const [orderStatus, setOrderStatus] = React.useState("DRAFT");
  const [orderNumber, setOrderNumber] = React.useState("");
  const [assigneeId, setAssigneeId] = React.useState("");
  const [shippingContact, setShippingContact] = React.useState("");
  const [shippingDetail, setShippingDetail] = React.useState("");
  const [province, setProvince] = React.useState("");
  const [city, setCity] = React.useState("");
  const [fulfillmentDistanceKm, setFulfillmentDistanceKm] = React.useState(null);
  const [feePreview, setFeePreview] = React.useState(null);
  const [feePreviewLoading, setFeePreviewLoading] = React.useState(false);
  const [feePreviewError, setFeePreviewError] = React.useState("");
  const [deliveryFeeOverride, setDeliveryFeeOverride] = React.useState(0);
  const [payTermNumber, setPayTermNumber] = React.useState(0);
  const [editLoading, setEditLoading] = React.useState(Boolean(orderId));
  const [saving, setSaving] = React.useState(false);
  const [savedOrder, setSavedOrder] = React.useState(null);
  const [error, setError] = React.useState("");
  const [dirty, setDirty] = React.useState(false);
  const [loadError, setLoadError] = React.useState("");
  const searchRef = React.useRef(null);
  const customerSearchRequestRef = React.useRef(0);
  const savingRef = React.useRef(false);
  const user = util.getCurrentUser() || {};
  const userName = user.fullName || user.displayName || user.name || user.userName || "Current user";
  const locationId = util.getLocationId();
  const [selectedLocationId, setSelectedLocationId] = React.useState(locationId || "");
  const [registerDate, setRegisterDate] = React.useState(moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"));
  const [deletedItems, setDeletedItems] = React.useState([]);

  React.useEffect(() => {
    Promise.allSettled([
      CustomerService.get({ limit: 15 }),
      FulfillmentProviderService.list(),
      PaymentMethodService.get({ limit: 50 }),
      ExchangeRateService.getCurrentExchangeRate(),
      EmployeeService.lists(100, 0),
      LocationService.get({ limit: 50 })
    ]).then(([customerResult, providerResult, paymentResult, rateResult, assigneeResult, locationResult]) => {
      if (customerResult.status === "fulfilled") setCustomers(listData(customerResult.value));
      if (providerResult.status === "fulfilled") setProviders(listData(providerResult.value));
      if (paymentResult.status === "fulfilled") setPaymentMethods(listData(paymentResult.value));
      if (assigneeResult.status === "fulfilled") setAssignees(listData(assigneeResult.value));
      if (locationResult.status === "fulfilled") setLocations(listData(locationResult.value));
      if (rateResult.status === "fulfilled") {
        const data = rateResult.value && rateResult.value.data && rateResult.value.data.data;
        const rate = Number(data && (data.sellRate || data.value || data.rate));
        if (rate > 0) setExchangeRate(rate);
      }
      if (customerResult.status === "rejected" || providerResult.status === "rejected" || paymentResult.status === "rejected") setLoadError("Some order configuration could not be loaded. Reload before confirming an order.");
    });
  }, []);

  React.useEffect(() => {
    if (!orderId) return undefined;
    let active = true;
    setEditLoading(true);
    SaleOrderService.detail(orderId).then(response => {
      if (!active) return;
      const data = response && response.data && (response.data.data || response.data);
      if (!data) throw new Error("The Sales Order could not be loaded.");
      const selectedCustomer = getCustomerFromOrder(data);
      const customerNameKey = channelByOrigin[String(data.originId || "").toLowerCase()] || (data.orderChannel === "MANUAL" ? "Phone Call" : "Phone Call");
      const loadedPayment = (data.paymentMethod && [data.paymentMethod].flat() || []).find(method => String(method.id) === String(data.paymentMethodId)) || paymentMethods.find(method => String(method.id) === String(data.paymentMethodId));
      setOrderNumber(data.number || data.orderNumber || "");
      setOrderStatus(data.status || "DRAFT");
      setSelectedLocationId(data.locationId || locationId || "");
      if (data.locationId) setLocations(current => current.some(value => String(value.id) === String(data.locationId)) ? current : [{ id: data.locationId, name: data.locationName || `Location ${data.locationId}` }, ...current]);
      setRegisterDate(data.registerDate || moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"));
      setChannel(customerNameKey);
      setOriginId(data.originId || originByChannel[customerNameKey] || "manual");
      setCustomer(selectedCustomer);
      setCustomers(current => current.some(value => String(value.id) === String(selectedCustomer.id)) ? current : [selectedCustomer, ...current]);
      setAddress(data.shippingAddress || data.address || "");
      const savedGeolocation = data.geolocation || data.customer && data.customer.geolocation || null;
      setLocationDetails(savedGeolocation && typeof savedGeolocation === "object" ? savedGeolocation : null);
      setGoogleMapsUrl(data.googleMapsUrl || data.locationSharedUrl || "");
      setShippingContact(String(data.shippingContact1 || selectedCustomer.phoneNumber || ""));
      setShippingDetail(data.shippingDetail || "");
      setDeliveryInstructions(data.deliveryInstructions || data.shippingDetail || "");
      setInternalNotes(data.internalFulfillmentNote || "");
      setProvince(data.fulfillmentProvince || "");
      setCity(data.fulfillmentCity || "");
      const savedDistance = data.fulfillmentFeeSnapshot && data.fulfillmentFeeSnapshot.distanceKm;
      const distanceValue = Number(savedDistance);
      setFulfillmentDistanceKm(savedDistance == null || savedDistance === "" || !Number.isFinite(distanceValue) || distanceValue < 0 ? null : distanceValue);
      setFulfillment(getFulfillmentMode(data.fulfillmentMode));
      setProviderId(data.fulfillmentProviderId ? String(data.fulfillmentProviderId) : "");
      setPaymentMethodId(data.paymentMethodId ? String(data.paymentMethodId) : "");
      setPayment(getPaymentLabel(loadedPayment) || "Cash on Delivery");
      setOrderDiscount(Number(data.discount || 0));
      setDiscountType(data.discountType || "USD");
      setDeliveryFeeOverride(Number(data.deliveryFee || 0));
      setPayTermNumber(Number(data.payTermNumber || 0));
      setAssigneeId(data.assigneeId ? String(data.assigneeId) : String(user.id || user.idUser || ""));
      if (data.assigneeId) setAssignees(current => current.some(value => String(value.id) === String(data.assigneeId)) ? current : [{ id: data.assigneeId, firstName: data.assigneeName || `User ${data.assigneeId}` }, ...current]);
      setItems((data.transactionEntries || []).map(getOrderItem));
      setDeletedItems([]);
      setDirty(false);
    }).catch(exception => {
      if (active) setLoadError(exception.message || "Could not load this Sales Order.");
    }).finally(() => { if (active) setEditLoading(false); });
    return () => { active = false; };
  }, [orderId, locationId]);

  React.useEffect(() => {
    if (!paymentMethodId || !paymentMethods.length) return;
    const selectedMethod = paymentMethods.find(method => String(method.id) === String(paymentMethodId));
    const label = getPaymentLabel(selectedMethod);
    if (label) setPayment(label);
  }, [paymentMethodId, paymentMethods]);

  React.useEffect(() => {
    if (fulfillment !== "Courier Delivery" || !providerId || !province.trim() || !city.trim() || fulfillmentDistanceKm == null || !Number.isFinite(Number(fulfillmentDistanceKm)) || Number(fulfillmentDistanceKm) < 0) {
      setFeePreview(null);
      setFeePreviewError("");
      setFeePreviewLoading(false);
      return undefined;
    }
    setFeePreview(null);
    let active = true;
    const timer = setTimeout(() => {
      setFeePreviewLoading(true);
      setFeePreviewError("");
      FulfillmentProviderService.calculateFee({
        providerId,
        province: province.trim(),
        city: city.trim(),
        distanceKm: Number(fulfillmentDistanceKm)
      }).then(response => {
        if (!active) return;
        const preview = getFeePreview(response);
        setFeePreview(preview);
        if (!preview) setFeePreviewError("The provider did not return a fee estimate.");
      }).catch(exception => {
        if (!active) return;
        setFeePreview(null);
        setFeePreviewError(getApiErrorMessage(exception));
      }).finally(() => { if (active) setFeePreviewLoading(false); });
    }, 300);
    return () => { active = false; clearTimeout(timer); };
  }, [fulfillment, providerId, province, city, fulfillmentDistanceKm]);

  React.useEffect(() => {
    const onKeyDown = event => {
      if (event.key !== "F2" || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target && event.target.closest("input, textarea, [contenteditable=true], [role=dialog]")) return;
      event.preventDefault();
      searchRef.current && searchRef.current.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    const beforeUnload = event => { if (dirty && !savedOrder) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty, savedOrder]);

  React.useEffect(() => {
    if (!customerAdd) return;
    if (customerAdd.added) {
      const created = customerAdd.response && customerAdd.response.data;
      if (created && created.id) {
        setCustomers(current => [created, ...current.filter(value => String(value.id) !== String(created.id))]);
        setCustomer(created);
        setAddress(newShippingAddress.trim() || String(created.address || newCustomerAddress || "").trim());
        setShippingContact(newShippingContact.trim() || String(newCustomerPhone || created.phoneNumber || "").trim());
        setCustomerQuery("");
        setCustomerSearchDone(false);
        setCustomerCreateOpen(false);
        setCustomerCreateError("");
        setNewCustomerName("");
        setNewCustomerPhone("");
        setNewCustomerAddress("");
        setNewShippingContact("");
        setNewShippingAddress("");
        setDirty(true);
      }
      dispatch(CustomerAction.reset("RESET_ADD_CUSTOMERS"));
      return;
    }
    if (customerAdd.error && !customerAdd.adding) {
      setCustomerCreateError(getApiErrorMessage({ response: customerAdd.error }));
    }
  }, [customerAdd, dispatch]);

  const touch = () => { setDirty(true); setError(""); };
  const resolveGoogleMapsLocation = async () => {
    const url = googleMapsUrl.trim();
    if (!url) {
      setLocationResolveError("Paste a Google Maps share link first.");
      return;
    }
    setLocationResolving(true);
    setLocationResolveError("");
    try {
      const response = await CustomerService.resolveLocation(url);
      const result = response && response.data && (response.data.data || response.data);
      const latitude = Number(result && result.latitude);
      const longitude = Number(result && result.longitude);
      if (!result || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 || !result.formattedAddress) {
        throw new Error("The location service returned incomplete location details.");
      }
      setLocationDetails({ latitude, longitude });
      setAddress(String(result.formattedAddress));
      if (result.province) setProvince(String(result.province));
      if (result.city) setCity(String(result.city));
      touch();
    } catch (exception) {
      setLocationResolveError(getApiErrorMessage(exception));
    } finally {
      setLocationResolving(false);
    }
  };
  const selectCustomer = id => {
    const selected = customers.find(value => String(value.id) === String(id));
    setCustomer(selected || null);
    setAddress(selected && selected.address || "");
    setGoogleMapsUrl("");
    setLocationDetails(null);
    setLocationResolveError("");
    setShippingContact(String(selected && selected.phoneNumber || ""));
    setCustomerQuery("");
    setCustomerSearchDone(false);
    setCustomerCreateOpen(false);
    setCustomerCreateError("");
    setItems(current => current.map(item => item.priceEdited ? item : { ...item, price: getPrice(item.variant, selected) }));
    touch();
  };
  const searchCustomers = value => {
    const searchValue = String(value || "").trim();
    const requestId = ++customerSearchRequestRef.current;
    setCustomerQuery(searchValue);
    setCustomerSearchDone(false);
    setCustomerCreateError("");
    if (searchValue.length < 2) {
      setCustomerLoading(false);
      return;
    }
    setCustomerLoading(true);
    CustomerService.get({ limit: 15, search: searchValue})
      .then(response => {
        if (requestId !== customerSearchRequestRef.current) return;
        setCustomers(listData(response));
        setCustomerSearchDone(true);
      })
      .catch(() => {
        if (requestId === customerSearchRequestRef.current) message.error("Could not search customers.");
      })
      .finally(() => { if (requestId === customerSearchRequestRef.current) setCustomerLoading(false); });
  };
  const openCustomerCreate = () => {
    const searchValue = customerQuery.trim();
    const looksLikePhone = /^[+\d()\s.-]+$/.test(searchValue) && searchValue.replace(/\D/g, "").length >= 6;
    setNewCustomerName(looksLikePhone ? "" : searchValue);
    setNewCustomerPhone(looksLikePhone ? searchValue : "");
    setNewCustomerAddress("");
    setNewShippingContact("");
    setNewShippingAddress("");
    setCustomerCreateError("");
    setCustomerCreateOpen(true);
  };
  const createCustomer = () => {
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
      setCustomerCreateError("Enter the customer name and phone number to continue.");
      return;
    }
    setCustomerCreateError("");
    dispatch(CustomerAction.add({
      firstName: newCustomerName.trim(),
      lastName: "",
      phoneNumber: newCustomerPhone.trim(),
      address: newCustomerAddress.trim(),
      type: CustomerEnum.CUSTOMER_TYPE.RETAIL_SALE,
      status: 1
    }));
  };
  const searchProducts = async value => {
    setSearching(true);
    try {
      const response = await ItemService.get({ limit: 20, locationId, search: String(value || "").trim() });
      setResults(listData(response));
      setCatalogOpen(true);
    } catch (exception) { message.error("Could not search products."); }
    finally { setSearching(false); }
  };
  const addProduct = (product, variant) => {
    setItems(current => [...current, {
      key: `${Date.now()}-${Math.random()}`, product, variant, quantity: 1,
      price: getPrice(variant, customer), priceEdited: false, discount: 0, discountType: "USD", tax: 0
    }]);
    setCatalogOpen(false);
    setQuery("");
    touch();
  };
  const updateItem = (key, values) => { setItems(current => current.map(item => item.key === key ? { ...item, ...values } : item)); touch(); };
  const selectedProvider = providers.find(value => String(value.id) === String(providerId));
  const selectProvider = value => {
    const provider = providers.find(candidate => String(candidate.id) === String(value));
    const rule = getFeeRule(provider);
    setProviderId(value);
    if (isUpdate) setDeliveryFeeOverride(rule ? Number(rule.amount) : 0);
    touch();
  };
  const feeRule = fulfillment === "Courier Delivery" && selectedProvider ? getFeeRule(selectedProvider) : null;
  const feeCurrency = String(feeRule && feeRule.currencyCode || "USD").toUpperCase();
  const configuredFee = !selectedProvider || fulfillment !== "Courier Delivery" ? 0 : !feeRule ? null : feeCurrency === "USD" ? Number(feeRule.amount) : feeCurrency === "KHR" && exchangeRate ? Number(feeRule.amount) / exchangeRate : null;
  const fee = isUpdate ? fulfillment === "Courier Delivery" ? deliveryFeeOverride : 0 : configuredFee;
  const { units, subtotal, discount, taxTotal, payable } = calculateOrderPreview(items, orderDiscount, fee, discountType);
  const selectedPayment = paymentMethods.find(value => String(value.id) === String(paymentMethodId)) || paymentMethods.find(value => getPaymentLabel(value) === payment);
  const customerOptions = customerQuery ? customerSearchDone ? customers : [] : customers;

  const discard = () => {
    const go = () => history.push("/sales");
    if (!dirty || savedOrder) return go();
    Modal.confirm({ title: "Discard this order?", content: "Unsaved order details will be lost.", okText: "Discard", onOk: go });
  };
  const save = async confirm => {
    if (savingRef.current || savedOrder) return;
    const shippingAddressValue = address.trim() || String(customer && customer.address || "").trim();
    const shippingContactValue = String(shippingContact || customer && customer.phoneNumber || "").trim();
    if (!customer || !items.length) { setError("Select a customer and at least one catalog item."); return; }
    if (items.some(item => !item.product || !item.product.id || !item.variant || !item.variant.id)) {
      setError(isUpdate ? "An existing line is missing its product or variant ID. Reload the order before saving." : "A selected item is missing its product or variant ID. Remove it and select it from the catalog again.");
      return;
    }
    if (confirm && ((fulfillment !== "Self-Pickup" && !shippingAddressValue) || items.some(item => !item.variant || Number(item.quantity) <= 0 || Number(item.price) < 0))) { setError("Enter the required destination details and check item quantities and prices."); return; }
    if (confirm && fulfillment === "Courier Delivery" && !selectedProvider) { setError("Choose a configured courier provider."); return; }
    if (confirm && !(selectedLocationId || locationId)) { setError("An active stock location is required to verify inventory before confirmation."); return; }
    if (!isUpdate && items.some(item => isInventoryTrackingEnabled(item) && Number.isFinite(Number(getStock(item.variant))) && getStock(item.variant) !== null && getStock(item.variant) !== undefined && Number(item.quantity) > Number(getStock(item.variant)))) { setError("An item exceeds its displayed available stock. Refresh inventory or reduce quantity."); return; }
    if (Number(orderDiscount) < 0 || (discountType === "PERCENTAGE" ? Number(orderDiscount) > 100 : discount > subtotal)) { setError("Order discount is outside the allowed range."); return; }
    // The current create contract has no fields for payment method, tax, coupons, or dispatch.
    if (!isUpdate && (payment !== "Cash on Delivery" || fulfillment !== "Courier Delivery" || items.some(item => Number(item.discount) || Number(item.tax)) || Number(orderDiscount))) {
      setError("The current Sales Order API cannot save this payment, fulfillment, discount, or tax selection. Choose the supported defaults before saving."); return;
    }
    if (!isUpdate && confirm && !selectedPayment) { setError("Cash on Delivery is not configured. Reload payment methods before confirming."); return; }
    if (isUpdate && confirm && !selectedPayment) { setError("Choose a configured payment method before confirming."); return; }
    const entries = items.map(item => isUpdate ? ({
      ...(item.entryId ? { id: item.entryId } : {}),
      productId: item.product.id,
      productVariantId: item.variant.id,
      itemName: item.itemName || getProductName(item.product),
      quantity: Number(item.quantity),
      price: Number(item.price),
      discount: Number(item.discount || 0),
      discountType: getApiLineDiscountType(item.discountType),
      status: String(item.status || "1")
    }) : ({
      id: "",
      productId: item.product.id,
      productVariantId: item.variant.id,
      itemName: item.itemName || getProductName(item.product),
      variantName: getProductName(item.product),
      categoryId: item.product.categoryId,
      description: `${getProductName(item.product)}${item.variant.name ? ` ${item.variant.name}` : ""}`,
      enableDescription: item.product.enableDescription,
      quantity: Number(item.quantity),
      unitId: item.product.stockUnitId || item.variant.unitId,
      unitName: item.product.unit && item.product.unit.name || item.variant.unitName || "",
      cost: Number(item.variant.cost || 0),
      price: Number(item.price),
      discount: 0,
      discountType: "AMOUNT",
      status: 1
    }));
    const order = isUpdate ? {
      customerId: customer.id,
      locationId: selectedLocationId || locationId,
      assigneeId: assigneeId || user.id || user.idUser || "",
      orderChannel: "MANUAL",
      originId: originId || originByChannel[channel] || "manual",
      status: orderStatus,
      registerDate,
      shippingAddress: shippingAddressValue,
      ...(locationDetails ? { geolocation: locationDetails } : {}),
      shippingContact1: shippingContactValue,
      shippingDetail,
      fulfillmentMode: { "Courier Delivery": "DELIVERY", "Self-Pickup": "PICKUP", "Scheduled Freight": "FREIGHT" }[fulfillment],
      fulfillmentProviderId: fulfillment === "Courier Delivery" ? providerId : "",
      fulfillmentDistanceKm: fulfillment === "Courier Delivery" && providerId && fulfillmentDistanceKm != null ? Number(fulfillmentDistanceKm) : undefined,
      fulfillmentProvince: province,
      fulfillmentCity: city,
      deliveryInstructions: deliveryInstructions.trim(),
      internalFulfillmentNote: internalNotes.trim(),
      deliveryFee: Number(fulfillment === "Courier Delivery" ? deliveryFeeOverride : 0),
      paymentMethodId: paymentMethodId || (paymentMethods.find(method => getPaymentLabel(method) === payment) || {}).id || "",
      payTermNumber: Number(payTermNumber || 0),
      discount: Number(orderDiscount || 0),
      discountType,
      transactionEntries: entries.concat(deletedItems.map(item => ({
        id: item.entryId,
        productId: item.product.id,
        productVariantId: item.variant.id,
        itemName: item.itemName || getProductName(item.product),
        quantity: Number(item.quantity),
        price: Number(item.price),
        discount: Number(item.discount || 0),
        discountType: getApiLineDiscountType(item.discountType),
        status: "3"
      })))
    } : {
      customerId: customer.id,
      orderChannel: "MANUAL",
      originId: originId || originByChannel[channel] || "manual",
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: String(customer.phoneNumber || ""),
      address: shippingAddressValue,
      shippingAddress: shippingAddressValue,
      ...(locationDetails ? { geolocation: locationDetails } : {}),
      shippingContact1: shippingContactValue,
      fulfillmentProvince: province,
      fulfillmentCity: city,
      discount: 0,
      discountType: Enum.DISCOUNT_TYPE.AMOUNT,
      exchangeRate: exchangeRate || undefined,
      customerNote: internalNotes.trim(),
      publicNote: deliveryInstructions.trim(),
      ...(fulfillment === "Courier Delivery" && selectedProvider ? { fulfillmentProviderId: selectedProvider.id } : {}),
      ...(fulfillment === "Courier Delivery" && selectedProvider && fulfillmentDistanceKm != null ? { fulfillmentDistanceKm: Number(fulfillmentDistanceKm) } : {}),
      ...(fulfillment === "Courier Delivery" && selectedProvider && feeRule ? { fulfillmentFeeOverride: Number(feeRule.amount), fulfillmentFeeCurrencyCode: feeCurrency } : {}),
      invoiceDate: moment().format("YYYY-MM-DD"),
      expectedShipmentDate: null,
      registerDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      status: "DRAFT",
      totalExcludeTax: items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
      deposit: 0,
      total: items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
      transactionEntries: entries
    };
    savingRef.current = true;
    setSaving(true);
    try {
      if (!isUpdate && confirm && (selectedLocationId || locationId)) {
        const trackedItems = items.map((item, index) => ({ item, index })).filter(({ item }) => isInventoryTrackingEnabled(item));
        const checks = await Promise.all(trackedItems.map(({ item }) => VariantService.getDetailWithLocation(item.variant.id, selectedLocationId || locationId)));
        checks.forEach((response, index) => {
          const variant = response && response.data && (response.data.data || response.data);
          const checkedItem = trackedItems[index].item;
          if (!isInventoryTrackingEnabled(checkedItem, variant)) return;
          const available = getStock(variant);
          if (available !== null && available !== undefined && Number(available) < Number(checkedItem.quantity)) {
            throw new Error(`${getProductName(checkedItem.product)} no longer has enough available stock.`);
          }
        });
      }
      const response = isUpdate ? await SaleOrderService.update(order, orderId) : await SaleOrderService.create(order);
      const created = response && response.data && response.data.data;
      const savedId = isUpdate ? orderId : created && created.id;
      if (!savedId) {
        setSavedOrder({ number: "Saved order · ID unavailable" });
        throw new Error("The server accepted the order without returning an ID. Check the order list before creating another order.");
      }
      if (confirm && (isUpdate ? !["CONFIRMED", "1"].includes(String(orderStatus).toUpperCase()) : true)) {
        try {
          await SaleOrderService.markAsConfirm(savedId);
        } catch (confirmationError) {
          if (!isUpdate) {
            setSavedOrder(created || { id: savedId, number: orderNumber, status: "DRAFT" });
            message.error(`Sales Order saved as draft, but confirmation failed: ${getApiErrorMessage(confirmationError)}`);
            history.push(`/transactions/sale-order/detail/${savedId}`);
            return;
          }
          throw confirmationError;
        }
      }
      setSavedOrder(created || { id: savedId, number: orderNumber });
      message.success(isUpdate ? "Sales Order updated." : confirm ? "Sales Order created and confirmed." : "Sales Order saved as draft.");
      history.push(`/transactions/sale-order/detail/${savedId}`);
    } catch (exception) {
      setError(getApiErrorMessage(exception));
    } finally { savingRef.current = false; setSaving(false); }
  };

  const actions = <div className="new-so-actions">
    <Button onClick={discard} disabled={saving}>Discard</Button>
    <Button onClick={() => save(false)} loading={saving} disabled={Boolean(savedOrder)}><Save size={15} /> {isUpdate ? "Save Changes" : "Save as Draft"}</Button>
    <Button type="primary" onClick={() => save(true)} loading={saving} disabled={Boolean(savedOrder)}><Zap size={16} /> {isUpdate ? "Update & Confirm" : "Create & Confirm Order"}</Button>
    <Button disabled aria-label="No additional order actions"><ChevronDown size={16} /></Button>
  </div>;

  if (editLoading) return <div className="new-so-loading"><Spin size="large" tip="Loading Sales Order…" /></div>;

  return <div className="new-so-page">
    <header className="new-so-header"><div><div className="new-so-heading"><h1>{isUpdate ? "Update Sales Order" : "New Sales Order"}</h1><span className="new-so-label">{isUpdate ? "EDIT ORDER" : "MANUAL CREATION"}</span><span className="new-so-status">● {isUpdate ? `${orderStatus} · ${orderNumber || `Order ${orderId}`}` : "Draft · Unsaved order"}</span></div><p>{isUpdate ? "Edit order details, items, fulfillment, and payment terms." : "Create a manual order with inventory checks and a configured courier provider."}</p></div>{actions}</header>
    {(error || loadError) && <div className="new-so-error" role="alert">{error || loadError}</div>}
    <div className="new-so-grid"><main>
      <Section title="Order Channel & Origin" Icon={Store} extra={<small>ORIGIN ID: {originId || originByChannel[channel] || "manual"}</small>}>
        <label>Capture Source / Sales Channel</label><div className="new-so-tiles new-so-channels">{channelOptions.map(([name, detail]) => <button type="button" key={name} className={channel === name ? "selected" : ""} onClick={() => { setChannel(name); setOriginId(originByChannel[name]); touch(); }}><strong>{name}</strong><small>{detail}</small></button>)}</div>
        <div className="new-so-fields"><div><label>Account Officer / Assignee</label>{isUpdate ? <Select value={assigneeId || undefined} placeholder="Select assignee" onChange={value => { setAssigneeId(value || ""); touch(); }} style={{ width: "100%" }}>{assignees.map(value => <Select.Option key={value.id} value={String(value.id)}>{[value.firstName, value.lastName].filter(Boolean).join(" ") || value.name || `User ${value.id}`}</Select.Option>)}</Select> : <div className="new-so-static"><UserRound size={17} /> {userName}<small>Current user</small></div>}</div><div><label>Stock Bay &amp; Depot</label>{isUpdate ? <Select value={selectedLocationId ? String(selectedLocationId) : undefined} placeholder="Select stock location" onChange={value => { setSelectedLocationId(value || ""); touch(); }} style={{ width: "100%" }}>{locations.map(value => <Select.Option key={value.id} value={String(value.id)}>{value.name || value.businessName || `Location ${value.id}`}</Select.Option>)}</Select> : <div className="new-so-static"><Store size={17} /> {selectedLocationId ? `Location #${selectedLocationId}` : "Current location unavailable"}</div>}</div><div><label>Applied Price Tier</label><div className="new-so-static">{customer && customer.type === CustomerEnum.CUSTOMER_TYPE.WHOLE_SALE ? "Wholesale" : customer && customer.type === CustomerEnum.CUSTOMER_TYPE.DISTRIBUTOR ? "Distributor" : "Standard Retail"}</div></div></div>
      </Section>
      <Section title="Order Line Items" Icon={ClipboardList} extra={<><span>{items.length} Items · {units} Units</span><Button onClick={() => searchProducts("")}>Quick Catalog</Button><Button className="new-so-add-line" disabled title="Custom SKU creation is not supported by this order API"><Plus size={14} /><span>Add Custom SKU</span></Button></>}>
        <div className="new-so-search"><Barcode size={18} /><Input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} onPressEnter={() => searchProducts(query)} placeholder="Search item name, SKU, or scan barcode (Press F2 to focus)…" suffix={<small>F2</small>} /><Button onClick={() => searchProducts(query)} loading={searching}><Search size={15} /> Lookup</Button></div>
        {catalogOpen && <div className="new-so-results" role="listbox" aria-label="Catalog results">
          <div className="new-so-results-title">
            <div className="new-so-results-heading"><strong>Choose a product</strong><small>{searching ? "Searching catalog…" : `${results.length} ${results.length === 1 ? "product" : "products"}`}</small></div>
            <Button type="link" size="small" onClick={() => setCatalogOpen(false)}><span>Close</span></Button>
          </div>
          {searching ? <div className="new-so-results-state"><Spin size="small" /> Searching catalog…</div> : results.length ? <div className="new-so-result-list">{results.map(product => {
            const variants = getVariants(product);
            const productCode = product.code || product.sku || product.barcode;
            const categoryName = product.category && product.category.name || product.categoryName;
            return <article className="new-so-result" key={product.id}>
              <div className="new-so-result-product">
                <span className="new-so-result-icon"><Package size={18} /></span>
                <div className="new-so-result-details"><strong>{getProductName(product)}</strong><small>{[productCode && `SKU ${productCode}`, categoryName].filter(Boolean).join(" · ") || "Catalog product"}</small></div>
                <span className="new-so-result-count">{variants.length} {variants.length === 1 ? "variant" : "variants"}</span>
              </div>
              {variants.length ? <div className="new-so-variant-list">{variants.map(variant => <Button key={variant.id} className="new-so-variant-option" onClick={() => addProduct(product, variant)}>
                <span className="new-so-variant-name">{variant.name || variant.barcode || variant.code || `Variant ${variant.id}`}</span>
                <span className="new-so-variant-price"><strong>{money(getPrice(variant, customer))}</strong><small>{variant.unitName || product.unit && product.unit.name || "USD"}</small></span>
                <Plus size={15} aria-hidden="true" />
              </Button>)}</div> : <div className="new-so-result-unavailable">No saleable variants for this product.</div>}
            </article>;
          })}</div> : <div className="new-so-results-state new-so-results-empty"><Search size={18} /><div><strong>No products found</strong><small>Try searching by item name, SKU, or barcode.</small></div></div>}
        </div>}
        <div className="new-so-table-wrap"><table><thead><tr>{["#", "ITEM DESCRIPTION & LOCATION", "QUANTITY", "UNIT PRICE", "DISCOUNT", "TAX", "LINE TOTAL", "ACTION"].map(head => <th key={head}>{head}</th>)}</tr></thead><tbody>{items.length ? items.map((item, index) => {
          const stock = getStock(item.variant);
          const inventoryTracked = isInventoryTrackingEnabled(item);
          const lineGross = Number(item.quantity) * Number(item.price);
          const lineDiscount = String(item.discountType || "USD").toUpperCase() === "PERCENTAGE" ? lineGross * Number(item.discount || 0) / 100 : Number(item.discount || 0);
          const lineTotal = (lineGross - lineDiscount) * (1 + Number(item.tax || 0) / 100);
          return <tr key={item.key}><td>{String(index + 1).padStart(2, "0")}</td><td><div className="new-so-product"><span className="new-so-product-icon"><Package size={19} /></span><div><strong>{getProductName(item.product)} {item.variant.name || ""}</strong><small>SKU: {item.variant.barcode || item.variant.code || item.product.code || "—"} · Current location</small><small className={!inventoryTracked ? "new-so-stock" : Number(stock) < Number(item.quantity) ? "new-so-low-stock" : "new-so-stock"}>{!inventoryTracked ? "Inventory not tracked" : stock === null || stock === undefined ? "Stock unavailable" : `${stock} available · Not reserved`}</small></div></div></td><td><div className="new-so-stepper"><Button size="small" onClick={() => updateItem(item.key, { quantity: Math.max(1, Number(item.quantity) - 1) })}><Minus size={13} /></Button><InputNumber min={1} value={item.quantity} onChange={value => updateItem(item.key, { quantity: value || 1 })} /><Button size="small" onClick={() => updateItem(item.key, { quantity: Number(item.quantity) + 1 })}><Plus size={13} /></Button></div><small>{item.product.unit && item.product.unit.name || item.variant.unitName || "Units"}</small></td><td><InputNumber min={0} precision={2} value={item.price} onChange={value => updateItem(item.key, { price: value || 0, priceEdited: true })} />{item.variant.retailPrice && <small>Retail {money(item.variant.retailPrice)}</small>}</td><td><InputNumber min={0} value={item.discount} title="Discount amount in USD" onChange={value => updateItem(item.key, { discount: value || 0, discountType: "USD" })} /></td><td><InputNumber min={0} max={100} disabled={isUpdate} title={isUpdate ? "Tax is not included in the supplied update API contract" : "Tax rate"} value={item.tax} formatter={value => `${value}%`} parser={value => value.replace("%", "")} onChange={value => updateItem(item.key, { tax: value || 0 })} /></td><td><strong>{money(lineTotal)}</strong><small>USD</small></td><td><div className="new-so-row-actions"><Button title="Duplicate line" onClick={() => { setItems(current => [...current, { ...item, key: `${Date.now()}-${Math.random()}`, entryId: "" }]); touch(); }}><Copy size={15} /></Button><Button title="Remove line" onClick={() => { if (isUpdate && item.entryId) setDeletedItems(current => [...current, item]); setItems(current => current.filter(value => value.key !== item.key)); touch(); }}><Trash2 size={15} /></Button></div></td></tr>;
        }) : <tr><td colSpan="8" className="new-so-empty">Search the catalog to add the first item.</td></tr>}</tbody></table></div>
        <div className="new-so-items-bottom"><Button className="new-so-add-line" type="link" onClick={() => searchProducts("")}><Plus size={15} /><span>Add another line item</span></Button><span><BadgeCheck size={16} /> Inventory shown is an availability check; reservation occurs according to the server order lifecycle.</span></div>
      </Section>
      <Section title="Fulfillment & Courier Dispatch" Icon={Truck}><div className="new-so-tiles new-so-fulfillment">{fulfillmentOptions.map(([name, detail]) => <button type="button" key={name} className={fulfillment === name ? "selected" : ""} onClick={() => { setFulfillment(name); touch(); }}><strong>{name}</strong><small>{detail}</small></button>)}</div>{fulfillment === "Courier Delivery" && <div className="new-so-field"><label>Designated Fleet Provider</label><Select value={providerId || undefined} placeholder="Choose configured provider" onChange={selectProvider} style={{ width: "100%" }}>{providers.map(provider => <Select.Option key={provider.id} value={String(provider.id)}>{provider.name}</Select.Option>)}</Select>{selectedProvider && <small>{fee === null ? "No configured fee available." : `Configured fee: ${money(fee)}`}</small>}{selectedProvider && <div className="new-so-field"><label htmlFor="fulfillment-distance-km">Fulfillment distance (km)</label><InputNumber id="fulfillment-distance-km" min={0} precision={2} value={fulfillmentDistanceKm} onChange={value => { setFulfillmentDistanceKm(value == null ? null : Math.max(0, Number(value))); touch(); }} style={{ width: "100%" }} />{feePreviewLoading && <small>Calculating delivery fee…</small>}{feePreview && <small>Estimated fee: {feePreview.fee.toFixed(2)} {feePreview.currency}</small>}{feePreviewError && <small className="new-so-fee-error">{feePreviewError}</small>}</div>}{isUpdate && <div className="new-so-field"><label>Delivery fee</label><InputNumber min={0} precision={2} value={deliveryFeeOverride} onChange={value => { setDeliveryFeeOverride(value || 0); touch(); }} /></div>}<div className="new-so-fields"><label>Province<Select aria-label="Province" dropdownClassName="new-so-province-dropdown" showSearch allowClear value={province || undefined} placeholder="Select province" optionFilterProp="children" filterOption={(input, option) => String(option.props.children).toLowerCase().includes(input.toLowerCase())} onChange={value => { setProvince(value || ""); touch(); }} style={{ width: "100%" }}>{province && !cambodiaProvinces.includes(province) && <Select.Option key={`legacy-${province}`} value={province}>{province}</Select.Option>}{cambodiaProvinces.map(value => <Select.Option key={value} value={value}>{value}</Select.Option>)}</Select></label><label>City<Input value={city} onChange={event => { setCity(event.target.value); touch(); }} /></label></div><div className="new-so-dispatch"><Checkbox disabled>Automatic Dispatch</Checkbox><small>Courier booking and tracking are unavailable in the current order API.</small></div></div>}<div className="new-so-field"><label>Shipping detail</label><Input value={shippingDetail} onChange={event => { setShippingDetail(event.target.value); touch(); }} placeholder="Shipping detail or waybill remark" /></div><div className="new-so-field"><label>Courier Delivery Instructions</label><TextArea rows={3} value={deliveryInstructions} onChange={event => { setDeliveryInstructions(event.target.value); touch(); }} placeholder="Instructions for delivery" /></div></Section>
    </main><aside>
      <Section title="Customer Recipient" Icon={UserRound}>
        <Select
          showSearch
          allowClear
          filterOption={false}
          loading={customerLoading}
          onSearch={searchCustomers}
          value={customer && customer.id || undefined}
          onChange={selectCustomer}
          notFoundContent={customerLoading ? <Spin size="small" /> : customerSearchDone && customerQuery.length >= 2 && !customers.length ? <Button type="link" onMouseDown={event => event.preventDefault()} onClick={openCustomerCreate}><Plus size={14} /> Add New Customer</Button> : customerQuery.length === 1 ? "Enter at least 2 characters to search" : "Search by customer name or phone number"}
          placeholder="Search customer by name or phone number"
          style={{ width: "100%" }}
        >
          {customerOptions.map(value => <Select.Option key={value.id} value={value.id}>{getName(value)} · {String(value.phoneNumber || "")}</Select.Option>)}
        </Select>
        {customer && <div className="new-so-customer">
          <div className="new-so-avatar">{getName(customer).split(" ").map(word => word[0]).slice(0, 2).join("")}</div>
          <div><strong>{getName(customer)}</strong><small>{String(customer.phoneNumber || "")}</small></div>
          {Number(customer.orderCount) > 0 && <span className="new-so-repeat">Repeat ({customer.orderCount} Orders)</span>}
          <div className="new-so-address">
            <label>Shipping Address <Button type="link" onClick={() => document.getElementById("new-so-address") && document.getElementById("new-so-address").focus()}>Change Address</Button></label>
            <MapPin size={15} />
            <TextArea id="new-so-address" aria-label="Shipping address" rows={2} value={address} onChange={event => { setAddress(event.target.value); touch(); }} placeholder="Enter shipping address" />
          </div>
          <div className="new-so-location-panel">
            <div className="new-so-location-heading">
              <span className="new-so-location-icon"><MapPin size={16} /></span>
              <div><strong>Pin delivery location</strong><small>Use a Google Maps share link to fill the address and map coordinates.</small></div>
            </div>
            <label htmlFor="new-so-google-maps-link">Google Maps link</label>
            <div className="new-so-location-input-row">
              <Input id="new-so-google-maps-link" aria-label="Google Maps share link" value={googleMapsUrl} onChange={event => { setGoogleMapsUrl(event.target.value); setLocationResolveError(""); }} onPressEnter={event => { event.preventDefault(); resolveGoogleMapsLocation(); }} placeholder="Paste a link like maps.app.goo.gl/…" />
              <Button className="new-so-location-fetch" onClick={resolveGoogleMapsLocation} disabled={locationResolving || !googleMapsUrl.trim()}><Link2 size={14} /> {locationResolving ? "Looking up…" : "Use location"}</Button>
            </div>
            <small className="new-so-location-help">The address will be added above and can still be edited.</small>
            {locationResolving && <div className="new-so-location-state" aria-live="polite"><Spin size="small" /> Resolving shared location…</div>}
            {locationDetails && !locationResolving && <div className="new-so-location-result" role="status"><CheckCircle2 size={16} /><div><strong>Location added</strong><span>{Number(locationDetails.latitude).toFixed(6)}, {Number(locationDetails.longitude).toFixed(6)}</span></div></div>}
            {locationResolveError && <div className="new-so-location-error" role="alert">{locationResolveError}</div>}
          </div>
        </div>}
        {customer && <div className="new-so-field"><label>Shipping Contact</label><Input aria-label="Shipping contact" value={shippingContact} onChange={event => { setShippingContact(event.target.value); touch(); }} placeholder={String(customer.phoneNumber || "Enter shipping contact")} /></div>}
        {customer && customer.notificationPreference && <div className="new-so-info">{customer.notificationPreference}</div>}
        {customerCreateOpen && <div className="new-so-inline-customer">
          <div className="new-so-inline-customer-heading"><div><strong>Add a new customer</strong><small>Customer details and optional delivery overrides.</small></div><Button type="link" onClick={() => { setCustomerCreateOpen(false); setCustomerCreateError(""); }}>Cancel</Button></div>
          <div className="new-so-inline-customer-fields">
            <label>Customer Name<Input value={newCustomerName} onChange={event => { setNewCustomerName(event.target.value); setCustomerCreateError(""); }} placeholder="Enter customer name" /></label>
            <label>Phone Number<Input value={newCustomerPhone} onChange={event => { setNewCustomerPhone(event.target.value); setCustomerCreateError(""); }} placeholder="Enter phone number" /></label>
            <label>Address<Input value={newCustomerAddress} onChange={event => setNewCustomerAddress(event.target.value)} placeholder="Customer address" /></label>
            <label>Shipping Contact<Input value={newShippingContact} onChange={event => setNewShippingContact(event.target.value)} placeholder={newCustomerPhone || "Defaults to phone number"} /></label>
            <label className="new-so-inline-customer-shipping-address">Shipping Address<TextArea rows={2} value={newShippingAddress} onChange={event => setNewShippingAddress(event.target.value)} placeholder={newCustomerAddress || "Defaults to customer address"} /></label>
          </div>
          <small className="new-so-customer-fallback">If left blank, shipping contact uses the phone number and shipping address uses the customer address.</small>
          {customerCreateError && <div className="new-so-error" role="alert">{customerCreateError}</div>}
          <div className="new-so-inline-customer-actions"><Button onClick={() => setCustomerCreateOpen(false)}>Cancel</Button><Button type="primary" onClick={createCustomer} loading={Boolean(customerAdd && customerAdd.adding)} disabled={Boolean(customerAdd && customerAdd.adding)}>Create & Select Customer</Button></div>
        </div>}
      </Section>
      <Section title="Payment & Terms" Icon={CreditCard} extra={<small>Unpaid</small>}><div className="new-so-tiles new-so-payments">{paymentLabels.map(label => <button type="button" key={label} className={payment === label ? "selected" : ""} onClick={() => { setPayment(label); const method = paymentMethods.find(value => getPaymentLabel(value) === label); setPaymentMethodId(method ? String(method.id) : ""); touch(); }}><strong>{label}</strong></button>)}</div>{payment === "Net 15 / 30 Terms" && <label>Payment term (days)<InputNumber min={0} value={payTermNumber} onChange={value => { setPayTermNumber(value || 0); touch(); }} /></label>}<div className="new-so-due"><span>Due Date / Term</span><strong>{payment === "Cash on Delivery" ? "On handover" : payment === "Net 15 / 30 Terms" ? `${payTermNumber} days` : "On payment confirmation"}</strong></div>{!selectedPayment && <div className="new-so-info">Choose a payment method configured in this workspace.</div>}</Section>
      <Section title="Financial Summary" Icon={Wallet} extra={<small>USD BASE</small>}><div className="new-so-summary-row"><span>Line Items Subtotal ({units} units)</span><strong>{money(subtotal)}</strong></div><div className="new-so-summary-row"><span>Order Discount <Button type="link" disabled title="Coupon endpoint is not available from the current frontend contract">+ Coupon</Button></span><div className="new-so-discount"><InputNumber min={0} precision={2} max={discountType === "PERCENTAGE" ? 100 : undefined} value={orderDiscount} onChange={value => { setOrderDiscount(value || 0); touch(); }} /><Select value={discountType} onChange={value => { setDiscountType(value); touch(); }}><Select.Option value="USD">USD</Select.Option><Select.Option value="PERCENTAGE">%</Select.Option></Select></div></div><div className="new-so-summary-row"><span>Delivery Fee {selectedProvider && `(${selectedProvider.name})`}</span><strong>{fee === null ? "Calculated by server" : money(fee)}</strong></div><div className="new-so-summary-row"><span>VAT / GST</span><strong>{money(taxTotal)}</strong></div><div className="new-so-total"><span>Grand Total</span><strong>{fee === null ? "Final fee pending" : money(payable)}</strong><small>Currency: US Dollar</small></div>{exchangeRate && payable !== null && <div className="new-so-currency"><span>Cambodian Riel (KHR)</span><strong>~{Math.round(payable * exchangeRate).toLocaleString()} KHR</strong><small>Exchange rate: $1.00 USD = {exchangeRate.toLocaleString()} KHR</small></div>}<div className="new-so-info"><ShieldCheck size={15} /> Final totals and payment state are validated by the server.</div></Section>
      <Section title="Internal Warehouse / Packer Notes" Icon={ClipboardList}><TextArea rows={4} value={internalNotes} onChange={event => { setInternalNotes(event.target.value); touch(); }} placeholder="Notes for warehouse staff" /></Section>
    </aside></div>
    <footer className="new-so-footer"><div className="new-so-footer-details"><span className="new-so-status">● {orderNumber || "Unsaved order"}</span><span>· {items.length} Items ({units} Units)</span><span>· {customer ? getName(customer) : "No customer"}</span><span>· {fulfillment === "Courier Delivery" && selectedProvider ? `${selectedProvider.name} Delivery` : fulfillment}</span></div><div className="new-so-footer-actions"><span>PAYABLE: <strong>{fee === null ? "Pending fee" : money(payable)}</strong></span>{actions}</div></footer>
  </div>;
}

export default connect(state => ({ customerAdd: state.reducer.customer.add }))(NewSalesOrder);
