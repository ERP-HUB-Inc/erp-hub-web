import React from "react";
import {
  isMobile,
  isAndroid,
  isIOS
} from "react-device-detect";
import _ from "lodash";
import ProductTypeList from "./ProductTypeList";
import DiscountSetup from "./DiscountSetup";
import TaxSetting from "./TaxSetting";
import Enum from "../../../enums";
import InventoryEnum from "../../../../inventory/enums";
import HREnum from "../../../../hr/enums";
import CRMUtil from "../../../../crm/util";
import SettingEnum from "../../../../pos/enums";
import TransactionAction from "../../../action/transaction/transaction";
import TransactionService from "../../../services/transactions/TransactionService";
import Constant from "../../../constants/transactions/transaction";
import CurrencyExchangeService from "../../../services/settings/CurrencyExchangeService";
import ReceiptTemplateService from "../../../../pos/services/settings/ReceiptTemplateService";
import PaymentMethodAction from "../../../../pos/action/settings/paymentMethod";
import FormCreateCustomer from "../../../../crm/containers/customers/Customer/FormCreate";
import CustomerAction from "../../../../crm/actions/customers/customer";
import CustomerConstant from "../../../../crm/constants/customers/customer";
import ProductTypeAction from "../../../../inventory/actions/products/productsType";
import ProductVariantAction from "../../../../inventory/actions/products/productVariant";
import ConstantOpenRegistrationSale from "../../../constants/transactions/openSaleRegisration";
import ProductAction from "../../../../inventory/actions/products/product";
import ProductService from "../../../../inventory/services/products/ProductService";
import DeviceAction from "../../../../pos/action/settings/device";
import ProductConstant from "../../../../inventory/constants/products/product";
import ProductVariantConstant from "../../../../inventory/constants/products/productVariant";
import ConstantAuth from "../../../../common/constants/authentication";
import CustomerDropDownSearch from "../../../../crm/components/customers/Customer/DropDownSearch";
import ProductDropDownSearch from "../../../../inventory/components/products/Product/DropDownSearch";
import FormOpenSaleRegistration from "../../../containers/transactions/OpenSaleRegistration/FormOpen";
import OpenSaleRegistrationAction from "../../../action/transaction/openSalaRegisration";
import StartUp from "../../../../common/components/StartUp";
import history from "../../../../common/router/history";
import Util from "../../../../inventory/utils";
import POSUtil from "../../../utils";
import Component from "../../../../common/components/Component";
import PaymentForm from "../../../containers/transactions/SaleWalkin/Payment";
import VaraintProduct from "../../../containers/transactions/SaleWalkin/VariantProduct";
import "./index.css";

