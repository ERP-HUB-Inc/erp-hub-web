import React from "react";
import moment from "moment";
import { Modal, Input, Select, Button, InputNumber, Checkbox, Spin, message, Tooltip } from "antd";
import {
  ClipboardPaste, Send, MessageCircle, Music2, Globe2, X, MapPin,
  Phone, UserRound, Clock3, Package, Plus, Minus, Trash2, CheckCircle2,
  AlertCircle, Truck, Printer, ArrowRight, CornerDownLeft
} from "lucide-react";
import CustomerService from "../../../../../../services/CustomerService";
import ItemService from "@services/ItemService";
import UnitService from "@services/UnitService";
import PaymentMethodService from "@services/PaymentMethodService";
import FulfillmentProviderService from "@services/FulfillmentProviderService";
import CurrencyExchangeService from "../../../services/settings/ExchangeRateService";
import SaleOrderService from "../../../services/transactions/SaleOrderService";
import Enum from "../../../enums";
import CustomerEnum from "../../../../crm/enum";
import Util from "../../../../common/util";
import "./quick-sale-modal.css";

const { TextArea } = Input;
const util = new Util();
const DEFAULT_CUSTOMER_NAME = "Unknown";
const PLATFORM_OPTIONS = [
  { key: "auto", label: "Auto Detect", Icon: Globe2 },
  { key: "telegram", label: "Telegram", Icon: Send },
  { key: "messenger", label: "Messenger", Icon: MessageCircle },
  { key: "tiktok", label: "TikTok", Icon: Music2 }
];

const normalizeText = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const normalizePhone = value => String(value || "").replace(/\D/g, "").replace(/^855/, "0");
const normalizeKhmerDigits = value => String(value || "").replace(/[០-៩]/g, digit => "០១២៣៤៥៦៧៨៩".indexOf(digit));
const getList = response => response && response.data && Array.isArray(response.data.data) ? response.data.data : [];
const getPaymentMethodValue = method => String(method && (method.id || method.code || method.name) || "");
const getPaymentMethodLabel = method => method && (method.name || method.code) || "Payment method";
const GOOGLE_MAPS_LINK_REGEX = /https?:\/\/(?:maps\.app\.goo\.gl\/[^\s]+|goo\.gl\/maps\/[^\s]+|(?:www\.)?google\.[a-z.]+\/maps[^\s]*|maps\.google\.[a-z.]+(?:\/maps)?[^\s]*)/ig;
const getGoogleMapsLinks = value => (String(value || "").match(GOOGLE_MAPS_LINK_REGEX) || []).map(link => link.replace(/[),.;!?]+$/, ""));
const removeGoogleMapsLinks = value => String(value || "").replace(GOOGLE_MAPS_LINK_REGEX, "").replace(/\s+/g, " ").replace(/\s*[,;|]\s*$/, "").trim();
const getFulfillmentProviderValue = provider => String(provider && provider.id || "");
const getFulfillmentProviderLabel = provider => provider && provider.name || "Fulfillment provider";
const getFulfillmentProviderMark = provider => {
  const identity = normalizeText(`${provider && provider.id || ""} ${getFulfillmentProviderLabel(provider)}`);
  if (identity.includes("jnt") || identity.includes("j t")) return { label: "J&T", tone: "jnt" };
  if (identity.includes("grab")) return { label: "G", tone: "grab" };
  if (identity.includes("kerry")) return { label: "K", tone: "kerry" };
  if (identity.includes("virak") || identity.includes("buntham")) return { label: "VB", tone: "virak" };
  if (identity.includes("in store") || identity.includes("instore")) return { label: "IS", tone: "store" };
  if (identity.includes("own delivery") || identity.includes("own")) return { label: "OD", tone: "own" };
  const initials = getFulfillmentProviderLabel(provider).split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase();
  return { label: initials || "FP", tone: "default" };
};
const getFulfillmentProviderLogoSource = provider => {
  const identity = normalizeText(`${provider && provider.id || ""} ${getFulfillmentProviderLabel(provider)}`);
  if (identity.includes("jnt") || identity.includes("j t")) return "/fulfillments/jnt_express.png";
  if (identity.includes("grab")) return "/fulfillments/grab_express.png";
  if (identity.includes("vireak") || identity.includes("virak") || identity.includes("buntham")) return "/fulfillments/vireak-buntham.png";
  return "";
};
const renderFulfillmentProviderOption = provider => {
  const mark = getFulfillmentProviderMark(provider);
  const logoSource = getFulfillmentProviderLogoSource(provider);
  return <span className="quick-sale-provider-option"><span className="quick-sale-provider-logo-slot" aria-hidden="true">{logoSource ? <img src={logoSource} alt="" /> : <span className={`quick-sale-provider-mark ${mark.tone}`}>{mark.label}</span>}</span><span>{getFulfillmentProviderLabel(provider)}</span></span>;
};
const getDefaultFulfillmentFeeRule = provider => {
  const rules = provider && Array.isArray(provider.feeRules) ? provider.feeRules : [];
  return rules
    .filter(rule => rule
      && (rule.status == null || Number(rule.status) === 1)
      && String(rule.type || "").toUpperCase() === "FLAT"
      && Number.isFinite(Number(rule.amount))
      && Number(rule.amount) >= 0)
    .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0))[0] || null;
};
const getProductName = product => product && (product.name || product.namekm || product.nameKh || "");
const getVariants = product => product && Array.isArray(product.productVariants) ? product.productVariants : [];
const normalizeUnit = value => {
  const unit = String(value || "").toLowerCase().trim();
  if (/^(kg|kgs|kilo|kilos|kilogram|kilograms|គីឡូក្រាម|គីឡូ|គក)$/.test(unit)) return "kg";
  if (/^(pair|pairs|គូ)$/.test(unit)) return "pair";
  if (/^(pc|pcs|piece|pieces)$/.test(unit)) return "pc";
  if (/^(bottle|bottles)$/.test(unit)) return "bottle";
  if (/^(bag|bags)$/.test(unit)) return "bag";
  if (/^(pack|packs)$/.test(unit)) return "pack";
  if (/^(box|boxes)$/.test(unit)) return "box";
  return unit;
};
const getProductUnit = (product, variant, units = []) => {
  const unitId = product && product.stockUnitId || variant && variant.unitId;
  const configuredUnit = units.find(unit => String(unit.id) === String(unitId));
  return configuredUnit && configuredUnit.name || product && product.unit && product.unit.name || variant && variant.unitName || "";
};

