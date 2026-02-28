import React from "react";
import { isMobile, isAndroid, isIOS } from "react-device-detect";
import { Button, Icon, Input, Row, Divider, Drawer } from "antd";
import _ from "lodash";
import CommonUtil from "@common/util/index";
import ProductTypeList from "./ProductTypeList";
import DiscountSetup from "./DiscountSetup";
import TaxSetting from "./TaxSetting";
import Enum from "../../../enums";
import InventoryEnum from "../../../../inventory/enums";
import HREnum from "../../../../hr/enums";
import CRMUtil from "../../../../crm/util";
import TransactionAction from "../../../action/transaction/transaction";
import TransactionService from "../../../services/transactions/TransactionService";
import Constant from "../../../constants/transactions/transaction";
import ExchangeRateService from "../../../services/settings/ExchangeRateService";
import ReceiptTemplateService from "../../../services/settings/ReceiptTemplateService";
import PaymentMethodAction from "../../../action/settings/paymentMethod";
import FormCreateCustomer from "../../../../crm/containers/customers/Customer/FormCreate";
import CustomerAction from "../../../../crm/actions/customers/customer";
import CustomerConstant from "../../../../crm/constants/customers/customer";
import ProductTypeAction from "../../../../inventory/actions/products/productsType";
import ProductVariantAction from "../../../../inventory/actions/products/productVariant";
import ConstantOpenRegistrationSale from "../../../constants/transactions/openSaleRegisration";
import ProductAction from "../../../../inventory/actions/products/product";
import ProductService from "../../../../inventory/services/products/ProductService";
import ProductConstant from "../../../../inventory/constants/products/product";
import ProductVariantConstant from "../../../../inventory/constants/products/productVariant";
import FormOpenSaleRegistration from "../../../containers/transactions/OpenSaleRegistration/FormOpen";
import OpenSaleRegistrationAction from "../../../action/transaction/openSalaRegisration";
import StartUp from "../../../../common/components/StartUp";
import history from "../../../../common/router/history";
import Util from "../../../../inventory/utils";
import POSUtil from "../../../utils";
import Component from "../../../../common/components/Component";
import PaymentForm from "../../../containers/transactions/SaleWalkin/Payment";
import VaraintProduct from "../../../containers/transactions/SaleWalkin/variant.product";
import "./index.css";
import ProfileDropdown from "@components/ProfileDropdown/profile.dropdown";
import { ItemImage } from "./item.image";
import OrderHeader from "./order.header";
import EmptyOrder from "./empty.order";
import ReceiptV2 from "./receipt-v2";
import payment from "../../../containers/transactions/SaleWalkin/Payment";

