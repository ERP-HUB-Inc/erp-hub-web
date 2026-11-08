import React from "react";
import { Wallet, UserRound, X, Banknote, QrCode, CreditCard, Split, Delete, Check, ShieldCheck, Lightbulb } from 'lucide-react';
import packageMetadata from '../../../../../../../package.json';
import { generateQuickCashSuggestions, generateQuickCashSuggestionsUSD } from '@helper/sales';
import _ from "lodash";
import sweetalert from "sweetalert";
import { 
  Button, 
  Checkbox, 
  Form, 
  InputNumber, 
  Modal as AntModal
} from "antd";
import "./payment.css";
import RetailSaleService from "@services/RetailSaleService";
import GeneralAction from "../../../../common/actions/general";
import TransactionAction from "../../../action/transaction/transaction";
import SalesUtil from "../../../utils";
import Modal from "../../../../common/components/shares/Modal";
import ReceiptNew from "./receipt.new";
import { convertKHRToUSD, convertUSDToKHR } from "@helper/index";

const paymentStyles = `
.checkout-dialog {font-family:'Segoe UI',enfont,khfont,sans-serif;color:#0f172a;}
.checkout-dialog .ant-modal-content {border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 20px 60px #0f172a30;}
.checkout-dialog button:focus-visible,.checkout-dialog input:focus-visible {outline:2px solid #0d9488;outline-offset:2px;}
.checkout-dialog button {cursor:pointer;transition:background-color .15s ease,border-color .15s ease;}
.checkout-dialog button:disabled {transition:none;}
.checkout-quick-grid button:not(:disabled):hover,.checkout-keypad button:not(:disabled):hover {background:#f0fdfa;border-color:#99bdb7;}
.checkout-exact:not(:disabled):hover {background:#ccfbf1;}
.checkout-close:not(:disabled):hover {background:#ffffff12;border-radius:6px;}
.checkout-actions .ant-btn-primary:not(:disabled):hover {background:#0f766e;border-color:#0f766e;}
.checkout-dialog button:disabled {cursor:not-allowed;opacity:.65;}
.checkout-dialog kbd {border:1px solid #cbd5e1;border-radius:5px;padding:2px 5px;font:11px monospace;white-space:nowrap;}
.checkout-header {display:flex;align-items:center;gap:12px;background:#0f172a;color:#cbd5e1;padding:14px 22px;}
.checkout-logo {background:#ffffff0a;border:1px solid #ffffff16;color:#5eead4;border-radius:8px;padding:7px;display:flex;}
.checkout-heading {flex:1;min-width:0;}.checkout-heading h1 {color:white;font-size:19px;font-weight:650;margin:0;}.checkout-heading h1 span {font-size:15px;font-weight:400;color:#cbd5e1;}
.checkout-heading>div {display:flex;gap:11px;align-items:center;font-size:12px;}.checkout-heading>div>span {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.checkout-order {border:1px solid #0d9488;color:#5eead4;padding:3px 8px;border-radius:18px;}
.checkout-customer {display:flex;align-items:center;gap:7px;border:1px solid #334155;padding:7px 10px;border-radius:8px;max-width:220px;}.checkout-customer svg {color:#2dd4bf;flex-shrink:0;}.checkout-customer span {overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.checkout-close {border:0;color:#cbd5e1;background:transparent;display:flex;padding:7px;}
.checkout-columns {display:grid;grid-template-columns:42% 58%;max-height:calc(100vh - 144px);overflow:auto;background:#fff;}
.checkout-summary {padding:22px;display:flex;flex-direction:column;gap:18px;border-right:1px solid #e2e8f0;min-width:0;}
.checkout-entry {padding:22px;background:#f8fafc;min-width:0;}
.checkout-between {display:flex;justify-content:space-between;align-items:center;gap:11px;}
.checkout-due {background:#f0fdfa;border:1px solid #cce5df;padding:16px 18px;border-radius:10px;color:#115e59;}
.checkout-due .checkout-between:first-child {font-size:12px;letter-spacing:0;margin-bottom:10px;}.checkout-due small {padding:0;border:0;border-radius:0;white-space:nowrap;font-size:11px;color:#52766d;}
.checkout-due strong {font-size:clamp(24px,2.4vw,32px);line-height:1.35;color:#134e4a;}.checkout-due b {background:transparent;color:#52766d;padding:0;border-radius:0;font-size:18px;font-weight:500;}
 .checkout-order-card,.checkout-change-card {border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;background:#fff;}
.checkout-items {max-height:225px;overflow:auto;}.checkout-items table {width:100%;font-size:12px;border-collapse:collapse;}.checkout-items th {position:sticky;top:0;background:#f8fafc;color:#64748b;font-size:11px;font-weight:500;letter-spacing:0;padding:10px 12px;}.checkout-items td {padding:12px;border-top:1px solid #f1f5f9;vertical-align:top;}.checkout-items th:first-child,.checkout-items td:first-child {text-align:left;}.checkout-items th:last-child,.checkout-items td:last-child {text-align:right;}.checkout-items td:nth-child(2) {text-align:center;}.checkout-dialog small {display:block;color:#64748b;font-size:11px;line-height:1.7;}.checkout-items strong {font-size:13px;font-weight:600;}.checkout-discount {padding:4px;background:#fff1f2;color:#e11d48;border-radius:5px;white-space:nowrap;}
.checkout-totals {padding:15px;}.checkout-totals>div {display:flex;justify-content:space-between;gap:11px;margin-bottom:9px;}.checkout-grand {border-top:1px solid #e2e8f0;padding-top:14px;font-size:14px;}.checkout-grand>strong:last-child {color:#0f766e;text-align:right;}
.checkout-change-card {padding:15px;background:#f8fafc;}.checkout-change-card>.checkout-between>strong {text-align:right;}.checkout-change {background:#f0fdfa;border:1px solid #cce5df;border-radius:8px;padding:14px;margin:14px 0 9px;color:#115e59;}.checkout-change b {font-size:11px;}.checkout-change strong {font-size:25px;font-weight:650;margin-top:8px;}.checkout-change.is-remaining {background:#fff7ed;border-color:#fed7aa;color:#9a3412;}
.checkout-return {display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:7px 14px;padding:10px 0 0;margin-top:10px;border:0;border-top:1px solid #e2e8f0;border-radius:0;background:transparent;}
.checkout-return-label {display:flex;align-items:center;gap:7px;flex:1 1 150px;min-width:0;color:#64748b;font-size:12px;line-height:1.6;}.checkout-return-label svg {flex-shrink:0;color:#0d9488;}
.checkout-return-amount {margin-left:auto;color:#115e59;white-space:nowrap;font:600 15px monospace;font-variant-numeric:tabular-nums;}
.checkout-dialog .checkout-return-rate {margin-top:7px;line-height:1.7;overflow-wrap:anywhere;}
.checkout-due .checkout-between:first-child > span {text-transform:uppercase;}
.checkout-totals b {text-align:right;}
.checkout-summary-footer {display:flex;gap:7px;align-items:center;border-top:1px solid #e2e8f0;padding-top:15px;margin-top:auto;}.checkout-summary-footer .ant-checkbox-wrapper {font-size:12px;}.checkout-summary-footer>small {margin-left:auto;}
.checkout-methods {display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;}.checkout-methods button {border:1px solid #e2e8f0;border-radius:8px;min-height:76px;padding:10px 8px;background:white;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:3px;color:#475569;}.checkout-methods button strong {font-size:13px;}.checkout-methods em {font-size:10px;font-style:normal;}.checkout-methods .selected {border:1px solid #0d9488;background:#f0fdfa;box-shadow:inset 0 0 0 1px #0d9488;color:#115e59;}
.checkout-methods button:disabled:not(.selected) {opacity:1;color:#94a3b8;background:#f8fafc;}
.checkout-methods button:disabled:not(.selected) small {color:#94a3b8;}
.checkout-methods button {position:relative;}
.checkout-dialog .checkout-cash-field .ant-input-number-handler-wrap {display:none;}
.checkout-method-check {position:absolute;top:7px;right:7px;color:#0f766e;}
.checkout-quick h2 {font-weight:600;line-height:1.5;}
.checkout-quick h2 span {font-weight:400;font-size:12px;color:#64748b;}
.checkout-quick .checkout-segment {flex-shrink:0;gap:3px;}
.checkout-quick .checkout-segment button {font-weight:600;}
.checkout-quick .checkout-segment button[data-currency="KHR"] {background:#ccfbf1;color:#115e59;}
.checkout-quick .checkout-segment button[data-currency="USD"] {background:#dbeafe;color:#1e40af;}
.checkout-quick .checkout-segment button[data-currency="KHR"][aria-pressed="true"] {background:#0f766e;color:white;}
.checkout-quick .checkout-segment button[data-currency="USD"][aria-pressed="true"] {background:#1d4ed8;color:white;}
.checkout-cash-inputs {display:grid;grid-template-columns:1fr 1fr;gap:18px;background:white;border:1px solid #e2e8f0;padding:16px;border-radius:10px;margin-bottom:20px;}.checkout-cash-field {min-width:0;}.checkout-cash-field label {font-weight:650;font-size:12px;}.checkout-cash-field .ant-form-item {margin:9px 0 3px;}.checkout-cash-field .ant-input-number {width:100%;height:56px;border-radius:8px;border-color:#cbd5e1;}.checkout-cash-field input {height:54px;text-align:right;font-size:24px;font-family:inherit;font-variant-numeric:tabular-nums;padding-right:16px;}.checkout-cash-field.active .ant-input-number {border:1px solid #0d9488;box-shadow:0 0 0 2px #0d948814;background:#fff;}.checkout-cash-field>small {text-align:right;}.checkout-cash-field.active .checkout-between small {color:#0f766e;border:1px solid #99f6e4;border-radius:5px;padding:0 5px;}
.checkout-cash-tools {display:grid;grid-template-columns:minmax(0,3fr) minmax(0,2fr);gap:16px;padding-right:0;}.checkout-quick h2 {font-size:13px;display:flex;gap:5px;align-items:center;margin:0;}.checkout-quick h2 svg {color:#0d9488;}.checkout-segment {display:flex;padding:3px;background:#e2e8f0;border-radius:7px;}.checkout-segment button {border:0;background:transparent;font-size:11px;padding:4px 6px;border-radius:5px;}.checkout-segment button[aria-pressed=true] {background:white;color:#115e59;box-shadow:0 1px 3px #0001;}
.checkout-exact {display:flex;align-items:center;justify-content:space-between;gap:9px;width:100%;min-height:44px;border:1px solid #b6d9d1;background:#f0fdfa;color:#115e59;border-radius:8px;padding:5px 11px;margin:10px 0 9px;font-size:14px;font-weight:600;line-height:1.35;}.checkout-exact strong {text-align:right;font-size:16px;}.checkout-dialog .checkout-exact small {font-size:12px;line-height:1.3;}.checkout-quick-grid {display:grid;grid-template-columns:1fr 1fr;gap:9px;}.checkout-quick-grid button {border:1px solid #e2e8f0;border-radius:8px;padding:10px 8px;background:white;min-height:64px;}.checkout-quick-grid strong {display:block;font-family:inherit;font-size:17px;font-weight:600;}.checkout-quick-grid .selected {border-color:#0d9488;background:#f0fdfa;box-shadow:inset 0 0 0 1px #0d9488;color:#115e59;}
.checkout-keypad {border:1px solid #e2e8f0;border-radius:10px;padding:10px;background:white;align-self:start;}.checkout-keypad>div:first-child {display:grid;grid-template-columns:repeat(3,1fr);gap:7px;}.checkout-keypad button {display:flex;align-items:center;justify-content:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;min-height:48px;font:500 20px monospace;color:#0f172a;}.checkout-keypad button.checkout-rose {background:#fff1f2;color:#e11d48;}.checkout-increments {display:flex;gap:5px;border-top:1px solid #e2e8f0;padding-top:11px;margin-top:11px;}.checkout-increments button {font-size:11px;flex:1;min-height:33px;}
.checkout-actions {display:flex;align-items:center;gap:9px;border-top:1px solid #e2e8f0;padding-top:20px;margin-top:22px;}.checkout-actions .ant-btn {height:48px;border-radius:8px;font-weight:600;}.checkout-actions .ant-btn-primary {display:flex;gap:8px;align-items:center;justify-content:center;margin-left:auto;background:#0d9488;border-color:#0d9488;min-height:48px;flex:1;}.checkout-actions kbd {margin-left:4px;}.checkout-help {display:flex;flex-wrap:wrap;gap:11px;justify-content:space-between;margin-top:14px;font-size:10px;color:#64748b;}.checkout-help>span:last-child {display:flex;gap:5px;align-items:center;}.checkout-rose {color:#e11d48;}.checkout-dialog strong,.checkout-dialog b {font-variant-numeric:tabular-nums;}
@media(max-width:1100px) {.checkout-columns {grid-template-columns:44% 56%;}.checkout-entry,.checkout-summary {padding:14px;}.checkout-cash-tools {grid-template-columns:1fr; padding:0;}.checkout-keypad>div:first-child {grid-template-columns:repeat(3,1fr);}.checkout-methods {gap:5px;}.checkout-methods button {min-height:76px;}.checkout-due .checkout-between {flex-wrap:wrap;}.checkout-actions {flex-wrap:wrap;}.checkout-actions .ant-btn-primary {flex-basis:100%;}.checkout-cash-field input {font-size:21px;}}
@media(max-width:760px) {.checkout-dialog {width:calc(100vw - 16px)!important;top:8px!important;}.checkout-header {padding:14px;gap:9px;flex-wrap:wrap;}.checkout-heading h1 {font-size:16px;}.checkout-heading h1 span {font-size:13px;}.checkout-customer {max-width:160px;font-size:12px;}.checkout-columns {grid-template-columns:1fr;max-height:calc(100vh - 162px);}.checkout-summary {border-right:0;border-bottom:1px solid #e2e8f0;}.checkout-methods {grid-template-columns:repeat(2,1fr);}.checkout-cash-inputs {padding:11px;gap:9px;}.checkout-summary-footer {flex-wrap:wrap;}}
`;