function parseShortKhmerRequest(text) {
  const normalized = normalizeKhmerDigits(text);
  const quantityMatch = normalized.match(/(?:ចង់យក|សុំយក|ចង់បាន|យក)?\s*(\d+(?:\.\d+)?)\s*(kg|kgs|kilo(?:grams?)?|គីឡូក្រាម|គីឡូ|គក)\s*(មួយ\s*គូ|1\s*គូ|គូ)?/i);
  if (!quantityMatch) return null;

  const amount = Number(quantityMatch[1]);
  const pairMentioned = Boolean(quantityMatch[3]);
  const options = [{ quantity: amount, unit: "kg", label: `${amount} kg` }];
  if (pairMentioned) options.push({ quantity: 1, unit: "pair", label: "1 pair" });

  return {
    rawName: "Product not specified",
    sourceText: String(text || "").trim(),
    quantity: amount,
    quantityUnit: pairMentioned ? "" : "kg",
    quantityOptions: options,
    quantityNeedsReview: pairMentioned,
    product: null,
    variant: null,
    candidates: [],
    matchState: "unmatched",
    needsProductSearch: true
  };
}

function parseChat(text) {
  const lines = String(text || "").split(/\r?\n/);
  const products = [];
  const sections = String(text || "").split(/\r?\n\s*\r?\n/);
  const itemPattern = /^\s*[-*•]?\s*(\d+)\s*[x×]\s*(.+?)(?:\s*\(\s*\$?\s*([\d,]+(?:\.\d{1,2})?)\s*(?:each|ea)?\s*\))?\s*$/i;
  const phonePattern = /(?:\+?855[\s-]?(?:\d[\s-]?){8,10}|0\d[\s-]?(?:\d[\s-]?){7,9})/;
  const normalizedText = normalizeKhmerDigits(text);
  const fullPhoneMatch = normalizedText.match(phonePattern);
  const fullPhoneLineIndex = fullPhoneMatch ? lines.findIndex(line => phonePattern.test(normalizeKhmerDigits(line))) : -1;
  const hasSectionBreak = sections.length > 1;
  const itemLines = hasSectionBreak
    ? sections[0].split(/\r?\n/)
    : fullPhoneLineIndex < 0 ? lines : lines.slice(0, fullPhoneLineIndex);
  const contactLines = hasSectionBreak
    ? sections.slice(1).join("\n").split(/\r?\n/)
    : fullPhoneLineIndex < 0 ? [] : lines.slice(fullPhoneLineIndex);
  const contactText = contactLines.join("\n");
  const normalizedContactText = normalizeKhmerDigits(contactText);
  const phoneMatch = normalizedContactText.match(phonePattern);

  itemLines.forEach(line => {
    const match = line.match(itemPattern);
    const lineText = line.trim().replace(/^[-*•]\s*/, "");
    if (!lineText || /^(deliver|recipient|customer|name|tel|phone|payment|please|hi\b|hello\b|ចង់យក|សុំយក|ចង់បាន|យក\s*\d)/i.test(lineText)) return;
    if (match) {
      products.push({
        rawName: match[2].trim(),
        quantity: Number(match[1]),
        statedPrice: match[3] ? Number(match[3].replace(/,/g, "")) : null,
        product: null,
        variant: null,
        candidates: [],
        matchState: "searching"
      });
      return;
    }

    const trailingUnit = lineText.match(/^(.+?)\s+(\d+(?:\.\d+)?)\s*(bong|bottle|bottles|pcs?|pieces|packs?|bags?|boxes?)$/i);
    const itemName = trailingUnit ? trailingUnit[1].trim() : lineText;
    const itemQuantity = trailingUnit ? Number(trailingUnit[2]) : 1;
    const itemUnit = trailingUnit ? normalizeUnit(trailingUnit[3]) : "";
    products.push({
      rawName: itemName,
      sourceText: lineText,
      quantity: itemQuantity,
      statedPrice: null,
      quantityUnit: itemUnit,
      quantityOptions: trailingUnit ? [{ quantity: itemQuantity, unit: itemUnit, label: `${itemQuantity} ${trailingUnit[3]}` }] : [],
      quantityNeedsReview: Boolean(trailingUnit),
      product: null,
      variant: null,
      candidates: [],
      matchState: "searching"
    });
  });

  if (!products.length) {
    const shortRequest = parseShortKhmerRequest(text);
    if (shortRequest) products.push(shortRequest);
  }

  const recipientMatch = text.match(/^\s*(?:recipient|customer|name)\s*:\s*(.+)$/im);
  const addressMatch = text.match(/^\s*(?:deliver\s+to|address)\s*:\s*(.+)$/im);
  const paymentMatch = text.match(/^\s*payment\s*:\s*(.+)$/im);
  const mapLink = getGoogleMapsLinks(text)[0] || "";
  const courierMatch = text.match(/\bwith\s+(.+?)(?=\s+today\b|[.!?\n]|$)/i);
  const timeMatch = text.match(/\b(today\s+before\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i);
  const unlabeledAddressLines = contactLines.map(line => removeGoogleMapsLinks(line).replace(phonePattern, "").replace(/^\s*(?:tel|phone)\s*:\s*/i, "").replace(/^\s*[-,:|]+\s*|\s*[-,:|]+\s*$/g, "").trim())
    .filter(line => line && !/^(payment\s*:|with\b|please\b|recipient\s*:|customer\s*:|name\s*:)/i.test(line));
  const locations = removeGoogleMapsLinks(addressMatch ? addressMatch[1] : unlabeledAddressLines.join(", "));

  return {
    products,
    name: recipientMatch ? recipientMatch[1].trim() : "",
    phone: phoneMatch ? contactText.slice(phoneMatch.index, phoneMatch.index + phoneMatch[0].length).trim().replace(/[.,;]+$/, "") : "",
    address: locations,
    mapLink,
    paymentMethod: paymentMatch ? paymentMatch[1].trim() : "",
    courier: courierMatch ? courierMatch[1].trim().replace(/\s+today.*$/i, "") : "",
    dispatchNote: timeMatch ? `Deliver ${timeMatch[1].trim()}` : ""
  };
}

function matchScore(query, product) {
  const name = normalizeText(getProductName(product));
  const normalizedQuery = normalizeText(query);
  if (!name || !normalizedQuery) return 0;
  if (name === normalizedQuery) return 100;
  if (name.includes(normalizedQuery) || normalizedQuery.includes(name)) return 75;
  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const matchingTokens = queryTokens.filter(token => name.includes(token)).length;
  return Math.round((matchingTokens / Math.max(queryTokens.length, 1)) * 65);
}

function QuickSaleModal({ visible, onCancel, onCreated }) {
  const [platform, setPlatform] = React.useState("auto");
  const [chat, setChat] = React.useState("");
  const [parsed, setParsed] = React.useState(false);
  const [parsing, setParsing] = React.useState(false);
  const [parseError, setParseError] = React.useState("");
  const [customerName, setCustomerName] = React.useState(DEFAULT_CUSTOMER_NAME);
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [mapLink, setMapLink] = React.useState("");
  const [customers, setCustomers] = React.useState([]);
  const [customerQuery, setCustomerQuery] = React.useState("");
  const [customerId, setCustomerId] = React.useState(null);
  const [customerSearching, setCustomerSearching] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [itemSearch, setItemSearch] = React.useState("");
  const [itemResults, setItemResults] = React.useState([]);
  const [itemSearching, setItemSearching] = React.useState(false);
  const [courier, setCourier] = React.useState("");
  const [fulfillmentProviders, setFulfillmentProviders] = React.useState([]);
  const [fulfillmentProviderId, setFulfillmentProviderId] = React.useState("");
  const [fulfillmentProvidersLoading, setFulfillmentProvidersLoading] = React.useState(false);
  const [fulfillmentProvidersError, setFulfillmentProvidersError] = React.useState(false);
  const [deliveryFee, setDeliveryFee] = React.useState(0);
  const [dispatchNote, setDispatchNote] = React.useState("");
  const [paymentMethods, setPaymentMethods] = React.useState([]);
  const [units, setUnits] = React.useState([]);
  const [paymentMethod, setPaymentMethod] = React.useState("");
  const [exchangeRate, setExchangeRate] = React.useState(null);
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [savedOrderId, setSavedOrderId] = React.useState(null);
  const [printWaybill, setPrintWaybill] = React.useState(false);
  const [customerDirty, setCustomerDirty] = React.useState(false);
  const [itemsDirty, setItemsDirty] = React.useState(false);
  const [courierDirty, setCourierDirty] = React.useState(false);

  React.useEffect(() => {
    if (!visible) return;
    setPlatform("auto");
    setChat("");
    setParsed(false);
    setParsing(false);
    setParseError("");
    setCustomerName(DEFAULT_CUSTOMER_NAME);
    setPhone("");
    setAddress("");
    setMapLink("");
    setCustomers([]);
    setCustomerQuery("");
    setCustomerId(null);
    setItems([]);
    setItemSearch("");
    setItemResults([]);
    setCourier("");
    setFulfillmentProviderId("");
    setFulfillmentProviders([]);
    setFulfillmentProvidersError(false);
    setDeliveryFee(0);
    setDispatchNote("");
    setPaymentMethod("");
    setUnits([]);
    setSavedOrderId(null);
    setPrintWaybill(false);
    setCustomerDirty(false);
    setItemsDirty(false);
    setCourierDirty(false);
    setFulfillmentProvidersLoading(true);
    FulfillmentProviderService.list()
      .then(response => setFulfillmentProviders(getList(response)))
      .catch(() => setFulfillmentProvidersError(true))
      .finally(() => setFulfillmentProvidersLoading(false));
    PaymentMethodService.get({ limit: 5 })
      .then(response => setPaymentMethods(getList(response)))
      .catch(() => setPaymentMethods([]));
    UnitService.get({ limit: 100 })
      .then(response => setUnits(getList(response)))
      .catch(() => setUnits([]));
    CurrencyExchangeService.getCurrentExchangeRate()
      .then(response => {
        const data = response && response.data && response.data.data;
        const rate = Number(data && (data.sellRate || data.value || data.rate));
        if (Number.isFinite(rate) && rate > 0) setExchangeRate(rate);
      })
      .catch(() => {});
    CustomerService.get({ limit: 10 })
      .then(response => setCustomers(getList(response)))
      .catch(() => setCustomers([]));
  }, [visible]);

  React.useEffect(() => {
    if (!courier || courierDirty || !fulfillmentProviders.length) return;
    const normalizedCourier = normalizeText(courier);
    const provider = fulfillmentProviders.find(value => normalizeText(value.name) === normalizedCourier);
    if (provider) setFulfillmentProviderId(getFulfillmentProviderValue(provider));
  }, [courier, courierDirty, fulfillmentProviders]);

  React.useEffect(() => {
    const provider = fulfillmentProviders.find(value => getFulfillmentProviderValue(value) === String(fulfillmentProviderId));
    const rule = getDefaultFulfillmentFeeRule(provider);
    setDeliveryFee(rule ? Number(rule.amount) : 0);
  }, [fulfillmentProviderId, fulfillmentProviders]);

  const productSearch = React.useCallback(async query => {
    const response = await ItemService.get({
      limit: 10,
      locationId: util.getLocationId(),
      search: String(query || "").trim()
    });
    return getList(response);
  }, []);

  const matchItem = React.useCallback(async item => {
    if (item.needsProductSearch) return item;
    try {
      const results = await productSearch(item.rawName);
      const ranked = results.map(product => ({ product, score: matchScore(item.rawName, product) }))
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score);
      const exact = ranked.filter(result => result.score === 100);
      if (exact.length === 1 && getVariants(exact[0].product).length === 1) {
        const product = exact[0].product;
        const variant = getVariants(product)[0];
        const inventoryUnit = getProductUnit(product, variant, units);
        const unitMismatch = Boolean(item.quantityUnit && inventoryUnit && normalizeUnit(item.quantityUnit) !== normalizeUnit(inventoryUnit));
        return {
          ...item,
          product,
          variant,
          candidates: [product],
          unitMismatch,
          matchState: item.quantityNeedsReview || unitMismatch ? "review" : "matched"
        };
      }
      return { ...item, candidates: ranked.filter(result => result.score >= 65).map(result => result.product), matchState: "review" };
    } catch (error) {
      return { ...item, candidates: [], matchState: "unmatched" };
    }
  }, [productSearch, units]);

  const parseContent = async () => {
    if (!chat.trim()) {
      setParseError("Paste a customer message before parsing.");
      setParsed(false);
      return;
    }
    setParsing(true);
    setParseError("");
    try {
      const extracted = parseChat(chat);
      const matchedItems = await Promise.all(extracted.products.map(matchItem));
      if (!customerDirty) {
        setCustomerName(extracted.name || DEFAULT_CUSTOMER_NAME);
        setPhone(extracted.phone);
        setAddress(extracted.address);
        setMapLink(extracted.mapLink);
        setCustomerId(null);
        if (extracted.phone) searchCustomers(extracted.phone);
      }
      if (!courierDirty) {
        setCourier(extracted.courier);
        setFulfillmentProviderId("");
        setDispatchNote(extracted.dispatchNote);
      }
      if (!itemsDirty) setItems(matchedItems);
      if (!paymentMethod && extracted.paymentMethod) setPaymentMethod(extracted.paymentMethod);
      setParsed(true);
      if (!matchedItems.length) setParseError("No product lines were recognized. Add items from inventory below.");
    } catch (error) {
      setParseError("Could not parse this message. Review it and add the order details manually.");
    } finally {
      setParsing(false);
    }
  };

  const searchCustomers = async value => {
    if (!value || value.trim().length < 2) return;
    setCustomerSearching(true);
    const query = JSON.stringify({ column: ["firstName", "lastName", "phoneNumber"], value: value.trim() });
    try {
      const response = await CustomerService.get({ limit: 15, offset: 0, search: query });
      const list = getList(response);
      setCustomers(list);
      setCustomerQuery(value.trim());
      const matchingPhone = list.find(customer => normalizePhone(customer.phoneNumber) === normalizePhone(value));
      if (matchingPhone && normalizePhone(value).length >= 8) {
        setCustomerId(matchingPhone.id);
        setCustomerName(`${matchingPhone.firstName || ""} ${matchingPhone.lastName || ""}`.trim());
        setPhone(matchingPhone.phoneNumber || value);
        setAddress(matchingPhone.address || address);
      }
    } catch (error) {
      message.error("Could not search customers. You can continue with the entered details.");
    } finally {
      setCustomerSearching(false);
    }
  };

  const selectCustomer = id => {
    const customer = customers.find(value => String(value.id) === String(id));
    if (!customer) return;
    setCustomerId(customer.id);
    setCustomerName(`${customer.firstName || ""} ${customer.lastName || ""}`.trim());
    setPhone(customer.phoneNumber || "");
    setAddress(customer.address || "");
    setCustomerDirty(true);
  };

  const searchItems = async value => {
    setItemSearch(value);
    if (!value || value.trim().length < 2) {
      setItemResults([]);
      return;
    }
    setItemSearching(true);
    try {
      setItemResults(await productSearch(value.trim()));
    } catch (error) {
      message.error("Could not search inventory.");
    } finally {
      setItemSearching(false);
    }
  };

  const setItemAt = (index, changes) => {
    setItems(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item));
    setItemsDirty(true);
  };

  const selectProduct = (index, product) => {
    const variants = getVariants(product);
    const variant = variants.length === 1 ? variants[0] : null;
    const item = items[index];
    const inventoryUnit = getProductUnit(product, variant, units);
    const unitMismatch = Boolean(item.quantityUnit && inventoryUnit && normalizeUnit(item.quantityUnit) !== normalizeUnit(inventoryUnit));
    setItemAt(index, { product, variant, candidates: [product], unitMismatch, matchState: variant && !item.quantityNeedsReview && !unitMismatch ? "matched" : "review" });
  };

  const selectQuantityInterpretation = (index, value) => {
    const item = items[index];
    const option = item.quantityOptions.find(candidate => candidate.unit === value);
    if (!option) return;
    const inventoryUnit = getProductUnit(item.product, item.variant, units);
    const unitMismatch = Boolean(item.product && inventoryUnit && normalizeUnit(option.unit) !== normalizeUnit(inventoryUnit));
    setItemAt(index, {
      quantity: option.quantity,
      quantityUnit: option.unit,
      quantityNeedsReview: false,
      unitMismatch,
      matchState: item.product && item.variant && !unitMismatch ? "matched" : "review"
    });
  };

  const useInventoryUnit = index => {
    const item = items[index];
    const inventoryUnit = getProductUnit(item.product, item.variant, units);
    if (!inventoryUnit) return;
    setItemAt(index, {
      quantityUnit: inventoryUnit,
      quantityNeedsReview: false,
      unitMismatch: false,
      matchState: item.product && item.variant ? "matched" : "review"
    });
  };

  const addInventoryProduct = productId => {
    const product = itemResults.find(value => String(value.id) === String(productId));
    if (!product) return;
    const variants = getVariants(product);
    const variant = variants.length === 1 ? variants[0] : null;
    setItems(current => [...current, {
      rawName: getProductName(product), quantity: 1, statedPrice: null,
      product, variant, candidates: [product], matchState: variant ? "matched" : "review"
    }]);
    setItemsDirty(true);
    setItemSearch("");
    setItemResults([]);
  };

  const removeItem = index => {
    setItems(current => current.filter((item, itemIndex) => itemIndex !== index));
    setItemsDirty(true);
  };

  const getUnitPrice = item => {
    if (item.statedPrice !== null && item.statedPrice !== undefined && Number.isFinite(Number(item.statedPrice))) return Number(item.statedPrice);
    const variant = item.variant || {};
    const selectedCustomer = customers.find(customer => String(customer.id) === String(customerId));
    let price = variant.price;
    if (selectedCustomer && selectedCustomer.type === CustomerEnum.CUSTOMER_TYPE.WHOLE_SALE) price = variant.wholePrice;
    if (selectedCustomer && selectedCustomer.type === CustomerEnum.CUSTOMER_TYPE.DISTRIBUTOR) price = variant.distributePrice;
    return Number(price || variant.retailPrice || 0);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product && item.variant ? getUnitPrice(item) * Number(item.quantity || 0) : 0), 0);
  const unitCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const selectedFulfillmentProvider = fulfillmentProviders.find(provider => getFulfillmentProviderValue(provider) === String(fulfillmentProviderId));
  const fulfillmentFeeRule = getDefaultFulfillmentFeeRule(selectedFulfillmentProvider);
  const deliveryFeeCurrency = String(fulfillmentFeeRule && fulfillmentFeeRule.currencyCode || "USD").toUpperCase();
  const deliveryFeeInOrderCurrency = deliveryFeeCurrency === "USD"
    ? deliveryFee
    : deliveryFeeCurrency === "KHR" && exchangeRate
      ? deliveryFee / exchangeRate
      : 0;
  const total = subtotal + deliveryFeeInOrderCurrency;
  const formatMoney = value => util.formatCurrency(Number(value) || 0);
  const selectedPaymentMethod = paymentMethods.find(method => [method.id, method.code, method.name].some(value => String(value || "") === String(paymentMethod)));
  const selectedPaymentMethodValue = selectedPaymentMethod ? getPaymentMethodValue(selectedPaymentMethod) : paymentMethod || undefined;
  const hasConfiguredPaymentMethod = Boolean(selectedPaymentMethod);
  const needsReview = items.some(item => !item.product || !item.variant || item.quantityNeedsReview || item.unitMismatch || item.matchState !== "matched") || !phone.trim() || !address.trim();

  const dismiss = () => {
    if (chat || items.length || (customerName.trim() && customerName.trim() !== DEFAULT_CUSTOMER_NAME) || address) {
      Modal.confirm({
        title: "Discard this Quick Sale?",
        content: "Your unsaved chat and order details will be cleared.",
        okText: "Discard",
        cancelText: "Keep editing",
        onOk: () => onCancel()
      });
      return;
    }
    onCancel();
  };

  const pasteClipboard = async () => {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      message.warning("Clipboard access is unavailable. Paste your message into the text area.");
      return;
    }
    try {
      setChat(await navigator.clipboard.readText());
      setParsed(false);
      setParseError("");
    } catch (error) {
      message.warning("Clipboard access was denied. Paste your message into the text area.");
    }
  };

  const resolveCustomer = async () => {
    if (customerId) return customerId;
    const search = JSON.stringify({ column: ["firstName", "lastName", "phoneNumber"], value: phone.trim() });
    const response = await CustomerService.get({ limit: 20, offset: 0, search });
    const existing = getList(response).find(value => normalizePhone(value.phoneNumber) === normalizePhone(phone));
    if (existing) return existing.id;
    const nameParts = (customerName.trim() || DEFAULT_CUSTOMER_NAME).split(/\s+/);
    const created = await CustomerService.add({
      firstName: nameParts.shift(),
      lastName: nameParts.join(" "),
      phoneNumber: phone.trim(),
      address: address.trim(),
      type: CustomerEnum.CUSTOMER_TYPE.RETAIL_SALE,
      status: 1,
      contacts: []
    });
    const data = created && created.data && created.data.data;
    if (!data || !data.id) throw new Error("Customer could not be created.");
    return data.id;
  };

  const saveOrder = async confirm => {
    if (saveLoading || savedOrderId) return;
    if (!phone.trim() || !address.trim()) {
      message.warning("Enter the recipient phone number and delivery address.");
      return;
    }
    if (!items.length || items.some(item => !item.product || !item.variant || item.quantityNeedsReview || item.unitMismatch || Number(item.quantity) <= 0)) {
      message.warning("Match every item to an inventory product and variant before saving.");
      return;
    }
    setSaveLoading(true);
    try {
      const linkedCustomerId = await resolveCustomer();
      const transactionEntries = items.map(item => {
        const product = item.product;
        const variant = item.variant;
        const price = getUnitPrice(item);
        const unitName = getProductUnit(product, variant, units);
        return {
          id: "",
          productVariantId: variant.id,
          variantName: getProductName(product),
          categoryId: product.categoryId,
          description: `${getProductName(product)}${variant.name ? ` ${variant.name}` : ""}`,
          enableDescription: product.enableDescription,
          quantity: Number(item.quantity),
          unitId: product.stockUnitId || variant.unitId,
          unitName,
          cost: Number(variant.cost || 0),
          price,
          discount: 0,
          status: 1
        };
      });
      const nameParts = (customerName.trim() || DEFAULT_CUSTOMER_NAME).split(/\s+/);
      const order = {
        customerId: linkedCustomerId,
        firstName: nameParts.shift(),
        lastName: nameParts.join(" "),
        phoneNumber: phone.trim(),
        address: address.trim(),
        shippingAddress: address.trim(),
        shippingContact1: phone.trim(),
        discount: 0,
        discountType: Enum.DISCOUNT_TYPE.AMOUNT,
        exchangeRate: exchangeRate || undefined,
        customerNote: dispatchNote.trim(),
        ...(fulfillmentProviderId ? { fulfillmentProviderId } : {}),
        ...(fulfillmentProviderId ? { fulfillmentFeeOverride: Number(deliveryFee || 0) } : {}),
        ...(fulfillmentProviderId ? { fulfillmentFeeCurrencyCode: deliveryFeeCurrency } : {}),
        publicNote: "",
        invoiceDate: moment().format("YYYY-MM-DD"),
        expectedShipmentDate: null,
        registerDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        status: confirm ? "CONFIRMED" : "DRAFT",
        totalExcludeTax: subtotal,
        deposit: 0,
        total: subtotal,
        transactionEntries
      };
      const response = await SaleOrderService.create(order);
      const id = response && response.data && response.data.data && response.data.data.id;
      if (!id) throw new Error("The Sales Order was created without a returned order ID.");
      setSavedOrderId(id);
      message.success(confirm ? "Sales Order created and confirmed." : "Sales Order saved as draft.");
      if (printWaybill) message.info("The order is saved. Waybill printing is not available in the current API.");
      onCreated();
      onCancel();
    } catch (error) {
      message.error(error && error.response && error.response.data && error.response.data.message || error.message || "Could not save the Sales Order. Your entered details are still here.");
    } finally {
      setSaveLoading(false);
    }
  };

  const renderItem = (item, index) => {
    const variants = item.product ? getVariants(item.product) : [];
    const variantId = item.variant && item.variant.id;
    const stockValue = item.variant && (item.variant.availableQuantity ?? item.variant.quantity ?? item.variant.inStock);
    const stockNumber = Number(stockValue);
    return (
      <div className="quick-sale-product-row" key={`${item.rawName}-${index}`}>
        <div className="quick-sale-product-icon"><Package size={18} /></div>
        <div className="quick-sale-product-main">
          {item.product ? (
            <>
              <strong>{getProductName(item.product)}</strong>
              <div className="quick-sale-product-meta">
                SKU {item.variant && (item.variant.barcode || item.variant.code) || item.product.code || "—"}
                {Number.isFinite(stockNumber) && <span className={stockNumber > 0 ? "is-stocked" : "is-out-of-stock"}>{stockNumber > 0 ? `In Stock (${stockNumber})` : "Out of Stock"}</span>}
                {item.matchState !== "matched" && <span className="quick-sale-review-note">Needs review</span>}
              </div>
              {variants.length > 1 && (
                <Select
                  size="small"
                  className="quick-sale-variant-select"
                  placeholder="Choose variant"
                  value={variantId}
                  onChange={value => {
                    const variant = variants.find(candidate => String(candidate.id) === String(value));
                    const inventoryUnit = getProductUnit(item.product, variant, units);
                    const unitMismatch = Boolean(item.quantityUnit && inventoryUnit && normalizeUnit(item.quantityUnit) !== normalizeUnit(inventoryUnit));
                    setItemAt(index, { variant, unitMismatch, matchState: !item.quantityNeedsReview && !unitMismatch ? "matched" : "review" });
                  }}
                >
                  {variants.map(variant => <Select.Option key={variant.id} value={variant.id}>{variant.name || variant.barcode || variant.code || `Variant ${variant.id}`}</Select.Option>)}
                </Select>
              )}
            </>
          ) : (
            <>
                <strong>{item.rawName}</strong>
              <Select
                showSearch
                size="small"
                className="quick-sale-variant-select"
                placeholder="Select matching inventory item"
                filterOption={false}
                onSearch={value => productSearch(value).then(results => setItemAt(index, { candidates: results, matchState: "review" })).catch(() => {})}
                onChange={value => {
                  const product = item.candidates.find(candidate => String(candidate.id) === String(value));
                  if (product) selectProduct(index, product);
                }}
              >
                {item.candidates.map(candidate => <Select.Option key={candidate.id} value={candidate.id}>{getProductName(candidate)}</Select.Option>)}
              </Select>
                {item.sourceText && <small className="quick-sale-source-text">From chat: {item.sourceText}</small>}
            </>
          )}
            {item.quantityNeedsReview && item.quantityOptions && item.quantityOptions.length > 0 && (
              <div className="quick-sale-quantity-review">
                <label>Choose what the customer meant</label>
                <Select size="small" value={!item.quantityNeedsReview ? item.quantityUnit : undefined} placeholder="Confirm quantity and unit" onChange={value => selectQuantityInterpretation(index, value)}>
                  {item.quantityOptions.map(option => <Select.Option key={option.unit} value={option.unit}>{option.label}</Select.Option>)}
                </Select>
                <small>{item.quantityOptions.length > 1 ? "Message includes both “10 kg” and “one pair”; confirm the intended amount." : `Confirm the quantity and unit from “${item.sourceText}”.`}</small>
              </div>
            )}
            {item.unitMismatch && <div className="quick-sale-unit-warning">Selected product is sold by {getProductUnit(item.product, item.variant, units) || "a different inventory unit"}, but the message indicates {item.quantityUnit}. <Button type="link" size="small" onClick={() => useInventoryUnit(index)}>Use inventory unit</Button></div>}
        </div>
        <div className="quick-sale-quantity-control">
          <Button size="small" aria-label="Decrease quantity" onClick={() => setItemAt(index, { quantity: Math.max(1, Number(item.quantity) - 1) })}><Minus size={13} /></Button>
          <InputNumber min={1} value={Number(item.quantity) || 1} onChange={value => setItemAt(index, { quantity: Math.max(1, Number(value) || 1) })} />
          <Button size="small" aria-label="Increase quantity" onClick={() => setItemAt(index, { quantity: Number(item.quantity || 1) + 1 })}><Plus size={13} /></Button>
        </div>
        <div className="quick-sale-line-price">
          <strong>{formatMoney(getUnitPrice(item) * Number(item.quantity || 0))}</strong>
          <InputNumber
            aria-label={`Unit price for ${item.rawName}`}
            size="small"
            min={0}
            value={getUnitPrice(item)}
            onChange={value => setItemAt(index, { statedPrice: value })}
          />
          <span>each</span>
        </div>
        <Tooltip title="Remove item"><Button type="link" className="quick-sale-remove-item" aria-label={`Remove ${item.rawName}`} onClick={() => removeItem(index)}><Trash2 size={15} /></Button></Tooltip>
      </div>
    );
  };

  const extractedCount = [customerName && customerName !== DEFAULT_CUSTOMER_NAME, phone, address, Boolean(mapLink), items.length > 0, dispatchNote].filter(Boolean).length;
  const statusLabel = !parsed ? "Waiting for message" : parsing ? "Reading message" : needsReview ? "Needs review" : "Ready to save";

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      width="95vw"
      style={{ top: 20, maxWidth: 1420 }}
      bodyStyle={{ padding: 0 }}
      wrapClassName="quick-sale-modal-wrap"
      destroyOnClose={false}
      onCancel={dismiss}
    >
      <div className="quick-sale-modal">
        <header className="quick-sale-header">
          <div className="quick-sale-heading">
            <div>
              <div className="quick-sale-title-row">
                <h2>Quick Sale</h2>
              </div>
              <p>Paste a customer message to start an order. Review the details before saving.</p>
            </div>
          </div>
          <div className="quick-sale-header-controls">
            <div className="quick-sale-platforms" role="tablist" aria-label="Chat platform">
              {PLATFORM_OPTIONS.map(({ key, label, Icon: PlatformIcon }) => (
                <button type="button" role="tab" aria-selected={platform === key} className={platform === key ? "is-active" : ""} key={key} onClick={() => setPlatform(key)}>
                  <PlatformIcon size={14} /> {label}
                </button>
              ))}
            </div>
            <Button type="link" className="quick-sale-close" aria-label="Close Quick Sale" onClick={dismiss}><X size={20} /></Button>
          </div>
        </header>

        <div className="quick-sale-body">
          <aside className="quick-sale-chat-column">
            <section className="quick-sale-card quick-sale-chat-card">
              <div className="quick-sale-section-heading">
                <h3><ClipboardPaste size={16} /> Paste Chat Message</h3>
                <Button size="small" onClick={pasteClipboard}><ClipboardPaste size={14} /> Paste from Clipboard</Button>
              </div>
              <TextArea
                className="quick-sale-chat-input"
                value={chat}
                onChange={event => { setChat(event.target.value); setParsed(false); }}
                placeholder={'Jasmine Rice 5kg\nBrown Bebber 1 bong\n10x bottled water\n\n012 345 678\nToul Kork, Phnom Penh\nhttps://maps.app.goo.gl/your-location-link'}
                rows={12}
              />
              <div className="quick-sale-chat-meta"><span>{[...chat].length} characters</span><span>{platform === "auto" ? "Platform: Auto detect" : `Platform: ${platform}`}</span></div>
              {parsed && (
                <div className="quick-sale-extract-chips">
                  {[
                    [items.length > 0, `${items.length} Product${items.length === 1 ? "" : "s"}`],
                    [Boolean(phone), "Phone No."],
                    [Boolean(address), "Location text"],
                    [Boolean(mapLink), "Map link"],
                    [Boolean(dispatchNote), "Time Constraint"]
                  ].map(([complete, label]) => <span className={complete ? "complete" : "missing"} key={label}>{complete ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}{label}</span>)}
                </div>
              )}
              <div className="quick-sale-hint"><span>Enter products first, one per line. Leave a blank line, then add the phone number and delivery address. A Google Maps link is optional. Check any quantities or units marked for review.</span></div>
              {parseError && <div className="quick-sale-inline-error">{parseError}</div>}
              <Button type="primary" block size="large" loading={parsing} onClick={parseContent}><ClipboardPaste size={16} /> {parsed ? "Update order details" : "Read message"}</Button>
            </section>
          </aside>

          <main className="quick-sale-details-column">
            <div className={`quick-sale-extraction-banner ${parsed && !needsReview ? "is-ready" : ""}`}>
              <div className="quick-sale-extraction-icon"><CheckCircle2 size={17} /></div>
              <div><strong>Order details</strong><span>Review the customer, items, and delivery information.</span></div>
              <div className="quick-sale-extraction-status"><i />{parsing ? "Parsing" : statusLabel}{parsed && <small>{extractedCount} fields</small>}</div>
            </div>

            <section className="quick-sale-card">
              <div className="quick-sale-card-title"><h3>Customer &amp; recipient</h3>{customerId ? <span className="quick-sale-small-badge">Existing customer</span> : customerName ? <span className="quick-sale-small-badge amber">New customer · created on save</span> : null}</div>
              <div className="quick-sale-customer-grid">
                <div className="quick-sale-info-panel customer">
                  <div className="quick-sale-avatar">{customerName.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || <UserRound size={18} />}</div>
                  <div className="quick-sale-edit-fields">
                    <Input aria-label="Customer name (optional)" value={customerName} placeholder="Unknown" onChange={event => { setCustomerName(event.target.value); setCustomerId(null); setCustomerDirty(true); }} />
                    <Input aria-label="Phone number" prefix={<Phone size={14} />} value={phone} placeholder="Phone number" onChange={event => { setPhone(event.target.value); setCustomerId(null); setCustomerDirty(true); }} onBlur={event => searchCustomers(event.target.value)} />
                    {customerSearching && <Spin size="small" />}
                    {customers.length > 0 && phone && !customerId && <Select size="small" placeholder="Link existing customer" onChange={selectCustomer} showSearch optionFilterProp="children">{customers.filter(customer => {
                      const name = `${customer.firstName || ""} ${customer.lastName || ""}`.trim().toLowerCase();
                      const query = customerQuery.toLowerCase();
                      return !query || name.includes(query) || normalizePhone(customer.phoneNumber).includes(normalizePhone(query));
                    }).map(customer => <Select.Option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName} · {customer.phoneNumber}</Select.Option>)}</Select>}
                  </div>
                </div>
                <div className="quick-sale-info-panel address">
                  <div className="quick-sale-location-icon"><MapPin size={18} /></div>
                  <div className="quick-sale-edit-fields">
                    <label>Delivery address</label>
                    <TextArea aria-label="Delivery address" value={address} rows={3} placeholder="Complete delivery address" onChange={event => { setAddress(event.target.value); setCustomerDirty(true); }} />
                    {mapLink && <a className="quick-sale-map-link" href={mapLink} target="_blank" rel="noopener noreferrer"><MapPin size={14} /> View drop location on Google Maps</a>}
                  </div>
                </div>
              </div>
            </section>

            <section className="quick-sale-card quick-sale-items-card">
              <div className="quick-sale-card-title"><h3>Items</h3><span className="quick-sale-small-badge">{items.filter(item => item.product && item.variant && item.matchState === "matched").length} matched</span><div className="quick-sale-add-item"><Input.Search size="small" value={itemSearch} onChange={event => setItemSearch(event.target.value)} onSearch={searchItems} placeholder="Search items" />{itemSearching && <Spin size="small" />}<Select size="small" showSearch placeholder="Select item" className="quick-sale-add-select" onChange={addInventoryProduct}>{itemResults.map(product => <Select.Option key={product.id} value={product.id}>{getProductName(product)}</Select.Option>)}</Select><Button type="link" onClick={() => searchItems(itemSearch)}><Plus size={15} /> Add</Button></div></div>
              {items.length ? <div className="quick-sale-product-list">{items.map(renderItem)}</div> : <div className="quick-sale-empty-items"><Package size={18} /> Paste a message and parse it, or search inventory to add items.</div>}
            </section>

            <div className="quick-sale-bottom-grid">
              <section className="quick-sale-card">
                <div className="quick-sale-card-title"><h3>Delivery</h3></div>
                <div className="quick-sale-courier-row"><Truck size={17} /><Select
                  aria-label="Fulfillment provider"
                  showSearch
                  allowClear
                  loading={fulfillmentProvidersLoading}
                  dropdownClassName="quick-sale-provider-dropdown"
                  value={fulfillmentProviderId || undefined}
                  placeholder="Select fulfillment provider"
                  filterOption={(input, option) => normalizeText(option.props.providerName).includes(normalizeText(input))}
                  onChange={value => { setFulfillmentProviderId(value || ""); setCourierDirty(true); }}
                >
                  {fulfillmentProviders.map(provider => <Select.Option key={getFulfillmentProviderValue(provider)} value={getFulfillmentProviderValue(provider)} providerName={getFulfillmentProviderLabel(provider)}>{renderFulfillmentProviderOption(provider)}</Select.Option>)}
                </Select></div>
                {fulfillmentProvidersError && <div className="quick-sale-inline-error">Could not load fulfillment providers.</div>}
                {!fulfillmentProvidersLoading && !fulfillmentProvidersError && !fulfillmentProviders.length && <div className="quick-sale-muted-hint">No fulfillment providers are configured.</div>}
                {courier && !fulfillmentProviderId && !fulfillmentProvidersLoading && fulfillmentProviders.length > 0 && <div className="quick-sale-muted-hint">“{courier}” was not matched. Select a configured provider.</div>}
                <div className="quick-sale-fee-row"><label>Delivery fee</label><InputNumber min={0} precision={2} disabled={!fulfillmentProviderId} value={deliveryFee} onChange={value => { setDeliveryFee(value == null ? 0 : value); setCourierDirty(true); }} /></div>
                {fulfillmentFeeRule && <div className="quick-sale-muted-hint">Default: {formatMoney(Number(fulfillmentFeeRule.amount || 0))} {deliveryFeeCurrency} · {fulfillmentFeeRule.name || "Provider flat fee"}. Adjust for the negotiated amount.</div>}
                {selectedFulfillmentProvider && !fulfillmentFeeRule && <div className="quick-sale-muted-hint">No default flat fee rule. Location based rules need province or distance details.</div>}
                <div className="quick-sale-dispatch-note"><Clock3 size={15} /><Input aria-label="Dispatch note" value={dispatchNote} placeholder="Dispatch note / delivery time" onChange={event => { setDispatchNote(event.target.value); setCourierDirty(true); }} /></div>
              </section>
              <section className="quick-sale-card quick-sale-totals-card">
                <div className="quick-sale-card-title"><h3>Payment &amp; totals</h3></div>
                <label className="quick-sale-payment-label">Payment method</label>
                <Select
                  showSearch
                  allowClear
                  value={selectedPaymentMethodValue}
                  placeholder="Select payment method"
                  onChange={value => setPaymentMethod(value || "")}
                  optionFilterProp="children"
                  className="quick-sale-payment-select"
                >
                  {paymentMethod && !hasConfiguredPaymentMethod && <Select.Option key="parsed-payment" value={paymentMethod}>{paymentMethod}</Select.Option>}
                  {paymentMethods.map(method => <Select.Option key={getPaymentMethodValue(method)} value={getPaymentMethodValue(method)}>{getPaymentMethodLabel(method)}</Select.Option>)}
                </Select>
                <div className="quick-sale-total-lines"><div><span>Subtotal ({unitCount} units · {items.length} lines)</span><strong>{formatMoney(subtotal)}</strong></div><div><span>Delivery Fee</span><strong>{fulfillmentFeeRule ? `${formatMoney(deliveryFee)} ${deliveryFeeCurrency}` : formatMoney(0)}</strong></div></div>
                <div className="quick-sale-total-payable"><div><strong>Total Payable</strong>{exchangeRate && <small>≈ {formatMoney(total * exchangeRate)} KHR{paymentMethod ? ` (${selectedPaymentMethod && selectedPaymentMethod.name || paymentMethod})` : ""}</small>}</div><strong className="quick-sale-total-amount">{formatMoney(total)}</strong></div>
              </section>
            </div>
          </main>
        </div>

        <footer className="quick-sale-footer">
          <div className="quick-sale-print-option"><Checkbox checked={printWaybill} disabled onChange={event => setPrintWaybill(event.target.checked)}><Printer size={15} /> Auto-generate &amp; print shipping waybill after order save</Checkbox><Tooltip title="Waybill generation and printing are not integrated with the current API."><span className="quick-sale-print-unavailable">Unavailable</span></Tooltip></div>
          <div className="quick-sale-footer-actions">
            <Button size="large" onClick={dismiss}>Cancel</Button>
            <Button size="large" loading={saveLoading} disabled={Boolean(savedOrderId)} onClick={() => saveOrder(false)}>Save as Draft</Button>
            <Button type="primary" size="large" loading={saveLoading} disabled={Boolean(savedOrderId) || needsReview} onClick={() => saveOrder(true)}>Create &amp; Confirm Order <ArrowRight size={15} /><span className="quick-sale-enter-hint"><CornerDownLeft size={12} /></span></Button>
          </div>
        </footer>
      </div>
    </Modal>
  );
}

export default QuickSaleModal;