export default class Retail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOutOfStock: true,
      modalContent: null,
      expandRowOrderIndex: null,
      selectedCustomer: null,
      expandOrderItemRow: [],
      productTaxList: [],
      categoryList: [
        { id: 0, name: <this.Translate id="text_all_category" />, namekm: <this.Translate id="text_all_category" />, namebm: <this.Translate id="text_all_category" />},
      ],
      customerFieldPrice: "price",
      textFullScreen: <this.Translate id="text_full_screen" />,
      iconFullScreen: "icon-full-screen",
      productList: [],
      productOrderList: [],
      discountValue: {type: Enum.DISCOUNT_TYPE.PERCENTAGE, value: 0},
      initialOrderQuantity: 1,
      initialOrderDiscount: 0,
      initialOrderDiscountType: Enum.DISCOUNT_TYPE.PERCENTAGE,
      initialTax: 0,
      isDiscountHasAdded: false,
      selectedCategoryIds: [],
      selectedReceiptType: Enum.CURRENT_RECEIPT,
      isHasSubCurrency: false,
      isRequestLoadingMore: false,
      receiptTemplate: {},
      baseCurrency: {},
      subCurrency: {},
      modalVisible: false,
      currencyExchange: {}
    };

    this.isSetFocusOnSearchProduct = false;
    this.hasDidUpdate = false;
    this.hadNotYetReceiveProps = true;
    this.hadDidUpdateCheckDevice = false;
    this.productWidth = 0;
    this.service = TransactionService;
    this.timer = null;

    this.handleLinkCloseShift = this.handleLinkCloseShift.bind(this);
    this.handleOnMakePayment = this.handleOnMakePayment.bind(this);
    this.handleCancelMakePayment = this.handleCancelMakePayment.bind(this);
    this.handleOnGetTaxList = this.handleOnGetTaxList.bind(this);
    this.handleOnSetupDiscount = this.handleOnSetupDiscount.bind(this);
    this.handleOnOpenTaxSetting = this.handleOnOpenTaxSetting.bind(this);
    this.handleCancelTaxSetting = this.handleCancelTaxSetting.bind(this);
    this.handleCancelDiscountSetup = this.handleCancelDiscountSetup.bind(this);
    this.handleOnClickAllCategory = this.handleOnClickAllCategory.bind(this);
    this.handleOnCancelAllCategory = this.handleOnCancelAllCategory.bind(this);
    this.handleOnResizeScreen = this.handleOnResizeScreen.bind(this);
    this.handleRemoveDiscount = this.handleRemoveDiscount.bind(this);
    this.handleGetDiscount = this.handleGetDiscount.bind(this);
    this.handleOnResetOrder = this.handleOnResetOrder.bind(this);
    this.handleOnSaveParkReceipt = this.handleOnSaveParkReceipt.bind(this);
    this.handleOnRestoreReceipt = this.handleOnRestoreReceipt.bind(this);
    this.handleOnBlurSearchProduct = this.handleOnBlurSearchProduct.bind(this);
    this.handleOnAutoSelectProductAfterSearchResult = this.handleOnAutoSelectProductAfterSearchResult.bind(this);
    this.handleOnChangOrderFieldBlur = this.handleOnChangOrderFieldBlur.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleOnResizeScreen);
    this.handleSetFullScreen();
  
    this.props.dispatch(DeviceAction.checkDevice(localStorage.getItem(ConstantAuth.ACCESS_DEVICE)));

    this.props.dispatch(OpenSaleRegistrationAction.showForm());
    this.props.dispatch(OpenSaleRegistrationAction.last());

    this.props.dispatch(ProductTypeAction.fetch(9999));
    this.props.dispatch(ProductAction.reset());
    this.props.dispatch(ProductAction.fetch(6, "", "", "", JSON.stringify({isAvialableSale: [Enum.PRODUCT_AVIALABLE_ON_SALE], type: [InventoryEnum.TYPE_OF_PRODUCT.GOOD]}), "", this.Util.getLocationId()));

    new Promise(() => {
      ReceiptTemplateService.default()
      .then(response => {
        if (response.data && response.data.data) {
          const receiptTemplate = response.data.data;
          this.setState({
            receiptTemplate,
            baseCurrency: receiptTemplate.baseCurrency,
            isHasSubCurrency: receiptTemplate.isHasSubCurrency,
            subCurrency: receiptTemplate.subCurrency,
          });
        }
      });
      this.props.dispatch(PaymentMethodAction.fetch(2, "", "createdAt", "ASC", JSON.stringify({isEnableOnPOS: [Enum.PAYMENT_METHOD_AVIALE_ON_POS]})));
    });

    window.addEventListener("keydown", (e) => {
      const EndKey = 35,
        F2 = 113,
        F11 = 122,
        F = 70,
        S = 83;
      if (e.keyCode === EndKey) {
        this.handleOnMakePayment();
      } else if (e.keyCode === F2) {
        this.handleOnSetupDiscount();
      } else if (e.keyCode === F11 && e.shiftKey) {
        this.setState({productOrderList: []});
      } else if (e.keyCode === F && e.ctrlKey) {
        e.preventDefault();
        document.getElementById("searchProduct").focus();
      } else if (e.keyCode === S && e.ctrlKey) {
        e.preventDefault();
        this.handleOnSaveParkReceipt();
      }
    });

    CurrencyExchangeService.getExchangeRate()
    .then(response => {
      const data = response.data.data;
      if (data.length) {
        this.setState({currencyExchange: data[0]});
        if (data[0].value !== this.state.subCurrency.value) {
          this.setState(preState => {
            preState.subCurrency.value = data[0].value;
            return preState;
          });
        }
      }
    });
  }

  componentDidUpdate() {    
    if (this.props.customerAdd.added && this.props.customerAdd.response.data) {
      this.getSelectedCustomer(this.props.customerAdd.response.data);
      this.props.dispatch(CustomerAction.reset(CustomerConstant.RESET_ADD_CUSTOMERS));
    }

    if (this.props.open.added) {
      this.props.dispatch(OpenSaleRegistrationAction.last());
      this.props.dispatch(OpenSaleRegistrationAction.reset(ConstantOpenRegistrationSale.RESET_OPEN_SALE_REGISTRATION));
    }

    if (this.props.productVariant.fetched) {
      this.handleOnSelectProduct(this.state.selectedProduct, this.props.productVariant.list, false);// false: cause don't show popup variant product
      this.props.dispatch(ProductVariantAction.reset(ProductVariantConstant.RESET_PRODUCT_VARIANT));
    }

    if (this.props.posPay.error) {
      let errorCode = this.Util.getErrorCodeFromState(this.props.posPay.error);
      let messageProductError = this.Util.getErrorMessageFromState(this.props.posPay.error);
      messageProductError = JSON.parse(messageProductError);
      const productVariantErrorId = messageProductError.productVariantId;
      const productErrorResult = this.state.productOrderList.find(productOrder => productOrder.productVariantId === productVariantErrorId);

      let message = "Something went wrong";
      if (errorCode === Enum.LOCATION_NOT_FOUND) {
        message = this.CATranslate("error_location_not_found", this.props.locale);
      } else if (errorCode === InventoryEnum.PRODUCT_NOT_FOUND) {
        message = this.CATranslate("error_product_not_found", this.props.locale);
      } else if (errorCode === InventoryEnum.PRODUCT_QTY_NOT_ENOUGHT) {
        message = this.CATranslate("text_qty_not_enought_for_sale", this.props.locale);
        message = `${message} ${messageProductError.quantityInStock}`;
      } else if (errorCode === Enum.SERIAL_NUMBER_REQUIRE) {
        message = this.CATranslate("error_serial_number_require", this.props.locale);
      }

      this.Message.error(`${productErrorResult.name}/${productErrorResult.variantName} ${message}`);
      this.props.dispatch(TransactionAction.reset(Constant.RESET_ERROR_TRANSACTION));
    }
    
    if (this.props.products.fetched) {
      this.setState({
        productList: this.state.productList.concat(this.props.products.list),
        isRequestLoadingMore: false
      });
      this.props.dispatch(ProductAction.reset(ProductConstant.RESET_PARTIAL_PRODUCT));
    }

    if (!this.hasDidUpdate && this.props.openSaleRegistration.fetched && this.props.open.showForm) {
      if(!this.isOpenSaleRegistrationClosed() && this.isSetFocusOnSearchProduct){
        this.isSetFocusOnSearchProduct = true;
      }

      if (this.isOpenSaleRegistrationClosed()) {
        this.setState({
          modalContent: <FormOpenSaleRegistration/>
        });
      }

      this.hasDidUpdate = true;
    }
  }

  componentWillUnmount() {
    this.hadDidUpdateCheckDevice = false;
    window.removeEventListener("keydown", null);
  }

  isValidOpenSaleRegistrationList() {
    return Array.isArray(this.props.openSaleRegistration.list) &&
    this.props.openSaleRegistration.list.length > 0;
  }

  isOpenSaleRegistrationClosed() {
    if (this.isValidOpenSaleRegistrationList()) {
      return this.props.openSaleRegistration.list[0].status === Enum.OPEN_SALE_REGISTRATION_STATUS.CLOSED;
    } else {
      return true; // has no record so set true to be allow to open sale
    }
  }

  appendProductTaxList(productOrderList) {
    this.setState({productTaxList: POSUtil.appendProductTaxList(productOrderList)});
  }

  appendFreeProduct(orderProducts, freeByVariantId, freeProducts) {
    const foundOrderProduct = orderProducts.find(value => value.productVariantId === freeByVariantId);
    if (foundOrderProduct) {
      foundOrderProduct["freeProducts"] = freeProducts;
    }
  }

  appendProductOrder(targetList, product, productVariant, newPrice, discount, discountType) {
    if (!productVariant) {
      this.Message.error(this.CATranslate("error_product_not_found", this.props.locale));
      return;
    }

    const tax = POSUtil.getTaxFromProduct(product);
    const price = isNaN(parseFloat(productVariant.price)) ? 0 : productVariant.price;
    const wholePrice = isNaN(parseFloat(productVariant.wholePrice)) ? 0 : productVariant.wholePrice;
    const distributePrice = isNaN(parseFloat(productVariant.distributePrice)) ? 0 : productVariant.distributePrice;
    
    targetList.push({
      productId: product.id,
      productVariantId: productVariant.id,
      name: product.name,
      namekm: product.namekm,
      unit: product.unit,
      variantName: productVariant.name,
      barcode: productVariant.barcode,
      price,
      newPrice: newPrice ? newPrice : price,
      wholePrice,
      distributePrice,
      quantity: this.state.initialOrderQuantity,
      discount,
      discountType,
      enableDescription: product.enableDescription,
      tax: tax.taxRate/100,
      taxDescription: tax,
      description: product.name,
      options: [],
      status: this.Enum.ACTIVE
    });
  }

   async getProductPromotion(productVariantId, orderQuantity, orderAmount) {
      let freeProducts = [];
      let newPrice;
      let discountType;

      try {
         const result = await ProductService.getPromotionByProductVariantId(productVariantId, orderQuantity, orderAmount);
         
         if (result && result.data) {
            const promotion = result.data;

            if (promotion.type === "advance") {
               if (promotion.then === "GET_ITEMS") {
                  freeProducts = promotion.freeProducts.map(freeProduct => ({
                     productId: freeProduct.productId,
                     productVariantId: freeProduct.productVariantId,
                     freeByVariantId: productVariantId,
                     name: `${freeProduct.productName} - Free`,
                     description: `${freeProduct.productName} - Free`,
                     barcode: freeProduct.barcode,
                     quantity: freeProduct.quantity,
                     price: freeProduct.price,
                     newPrice: freeProduct.newPrice,
                     discount: 100,
                     discountType: 1,
                     status: 0
                  }));
               }

               discountType = promotion.type;
            } else {
               discountType = "basic";
               newPrice = promotion.price;
            }
         }
      } catch (error) {

      }

      return {
         discountType,
         newPrice,
         freeProducts
      };
   }

   getSummaryTotal() {
      const summaryTotal = POSUtil.getSummaryTotalInOrder(this.state.productOrderList, this.state.customerFieldPrice);
      let discountAmount = 0;
      let discountTypeStr = "";

      const taxAmount = POSUtil.getSummaryTax(this.state.productTaxList, <this.Translate id="text_no_tax"/>, this.CATranslate("text_taxes", this.props.locale)).taxTotal;

      if (this.state.discountValue.type === Enum.DISCOUNT_TYPE.PERCENTAGE) {
         discountTypeStr = ` (${this.state.discountValue.value}%)`;
         discountAmount = POSUtil.getDiscountByRate(summaryTotal.subTotal + taxAmount, this.state.discountValue.value); // WE DISCOUNT AFTER TAX IF DIFFERENCE FROM EACH ITEM
      } else if (this.state.discountValue.type === Enum.DISCOUNT_TYPE.AMOUNT) {
         discountAmount = this.state.discountValue.value;
      } else {
         discountAmount = summaryTotal.discount;
      }
      
      return {
         summaryTotal,
         taxAmount,
         discountAmount,
         discountTypeStr,
         discountType: this.state.discountValue.type
      };
   }

  getSelectedCustomer = (selectedCustomer) => {
    this.setState({selectedCustomer});

    if (selectedCustomer) {
      this.props.form.setFieldsValue({ searchRecord: `${selectedCustomer.firstName} ${selectedCustomer.lastName} ${selectedCustomer.phoneNumber ? " - " + selectedCustomer.phoneNumber : ""}` });
    } else {
      this.props.form.setFieldsValue({ searchRecord: "" });
    }
    
    this.setState({customerFieldPrice: CRMUtil.getCustomerPriceField(selectedCustomer)});
  }

  saveReceipt(key, productOrderList = []) {
    localStorage.setItem(key, JSON.stringify({
      isParkReceipt: key === Enum.PARK_RECEIPT,
      productOrderList,
      productTaxList: this.state.productTaxList,
      discountValue: this.state.discountValue,
      isDiscountHasAdded: this.state.isDiscountHasAdded
    }));
  }

  restoreReceipt(key) {
    let receipt = localStorage.getItem(key);
    if (this.Util.isJsonString(receipt)) {
      receipt = JSON.parse(receipt);
      if (receipt) {
        this.setState({
          ...receipt
        });
      } else {
        this.handleOnResetOrder();
      }
    }
  }

  openFormSaleRegisration() {
    if (this.isOpenSaleRegistrationClosed()) {
      this.props.dispatch(OpenSaleRegistrationAction.showForm());
      this.setState({
        modalContent: <FormOpenSaleRegistration/>
      });
      return true;
    }
    return false;
  }

  handleOnBlurSearchProduct() {
    this.isSetFocusOnSearchProduct = false;
  }

  handleOnResetOrder() {
    this.setState({
      selectedReceiptType: Enum.CURRENT_RECEIPT,
      expandOrderItemRow: [],
      productOrderList: [],
      productTaxList: [],
      discountValue: {
        type: Enum.DISCOUNT_TYPE.PERCENTAGE,
        value: 0
      },
      isDiscountHasAdded: false,
      selectedCustomer: null,
      customerFieldPrice: "price"
    });

    localStorage.removeItem(Enum.CURRENT_RECEIPT);
    this.props.dispatch(CustomerAction.reset(CustomerConstant.REQUEST_CUSTOMERS_RESET));
    this.props.form.setFieldsValue({searchRecord: ""}); //searchRecord: customer search field
  }

  handleOnResizeScreen() {
    // TO DO: Disable temparary on modal popup Discount and Tax On Sale POS
    // this.setState({modalContent: null});
  }

  handleOnSelectCategory = (value) => {
    if (this.openFormSaleRegisration()) {
      return;
    }

    let filter = "";
    if (value !== 0) {
      filter = JSON.stringify({productTypeId: [value]});

      if (this.state.selectedCategoryIds.includes(value)) {
        filter = "";
        this.setState({selectedCategoryIds: []});
      } else {
        this.setState({selectedCategoryIds: [value]});
      }
    } else {
      this.handleOnClickAllCategory();
      return;
    }

    this.setState({productList: []});

    this.props.dispatch(ProductAction.fetch(10, "", "", "", filter, "", this.Util.getLocationId()));
  }

  handleCancelVariantProduct = () => {
    this.setState({modalContent: null});
  }

  handleExpandOrderItem = (expandOrderItem, productOrderIndex, status) => {
    const expandOrderItemRow = `${expandOrderItem.productVariantId}-${status}`;

    this.handleonSearchFails();
    
    if (this.state.expandOrderItemRow.includes(expandOrderItemRow)) {
      this.setState({
        expandOrderItemRow: [],
        expandRowOrderIndex: productOrderIndex
      });
    } else {
      this.setState({
        expandOrderItemRow: [expandOrderItemRow],
        expandRowOrderIndex: productOrderIndex
      });
    }
  }

  handleOnSelectProduct = async (product, productVariant, isRequestVariantForm = true) => {
      let freeProducts = [];
      let newPrice = null;
      let {
          productOrderList,
          initialOrderDiscount,
          initialOrderDiscountType,
          isDiscountHasAdded,
          discountValue
      } = this.state;

      // POPUP INPUT CASH REQUIRE IF YOU NOT YET OPEN
      if (this.openFormSaleRegisration()) {
         return;
      }

      let isProductVariant = product.productOption === InventoryEnum.PRODUCT_VARIANT;
      if (isProductVariant && isRequestVariantForm) {
         this.setState({
         selectedProduct: product,
         modalContent: <VaraintProduct
            product={product}
            handleCancel={this.handleCancelVariantProduct} />
         });
         return;
      } else if (productVariant && productVariant.length === 1) {
          productVariant = productVariant[0]; // ACCESS TO PRODUCT VARIANT DEFAUTL FOR STARTDARD PRODUCT
          productVariant.name = isProductVariant ? productVariant.name : ""; // Remove product variant name away from label table
      }

      // Checking for promotion
      let orderQuantity = 1;
      let orderAmount = productVariant.quantity * productVariant.price;
      const foundOrderProduct = productOrderList.find(value => value.productVariantId === productVariant.id);

      if (foundOrderProduct) {
         orderQuantity += foundOrderProduct.quantity;
         orderAmount += (orderQuantity * foundOrderProduct.price);
      }
      console.log("orderQuantity:", orderQuantity);
      console.log("orderAmount:", orderAmount);
      const promotion = await this.getProductPromotion(productVariant.id, orderQuantity, orderAmount);
      if (promotion.discountType === "basic") {
         newPrice = promotion.newPrice;
         const saveAmount = productVariant.price - newPrice;

         initialOrderDiscount = POSUtil.getPercentageByValue(saveAmount, productVariant.price);
         isDiscountHasAdded = true;
         discountValue = {type: Enum.DISCOUNT_TYPE.EACH_ITEM};
      } else {
         freeProducts = promotion.freeProducts;
      }

      //##End checking promotion

      if (productOrderList.length === 0) {
         this.appendProductOrder(productOrderList, product, productVariant, newPrice, initialOrderDiscount, initialOrderDiscountType);
      } else {
         let isNotTheSame = true;
         productOrderList.forEach((productOrder, productOrderIndex) => {
         if (productVariant && productOrder.productVariantId === productVariant.id && productOrder.status === this.Enum.ACTIVE) {
            isNotTheSame = false;
            productOrderList[productOrderIndex]["quantity"] += this.state.initialOrderQuantity;
            productOrderList[productOrderIndex]["status"] = this.Enum.ACTIVE;
         }
         });

         if (isNotTheSame) this.appendProductOrder(productOrderList, product, productVariant, null, initialOrderDiscount, initialOrderDiscountType);
      }

      this.appendProductTaxList(productOrderList);
      this.appendFreeProduct(productOrderList, productVariant.id, freeProducts);
      
      this.setState({
         productOrderList,
         isDiscountHasAdded,
         discountValue
      });
      
      this.saveReceipt(Enum.CURRENT_RECEIPT, productOrderList);
      
      this.props.form.setFieldsValue({searchProduct: ""});
  }

  removeProductFromOrderList = (productVariant) => {
    let productOrderList = this.state.productOrderList.filter(productOrder => productOrder.productVariantId !== productVariant.productVariantId);

    this.setState({
      productOrderList,
      isDiscountHasAdded: productOrderList.length > 0 ? this.state.isDiscountHasAdded : false
    });

    this.appendProductTaxList(productOrderList);

    this.saveReceipt(Enum.CURRENT_RECEIPT, productOrderList);
  }

  handleOnRemoveProductFromOrderList = (productVariant) => {
    this.removeProductFromOrderList(productVariant);
  }

  handleOnGetTaxList(productTaxList, taxRate) {
    const productOrderList = this.state.productOrderList;
    productOrderList.forEach((product, productIndex) => {
      if (productOrderList[productIndex]["tax"] * 100 === taxRate) { //ex: taxRate=0.2
        productOrderList[productIndex]["tax"] = 0;
      }
    });
    this.setState({
      productTaxList,
      productOrderList
    });
  }

   handleOnChangOrderFieldBlur(){
      this.setState({expandRowOrderIndex: null});
   }

   handleonSearchFails(){
      this.isSetFocusOnSearchProduct = false;
   }

   handleOnChangOrderField = async (event, proderOrderRowIndex, field = "quantity") => {
      this.handleonSearchFails();

      const value = parseFloat(event.target.value);
      let orderProducts = this.state.productOrderList;
      const orderProduct = orderProducts[proderOrderRowIndex];

      orderProducts[proderOrderRowIndex][field] = isNaN(value) ? 0 : value;

      if (field === "discount") {
         if (!isNaN(value) && value > 0) {
            this.setState({
               isDiscountHasAdded: true,
               discountValue: {
               type: Enum.DISCOUNT_TYPE.EACH_ITEM
               }
            });
         } else {
            orderProducts[proderOrderRowIndex]["discount"] = 0;
            const isDiscountHasAdded = orderProducts.filter(productOrderList => parseFloat(productOrderList.discount) > 0 ).length > 0;
            this.setState({
               isDiscountHasAdded,
               discountValue: {
               type: isDiscountHasAdded ? Enum.DISCOUNT_TYPE.EACH_ITEM : Enum.DISCOUNT_TYPE.PERCENTAGE,
               value: isDiscountHasAdded ? this.state.discountValue.value : 0
               }
            });
         }
         const price = POSUtil.getTotalAmountAfterDiscount(1, orderProducts[proderOrderRowIndex][this.state.customerFieldPrice], orderProducts[proderOrderRowIndex]["discount"]);
         orderProducts[proderOrderRowIndex]["newPrice"] = price;
         this.props.form.setFieldsValue({[`price[${proderOrderRowIndex}]`]: price});
      }

    if (field === "newPrice") {
      const newPrice = orderProducts[proderOrderRowIndex]["newPrice"];
      let price = orderProducts[proderOrderRowIndex][this.state.customerFieldPrice];
      if (newPrice < price) { // DISCOUNT EVENT APPEAR
        const discountAmount = price - newPrice;
        const discount = POSUtil.getDiscountRateByAmount(price, discountAmount);
        orderProducts[proderOrderRowIndex]["discount"] = discount;
        this.props.form.setFieldsValue({[`discount[${proderOrderRowIndex}]`]: discount});
        this.setState({
          isDiscountHasAdded: true,
          discountValue: {
            type: Enum.DISCOUNT_TYPE.EACH_ITEM
          }
        });
      } else {
        this.setState({isDiscountHasAdded: false});
        orderProducts[proderOrderRowIndex]["discount"] = 0;
        this.props.form.setFieldsValue({[`discount[${proderOrderRowIndex}]`]: 0});
      }
    }

      if (field === "description") {
         orderProducts[proderOrderRowIndex]["description"] = event.target.value;
      }

      if (field === "quantity") {
         const orderQuantity = value;
         const orderAmount = orderQuantity * orderProduct.price;
         const promotion = await this.getProductPromotion(orderProduct.productVariantId, orderQuantity, orderAmount);
         if (promotion.discountType === "basic") {
            
         } else {
            this.appendFreeProduct(orderProducts, orderProduct.productVariantId, promotion.freeProducts);
         }
      }

      this.appendProductTaxList(orderProducts);
      this.setState({productOrderList: orderProducts});
   }

   handleOnAddNewCustomer = () => {
      this.props.dispatch(CustomerAction.showForm());
      this.setState({
         modalContent: <FormCreateCustomer />
      });
   }

  handleOnSelectProductSearchList = (product, productVariants) => {
    if (this.openFormSaleRegisration()) {
      return;
    }
    
    if (
      product.productOption === InventoryEnum.PRODUCT_VARIANT &&
      product.productVariants &&
      product.productVariants.length > 0
    ) {
      this.setState({
        selectedProduct: product,
        modalContent: <VaraintProduct
          product={product}
          handleCancel={this.handleCancelVariantProduct} />
      });
      return;
    } else {
      this.handleOnSelectProduct(product, productVariants);
    }
  }

  handleOnAutoSelectProductAfterSearchResult(productList, isRequestVariantForm) {
    if (this.openFormSaleRegisration()) {
      return;
    }

    if (productList.length === 1) {
      this.handleOnSelectProduct(productList[0], productList[0].productVariants, isRequestVariantForm);
      this.props.form.setFieldsValue({searchProduct: ""});
      this.props.dispatch(ProductAction.reset(ProductConstant.SEARCH_PRODUCT_RESET));
    }
  }

  handleCancelMakePayment() {
    this.setState({modalContent: null});
  }

  handleCancelDiscountSetup() {
    this.setState({
      modalContent: null,
      isDiscountHasAdded: this.props.form.getFieldValue("discountValue") > 0
    });
  }

  handleCancelTaxSetting() {
    this.setState({
      modalContent: null
    });
  }

  handleOnCancelAllCategory () {
    this.setState({
      modalContent: null
    });
  }

  handleOnMakePayment() {
    this.handleonSearchFails();
    if (this.openFormSaleRegisration()) {
      return;
    }

    if (this.state.productOrderList.length > 0) {
      const setting = this.Util.getSetting();
      let exchangeRate = 1;
      let currency = setting.currency && setting.currency.trim();
      if (currency === "៛" || currency === "R") {
        exchangeRate = this.state.currencyExchange && this.state.currencyExchange.value;
      }

      this.props.dispatch(TransactionAction.showForm());
      this.setState({modalContent: <PaymentForm
        isHasSubCurrency={this.state.isHasSubCurrency}
        baseCurrency={this.state.baseCurrency}
        subCurrency={this.state.subCurrency}
        receiptTemplate={this.state.receiptTemplate}
        handleCancel={this.handleCancelMakePayment}
        customer={this.state.selectedCustomer}
        customerFieldPrice={this.state.customerFieldPrice}
        productOrderList={this.state.productOrderList}
        paymentMethodList={this.props.paymentMethod}
        productTaxList={this.state.productTaxList}
        exchangeRate={exchangeRate}
        handleOnResetOrder={this.handleOnResetOrder}
        summaryTotal={this.getSummaryTotal()}
        summaryTax={POSUtil.getSummaryTax(this.state.productTaxList, <this.Translate id="text_no_tax"/>, this.CATranslate("text_taxes", this.props.locale))}/>
      });

      if (this.state.selectedReceiptType === Enum.PARK_RECEIPT) {
        // CLEAR PARK RECEIPT IN CASE USER HAS RESTORE IT AND MAKE PAYMENT
        let parkReceipt = localStorage.getItem(Enum.PARK_RECEIPT);
        if (parkReceipt) {
          parkReceipt = JSON.parse(parkReceipt);
          if (parkReceipt.isParkReceipt) {
            localStorage.removeItem(Enum.PARK_RECEIPT);
          }
        }
      }
    } else {
      // TO DO: alert message can make payment with empty list
    }
  }
  
  handleGetDiscount(discountValue) {
    this.setState({
      discountValue
    });
  }

  handleOnClickAllCategory() {
    this.setState({
      modalContent: <ProductTypeList
        list={this.props.productsType.list}
        handleCancel={this.handleOnCancelAllCategory}
        form={this.props.form}
        handleOnSelectCategory={this.handleOnSelectCategory} />
    });
  }

  handleOnSetupDiscount() {
    const {
      summaryTotal
    } = this.getSummaryTotal();

    this.setState({
      modalContent: <DiscountSetup
        handleCancel={this.handleCancelDiscountSetup}
        form={this.props.form}
        discountValue={this.state.discountValue.value}
        discountType={this.state.discountValue.type}
        summaryTotal={summaryTotal}
        callBack={this.handleGetDiscount} />,
      isDiscountHasAdded: true,
    });
    this.isSetFocusOnSearchProduct = false;
  }

  handleOnOpenTaxSetting() {
    this.setState({
      modalContent: <TaxSetting
        handleCancel={this.handleCancelTaxSetting}
        callBack={this.handleOnGetTaxList}
        productOrderList={this.state.productTaxList}
        form={this.props.form} />
    });
  }

  handleRemoveDiscount() {
    this.setState({
      isDiscountHasAdded: false,
      discountValue: {
        type: Enum.DISCOUNT_TYPE.PERCENTAGE,
        value: 0
      }
    });
  }

  handleSetFullScreen = () => {
    const element = document.getElementById("center-container");

    if (element.classList.contains("full-screen")) {
      this.setState({
        iconFullScreen: "icon-full-screen",
        textFullScreen: <this.Translate id="text_full_screen" />
      });
      element.classList.remove("full-screen");
    }
    else {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        if (rootElement.classList.contains("mini-sidebar")) {
          rootElement.classList.remove("mini-sidebar");
        }
      }

      this.setState({
        iconFullScreen: "icon-exit-full-screen",
        textFullScreen: <this.Translate id="text_exit_full_screen" />
      });
      element.classList.add("full-screen");
    }
  }

  handleLinkSaleHistory = () => {
    this.handleSetFullScreen();

    history.push("/transactions/invoice");
  }

  handleLinkCloseShift() {
    this.handleSetFullScreen();

    history.push("/transactions/saleregister");
  }

  handleOnSaveParkReceipt() {
    this.saveReceipt(Enum.PARK_RECEIPT, this.state.productOrderList);
    this.handleOnResetOrder();
  }

  handleOnRestoreReceipt(key) {
    this.restoreReceipt(key);
    this.setState({selectedReceiptType: key});
  }

  renderProductList() {
    const countProduct = this.state.productList.length;
    const scrollWidth = 5;
    const categoryPanelHeight = 60;
    const headerHeight = 50;
    const itemPanelHeight = window.innerHeight - (headerHeight + categoryPanelHeight);
    const screenWidth = window.innerWidth - 420;
    let numberOfColumn = 5;
    let cuttingPaddingRightScroll = 4;

    if (screenWidth > 1300) {
      numberOfColumn = 6;
      cuttingPaddingRightScroll = 4;
    }

    const numberOfItemRow = Math.ceil(countProduct / numberOfColumn);

    let productWidth = (screenWidth / numberOfColumn) - cuttingPaddingRightScroll;
    let productHeight = productWidth;

    if ((numberOfItemRow * productHeight) > itemPanelHeight) { // calculate total height of all row of item list
      productWidth = productHeight = productWidth - (scrollWidth / 5); // we take the whole width of scroll and provide the left for item list
    }

    const imageHeight = productWidth - 70;
    this.productWidth = productWidth;

    return countProduct > 0 ?
      this.state.productList.map((product, index) =>
        <this.Col style={{width: productWidth, maxWidth: "none", flex: "none"}} md="3" className="product-box" key={index}>
          <div onClick={() => this.handleOnSelectProduct(product, product.productVariants)} className="product" style={{height: productWidth}}>
            <div className="image" style={{minHeight: imageHeight, maxHeight: imageHeight}}>
              <this.Image style={{maxHeight: imageHeight}} url={this.Util.getProductImage(product.image).url}/>
            </div>
            <div style={{maxHeight: 20, overflow: "hidden", wordBreak: "break-all"}}>
              <div className="name">
                {Util.getProductNameV2(product)}
              </div>
            </div>
            <div className="price">{this.formatCurrency(Util.getProductPrice(product))}</div>
          </div>
        </this.Col>
      )
      :
      <div style={{display: "flex", alignItems: "center", margin: "0 auto", height: "100%"}}>
        <img src={`${this.Util.getGeneralImage("storeVein/no-product-found.png").url}`} style={{width: 150}} alt="" />
      </div>;
  }

  renderSaveAndPayButton = () => (
    <this.Row className="payment-action">
      <this.Button type="info" className="mg-right" onClick={this.handleOnSaveParkReceipt}>
        <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />
      </this.Button>
      <this.Button type="info" onClick={this.handleOnMakePayment}>
        <span className="icon-checked icon-padding-right"></span><this.Translate id="text_pay" /><span style={{textTransform: "capitalize", fontSize: "12pt"}}>(End)</span>
      </this.Button>
    </this.Row>
  )

  saleOrderHeader = () => {
    let parkReceipt = localStorage.getItem(Enum.PARK_RECEIPT);
    if (parkReceipt) {
      parkReceipt = JSON.parse(parkReceipt);
    }
    return <this.Row className="wrap-receipt-type">
      <this.Col md="12" className="receipt-type">
        <div className={`pull-left current-receipt ${this.state.selectedReceiptType === Enum.CURRENT_RECEIPT ? "selected" : ""}`} onClick={() => this.handleOnRestoreReceipt(Enum.CURRENT_RECEIPT)}>
          <span className="icon-receipt icon-padding-right"></span><this.Translate id="current_receipt_type" />
        </div>
        {
          localStorage.getItem(Enum.PARK_RECEIPT) ?
            <div className={`pull-left park-receipt ${this.state.selectedReceiptType === Enum.PARK_RECEIPT ? "selected" : ""}`} onClick={() => this.handleOnRestoreReceipt(Enum.PARK_RECEIPT)}>
              <span className="icon-reports icon-padding-right"></span><this.Translate id="park_receipt_type" />({_.sumBy(parkReceipt["productOrderList"], "quantity")} Items)
            </div>
            :
            ""
        }
        <div className="pull-left park-receipt" onClick={this.handleLinkSaleHistory}>
          <span className="icon-time icon-padding-right"></span><this.Translate id="text_invoices" />
        </div>
        <div className="pull-left park-receipt" onClick={this.handleLinkCloseShift}>
          <span className="icon-currency icon-padding-right"></span><this.Translate id="text_close_shift" />
        </div>
      </this.Col>
    </this.Row>;
  }

  fieldNotation = (productOrderIndex, productOrder) => (
    <div className="detail-row-2">
      <this.InputText
        name={`description[${productOrderIndex}]`}
        label={productOrder.enableDescription ? <this.Translate id="text_serial_or_imei" /> : <this.Translate id="text_notation" />}
        // data={productOrder.description}
        className="ca-input-v1"
        handleKeyUp={(event) => this.handleOnChangOrderField(event, productOrderIndex, "description")}
        placeholder={this.CATranslate(productOrder.enableDescription ? "text_search_serial_no" : "text_add_notation", this.props.locale)}
        form={this.props.form} />
    </div>
  )

  render() {

    if (isMobile) {
      return <div className="unavailable-mobile-layout"> 
        <div className="unavailable-mobile"> 
          <this.Translate id="text_unavailable_mobile_layout"/><br/>
          <this.Translate id="text_unavailable_mobile_download_app"/> <br/>
          { 
            isAndroid ?
              <a href="www">Play Store</a>
              : isIOS ? <a href="www">App Store</a> : ""
          }
        </div>
      </div> ;
    }
    
    const {
      summaryTotal,
      discountAmount,
      taxAmount,
      discountTypeStr
    } = this.getSummaryTotal();

    const {
      taxTitle,
      taxTotal,
      countTax
    } = POSUtil.getSummaryTax(this.state.productTaxList, <this.Translate id="text_no_tax"/>, this.CATranslate("text_taxes", this.props.locale));

    let categoryList = this.props.productsType.list;
    if (categoryList.length > 4) {
      categoryList = this.state.categoryList.concat(categoryList);
    }

    const setting = this.Util.getSetting();
    let currency = setting.currency && setting.currency.trim();
    let exchangeRate = 1;
    if (currency === "៛" || currency === "R") {
      currency = "៛";
      exchangeRate = this.state.currencyExchange && this.state.currencyExchange.value;
    }
    
    return <this.Row className="main-layout main-store-account" id="retail-sale">
      <div id="receiptLogoPreLoading" style={{display: "none"}}>
        <img style={{width: 100}} src={this.Util.getProductImage(this.state.receiptTemplate ? this.state.receiptTemplate.logo : "", "general").url} alt="" />
      </div>
      <this.Col md="8" id="left-block">

        {this.saleOrderHeader()}


        <this.Row className="wrap-category">
          {
            this.props.productsType.fetching && !this.state.isRequestLoadingMore ?
              <StartUp />
              :
              categoryList.map((category, index) =>
                <this.Col md="3" className="category-box" style={{width: this.productWidth}} key={index}>
                  <div onClick={() => this.handleOnSelectCategory(category.id)} className={`category ${this.state.selectedCategoryIds.includes(category.id)? "selected": "" }`}>
                    <div style={{maxHeight: 20, overflow: "hidden", wordBreak: "break-all"}}>
                      <div>
                        {category.name}
                      </div>
                    </div>
                  </div>
                </this.Col>
              )
          }
        </this.Row>
        <this.Row className="wrap-product-box-list" id="wrap-product-box-list">
          {
            this.props.products.fetching && !this.state.isRequestLoadingMore ?
              <StartUp />
              :
              this.renderProductList()
          }
        </this.Row>
      </this.Col>
      <this.Col md="4" id="right-block">
        <this.Row id="search-information">
          <this.Col md="12" id="wrap-cashier">
            <div>
              <this.Translate id="text_cashier" />: 
            </div>
            <div className="current-cashier">
              {this.Util.getCurrentUser().fullName}
            </div>
          </this.Col>
          {
            this.Util.getClientCustomerCreditStatus() === SettingEnum.CUSTOMER_CREDIT_STATUS.ENABLE ?
              <CustomerDropDownSearch
                customers={this.props.customers}
                locale={this.props.locale}
                form={this.props.form}
                dispatch={this.props.dispatch}
                callBack={this.getSelectedCustomer}
                disabledCustomer={this.state.disabledCustomer}
                handleOnAddNewCustomer={this.handleOnAddNewCustomer} />
              :
              ""
          }
       
          <ProductDropDownSearch
            placeholder={`${this.CATranslate("text_search_and_scan_barcode", this.props.locale)}(Ctrl+F)`}
            productSearch={this.props.productSearch}
            handleOnSelectList={this.handleOnSelectProductSearchList}
            callBack={this.handleOnAutoSelectProductAfterSearchResult}
            handlePressEnterOnSearch={this.handleOnSelectProductSearchList}
            handleOnBlur={this.handleOnBlurSearchProduct}
            searchFor={1}
            className="ca-input-v1-icon-left ca-input-v1"
            // isAutoFocus={true || this.isSetFocusOnSearchProduct}
            didUpdateMakeAutoFocus={this.isSetFocusOnSearchProduct}
            locale={this.props.locale}
            form={this.props.form}
            isShowBarcodeScannerIcon={true}
            dispatch={this.props.dispatch} />
        </this.Row>
        <div className="product-order-list">
          {
            this.state.productOrderList.map((productOrder, productOrderIndex) => 
              <React.Fragment key={productOrderIndex}>
                {/* Main Order Product */}
                <div className={`product-order-item ${this.state.expandOrderItemRow.includes(`${productOrder.productVariantId}-${productOrder.status}`) ? "expanded" : ""}`}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div className="item" onClick={() => this.handleExpandOrderItem(productOrder, productOrderIndex, productOrder.status)}>
                      <div className={`epxand-icon ${this.state.expandOrderItemRow.includes(`${productOrder.productVariantId}-${productOrder.status}`) ? "icon-move-down" : "icon-next"}`}></div>
                      <div className="description">
                        <div style={{ maxHeight: "20px", maxWidth: "160px", overflow: "hidden", wordBreak: "break-all" }}>
                          <div className="name">
                            {productOrder.name}
                          </div>
                        </div>
                        {
                          productOrder.variantName ?
                            <div className="barcode-number variant-name" style={{ marginTop: 5 }}>
                              {productOrder.variantName}
                            </div>
                            :
                            ""
                        }

                        <div className="barcode-number" style={{ marginTop: 5 }}>
                          {productOrder.barcode}
                        </div>

                      </div>
                      <div className="quantity">
                        {`${productOrder.quantity}x`}
                      </div>
                      <div className="price">
                        {
                          productOrder.discount > 0 ?
                            <div className="after-discount-price">
                              {this.formatCurrency(POSUtil.getTotalAmountAfterDiscount(productOrder.quantity, productOrder[this.state.customerFieldPrice] * exchangeRate, productOrder.discount))}
                            </div>
                            :
                            ""
                        }
                        <div className={`main-price ${productOrder.discount > 0 ? "strike-price" : ""}`}>
                          {this.formatCurrency(POSUtil.getTotalAmount(productOrder.quantity, productOrder[this.state.customerFieldPrice] * exchangeRate))}
                        </div>
                      </div>
                    </div>
                    {
                      productOrder.status === this.Enum.ACTIVE && 
                        <div className="delete" onClick={() => this.handleOnRemoveProductFromOrderList(productOrder, productOrderIndex)}>
                          <span className="icon-delete"></span>
                        </div>
                    }
                  </div>
                  <div className="product-order-item-detail">
                    <div className="detail-row-1">
                      <this.InputNumber
                        name={`quantity[${productOrderIndex}]`}
                        label={productOrder.status === this.Enum.ACTIVE ? <this.Translate id="text_quantity" /> : <this.Translate id="text_return_quantity" /> }
                        data={productOrder.quantity}
                        handleKeyUp={event => this.handleOnChangOrderField(event, productOrderIndex, "quantity")}
                        handleOnBlur={this.handleOnChangOrderFieldBlur}
                        className="ca-input-v1 order-quantity"
                        min={0}
                        isHideTool={true}
                        precision={1}
                        isAutoSelect={true}
                        isAutoFocus={true}
                        didUpdateMakeAutoFocus={this.state.expandRowOrderIndex === productOrderIndex}
                        form={this.props.form}/>
                      <this.InputNumber
                        name={`price[${productOrderIndex}]`}
                        label={<this.Translate id="text_price" />}
                        data={POSUtil.getTotalAmountAfterDiscount(1, productOrder[this.state.customerFieldPrice], productOrder.discount)}
                        handleKeyUp={(event) => this.handleOnChangOrderField(event, productOrderIndex, "newPrice")}
                        handleOnBlur={this.handleOnChangOrderFieldBlur}
                        className="ca-input-v1"
                        precision={2}
                        isAutoSelect={true}
                        isHideTool={true}
                        disabled={this.Util.getCurrentUser().isAllowEditPrice === HREnum.ALLOW_EDIT_SALE_PRODUCT.NOT_ALLOW || productOrder.status === this.Enum.TRANSACTION_ENTRY_STATUS.RETURN}
                        form={this.props.form}
                      />
                      <this.InputNumber
                        name={`discount[${productOrderIndex}]`}
                        label={<span><this.Translate id="text_discount"/> (%)</span>}
                        data={productOrder.discount}
                        handleKeyUp={event => this.handleOnChangOrderField(event, productOrderIndex, "discount")}
                        handleOnBlur={this.handleOnChangOrderFieldBlur}
                        className="ca-input-v1"
                        precision={2}
                        isAutoSelect={true}
                        isHideTool={true}
                        disabled={this.Util.getCurrentUser().isAllowEditPrice === HREnum.ALLOW_EDIT_SALE_PRODUCT.NOT_ALLOW || productOrder.status === this.Enum.TRANSACTION_ENTRY_STATUS.RETURN}
                        form={this.props.form}
                      />
                    </div>
                    {this.fieldNotation(productOrderIndex, productOrder)}
                  </div>
                </div>

                {/* Free Product Order */}
                {
                  Array.isArray(productOrder.freeProducts) && productOrder.freeProducts.map((freeProductOrder, freeProductIndex) => 
                    <div className="product-order-item" key={freeProductIndex}>
                      <img src={require("../../../../common/components/layout/styles/images/free.png")} alt="Free Product" style={{position: "absolute", top: 15, left: 5}}  />
                      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <div className="item">
                          <div className="epxand-icon icon-next"></div>
                          <div className="description">
                            <div style={{ maxHeight: "20px", maxWidth: "160px", overflow: "hidden", wordBreak: "break-all" }}>
                              <div className="name">
                                {freeProductOrder.name}
                              </div>
                            </div>
                            {
                              freeProductOrder.variantName ?
                                <div className="barcode-number variant-name" style={{ marginTop: 5 }}>
                                  {freeProductOrder.variantName}
                                </div>
                                :
                                ""
                            }

                            <div className="barcode-number" style={{ marginTop: 5 }}>
                              {freeProductOrder.barcode}
                            </div>

                          </div>
                          <div className="quantity">
                            {`${freeProductOrder.quantity}x`}
                          </div>
                          <div className="price">
                            <div className="main-price">
                              {this.formatCurrency(0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> 
                  ) 
                }
              </React.Fragment>
            )
          }
        </div>
        <div id="wrap-payment">
          <this.Col md="12">
            <this.Row className="payment">
              <this.Col md="12" className="text-left">
                {
                  !this.state.isDiscountHasAdded && summaryTotal.discount <= 0 ?
                    <div className="sub-total add-discount" style={{justifyContent: "flex-end"}} onClick={this.handleOnSetupDiscount}>
                      <span className="icon-add icon-padding-right"></span> <span><this.Translate id="text_add"/> <this.Translate id="text_discount"/></span><span style={{fontSize: "10pt"}}>(F2)</span>
                    </div>
                    :
                    ""
                }
          
                {/* SUB TOTAL ROW */}
                <div className="sub-total">
                  <div className="sub-total-title"><this.Translate id="text_sub_total"/></div>
                  <div className="sub-total-value">{this.formatCurrency(summaryTotal.subTotalAfterDiscount * exchangeRate)}</div>
                </div>
                {
                  summaryTotal.discount > 0 ?
                    <div className="sub-total">
                      <div className="sub-total-title" style={{fontWeight: 600}}><this.Translate id="text_discount"/></div>
                      <div className="sub-total-value" style={{color: "#e85757"}}>{this.formatCurrency(discountAmount * exchangeRate)}</div>
                    </div>
                    :
                    ""
                }
                {/* END SUB TOTAL ROW */}

                {/* TAX ROW */}
                {
                  taxTotal > 0 && 
                  <div className="sub-total">
                    <div className="sub-total-title" onClick={countTax > 0 ? this.handleOnOpenTaxSetting : null}>
                      <span className={`${countTax > 0 ? "ca-link" : ""}`}><this.Translate id="text_tax"/></span> {taxTitle}
                    </div>
                    <div className="sub-total-value">{this.formatCurrency(taxTotal * exchangeRate)}</div>
                  </div>
                }
                {/*END TAX ROW */}

                {/* DISCOUNT ROW */}
                {
                  this.state.isDiscountHasAdded && summaryTotal.discount <= 0?
                    <div className="sub-total">
                      <div className="ca-link sub-total-title" style={{fontWeight: 600, position: "relative"}} onClick={this.handleOnSetupDiscount}>
                        <div className="delete remove-discount" onClick={this.handleRemoveDiscount}><span className="icon-delete"></span></div>
                        <this.Translate id="text_discount"/>
                        {discountTypeStr}
                      </div>
                      <div className="sub-total-value" style={{position: "relative", color: "#e85757"}}>
                        {this.formatCurrency(discountAmount * exchangeRate)}
                      </div>
                    </div>
                    :
                    ""
                }
                {/*END DISCOUNT ROW */}

                <div className="sub-total">
                  <div className="sub-total-title">
                    <this.Translate id="text_total"/>
                    {this.state.isHasSubCurrency ? ` (${this.state.baseCurrency.symbol})` : ""}
                  </div>
                  <div className="sub-total-value">
                    {this.formatCurrency(POSUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount), `${this.state.baseCurrency.symbol}`)}
                  </div>
                </div>

                {
                  this.state.isHasSubCurrency ?
                    <div className="sub-total">
                      <div className="sub-total-title">
                        <this.Translate id="text_total"/> ({this.state.subCurrency.symbol})
                      </div>
                      <div className="sub-total-value">
                        {this.Util.formatCurrency(POSUtil.toSubCurrencyGrantTotal(POSUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount), this.state.baseCurrency, this.state.subCurrency), this.state.subCurrency.symbol)}
                      </div>
                    </div>
                    :
                    ""
                }
              </this.Col>

              <this.Col md="6" className="text-right" style={{display: "none"}}>
                <div className="grand-total">
                  <div className="grand-total-title"><this.Translate id="text_total"/></div>
                  <div className="grand-total-value">{this.formatCurrency(POSUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount))}</div>
                </div>
              </this.Col>

            </this.Row>
            { this.renderSaveAndPayButton() }
          </this.Col>
        </div>
      </this.Col>
      {this.state.modalContent}
    </this.Row>;
  }
}