export default class PaymentScreen extends Modal {
  static PAYMENT_METHOD_CREDIT_CODE = "002";
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      customerPaymentList: [],
      amountToPay: 0,
      isCustomerCredit: false,
      isAlreadyAutoPrint: false,
      isAllowPrintReceipt: false,
      isNotYetPaid: true,
      isFocusOnInputBaseCurrency: true,
      validateStatus: "",
      errorMsg: "",
      tenderInputFocus: "KHR",
      formData: {},
      loadingSubmit: false,
      submittingPayment: false,
      isPrintReceiptChecked: true,
      receiptPrintData: null,
    };
    this.paymentMethodSelectedIndex = null;
    this.wrapClassName = "pos-payment";
    this.width = window.innerWidth < 1000 ? window.innerWidth : 1000;
    this.height = window.innerHeight < 700 ? window.innerHeight - 10 : 700;
    this.currentUser = this.getCurrentUser();
    this.khrInputRef = React.createRef();
    this.quickCashRef = React.createRef();
    this.usdInputRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleGlobalKeyDown);
    setTimeout(() => {
      if (this.khrInputRef.current) {
        this.khrInputRef.current.focus();
      }
    }, 100);
  }

  componentDidUpdate(prevProps) {
    if (this.props.mail.sent) {
      this.Message.success(this.CATranslate("text_receipt_has_sent", this.props.locale));
      this.props.form.setFieldsValue({ email: "" });
      document.getElementById("email").focus();
      this.props.dispatch(GeneralAction.sendMailReset());
    }

    if (this.props.transaction.paid && !this.state.isAlreadyAutoPrint) {
      let element = document.getElementById("pos-receipt-preview");
      if (element && this.state.isAllowPrintReceipt) {
        this.Util.printElemV2(element.innerHTML);
        this.setState({
          isAllowPrintReceipt: false,
        });
      }

      this.setState({
        isAlreadyAutoPrint: true,
      });
    }

    // When payment screen becomes visible
    if (!prevProps.paymentVisible && this.props.paymentVisible) {
      this.paymentPending = false;
      this.setState({ receiptPrintData: null });
      window.addEventListener("keydown", this.handleGlobalKeyDown);
    }

    // When payment screen becomes hidden
    if (prevProps.paymentVisible && !this.props.paymentVisible) {
      window.removeEventListener("keydown", this.handleGlobalKeyDown);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleGlobalKeyDown);
  }

  formatCurrency(props = { value: 0, currency: "", position: 0, showSymbol: true }) {
    let { value, currency, position, showSymbol } = props;
    let temp = value;
    const currentSetting = this.Util.getSetting();
    if (currentSetting && !currency) {
      currency = currentSetting.currency;
      position = currentSetting.currencyPosition;
    }

    showSymbol = true;

    // DETECT DONT WANT TO SHOW CURRENCY SYMBOL
    if (!showSymbol) {
      currency = "";
    }

    temp = this.Util.formatCurrency(Math.abs(temp), currency, position);
    return value < 0 ? `(${temp})` : temp;
  }

  mapFreeProductsToOrder() {
    let items = [];
    this.props.orderItems.forEach((item) => {
      const orderItem = {
        ...item,
        categoryId: item.categoryId ? item.categoryId : null,
        unitPrice: item.newPrice,
        addons: [],
      };

      items.push(orderItem);

      if (Array.isArray(item.freeProducts)) {
        items = items.concat(item.freeProducts);
        delete orderItem.freeProducts;
      }
    });

    return items;
  }

  resetTender = () => {
    if (this.paymentPending || this.state.submittingPayment) return;
    this.props.form.setFieldsValue({ tenderInCashKHR: 0, tenderInCashUSD: 0 });
  };

  isTenderValid = () => {
    const values = ['tenderInCashKHR', 'tenderInCashUSD'].map(name => this.props.form.getFieldValue(name));
    return Number.isFinite(Number(this.props.exchangeRate.sellRate)) && Number(this.props.exchangeRate.sellRate) > 0 && Number.isFinite(Number(this.props.exchangeRate.buyRate)) && Number(this.props.exchangeRate.buyRate) > 0 && values.every(value =>
      value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= Number.MAX_SAFE_INTEGER / 100);
  };

  enterCash = key => {
    if (this.paymentPending || this.state.submittingPayment) return;
    const currency = this.state.tenderInputFocus;
    const name = currency === 'USD' ? 'tenderInCashUSD' : 'tenderInCashKHR';
    let value = String(this.props.form.getFieldValue(name) || '');
    if (key === 'backspace') value = value.slice(0, -1);
    else if (key === '.') { if (currency !== 'USD' || value.includes('.')) return; value = (value || '0') + '.'; }
    else value = (value === '0' ? '' : value) + key;
    if (value && (!/^\d*(\.\d{0,2})?$/.test(value) || Number(value) > Number.MAX_SAFE_INTEGER / 100)) return;
    this.props.form.setFieldsValue({ [name]: value || 0 });
    this.forceUpdate();
  };

  selectCash = (amount, currency) => {
    if (this.paymentPending || this.state.submittingPayment) return;
    this.props.form.setFieldsValue({ [currency === 'USD' ? 'tenderInCashUSD' : 'tenderInCashKHR']: amount });
    this.setState({ tenderInputFocus: currency });
  };

  handleGlobalKeyDown = e => {
    if (!this.props.paymentVisible || e.isComposing || e.keyCode === 229 || e.defaultPrevented || this.paymentPending || this.state.submittingPayment) return;
    if (e.key === 'Escape') { e.preventDefault(); this.handleCancel(); }
    else if (e.key === 'F5') { e.preventDefault(); this.resetTender(); }
    else if (e.key === 'F9') { e.preventDefault(); this.setState(state => ({ isPrintReceiptChecked: !state.isPrintReceiptChecked })); }
    else if (e.key === 'Enter') {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const target = e.target;
      if (!target || target.isContentEditable || ['TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      const button = target.closest && target.closest('button');
      const cashControl = target.closest && target.closest('.checkout-quick, .checkout-keypad');
      // Keep native Enter activation for Cancel, Reset, and Confirm buttons.
      if (button && !cashControl) return;
      e.preventDefault();
      this.handleOnMakePayment();
    }
  };

  getTotalTenderUSD() {
    const tenderInCashKHR = this.props.form.getFieldValue("tenderInCashKHR") || 0;
    const tenderInCashUSDFromKHR = convertKHRToUSD(tenderInCashKHR, this.props.exchangeRate.sellRate);
    const tenderInCashUSD = this.props.form.getFieldValue("tenderInCashUSD") || 0;
    const totalTender = parseFloat(tenderInCashUSDFromKHR) + parseFloat(tenderInCashUSD);
    return totalTender;
  }

  getTotalTenderKHR() {
    const tenderInCashKHR = this.props.form.getFieldValue("tenderInCashKHR") || 0;
    const tenderInCashUSD = this.props.form.getFieldValue("tenderInCashUSD") || 0;
    const tenderInCashKHRFromUSD = convertUSDToKHR(tenderInCashUSD, this.props.exchangeRate.sellRate);
    const totalTender = parseFloat(tenderInCashKHR) + parseFloat(tenderInCashKHRFromUSD);
    return totalTender;
  }

  getGrandTotal() {
    const { summaryTotal, discountAmount, taxAmount } = this.props.summaryTotal;
    return SalesUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount);
  }

  getGrandTotalInKHR() {
    const { summaryTotal, discountAmount, taxAmount } = this.props.summaryTotal;
    return SalesUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount) * this.props.exchangeRate.sellRate;
  }

  getChangeAmountInUSD() {
    return this.getTotalTenderUSD() - this.getGrandTotal();
  }

  getChangeAmountInKHR() {
    return Math.max(convertUSDToKHR(this.getChangeAmountInUSD(), this.props.exchangeRate.buyRate), 0);
  }

  handleOnFocusInputAmount = (isFocusOnBaseCurrency) => {
    if (isFocusOnBaseCurrency) {
      this.setState({ isFocusOnInputBaseCurrency: true });
    } else {
      this.setState({ isFocusOnInputBaseCurrency: false });
    }
  };

  handleCancel() {
    if (!this.paymentPending && !this.state.submittingPayment) this.props.handleCancel();
  }

  handleOnQuickCash = (value, currency) => {
    if (currency === "USD") {
      const currentTenderInCashUSD = this.props.form.getFieldValue("tenderInCashUSD") || 0;
      this.props.form.setFieldsValue({
        tenderInCashUSD: currentTenderInCashUSD + parseFloat(value),
      });
      this.setState({ tenderInputFocus: "USD" });
    } else {
      const currentTenderInCashKHR = this.props.form.getFieldValue("tenderInCashKHR") || 0;
      this.props.form.setFieldsValue({
        tenderInCashKHR: currentTenderInCashKHR + parseFloat(value),
      });
      this.setState({ tenderInputFocus: "KHR" });
    }
  }

  handleOnSendMailReceipt = () => {
    const email = this.props.form.getFieldValue("email");
    let element = document.getElementById("pos-receipt-preview");
    if (email && element) {
      element = `<html><head><title></title></head><body>${element.innerHTML}</body></html>`;
      this.props.dispatch(TransactionAction.sendEmailReceipt(element, email));
    } else {
      element = document.getElementById("email");
      if (element) {
        element.focus();
      }
    }
  };

  handleOnCompletePayment = () => {
    if (this.props.transaction.paid && this.state.isNotYetPaid) {
      this.props.dispatch(TransactionAction.reset());
      this.setState({
        isCustomerCredit: false,
        isAlreadyAutoPrint: false,
        isNotYetPaid: true,
        customerPaymentList: [],
        amountToPay: 0,
      });
      this.wrapClassName = "pos-payment";
      this.props.handleOnResetOrder();
    }
  };

  handleOnMakePayment = () => {
    if (this.paymentPending || this.props.transaction.paid) return;
    this.props.form.validateFields((err, values) => {
      if (this.paymentPending || this.props.transaction.paid) return;
      const totalTender = this.getTotalTenderUSD();
      const { discountAmount } = this.props.summaryTotal;
      const grandTotalUSD = this.getGrandTotal();

      if (!err && this.props.orderItems.length > 0 && Number.isFinite(grandTotalUSD) && grandTotalUSD >= 0 && this.isTenderValid() && this.getTotalTenderUSD() >= grandTotalUSD) {
        this.paymentPending = true;
        const saleData = {
          customerId: this.props.customer ? this.props.customer.id : null,
          saleType: "RETAIL",
          paymentFlow: "PAY_FIRST",
          table: {},
          deposit: 0,
          discount: discountAmount,
          total: grandTotalUSD,
          // totalExcludeTax: summaryTotal.subTotal,
          items: this.mapFreeProductsToOrder(),
          tenderCash: totalTender,
          tenderBank: 0,
          paymentItems: this.state.customerPaymentList,
        };

        this.setState({ submittingPayment: true });
        RetailSaleService.createNewSale(saleData)
          .then((response) => {
            const receiptPrintData = this.getReceiptPrintData(response, saleData);

            const completePayment = () => {
              sweetalert({
                icon: "success",
                title: "Payment Successful!",
                text: "The payment has been completed successfully.",
                buttons: false,
                timer: 1500,
              }).then(() => {
                this.props.handleOnResetOrder();
                this.props.handleCancel();
              });
            };

            if (this.state.isPrintReceiptChecked) {
              this.setState({ receiptPrintData }, () => {
                setTimeout(() => {
                  try { window.print(); }
                  catch (error) { this.Message.error('Payment completed. Receipt printing failed; do not submit payment again.'); }
                  finally { completePayment(); }
                }, 100);
              });
            } else {
              completePayment();
            }
          })
          .catch((error) => {
            this.paymentPending = false;
            sweetalert({
              icon: "error",
              title: "Payment Failed!",
              text: "There was an error processing the payment.",
              buttons: false,
              timer: 1500,
            }).then(() => {
              // this.props.handleOnResetOrder();
              // this.props.handleCancel();
            });
          })
          .finally(() => {
            this.setState({ submittingPayment: false });
          });
      }
    });
  };

  getReceiptPrintData(response, saleData) {
    const responseData = _.get(response, "data.data", {});
    const customer = responseData.customer || this.props.customer || {};
    const cashier = this.currentUser || {};
    const exchangeRate = _.get(this.props.exchangeRate, "sellRate", 4100);
    const grandTotalUSD = this.getGrandTotal();
    const tenderUSD = this.props.form.getFieldValue("tenderInCashUSD") || 0;
    const tenderKHR = this.props.form.getFieldValue("tenderInCashKHR") || 0;

    return {
      invoiceNo: responseData.invoiceNo || responseData.saleNo || responseData.code || responseData.id,
      cashier: cashier.fullName || cashier.name || cashier.username,
      date: responseData.createdAt || new Date(),
      customerName: customer.firstName || customer.lastName ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() : customer.name,
      exchangeRate,
      items: saleData.items,
      discountAmount: _.get(this.props.summaryTotal, "discountAmount", 0),
      taxAmount: _.get(this.props.summaryTotal, "taxAmount", 0),
      grandTotalUSD,
      tenderUSD,
      tenderKHR,
      changeUSD: Math.max(this.getChangeAmountInUSD(), 0),
      changeKHR: this.getChangeAmountInKHR(),
    };
  }

  renderMoneyExhangeAfterPay(balance, changeAmount) {
    if (this.state.customerPaymentList.length <= 0) {
      return [];
    } else {
      return [
        this.state.customerPaymentList.map((payment, paymentIndex) => (
          <li key={paymentIndex}>
            <div className="sub-total-title">{payment.paymentMethodName}</div>
            <div className="sub-total-value">{this.formatCurrency({ value: payment.tender })}</div>
          </li>
        )),
        changeAmount > 0 ? (
          <li key="a">
            <div className="sub-total-title">
              <this.Translate id="text_change" />
            </div>
            <div className="sub-total-value">{this.formatCurrency({ value: changeAmount })}</div>
          </li>
        ) : (
          ""
        ),
        <li key="b">
          <div className="text-uppercase grand-total-title">
            <this.Translate id="text_balance" />
          </div>
          <div className="grand-total-value">{this.formatCurrency({ value: balance })}</div>
        </li>,
      ];
    }
  }

  renderCrudAction() {}

  renderCustomerInfo() {
    return (
      <div className="customer-credit-info">
        <div className="inner-customer-credit-info">
          <div className="customer-info-title">
            <this.Translate id="text_customer_info" />
          </div>
          <div className="data-row" style={{ lineHeight: 1, marginBottom: 10 }}>
            <div>{`${this.props.customer.firstName} ${this.props.customer.lastName}`}</div>
            <div style={{ fontSize: "10pt" }}>{this.props.customer.phoneNumber}</div>
          </div>
          <div className="data-row" style={{ display: "flex", alignItems: "center" }}>
            <div>{<this.Translate id="text_credit_balance" />}:</div>
            <div style={{ fontSize: "16pt", fontFamily: "serif", paddingLeft: 10 }}>
              {this.formatCurrency({
                value: this.props.customer.credit ? this.props.customer.credit : 0,
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { form, exchangeRate, customer, summaryTotal: totals } = this.props;
    const setting = this.Util.getSetting() || {};
    const usd = value => this.formatCurrency({ value, currency: '$', position: 0 });
    // Keep KHR exact here: display rounding must not change the amount collected.
    const khr = value => Number.isFinite(Number(value)) ? Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '៛' : 'Unavailable';
    const dueUSD = this.getGrandTotal();
    const dueKHR = convertUSDToKHR(dueUSD, exchangeRate.sellRate);
    const tenderUSD = this.getTotalTenderUSD();
    const tenderKHR = this.getTotalTenderKHR();
    const enough = this.props.orderItems.length > 0 && Number.isFinite(dueUSD) && dueUSD >= 0 && this.isTenderValid() && tenderUSD >= dueUSD;
    const changeKHR = this.getChangeAmountInKHR();
    // Match the existing KHR cash formatter's nearest-100 rule for this suggestion only.
    const suggestedCashReturnKHR = Math.round(changeKHR / 100) * 100;
    const currency = this.state.tenderInputFocus;
    const busy = this.state.submittingPayment || Boolean(this.paymentPending);
    const customerName = customer && (customer.name || [customer.firstName, customer.lastName].filter(Boolean).join(' ')) || 'Walk-in customer';
    const orderRef = this.props.orderNumber || this.props.saleNo;
    const storeName = setting.storeName || setting.businessName;
    const options = currency === 'KHR'
      ? [...generateQuickCashSuggestions(dueKHR), ...[5000, 10000, 20000, 50000, 100000].filter(value => value >= dueKHR)]
      : [...generateQuickCashSuggestionsUSD(dueUSD), ...[5, 10, 20, 50, 100].filter(value => value >= dueUSD)];
    const suggestions = [...new Set(options)].slice(0, 6);
    const selectedTender = form.getFieldValue(currency === 'USD' ? 'tenderInCashUSD' : 'tenderInCashKHR');
    return <React.Fragment>
      <AntModal visible={this.props.paymentVisible} footer={null} title={null} closable={false} width="calc(100vw - 48px)" style={{ top: 24, maxWidth: 1440, paddingBottom: 0 }} bodyStyle={{ padding: 0 }} className="checkout-dialog" maskClosable={false} keyboard={false} onCancel={() => this.handleCancel()} destroyOnClose>
        <style>{paymentStyles}</style>
        <header className="checkout-header">
          <div className="checkout-logo"><Wallet size={27} /></div>
          <div className="checkout-heading"><h1>Complete Payment <span>/ ទូទាត់ប្រាក់</span></h1>
            {/* <div>{orderRef && <span className="checkout-order">Order #{orderRef}</span>}<span>{storeName || 'Point of Sale'}{setting.storeId ? ' · ' + setting.storeId : ''}</span></div> */}
          </div>
          <div className="checkout-customer"><UserRound size={18} /><span>{customerName}</span></div>
          <kbd>Esc</kbd><button type="button" className="checkout-close" aria-label="Close payment" disabled={busy} onClick={() => this.handleCancel()}><X size={23} /></button>
        </header>
        <div className="checkout-columns">
          <section className="checkout-summary" aria-label="Order summary">
            <div className="checkout-due">
              <div className="checkout-between"><span>Amount due / ប្រាក់ត្រូវបង់</span><small>1 USD = {khr(exchangeRate.sellRate)}</small></div>
              <div className="checkout-between"><strong>{khr(dueKHR)}</strong><b>{usd(dueUSD)}</b></div>
            </div>
            <div className="checkout-order-card">
              <div className="checkout-items"><table><thead><tr><th>ITEM DESCRIPTION / ទំនិញ</th><th>QTY</th><th>DISC.</th><th>AMOUNT</th></tr></thead><tbody>
                {this.props.orderItems.map((item, index) => {
                  const price = Number(item[this.props.customerFieldPrice] || 0);
                  const line = SalesUtil.getTotalAmountAfterDiscount(item.quantity, price, item.discount);
                  return <tr key={item.id || item.productVariantId || index}><td><strong>{item.itemName}</strong>{item.itemNamekh && <small>{item.itemNamekh}</small>}<small>{item.sku || item.code || item.variantName} · {usd(price)}</small></td><td>{item.quantity}</td><td>{Number(item.discount) > 0 ? <span className="checkout-discount">−{item.discount}%</span> : '—'}</td><td><strong>{usd(line)}</strong></td></tr>;
                })}
              </tbody></table></div>
              <div className="checkout-totals"><div><span>Subtotal / សរុបរង</span><b>{khr(convertUSDToKHR(totals.summaryTotal.subTotal, exchangeRate.sellRate))}</b></div><div className="checkout-rose"><span>Discount / បញ្ចុះតម្លៃ</span><b>−{khr(convertUSDToKHR(totals.discountAmount, exchangeRate.sellRate))}</b></div><div><span>Tax / ពន្ធ {this.props.summaryTax.taxTitle}</span><b>{khr(convertUSDToKHR(totals.taxAmount, exchangeRate.sellRate))}</b></div><div className="checkout-grand"><strong>Grand Total / សរុប</strong><strong>{khr(dueKHR)}<small>{usd(dueUSD)}</small></strong></div></div>
            </div>
            <div className="checkout-change-card">
              <div className="checkout-between"><span>Tendered / ប្រាក់ទទួល</span><strong>{khr(tenderKHR)}<small>≈ {usd(tenderUSD)}</small></strong></div>
              <div className={'checkout-change ' + (!enough ? 'is-remaining' : '')} aria-live="polite"><div className="checkout-between"><b>{enough ? 'Change due / ប្រាក់អាប់' : 'Remaining / នៅខ្វះ'}</b><small>KHR Balance</small></div><div className="checkout-between"><strong>{khr(enough ? changeKHR : Math.max(dueKHR - tenderKHR, 0))}</strong><span>{usd(enough ? Math.max(this.getChangeAmountInUSD(), 0) : Math.max(dueUSD - tenderUSD, 0))}</span></div></div>
              {enough && <div className="checkout-return"><span className="checkout-return-label"><Lightbulb size={16} aria-hidden="true" /><span>Suggested Cash Return:</span></span><strong className="checkout-return-amount">{khr(suggestedCashReturnKHR)}</strong></div>}
              <small className="checkout-return-rate">Change conversion rate: 1 USD = {khr(exchangeRate.buyRate)}.</small>
            </div>
            <footer className="checkout-summary-footer"><Checkbox checked={this.state.isPrintReceiptChecked} disabled={busy} onChange={event => this.setState({ isPrintReceiptChecked: event.target.checked })}>Print Receipt / បោះពុម្ពវិក្កយបត្រ</Checkbox><kbd>F9</kbd><small>v{packageMetadata.version}</small></footer>
          </section>
          <section className="checkout-entry" aria-label="Payment entry">
            <div className="checkout-methods">{[
              { label: 'Cash', kh: 'សាច់ប្រាក់', Icon: Banknote },
              { label: 'Bakong / QR', kh: 'បាគង', Icon: QrCode },
              { label: 'Debit / Card', kh: 'កាតធនាគារ', Icon: CreditCard },
              { label: 'Split Tender', kh: 'បែងចែកការទូទាត់', Icon: Split }
            ].map(({ label, kh, Icon }, index) => <button type="button" key={label} className={index === 0 ? 'selected' : ''} aria-label={index ? `${label} — not enabled` : 'Cash payment'} aria-pressed={index === 0} disabled={busy || index !== 0} title={index ? 'Not enabled for this checkout' : 'Cash payment'}>{index === 0 && <Check className="checkout-method-check" size={13} aria-hidden="true" />}<Icon size={22} aria-hidden="true" /><strong>{label}</strong><small>{kh}</small></button>)}</div>
            <div className="checkout-cash-inputs">{['KHR', 'USD'].map(code => {
              const active = currency === code;
              const name = code === 'KHR' ? 'tenderInCashKHR' : 'tenderInCashUSD';
              const entered = Number(form.getFieldValue(name) || 0);
              return <div className={'checkout-cash-field ' + (active ? 'active' : '')} key={code}><div className="checkout-between"><label htmlFor={name}>Cash ({code}) / សាច់ប្រាក់</label>{active && <small>Active</small>}</div><Form.Item>{form.getFieldDecorator(name, { initialValue: 0, rules: [{ validator: (_, value, callback) => {
                callback(value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= Number.MAX_SAFE_INTEGER / 100 ? undefined : 'Enter a valid non-negative cash amount.');
              } }] })(<InputNumber id={name} ref={code === 'KHR' ? this.khrInputRef : this.usdInputRef} aria-label={'Cash tendered in ' + code} min={0} max={Number.MAX_SAFE_INTEGER / 100} precision={code === 'USD' ? 2 : 0} disabled={busy} onFocus={() => this.setState({ tenderInputFocus: code })} onChange={() => this.forceUpdate()} />)}</Form.Item><small>{code === 'KHR' ? usd(convertKHRToUSD(entered, exchangeRate.sellRate)) : khr(convertUSDToKHR(entered, exchangeRate.sellRate))} equivalent</small></div>;
            })}</div>
            <div className="checkout-cash-tools">
              <div className="checkout-quick"><div className="checkout-between"><h2>Quick Cash <span>/ ប្រាក់រហ័ស</span></h2><div className="checkout-segment" role="group" aria-label="Quick cash currency">{['KHR', 'USD'].map(code => <button type="button" key={code} data-currency={code} disabled={busy} aria-label={code === 'KHR' ? 'Use Cambodian riel for quick cash' : 'Use US dollars for quick cash'} aria-pressed={currency === code} onClick={() => this.setState({ tenderInputFocus: code })}>{code}</button>)}</div></div>
                <button type="button" className="checkout-exact" disabled={busy} onClick={() => { form.setFieldsValue({ tenderInCashKHR: 0, tenderInCashUSD: dueUSD }); this.setState({ tenderInputFocus: 'USD' }); }}><span>Exact Cash / ប្រាក់គ្រប់</span><strong>{khr(dueKHR)}<small>{usd(dueUSD)}</small></strong></button>
                <div className="checkout-quick-grid">{suggestions.map(amount => {
                  const combined = currency === 'KHR' ? convertKHRToUSD(amount, exchangeRate.sellRate) + Number(form.getFieldValue('tenderInCashUSD') || 0) : amount + convertKHRToUSD(Number(form.getFieldValue('tenderInCashKHR') || 0), exchangeRate.sellRate);
                  const suggestedChangeKHR = Math.round(convertUSDToKHR(Math.max(combined - dueUSD, 0), exchangeRate.buyRate) / 100) * 100;
                  return <button type="button" disabled={busy} className={Number(selectedTender) === amount ? 'selected' : ''} key={amount} onClick={() => this.selectCash(amount, currency)}><strong>{currency === 'KHR' ? khr(amount) : usd(amount)}</strong><small>{combined >= dueUSD ? 'Change ' + khr(suggestedChangeKHR) : 'Remaining ' + usd(dueUSD - combined)}</small></button>;
                })}</div>
              </div>
              <div className="checkout-keypad" aria-label="Cash numeric keypad"><div>{['1','2','3','4','5','6','7','8','9','00','0','backspace'].map(key => <button type="button" disabled={busy} key={key} aria-label={key === 'backspace' ? 'Backspace cash amount' : key} className={key === 'backspace' ? 'checkout-rose' : ''} onClick={() => this.enterCash(key)}>{key === 'backspace' ? <Delete size={23} /> : key}</button>)}</div><div className="checkout-increments">{currency === 'USD' && <button type="button" disabled={busy} onClick={() => this.enterCash('.')}>.</button>}{(currency === 'KHR' ? [5000,10000] : [5,10]).map(amount => <button type="button" disabled={busy} key={amount} onClick={() => this.selectCash(Number(selectedTender || 0) + amount, currency)}>+{currency === 'KHR' ? khr(amount) : usd(amount)}</button>)}</div></div>
            </div>
            {!this.isTenderValid() && <p role="alert" className="checkout-rose">Enter valid cash amounts and ensure an exchange rate is configured.</p>}
            <div className="checkout-actions"><Button disabled={busy} onClick={() => this.handleCancel()}>Cancel <kbd>Esc</kbd></Button><Button disabled={busy} onClick={this.resetTender}>Reset <kbd>F5</kbd></Button><Button type="primary" loading={this.state.submittingPayment} disabled={busy || !enough || this.props.transaction.paid} onClick={this.handleOnMakePayment}><Check size={21} /> Confirm Payment / ទូទាត់ <kbd>Enter</kbd></Button></div>
            {this.props.transaction.paid && <section className="wrap-email-receipt" aria-label="Receipt actions"><this.InputEmail name="email" placeholder={this.CATranslate('text_email', this.props.locale)} form={form} /><Button loading={this.props.mail.sending} onClick={this.handleOnSendMailReceipt}>Email receipt</Button><Button onClick={this.handleOnCompletePayment}>Done</Button></section>}
            <footer className="checkout-help"><span><kbd>Enter</kbd> Confirm · <kbd>Esc</kbd> Cancel · <kbd>F5</kbd> Reset</span><span><ShieldCheck size={15} /> Configured exchange rate applied</span></footer>
          </section>
        </div>
      </AntModal>
      {this.state.receiptPrintData ? <ReceiptNew data={this.state.receiptPrintData} embedded /> : null}
    </React.Fragment>;
  }
}

PaymentScreen.defaultProps = {
  orderItems: [],
  customerFieldPrice: "price",
};