export default class Retail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOutOfStock: true,
      paymentVisible: false,
      modalContent: null,
      expandRowOrderIndex: null,
      selectedCustomer: null,
      expandOrderItemRow: [],
      productTaxList: [],
      categoryList: [
        {
          id: 0,
          name: <this.Translate id="text_all_category" />,
          namekm: <this.Translate id="text_all_category" />,
          namebm: <this.Translate id="text_all_category" />,
        },
      ],
      customerFieldPrice: "price",
      textFullScreen: <this.Translate id="text_full_screen" />,
      iconFullScreen: "icon-full-screen",
      productList: [],
      orderItems: [],
      discountValue: { type: Enum.DISCOUNT_TYPE.PERCENTAGE, value: 0 },
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
      currencyExchange: {},
      exchangeRate: {
        sellRate: 0,
        buyRate: 0,
      }
    };

    this.isSetFocusOnSearchProduct = false;
    this.hasDidUpdate = false;
    this.hadNotYetReceiveProps = true;
    this.hadDidUpdateCheckDevice = false;
    this.productWidth = 0;
    this.service = TransactionService;
    this.timer = null;
    this.orderListRef = null;
    this.orderItemRefs = {};

    this.handleOnGetTaxList = this.handleOnGetTaxList.bind(this);
    this.handleOnSetupDiscount = this.handleOnSetupDiscount.bind(this);
    this.handleOnOpenTaxSetting = this.handleOnOpenTaxSetting.bind(this);
    this.handleCancelTaxSetting = this.handleCancelTaxSetting.bind(this);
    this.handleOnClickAllCategory = this.handleOnClickAllCategory.bind(this);
    this.handleOnCancelAllCategory = this.handleOnCancelAllCategory.bind(this);
    this.handleOnResizeScreen = this.handleOnResizeScreen.bind(this);
    this.handleRemoveDiscount = this.handleRemoveDiscount.bind(this);
    this.handleGetDiscount = this.handleGetDiscount.bind(this);
    this.handleOnResetOrder = this.handleOnResetOrder.bind(this);
    this.handleOnSaveParkReceipt = this.handleOnSaveParkReceipt.bind(this);
    this.handleOnRestoreReceipt = this.handleOnRestoreReceipt.bind(this);
    this.handleOnBlurSearchProduct = this.handleOnBlurSearchProduct.bind(this);
    this.handleOnChangOrderFieldBlur =
      this.handleOnChangOrderFieldBlur.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleOnResizeScreen);
    this.handleSetFullScreen();

    this.props.dispatch(OpenSaleRegistrationAction.showForm());
    this.props.dispatch(OpenSaleRegistrationAction.last());

    this.props.dispatch(ProductTypeAction.fetch(9999));
    this.props.dispatch(ProductAction.reset());
    this.props.dispatch(
      ProductAction.fetch(
        15,
        "",
        "",
        "",
        JSON.stringify({}),
        "",
        this.Util.getLocationId(),
      ),
    );

    window.addEventListener("keydown", (e) => {
      const EndKey = 35,
        F2 = 113,
        F11 = 122,
        F = 70,
        S = 83;
      if (e.key === EndKey) {
        this.handleOnMakePayment();
      } else if (e.key === F2) {
        this.handleOnSetupDiscount();
      } else if (e.key === F11 && e.shiftKey) {
        this.setState({ orderItems: [] });
      } else if (e.key === F && e.ctrlKey) {
        e.preventDefault();
        document.getElementById("searchProduct").focus();
      } else if (e.key === S && e.ctrlKey) {
        e.preventDefault();
        this.handleOnSaveParkReceipt();
      }
    });

    ExchangeRateService.getCurrentExchangeRate().then((response) => {
      const data = response.data;
      if (data) {
        this.setState({ 
          exchangeRate: {
            sellRate: parseFloat(data.sellRate),
            buyRate: parseFloat(data.buyRate),
          },
        });
      }
    });

    if (this.searchItemInput) {
      this.searchItemInput.focus();
    }
  }

  componentDidUpdate() {
    if (this.props.customerAdd.added && this.props.customerAdd.response.data) {
      this.getSelectedCustomer(this.props.customerAdd.response.data);
      this.props.dispatch(
        CustomerAction.reset(CustomerConstant.RESET_ADD_CUSTOMERS),
      );
    }

    if (this.props.open.added) {
      this.props.dispatch(OpenSaleRegistrationAction.last());
      this.props.dispatch(
        OpenSaleRegistrationAction.reset(
          ConstantOpenRegistrationSale.RESET_OPEN_SALE_REGISTRATION,
        ),
      );
    }

    if (this.props.productVariant.fetched) {
      this.handleOnSelectProduct(
        this.state.selectedProduct,
        this.props.productVariant.list,
        false,
      ); // false: cause don't show popup variant product
      this.props.dispatch(
        ProductVariantAction.reset(
          ProductVariantConstant.RESET_PRODUCT_VARIANT,
        ),
      );
    }

    if (this.props.posPay.error) {
      let errorCode = this.Util.getErrorCodeFromState(this.props.posPay.error);
      let messageProductError = this.Util.getErrorMessageFromState(
        this.props.posPay.error,
      );
      messageProductError = JSON.parse(messageProductError);
      const productVariantErrorId = messageProductError.productVariantId;
      const productErrorResult = this.state.orderItems.find(
        (productOrder) =>
          productOrder.productVariantId === productVariantErrorId,
      );

      let message = "Something went wrong";
      if (errorCode === Enum.LOCATION_NOT_FOUND) {
        message = this.CATranslate(
          "error_location_not_found",
          this.props.locale,
        );
      } else if (errorCode === InventoryEnum.PRODUCT_NOT_FOUND) {
        message = this.CATranslate(
          "error_product_not_found",
          this.props.locale,
        );
      } else if (errorCode === InventoryEnum.PRODUCT_QTY_NOT_ENOUGHT) {
        message = this.CATranslate(
          "text_qty_not_enought_for_sale",
          this.props.locale,
        );
        message = `${message} ${messageProductError.quantityInStock}`;
      } else if (errorCode === Enum.SERIAL_NUMBER_REQUIRE) {
        message = this.CATranslate(
          "error_serial_number_require",
          this.props.locale,
        );
      }

      this.Message.error(
        `${productErrorResult.name}/${productErrorResult.variantName} ${message}`,
      );
      this.props.dispatch(
        TransactionAction.reset(Constant.RESET_ERROR_TRANSACTION),
      );
    }

    if (this.props.products.fetched) {
      this.setState({
        productList: this.state.productList.concat(this.props.products.list),
        isRequestLoadingMore: false,
      });
      this.props.dispatch(
        ProductAction.reset(ProductConstant.RESET_PARTIAL_PRODUCT),
      );
    }

    if (
      !this.hasDidUpdate &&
      this.props.openSaleRegistration.fetched &&
      this.props.open.showForm
    ) {
      if (
        !this.isOpenSaleRegistrationClosed() &&
        this.isSetFocusOnSearchProduct
      ) {
        this.isSetFocusOnSearchProduct = true;
      }

      if (this.isOpenSaleRegistrationClosed()) {
        this.setState({
          modalContent: <FormOpenSaleRegistration />,
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
    return (
      Array.isArray(this.props.openSaleRegistration.list) &&
      this.props.openSaleRegistration.list.length > 0
    );
  }

  isOpenSaleRegistrationClosed() {
    if (this.isValidOpenSaleRegistrationList()) {
      return (
        this.props.openSaleRegistration.list[0].status ===
        Enum.OPEN_SALE_REGISTRATION_STATUS.CLOSED
      );
    } else {
      return true; // has no record so set true to be allow to open sale
    }
  }

  appendProductTaxList(orderItems) {
    this.setState({ productTaxList: POSUtil.appendProductTaxList(orderItems) });
  }

  appendFreeProduct(orderProducts, freeByVariantId, freeProducts) {
    const foundOrderProduct = orderProducts.find(
      (value) => value.productVariantId === freeByVariantId,
    );
    if (foundOrderProduct) {
      foundOrderProduct["freeProducts"] = freeProducts;
    }
  }

  appendItemOrder(
    orderItems,
    item,
    variant,
    newPrice,
    discount,
    discountType,
  ) {
    if (!variant) {
      this.Message.error(
        this.CATranslate("error_product_not_found", this.props.locale),
      );
      return;
    }

    const tax = POSUtil.getTaxFromProduct(item);
    const price = isNaN(parseFloat(variant.price)) ? 0 : variant.price;
    const wholePrice = isNaN(parseFloat(variant.wholePrice)) ? 0 : variant.wholePrice;
    const distributePrice = isNaN(parseFloat(variant.distributePrice)) ? 0: variant.distributePrice;

    orderItems.push({
      itemId: item.id,
      itemName: item.name,
      variantId: variant.id,
      variantName: variant.name,
      namekm: item.namekm,
      categoryId: item.categoryId,
      unitId: item.sellUnitId,
      unitName: item.sellUnitName,
      barcode: variant.barcode,
      price,
      newPrice: newPrice ? newPrice : price,
      unitPrice: newPrice ? newPrice : price,
      wholePrice,
      distributePrice,
      quantity: this.state.initialOrderQuantity,
      discount,
      discountType,
      enableDescription: item.enableDescription,
      tax: tax.taxRate / 100,
      taxDescription: tax,
      description: item.name,
      options: [],
      status: this.Enum.ACTIVE,
    });
  }

  async getProductPromotion(productVariantId, orderQuantity, orderAmount) {
    let freeProducts = [];
    let saveAmount = 0;
    let newPrice;
    let discountType;

    try {
      const result = await ProductService.getPromotionByProductVariantId(
        productVariantId,
        orderQuantity,
        orderAmount,
      );

      if (result && result.data) {
        const promotion = result.data;

        if (promotion.type === "advance") {
          if (promotion.then === "GET_ITEMS") {
            freeProducts = promotion.freeProducts.map((freeProduct) => ({
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
              status: 0,
            }));
          } else if (promotion.then === "SAVE_AMOUNT") {
            saveAmount = promotion.savedAmount;
          }

          discountType = promotion.type;
        } else {
          discountType = "basic";
          newPrice = promotion.price;
        }
      }
    } catch (error) {}

    return {
      discountType,
      newPrice,
      freeProducts,
      saveAmount,
    };
  }

  getSummaryTotal() {
    const summaryTotal = POSUtil.getSummaryTotalInOrder(
      this.state.orderItems,
      this.state.customerFieldPrice,
    );
    let discountAmount = 0;
    let discountTypeStr = "";

    const taxAmount = POSUtil.getSummaryTax(
      this.state.productTaxList,
      <this.Translate id="text_no_tax" />,
      this.CATranslate("text_taxes", this.props.locale),
    ).taxTotal;

    if (this.state.discountValue.type === Enum.DISCOUNT_TYPE.PERCENTAGE) {
      discountTypeStr = ` (${this.state.discountValue.value}%)`;
      discountAmount = POSUtil.getDiscountByRate(
        summaryTotal.subTotal + taxAmount,
        this.state.discountValue.value,
      ); // WE DISCOUNT AFTER TAX IF DIFFERENCE FROM EACH ITEM
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
      discountType: this.state.discountValue.type,
    };
  }

  getSelectedCustomer = (selectedCustomer) => {
    this.setState({ selectedCustomer });

    if (selectedCustomer) {
      this.props.form.setFieldsValue({
        searchRecord: `${selectedCustomer.firstName} ${selectedCustomer.lastName} ${selectedCustomer.phoneNumber ? " - " + selectedCustomer.phoneNumber : ""}`,
      });
    } else {
      this.props.form.setFieldsValue({ searchRecord: "" });
    }

    this.setState({
      customerFieldPrice: CRMUtil.getCustomerPriceField(selectedCustomer),
    });
  };

  saveReceipt(key, orderItems = []) {
    localStorage.setItem(
      key,
      JSON.stringify({
        isParkReceipt: key === Enum.PARK_RECEIPT,
        orderItems,
        productTaxList: this.state.productTaxList,
        discountValue: this.state.discountValue,
        isDiscountHasAdded: this.state.isDiscountHasAdded,
      }),
    );
  }

  restoreReceipt(key) {
    let receipt = localStorage.getItem(key);
    if (this.Util.isJsonString(receipt)) {
      receipt = JSON.parse(receipt);
      if (receipt) {
        this.setState({
          ...receipt,
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
        modalContent: <FormOpenSaleRegistration />,
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
      orderItems: [],
      productTaxList: [],
      discountValue: {
        type: Enum.DISCOUNT_TYPE.PERCENTAGE,
        value: 0,
      },
      isDiscountHasAdded: false,
      selectedCustomer: null,
      customerFieldPrice: "price",
    });

    localStorage.removeItem(Enum.CURRENT_RECEIPT);
    this.props.dispatch(
      CustomerAction.reset(CustomerConstant.REQUEST_CUSTOMERS_RESET),
    );
    this.props.form.setFieldsValue({ searchRecord: "" }); //searchRecord: customer search field
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
      filter = JSON.stringify({ categoryId: [value] });

      if (this.state.selectedCategoryIds.includes(value)) {
        filter = "";
        this.setState({ selectedCategoryIds: [] });
      } else {
        this.setState({ selectedCategoryIds: [value] });
      }
    } else {
      this.handleOnClickAllCategory();
      return;
    }

    this.setState({ productList: [] });

    this.props.dispatch(
      ProductAction.fetch(
        10,
        "",
        "",
        "",
        filter,
        "",
        this.Util.getLocationId(),
      ),
    );
  };

  handleCancelVariantProduct = () => {
    this.setState({ modalContent: null });
  };

  handleExpandOrderItem = (expandOrderItem, productOrderIndex, status) => {
    const expandOrderItemRow = `${expandOrderItem.variantId}-${status}`;

    this.handleonSearchFails();

    if (this.state.expandOrderItemRow.includes(expandOrderItemRow)) {
      this.setState({
        expandOrderItemRow: [],
        expandRowOrderIndex: productOrderIndex,
      });
    } else {
      this.setState({
        expandOrderItemRow: [expandOrderItemRow],
        expandRowOrderIndex: productOrderIndex,
      });
    }
  };

  handleOnSelectProduct = async (
    product,
    productVariant,
    isRequestVariantForm = true,
  ) => {
    let freeProducts = [];
    let newPrice = null;
    let {
      orderItems,
      initialOrderDiscount,
      initialOrderDiscountType,
      isDiscountHasAdded,
      discountValue,
    } = this.state;

    // POPUP INPUT CASH REQUIRE IF YOU NOT YET OPEN
    if (this.openFormSaleRegisration()) {
      return;
    }

    let isProductVariant =
      product.productOption === InventoryEnum.PRODUCT_VARIANT;

    if (isProductVariant && isRequestVariantForm) {
      this.setState({
        selectedProduct: product,
        modalContent: (
          <VaraintProduct
            product={product}
            handleCancel={this.handleCancelVariantProduct}
          />
        ),
      });
      return;
    } else if (productVariant && productVariant.length === 1) {
      productVariant = productVariant[0]; // ACCESS TO PRODUCT VARIANT DEFAUTL FOR STARTDARD PRODUCT
      productVariant.name = isProductVariant ? productVariant.name : ""; // Remove product variant name away from label table
      this.setState({ selectedProduct: product });
    }

    // Checking for promotion
    let orderQuantity;
    let orderAmount;
    const foundOrderProduct = orderItems.find(
      (value) => value.variantId === productVariant.id,
    );

    if (foundOrderProduct) {
      orderQuantity = foundOrderProduct.quantity + 1;
      orderAmount = orderQuantity * foundOrderProduct.price;
    } else {
      orderQuantity = 1;
      orderAmount = orderQuantity * productVariant.price;
    }

    const promotion = await this.getProductPromotion(
      productVariant.id,
      orderQuantity,
      orderAmount,
    );
    if (promotion.discountType === "basic") {
      newPrice = promotion.newPrice;
      const saveAmount = productVariant.price - newPrice;

      initialOrderDiscount = POSUtil.getPercentageByValue(
        saveAmount,
        productVariant.price,
      );
      isDiscountHasAdded = true;
      discountValue = { type: Enum.DISCOUNT_TYPE.EACH_ITEM };
    } else if (promotion.discountType === "advance") {
      if (promotion.freeProducts.length) {
        freeProducts = promotion.freeProducts;
      } else {
        discountValue = { type: 0, value: promotion.saveAmount };
        isDiscountHasAdded = true;
      }
    }

    //##End checking promotion

    if (orderItems.length === 0) {
      this.appendItemOrder(
        orderItems,
        product,
        productVariant,
        newPrice,
        initialOrderDiscount,
        initialOrderDiscountType,
      );
    } else {
      let isNotTheSame = true;
      orderItems.forEach((productOrder, productOrderIndex) => {
        if (
          productVariant &&
          productOrder.variantId === productVariant.id &&
          productOrder.status === this.Enum.ACTIVE
        ) {
          isNotTheSame = false;
          orderItems[productOrderIndex]["quantity"] +=
            this.state.initialOrderQuantity;
          orderItems[productOrderIndex]["status"] = this.Enum.ACTIVE;
        }
      });

      if (isNotTheSame)
        this.appendItemOrder(
          orderItems,
          product,
          productVariant,
          null,
          initialOrderDiscount,
          initialOrderDiscountType,
        );
    }

    this.appendProductTaxList(orderItems);
    this.appendFreeProduct(orderItems, productVariant.id, freeProducts);

    this.setState({
      orderItems,
      isDiscountHasAdded,
      discountValue,
    });

    this.saveReceipt(Enum.CURRENT_RECEIPT, orderItems);

    this.props.form.setFieldsValue({ searchProduct: "" });

    // Wait for state update & DOM render
    setTimeout(() => {
      this.scrollToOrderItem(product.id);
    }, 0);
  };

  scrollToOrderItem = (productId) => {
    const container = this.orderListRef;
    const element = this.orderItemRefs[productId];

    if (!container || !element) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    if (
      elementRect.top < containerRect.top ||
      elementRect.bottom > containerRect.bottom
    ) {
      container.scrollTo({
        top: element.offsetTop - 70,
        behavior: "smooth",
      });
    }
  };

  removeProductFromOrderList = (productOrder) => {
    let orderItems = this.state.orderItems.filter(
      (item) => item.variantId !== productOrder.variantId,
    );

    this.setState({
      orderItems,
      isDiscountHasAdded:
        orderItems.length > 0 ? this.state.isDiscountHasAdded : false,
    });

    this.appendProductTaxList(orderItems);

    this.saveReceipt(Enum.CURRENT_RECEIPT, orderItems);
  };

  handleOnRemoveProductFromOrderList = (productOrder) => {
    this.removeProductFromOrderList(productOrder);
  };

  handleOnGetTaxList(productTaxList, taxRate) {
    const orderItems = this.state.orderItems;
    orderItems.forEach((product, productIndex) => {
      if (orderItems[productIndex]["tax"] * 100 === taxRate) {
        //ex: taxRate=0.2
        orderItems[productIndex]["tax"] = 0;
      }
    });
    this.setState({
      productTaxList,
      orderItems,
    });
  }

  handleOnChangOrderFieldBlur() {
    this.setState({ expandRowOrderIndex: null });
  }

  handleonSearchFails() {
    this.isSetFocusOnSearchProduct = false;
  }

  handleOnChangOrderField = async (
    event,
    proderOrderRowIndex,
    field = "quantity",
  ) => {
    this.handleonSearchFails();

    const value = parseFloat(event.target.value);
    let orderProducts = this.state.orderItems;
    const orderProduct = orderProducts[proderOrderRowIndex];

    orderProducts[proderOrderRowIndex][field] = isNaN(value) ? 0 : value;

    if (field === "discount") {
      if (!isNaN(value) && value > 0) {
        this.setState({
          isDiscountHasAdded: true,
          discountValue: {
            type: Enum.DISCOUNT_TYPE.EACH_ITEM,
          },
        });
      } else {
        orderProducts[proderOrderRowIndex]["discount"] = 0;
        const isDiscountHasAdded =
          orderProducts.filter(
            (orderItems) => parseFloat(orderItems.discount) > 0,
          ).length > 0;
        this.setState({
          isDiscountHasAdded,
          discountValue: {
            type: isDiscountHasAdded
              ? Enum.DISCOUNT_TYPE.EACH_ITEM
              : Enum.DISCOUNT_TYPE.PERCENTAGE,
            value: isDiscountHasAdded ? this.state.discountValue.value : 0,
          },
        });
      }
      const price = POSUtil.getTotalAmountAfterDiscount(
        1,
        orderProducts[proderOrderRowIndex][this.state.customerFieldPrice],
        orderProducts[proderOrderRowIndex]["discount"],
      );
      orderProducts[proderOrderRowIndex]["newPrice"] = price;
      this.props.form.setFieldsValue({
        [`price[${proderOrderRowIndex}]`]: price,
      });
    }

    if (field === "newPrice") {
      const newPrice = orderProducts[proderOrderRowIndex]["newPrice"];
      let price =
        orderProducts[proderOrderRowIndex][this.state.customerFieldPrice];
      if (newPrice < price) {
        // DISCOUNT EVENT APPEAR
        const discountAmount = price - newPrice;
        const discount = POSUtil.getDiscountRateByAmount(price, discountAmount);
        orderProducts[proderOrderRowIndex]["discount"] = discount;
        this.props.form.setFieldsValue({
          [`discount[${proderOrderRowIndex}]`]: discount,
        });
        this.setState({
          isDiscountHasAdded: true,
          discountValue: {
            type: Enum.DISCOUNT_TYPE.EACH_ITEM,
          },
        });
      } else {
        this.setState({ isDiscountHasAdded: false });
        orderProducts[proderOrderRowIndex]["discount"] = 0;
        this.props.form.setFieldsValue({
          [`discount[${proderOrderRowIndex}]`]: 0,
        });
      }
    }

    if (field === "description") {
      orderProducts[proderOrderRowIndex]["description"] = event.target.value;
    }

    if (field === "quantity") {
      const orderQuantity = value;
      const orderAmount = orderQuantity * orderProduct.price;
      const promotion = await this.getProductPromotion(
        orderProduct.productVariantId,
        orderQuantity,
        orderAmount,
      );
      if (promotion.discountType === "basic") {
      } else {
        this.appendFreeProduct(
          orderProducts,
          orderProduct.productVariantId,
          promotion.freeProducts,
        );
      }
    }

    this.appendProductTaxList(orderProducts);
    this.setState({ orderItems: orderProducts });
  };

  handleOnAddNewCustomer = () => {
    this.props.dispatch(CustomerAction.showForm());
    this.setState({
      modalContent: <FormCreateCustomer />,
    });
  };

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
        modalContent: (
          <VaraintProduct
            product={product}
            handleCancel={this.handleCancelVariantProduct}
          />
        ),
      });
      return;
    } else {
      this.handleOnSelectProduct(product, productVariants);
    }
  };

  handleOnAutoSelectProductAfterSearchResult = (
    productList,
    isRequestVariantForm,
  ) => {
    if (this.openFormSaleRegisration()) {
      return;
    }

    if (productList.length === 1) {
      this.handleOnSelectProduct(
        productList[0],
        productList[0].productVariants,
        isRequestVariantForm,
      );
      this.props.form.setFieldsValue({ searchProduct: "" });
      this.props.dispatch(
        ProductAction.reset(ProductConstant.SEARCH_PRODUCT_RESET),
      );
    }
  };

  handleCancelMakePayment = () => {
    this.setState({ modalContent: null });
  }

  handleCancelDiscountSetup = () => {
    this.setState({
      modalContent: null,
      isDiscountHasAdded: this.props.form.getFieldValue("discountValue") > 0,
    });
  };

  handleCancelTaxSetting() {
    this.setState({
      modalContent: null,
    });
  }

  handleOnCancelAllCategory() {
    this.setState({
      modalContent: null,
    });
  }

  handleOnMakePayment = () => {
    this.handleonSearchFails();
    if (this.openFormSaleRegisration()) {
      return;
    }

    if (this.state.orderItems.length > 0) {
      const setting = this.Util.getSetting();
      let exchangeRate = 1;
      let currency = setting.currency && setting.currency.trim();
      if (currency === "៛" || currency === "R") {
        exchangeRate =
          this.state.currencyExchange && this.state.currencyExchange.value;
      }

      this.setState({ paymentVisible: true });
      // this.props.dispatch(TransactionAction.showForm());
      // this.setState({
      //   modalContent: (
      //     <PaymentForm
      //       isHasSubCurrency={this.state.isHasSubCurrency}
      //       baseCurrency={this.state.baseCurrency}
      //       subCurrency={this.state.subCurrency}
      //       receiptTemplate={this.state.receiptTemplate}
      //       customer={this.state.selectedCustomer}
      //       customerFieldPrice={this.state.customerFieldPrice}
      //       orderItems={this.state.orderItems}
      //       paymentMethodList={this.props.paymentMethod}
      //       productTaxList={this.state.productTaxList}
      //       exchangeRate={exchangeRate}
      //       handleCancel={this.handleCancelMakePayment}
      //       handleOnResetOrder={this.handleOnResetOrder}
      //       summaryTotal={this.getSummaryTotal()}
      //       summaryTax={POSUtil.getSummaryTax(
      //         this.state.productTaxList,
      //         <this.Translate id="text_no_tax" />,
      //         this.CATranslate("text_taxes", this.props.locale),
      //       )}
      //     />
      //   ),
      // });

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
      discountValue,
    });
  }

  handleOnClickAllCategory() {
    this.setState({
      modalContent: (
        <ProductTypeList
          list={this.props.productsType.list}
          handleCancel={this.handleOnCancelAllCategory}
          form={this.props.form}
          handleOnSelectCategory={this.handleOnSelectCategory}
        />
      ),
    });
  }

  handleOnSetupDiscount() {
    const { summaryTotal } = this.getSummaryTotal();

    this.setState({
      modalContent: (
        <DiscountSetup
          handleCancel={this.handleCancelDiscountSetup}
          form={this.props.form}
          discountValue={this.state.discountValue.value}
          discountType={this.state.discountValue.type}
          summaryTotal={summaryTotal}
          callBack={this.handleGetDiscount}
        />
      ),
      isDiscountHasAdded: true,
    });
    this.isSetFocusOnSearchProduct = false;
  }

  handleOnOpenTaxSetting() {
    this.setState({
      modalContent: (
        <TaxSetting
          handleCancel={this.handleCancelTaxSetting}
          callBack={this.handleOnGetTaxList}
          orderItems={this.state.productTaxList}
          form={this.props.form}
        />
      ),
    });
  }

  handleRemoveDiscount() {
    this.setState({
      isDiscountHasAdded: false,
      discountValue: {
        type: Enum.DISCOUNT_TYPE.PERCENTAGE,
        value: 0,
      },
    });
  }

  handleSetFullScreen = () => {
    const element = document.getElementById("center-container");

    if (element.classList.contains("full-screen")) {
      this.setState({
        iconFullScreen: "icon-full-screen",
        textFullScreen: <this.Translate id="text_full_screen" />,
      });
      element.classList.remove("full-screen");
    } else {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        if (rootElement.classList.contains("mini-sidebar")) {
          rootElement.classList.remove("mini-sidebar");
        }
      }

      this.setState({
        iconFullScreen: "icon-exit-full-screen",
        textFullScreen: <this.Translate id="text_exit_full_screen" />,
      });
      element.classList.add("full-screen");
    }
  };

  handleLinkSaleHistory = () => {
    this.handleSetFullScreen();

    history.push("/transactions/invoice");
  };

  handleLinkCloseShift = () => {
    this.handleSetFullScreen();

    history.push("/transactions/saleregister");
  }

  handleOnSaveParkReceipt() {
    this.saveReceipt(Enum.PARK_RECEIPT, this.state.orderItems);
    this.handleOnResetOrder();
  }

  handleOnRestoreReceipt(key) {
    this.restoreReceipt(key);
    this.setState({ selectedReceiptType: key });
  }

  renderProductList() {
    const countProduct = this.state.productList.length;
    const scrollWidth = 5;
    const categoryPanelHeight = 60;
    const headerHeight = 50;
    const itemPanelHeight =
      window.innerHeight - (headerHeight + categoryPanelHeight);
    const screenWidth = window.innerWidth - 420;
    let numberOfColumn = 5;
    let cuttingPaddingRightScroll = 4;

    if (screenWidth > 1300) {
      numberOfColumn = 6;
      cuttingPaddingRightScroll = 4;
    }

    const numberOfItemRow = Math.ceil(countProduct / numberOfColumn);

    let productWidth = screenWidth / numberOfColumn - cuttingPaddingRightScroll;
    let productHeight = productWidth;

    if (numberOfItemRow * productHeight > itemPanelHeight) {
      // calculate total height of all row of item list
      productWidth = productHeight = productWidth - scrollWidth / 5; // we take the whole width of scroll and provide the left for item list
    }

    const imageHeight = productWidth - 70;
    this.productWidth = productWidth;

    return countProduct > 0 ? (
      this.state.productList.map((product, index) => (
        <div className="product-box" key={index}>
          <div
            onClick={() =>
              this.handleOnSelectProduct(product, product.productVariants)
            }
            className="product"
          >
            <ItemImage
              src={
                new CommonUtil().getImageUrl(product?.image) ||
                product?.imageUrl
              }
              name={Util.getProductNameV2(product)}
              height={imageHeight}
            />
            <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
              <div
                style={{
                  maxHeight: 26,
                  overflow: "hidden",
                  wordBreak: "break-all",
                  textAlign: "left",
                  paddingLeft: 10,
                }}
              >
                <div className="name">{Util.getProductNameV2(product)}</div>
              </div>
            </div>
            <Divider style={{ margin: "5px 0" }} />
            <div className="price">
              {this.formatCurrency(Util.getProductPrice(product))}
            </div>
          </div>
        </div>
      ))
    ) : (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "0 auto",
          height: "100%",
        }}
      >
        <img
          src={`${this.Util.getGeneralImage("storeVein/no-product-found.png").url}`}
          style={{ width: 150 }}
          alt=""
        />
      </div>
    );
  }

  renderSaveAndPayButton = () => (
    <div className="payment-action">
      {/* <this.Button type="info" className="mg-right" onClick={this.handleOnSaveParkReceipt}>
        <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />
      </this.Button> */}
      <Button type="primary" onClick={this.handleOnMakePayment}>
        <span className="icon-checked icon-padding-right"></span>
        <this.Translate id="text_pay" />
        <span style={{ textTransform: "capitalize", fontSize: "12pt" }}>
          (End)
        </span>
      </Button>
    </div>
  );

  saleOrderHeader = () => {
    let parkReceipt = localStorage.getItem(Enum.PARK_RECEIPT);
    if (parkReceipt) {
      parkReceipt = JSON.parse(parkReceipt);
    }
    return (
      <this.Row className="wrap-receipt-type">
        <this.Col md="12" className="receipt-type">
          <div
            className={`pull-left current-receipt ${this.state.selectedReceiptType === Enum.CURRENT_RECEIPT ? "selected" : ""}`}
            onClick={() => this.handleOnRestoreReceipt(Enum.CURRENT_RECEIPT)}
          >
            <span className="icon-receipt icon-padding-right"></span>
            <this.Translate id="current_receipt_type" />
          </div>
          {localStorage.getItem(Enum.PARK_RECEIPT) ? (
            <div
              className={`pull-left park-receipt ${this.state.selectedReceiptType === Enum.PARK_RECEIPT ? "selected" : ""}`}
              onClick={() => this.handleOnRestoreReceipt(Enum.PARK_RECEIPT)}
            >
              <span className="icon-reports icon-padding-right"></span>
              <this.Translate id="park_receipt_type" />(
              {_.sumBy(parkReceipt["orderItems"], "quantity")} Items)
            </div>
          ) : (
            ""
          )}
          <div
            className="pull-left park-receipt"
            onClick={this.handleLinkCloseShift}
          >
            <span className="icon-currency icon-padding-right"></span>
            <this.Translate id="text_close_shift" />
          </div>
        </this.Col>
      </this.Row>
    );
  };

  fieldNotation = (productOrderIndex, productOrder) => (
    <div className="detail-row-2">
      <this.InputText
        name={`description[${productOrderIndex}]`}
        label={
          productOrder.enableDescription ? (
            <this.Translate id="text_serial_or_imei" />
          ) : (
            <this.Translate id="text_notation" />
          )
        }
        // data={productOrder.description}
        className="ca-input-v1"
        handleKeyUp={(event) =>
          this.handleOnChangOrderField(event, productOrderIndex, "description")
        }
        placeholder={this.CATranslate(
          productOrder.enableDescription
            ? "text_search_serial_no"
            : "text_add_notation",
          this.props.locale,
        )}
        form={this.props.form}
      />
    </div>
  );

  render() {
    if (isMobile) {
      return (
        <div className="unavailable-mobile-layout">
          <div className="unavailable-mobile">
            <this.Translate id="text_unavailable_mobile_layout" />
            <br />
            <this.Translate id="text_unavailable_mobile_download_app" /> <br />
            {isAndroid ? (
              <a href="www">Play Store</a>
            ) : isIOS ? (
              <a href="www">App Store</a>
            ) : (
              ""
            )}
          </div>
        </div>
      );
    }

    const { summaryTotal, discountAmount, taxAmount, discountTypeStr } =
      this.getSummaryTotal();

    const { taxTitle, taxTotal, countTax } = POSUtil.getSummaryTax(
      this.state.productTaxList,
      <this.Translate id="text_no_tax" />,
      this.CATranslate("text_taxes", this.props.locale),
    );

    let categoryList = this.props.productsType.list;
    if (categoryList.length > 4) {
      categoryList = this.state.categoryList.concat(categoryList);
    }

    const setting = this.Util.getSetting();
    let currency = setting.currency && setting.currency.trim();
    let exchangeRate = 1;
    if (currency === "៛" || currency === "R") {
      currency = "៛";
      exchangeRate =
        this.state.currencyExchange && this.state.currencyExchange.value;
    }

    return (
      <Row className="main-layout main-store-account">
        {/* <ReceiptV2 /> */}
        <div id="receiptLogoPreLoading" style={{ display: "none" }}>
          <img style={{ width: 100 }} src={this.Util.getProductImage(this.state.receiptTemplate ? this.state.receiptTemplate.logo : "", "general").url} alt="" />
        </div>
        <div className="top-header">
          <div className="search-container">
            <Input
              ref={(input) => {
                this.searchItemInput = input;
              }}
              size="large"
              placeholder={"Scan barcode or search item…"}
              // onChange={this.onSearch}
              prefix={<Icon type="search" />}
              style={{ width: 350, marginBottom: 0 }}
              allowClear={true}
              className="search-item-input"
            />
          </div>
          <div className="action-container">
            <Button type="primary" shape="round" icon="plus-circle" size={"large"} onClick={() => this.setState({ orderItems: [] })}>
              New Sale
            </Button>
            <Button type="default" shape="circle" icon="printer" size={"large"} style={{ borderRadius: "50%" }} />
            <Button type="default" shape="circle" icon="setting" size={"large"} style={{ borderRadius: "50%" }} />
            <ProfileDropdown />
          </div>
        </div>
        <div id="retail-sale">
          <div id="left-block">
            {/* {this.saleOrderHeader()} */}

            {/* <this.Row className="wrap-category">
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
          </this.Row> */}
            <div className="wrap-product-box-list" id="wrap-product-box-list">
              {this.props.products.fetching && !this.state.isRequestLoadingMore ? <StartUp /> : this.renderProductList()}
            </div>
          </div>
          <div id="right-block">
            {/* id="search-information" */}
            {/* <this.Col md="12" id="wrap-cashier">
                <div>
                  <this.Translate id="text_cashier" />:
                </div>
                <div className="current-cashier">
                  {this.Util.getCurrentUser().fullName}
                </div>
              </this.Col> */}
            {/* {this.Util.getClientCustomerCreditStatus() ===
              SettingEnum.CUSTOMER_CREDIT_STATUS.ENABLE ? (
                <CustomerDropDownSearch
                  customers={this.props.customers}
                  locale={this.props.locale}
                  form={this.props.form}
                  dispatch={this.props.dispatch}
                  callBack={this.getSelectedCustomer}
                  disabledCustomer={this.state.disabledCustomer}
                  handleOnAddNewCustomer={this.handleOnAddNewCustomer}
                />
              ) : (
                ""
              )} */}

            {/* <ProductDropDownSearch
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
              dispatch={this.props.dispatch} /> */}
            <OrderHeader totalQty={this.state.orderItems.reduce((acc, item) => acc + item.quantity, 0)} />
            <div className="product-order-list" ref={(el) => (this.orderListRef = el)}>
              {this.state.orderItems.length === 0 && <EmptyOrder />}
              {this.state.orderItems.map((productOrder, productOrderIndex) => {
                const flashClass = this.state.selectedProduct && productOrder.itemId === this.state.selectedProduct.id ? "flash-highlight" : "";
                return (
                  <React.Fragment key={productOrderIndex}>
                    {/* Main Order Product */}
                    <div className={`product-order-item ${this.state.expandOrderItemRow.includes(`${productOrder.variantId}-${productOrder.status}`) ? "expanded" : ""} ${flashClass}`} ref={(el) => (this.orderItemRefs[productOrder.itemId] = el)}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div className="item" onClick={() => this.handleExpandOrderItem(productOrder, productOrderIndex, productOrder.status)}>
                          <div className={`epxand-icon ${this.state.expandOrderItemRow.includes(`${productOrder.variantId}-${productOrder.status}`) ? "icon-move-down" : "icon-next"}`}></div>
                          <div className="description">
                            <div
                              style={{
                                maxHeight: "20px",
                                maxWidth: "160px",
                                overflow: "hidden",
                                wordBreak: "break-all",
                              }}
                            >
                              <div className="name">{productOrder.itemName}</div>
                            </div>
                            {productOrder.variantName ? (
                              <div className="barcode-number variant-name" style={{ marginTop: 5 }}>
                                {productOrder.variantName}
                              </div>
                            ) : (
                              ""
                            )}

                            <div className="barcode-number" style={{ marginTop: 5 }}>
                              {productOrder.barcode}
                            </div>
                          </div>
                          <div className="quantity">{`${productOrder.quantity}x`}</div>
                          <div className="price">
                            {productOrder.discount > 0 ? (
                              <div className="after-discount-price">{this.formatCurrency(POSUtil.getTotalAmountAfterDiscount(productOrder.quantity, productOrder[this.state.customerFieldPrice] * exchangeRate, productOrder.discount), "", false)}</div>
                            ) : (
                              ""
                            )}
                            <div className={`main-price ${productOrder.discount > 0 ? "strike-price" : ""}`}>{this.formatCurrency(POSUtil.getTotalAmount(productOrder.quantity, productOrder[this.state.customerFieldPrice] * exchangeRate))}</div>
                          </div>
                        </div>
                        {productOrder.status === this.Enum.ACTIVE && (
                          <div className="delete" onClick={() => this.handleOnRemoveProductFromOrderList(productOrder, productOrderIndex)}>
                            <Icon type="delete" size="small" />
                          </div>
                        )}
                      </div>
                      <div className="product-order-item-detail">
                        <div className="detail-row-1">
                          <this.InputNumber
                            name={`quantity[${productOrderIndex}]`}
                            label={productOrder.status === this.Enum.ACTIVE ? <this.Translate id="text_quantity" /> : <this.Translate id="text_return_quantity" />}
                            data={productOrder.quantity}
                            handleKeyUp={(event) => this.handleOnChangOrderField(event, productOrderIndex, "quantity")}
                            handleOnBlur={this.handleOnChangOrderFieldBlur}
                            className="ca-input-v1 order-quantity"
                            min={0}
                            isHideTool={true}
                            precision={1}
                            isAutoSelect={true}
                            isAutoFocus={true}
                            didUpdateMakeAutoFocus={this.state.expandRowOrderIndex === productOrderIndex}
                            form={this.props.form}
                          />
                          <this.InputNumber
                            name={`price[${productOrderIndex}]`}
                            label={<this.Translate id="text_unit_price" />}
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
                            label={
                              <span>
                                <this.Translate id="text_discount" /> (%)
                              </span>
                            }
                            data={productOrder.discount}
                            handleKeyUp={(event) => this.handleOnChangOrderField(event, productOrderIndex, "discount")}
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
                    {Array.isArray(productOrder.freeProducts) &&
                      productOrder.freeProducts.map((freeProductOrder, freeProductIndex) => (
                        <div className="product-order-item" key={freeProductIndex}>
                          <img src={require("../../../../common/components/layout/styles/images/free.png")} alt="Free Product" style={{ position: "absolute", top: 15, left: 5 }} />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div className="item">
                              <div className="epxand-icon icon-next"></div>
                              <div className="description">
                                <div
                                  style={{
                                    maxHeight: "20px",
                                    maxWidth: "160px",
                                    overflow: "hidden",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  <div className="name">{freeProductOrder.name}</div>
                                </div>
                                {freeProductOrder.variantName ? (
                                  <div className="barcode-number variant-name" style={{ marginTop: 5 }}>
                                    {freeProductOrder.variantName}
                                  </div>
                                ) : (
                                  ""
                                )}

                                <div className="barcode-number" style={{ marginTop: 5 }}>
                                  {freeProductOrder.barcode}
                                </div>
                              </div>
                              <div className="quantity">{`${freeProductOrder.quantity}x`}</div>
                              <div className="price">
                                <div className="main-price">{this.formatCurrency(0)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </React.Fragment>
                );
              })}
            </div>
            <div id="wrap-payment">
              <div className="payment">
                <div className="text-left">
                  {/* {
                  !this.state.isDiscountHasAdded && summaryTotal.discount <= 0 ?
                    <div className="sub-total add-discount" style={{justifyContent: "flex-end"}} onClick={this.handleOnSetupDiscount}>
                      <span className="icon-add icon-padding-right"></span> <span><this.Translate id="text_add"/> <this.Translate id="text_discount"/></span><span style={{fontSize: "10pt"}}>(F2)</span>
                    </div>
                    :
                    ""
                } */}

                  {/* SUB TOTAL ROW */}
                  <div className="sub-total">
                    <div className="sub-total-title">
                      <this.Translate id="text_sub_total" />
                    </div>
                    <div className="sub-total-value">{this.formatCurrency(summaryTotal.subTotalAfterDiscount * exchangeRate)}</div>
                  </div>
                  <div className="sub-total">
                    <div className="sub-total-title" style={{ fontWeight: 600 }}>
                      <this.Translate id="text_discount" />
                    </div>
                    <div className="sub-total-value" style={{ color: "#e85757" }}>
                      -{this.formatCurrency(discountAmount * exchangeRate)}
                    </div>
                  </div>
                  {/* END SUB TOTAL ROW */}

                  {/* TAX ROW */}
                  {taxTotal > 0 && (
                    <div className="sub-total">
                      <div className="sub-total-title" onClick={countTax > 0 ? this.handleOnOpenTaxSetting : null}>
                        <span className={`${countTax > 0 ? "ca-link" : ""}`}>
                          <this.Translate id="text_tax" />
                        </span>{" "}
                        {taxTitle}
                      </div>
                      <div className="sub-total-value">{this.formatCurrency(taxTotal * exchangeRate)}</div>
                    </div>
                  )}
                  {/*END TAX ROW */}

                  {/* DISCOUNT ROW */}
                  {this.state.isDiscountHasAdded && summaryTotal.discount <= 0 ? (
                    <div className="sub-total">
                      <div className="ca-link sub-total-title" style={{ fontWeight: 600, position: "relative" }} onClick={this.handleOnSetupDiscount}>
                        <div className="delete remove-discount" onClick={this.handleRemoveDiscount}>
                          <span className="icon-delete"></span>
                        </div>
                        <this.Translate id="text_discount" />
                        {discountTypeStr}
                      </div>
                      <div className="sub-total-value" style={{ position: "relative", color: "#e85757" }}>
                        {this.formatCurrency(discountAmount * exchangeRate)}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {/*END DISCOUNT ROW */}

                  <div
                    className="sub-total"
                    style={{
                      borderTop: "1px dashed #d1d5db",
                      marginTop: 10,
                      paddingTop: 10,
                    }}
                  >
                    <div className="sub-total-title" style={{ fontSize: "16pt", fontWeight: 600 }}>
                      <this.Translate id="text_total" />
                    </div>
                    <div className="sub-total-value" style={{ fontSize: "16pt", fontWeight: 600, color: "#00897B" }}>
                      {this.Util.formatCurrency(POSUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount) * this.state.exchangeRate.sellRate, "៛", 1, 0)}
                    </div>
                  </div>

                  <div className="sub-total">
                    <div className="sub-total-title" style={{ visibility: "hidden" }}>
                      <this.Translate id="text_total" />
                    </div>
                    <div
                      className="sub-total-value"
                      style={{
                        fontSize: "16pt",
                        fontWeight: 600,
                      }}
                    >
                      {this.formatCurrency(POSUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount), "$", 0)}
                    </div>
                  </div>
                </div>
              </div>
              {this.renderSaveAndPayButton()}
            </div>
          </div>
        </div>
        {this.state.modalContent}
        <PaymentForm
          handleCancel={() => this.setState({ paymentVisible: false })}
          paymentVisible={this.state.paymentVisible}
          isHasSubCurrency={this.state.isHasSubCurrency}
          baseCurrency={this.state.baseCurrency}
          subCurrency={this.state.subCurrency}
          receiptTemplate={this.state.receiptTemplate}
          customer={this.state.selectedCustomer}
          customerFieldPrice={this.state.customerFieldPrice}
          orderItems={this.state.orderItems}
          paymentMethodList={this.props.paymentMethod}
          productTaxList={this.state.productTaxList}
          exchangeRate={this.state.exchangeRate}
          handleOnResetOrder={this.handleOnResetOrder}
          summaryTotal={this.getSummaryTotal()}
          summaryTax={POSUtil.getSummaryTax(this.state.productTaxList, <this.Translate id="text_no_tax" />, this.CATranslate("text_taxes", this.props.locale))}
        />
      </Row>
    );
  }
}
