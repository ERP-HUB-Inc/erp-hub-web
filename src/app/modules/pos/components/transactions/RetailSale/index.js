import React from "react";
import VaraintProduct from "./VaraintProduct";
import DiscountSetup from "./DiscountSetup";
import TaxSetting from "./TaxSetting";
import Enum from "../../../enums";
import InventoryEnum from "../../../../inventory/enums";
import TransactionAction from "../../../action/transaction/transaction";
import PaymentMethodAction from "../../../../pos/action/settings/paymentMethod";
import FormCreateCustomer from "../../../../crm/containers/customers/Customer/FormCreate";
import CustomerAction from "../../../../crm/actions/customers/customer";
import ProductTypeAction from "../../../../inventory/actions/products/productsType";
import ConstantOpenRegistrationSale from "../../../constants/transactions/openSaleRegisration";
import ProductAction from "../../../../inventory/actions/products/product";
import ProductConstant from "../../../../inventory/constants/products/product";
import CustomerDropDownSearch from "../../../../crm/components/customers/Customer/DropDownSearch";
import ProductDropDownSearch from "../../../../inventory/components/products/Product/DropDownSearch";
import FormOpenSaleRegistration from "../../../containers/transactions/OpenSaleRegistration/FormOpen";
import OpenSaleRegistrationAction from "../../../action/transaction/openSalaRegisration";
import Util from "../../../../inventory/utils";
import POSUtil from "../../../utils";
import Component from "../../../../common/components/Component";
import PaymentForm from "../../../containers/transactions/SaleWalkin/Payment";
import "./index.css";
export default class Retail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVariantProduct: false,
      variantProductList: [],
      modalContent: null,
      expandOrderItemRow: [],
      productTaxList: [],
      categoryList: [
        {id: 0, name: <this.Translate id="text_all_category"/>},
      ],
      productOrderList: [],
      discountValue: {type: Enum.DISCOUNT_TYPE.PERCENTAGE, value: 0},
      initialOrderQuantity: 1,
      initialOrderDiscount: 0,
      initialOrderDiscountType: Enum.DISCOUNT_TYPE.PERCENTAGE,
      initialTax: 0,
      isDiscountHasAdded: false,
      selectedCategoryIds: [0],
      selectedReceiptType: Enum.CURRENT_RECEIPT,
      textFullScreen: <this.Translate id="text_full_screen" />,
      iconFullScreen: "icon-full-screen"
    };
    this.hasDidUpdate = false;

    this.handleOnSelectCategory = this.handleOnSelectCategory.bind(this);
    this.handleOnSelectProduct = this.handleOnSelectProduct.bind(this);
    this.handleCancelVariant = this.handleCancelVariant.bind(this);
    this.handleOnAddNewCustomer = this.handleOnAddNewCustomer.bind(this);
    this.handleOnSelectProductSearchList = this.handleOnSelectProductSearchList.bind(this);
    this.handleExpandOrderItem = this.handleExpandOrderItem.bind(this);
    this.handleSetFullScreen = this.handleSetFullScreen.bind(this);
    this.handleOnMakePayment = this.handleOnMakePayment.bind(this);
    this.handleCancelMakePayment = this.handleCancelMakePayment.bind(this);
    this.handleOnGetTaxList = this.handleOnGetTaxList.bind(this);
    this.handleOnRemoveProductFromOrderList = this.handleOnRemoveProductFromOrderList.bind(this);
    this.handleOnChangOrderField = this.handleOnChangOrderField.bind(this);
    this.handleOnSetupDiscount = this.handleOnSetupDiscount.bind(this);
    this.handleOnOpenTaxSetting = this.handleOnOpenTaxSetting.bind(this);
    this.handleCancelTaxSetting = this.handleCancelTaxSetting.bind(this);
    this.handleCancelDiscountSetup = this.handleCancelDiscountSetup.bind(this);
    this.handleOnResizeScreen = this.handleOnResizeScreen.bind(this);
    this.handleRemoveDiscount = this.handleRemoveDiscount.bind(this);
    this.handleGetDiscount = this.handleGetDiscount.bind(this);
    this.handleOnResetOrder = this.handleOnResetOrder.bind(this);
    this.handleOnSaveParkReceipt = this.handleOnSaveParkReceipt.bind(this);
    this.handleOnRestoreReceipt = this.handleOnRestoreReceipt.bind(this);
    this.handleOnAutoSelectProductAfterSearchResult = this.handleOnAutoSelectProductAfterSearchResult.bind(this);
  }

  componentDidUpdate() {
    if (!this.hasDidUpdate &&
      this.props.openSaleRegistration.fetched &&
      this.props.open.showForm) {
      if (this.isOpenSaleRegistrationClosed()) {
        this.setState({
          modalContent: <FormOpenSaleRegistration/>
        });
      }
      this.hasDidUpdate = true;
    }

    if (this.props.open.added) {
      this.props.dispatch(OpenSaleRegistrationAction.last());
      this.props.dispatch(OpenSaleRegistrationAction.reset(ConstantOpenRegistrationSale.RESET_OPEN_SALE_REGISTRATION));
    }
  }

  componentDidMount() {
    this.props.dispatch(ProductTypeAction.fetch(18));
    this.props.dispatch(ProductAction.fetch(25));
    this.props.dispatch(PaymentMethodAction.fetch(100, "", "", "", JSON.stringify({isEnableOnPOS: [Enum.PAYMENT_METHOD_AVIALE_ON_POS]})));
    window.addEventListener("resize", this.handleOnResizeScreen);
    this.props.dispatch(OpenSaleRegistrationAction.showForm());
    this.props.dispatch(OpenSaleRegistrationAction.last());
    // RESTORE CURRENT RECEIPT
    //this.restoreReceipt(Enum.CURRENT_RECEIPT);
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
  

  getTaxDescription(tax) {
    let name = "";
    if ("tax" in tax && tax["tax"]) {
      name = tax["tax"].name;
    }
    return name;
  }

  getTaxFromProduct(product) {
    let taxId = 0;
    let taxRate = 0;
    let taxName = "";
    if (product["productTaxes"] && product["productTaxes"].length > 0) {
      taxId = product["productTaxes"][0].id;
      taxRate = product["productTaxes"][0].rate;
      taxName = this.getTaxDescription(product["productTaxes"][0]);
    }
    return {
      id: taxId,
      taxRate,
      taxName
    };
  }

  appendProductTaxList(productOrderList) {
    this.setState({productTaxList: POSUtil.appendProductTaxList(productOrderList)});
  }

  appendProductOrder(targetList, product) {
    const tax = POSUtil.getTaxFromProduct(product);
    targetList.push({
      productId: product.id,
      name: Util.getProductName(product),
      barcode: product.barcode,
      price: product.price,
      newPrice: product.price,
      quantity: this.state.initialOrderQuantity,
      discount: this.state.initialOrderDiscount,
      discountType: this.state.initialOrderDiscountType,
      tax: tax.taxRate/100,
      taxDescription: tax,
      description: "",
      options: []
    });
  }

  getSummaryTotal() {
    const summaryTotal = POSUtil.getSummaryTotalInOrder(this.state.productOrderList);
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

  saveReceipt(key) {
    localStorage.setItem(key, JSON.stringify({
      productOrderList: this.state.productOrderList,
      productTaxList: this.state.productTaxList,
      discountValue: this.state.discountValue,
      isDiscountHasAdded: this.state.isDiscountHasAdded
    }));
  }

  restoreReceipt(key) {
    let receipt = localStorage.getItem(key);
    if (this.Util.isJsonString(receipt)) {
      receipt = JSON.parse(receipt);
      this.setState({
        ...receipt
      });
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

  handleOnResetOrder() {
    this.setState({
      expandOrderItemRow: [],
      productOrderList: [],
      productTaxList: [],
      discountValue: {type: Enum.DISCOUNT_TYPE.PERCENTAGE, value: 0},
      isDiscountHasAdded: false,
    });

    localStorage.removeItem(Enum.CURRENT_RECEIPT);
  }

  handleOnResizeScreen() {
    // TO DO: Disable temparary on modal popup Discount and Tax On Sale POS
    // this.setState({modalContent: null});
  }

  handleOnSelectCategory(value) {
    if (this.openFormSaleRegisration()) {
      return;
    }

    let filter = "";
    if (value !== 0) {
      filter = JSON.stringify({productTypeId: [value]});
    }

    this.props.dispatch(ProductAction.fetch(25, "", "", "", filter));
    this.setState({selectedCategoryIds: [value]});
  }

  handleCancelVariant() {
    this.setState({
      showVariantProduct: false,
      variantProductList: []
    });
  }

  handleExpandOrderItem(expandOrderItemRow, productOrderIndex) {
    if (this.state.expandOrderItemRow.includes(expandOrderItemRow)) {
      this.setState({expandOrderItemRow: []});
    } else {
      this.setState({expandOrderItemRow: [expandOrderItemRow]});
    }
  }

  handleOnSelectProduct(product) {

    if (this.openFormSaleRegisration()) {
      return;
    }

    if (product.quantity <= 0) {
      this.Message.error(`${Util.getProductName(product)}: ${this.CATranslate("text_out_of_stock", this.props.locale)}`);
      return;
    }

    const existingProductOrderList = this.state.productOrderList;
    if (existingProductOrderList.length === 0) {
      this.appendProductOrder(existingProductOrderList, product);
    } else {
      let isNotTheSame = true;
      existingProductOrderList.forEach((productOrder, productOrderIndex) => {
        if (productOrder.productId === product.id) {
          isNotTheSame = false;
          existingProductOrderList[productOrderIndex]["quantity"] += this.state.initialOrderQuantity;
        }
      });
      if (isNotTheSame) {
        this.appendProductOrder(existingProductOrderList, product);
      }
    }

    this.appendProductTaxList(existingProductOrderList);

    this.setState({productOrderList: existingProductOrderList});

    this.saveReceipt(Enum.CURRENT_RECEIPT);
    // if (value.productVariantToProduct.length > 0) {
    //   this.setState({
    //     showVariantProduct: true,
    //     variantProductList: value.productVariantToProduct
    //   });
    // } else {
      
    // }
  }

  handleOnRemoveProductFromOrderList(product) {
    const productOrderList = this.state.productOrderList.filter(productOrder => productOrder.productId !== product.productId);
    this.setState({
      productOrderList,
      isDiscountHasAdded: productOrderList.length > 0 ? this.state.isDiscountHasAdded : false
    });

    this.appendProductTaxList(productOrderList);

    this.saveReceipt(Enum.CURRENT_RECEIPT);
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

  handleOnChangOrderField(event, proderOrderRowIndex, field = "quantity") {
    const value = parseFloat(event.target.value);
    let existingProductOrderList = this.state.productOrderList;
    existingProductOrderList[proderOrderRowIndex][field] = isNaN(value) ? 0 : value;

    if (field === "discount") {
      if (!isNaN(value) && value > 0) {
        this.setState({
          isDiscountHasAdded: true,
          discountValue: {
            type: Enum.DISCOUNT_TYPE.EACH_ITEM
          }
        });
      } else {
        existingProductOrderList[proderOrderRowIndex]["discount"] = 0;
        this.setState({
          isDiscountHasAdded: false,
          discountValue: {
            type: Enum.DISCOUNT_TYPE.PERCENTAGE,
            value: 0
          }
        });
      }
      const price = POSUtil.getTotalAmountAfterDiscount(1, existingProductOrderList[proderOrderRowIndex]["price"], existingProductOrderList[proderOrderRowIndex]["discount"]);
      existingProductOrderList[proderOrderRowIndex]["newPrice"] = price;
      this.props.form.setFieldsValue({[`price[${proderOrderRowIndex}]`]: price});
    }

    if (field === "newPrice") {
      const newPrice = existingProductOrderList[proderOrderRowIndex]["newPrice"];
      let price = existingProductOrderList[proderOrderRowIndex]["price"];
      if (newPrice < price) { // DISCOUNT EVENT APPEAR
        const discountAmount = price - newPrice;
        const discount = POSUtil.getDiscountRateByAmount(price, discountAmount);
        existingProductOrderList[proderOrderRowIndex]["discount"] = discount;
        this.props.form.setFieldsValue({[`discount[${proderOrderRowIndex}]`]: discount});
        this.setState({
          isDiscountHasAdded: true,
          discountValue: {
            type: Enum.DISCOUNT_TYPE.EACH_ITEM
          }
        });
      } else {
        this.setState({
          isDiscountHasAdded: false
        });
        existingProductOrderList[proderOrderRowIndex]["discount"] = 0;
        this.props.form.setFieldsValue({[`discount[${proderOrderRowIndex}]`]: 0});
      }
    }

    // UPDATE SUMMARY TAX LIST
    this.appendProductTaxList(existingProductOrderList);

    this.setState({
      productOrderList: existingProductOrderList,
    });
  }

  handleOnAddNewCustomer() {
    this.props.dispatch(CustomerAction.showForm());
    this.setState({
      modalContent: <FormCreateCustomer/>
    });
  }

  handleOnSelectProductSearchList(value) {
    if (this.openFormSaleRegisration()) {
      return;
    }
    
    if (value.productVariantToProduct.length > 0) {
      this.setState({
        showVariantProduct: true,
        variantProductList: this.state.productList[0].options
      });
    } else {
      this.handleOnSelectProduct(value);
    }
  }

  handleOnAutoSelectProductAfterSearchResult(productList) {
    if (this.openFormSaleRegisration()) {
      return;
    }

    if (productList.length === 1) {
      this.handleOnSelectProduct(productList[0]);
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

  handleOnMakePayment() {
    if (this.openFormSaleRegisration()) {
      return;
    }
    
    if (this.state.productOrderList.length > 0) {
      this.props.dispatch(TransactionAction.showForm());
      this.setState({modalContent: <PaymentForm
        handleCancel={this.handleCancelMakePayment}
        productOrderList={this.state.productOrderList}
        paymentMethodList={this.props.paymentMethod}
        productTaxList={this.state.productTaxList}
        handleOnResetOrder={this.handleOnResetOrder}
        summaryTotal={this.getSummaryTotal()}
        summaryTax={POSUtil.getSummaryTax(this.state.productTaxList, <this.Translate id="text_no_tax"/>, this.CATranslate("text_taxes", this.props.locale))}/>
      });
    } else {
      // TO DO: alert message can make payment with empty list
    }
  }
  
  handleGetDiscount(discountValue) {
    this.setState({
      discountValue
    });
  }

  handleOnSetupDiscount() {
    this.setState({
      modalContent: <DiscountSetup
        handleCancel={this.handleCancelDiscountSetup}
        form={this.props.form}
        discountValue={this.state.discountValue.value}
        discountType={this.state.discountValue.type}
        callBack={this.handleGetDiscount} />,
      isDiscountHasAdded: true
    });
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

  handleSetFullScreen() {
    const element = document.getElementById("center-container");
    const body = document.getElementsByTagName("BODY")[0];
    if (element.classList.contains("full-screen")) {
      this.setState({
        iconFullScreen: "icon-full-screen",
        textFullScreen: <this.Translate id="text_full_screen" />
      });
      element.classList.remove("full-screen");
    } else {
      this.setState({
        iconFullScreen: "icon-exit-full-screen",
        textFullScreen: <this.Translate id="text_exit_full_screen" />
      });
      element.classList.add("full-screen");
    }
    this.Util.toggleFullScreen(body);
  }

  handleOnSaveParkReceipt() {
    this.saveReceipt(Enum.PARK_RECEIPT);
    this.handleOnResetOrder();
  }

  handleOnRestoreReceipt(key) {
    this.restoreReceipt(key);
    this.setState({selectedReceiptType: key});
  }

  renderProductList() {
    return (
      this.props.products.list.length > 0 ?
        this.props.products.list.map((product, index) =>
          <this.Col md="3" className="product-box" key={index}>
            <div onClick={() => this.handleOnSelectProduct(product)} className="product">
              <div className="image">
                <this.Image url={this.Util.getProductImage(product.image).url}/>
              </div>
              {
                product.quantity <= 0 && product.type !== InventoryEnum.SERIAL_TYPE.NON_INVENTORY ?
                  <div className="out-of-stock"><this.Translate id="text_out_of_stock" /></div>
                  : 
                  ""
              }

              <div className="name">
                {
                  product.productDescriptions.length > 0 ?
                    product.productDescriptions[0].name
                    :
                    ""
                }
              </div>
              <div className="price">{this.formatCurrency(product.price)}</div>
            </div>
          </this.Col>
        )
        :
        <div style={{color: "#9A9A9A", margin: "0 auto"}}>
          <this.Translate id="placeholder_product_list_search" />
        </div>
    );
  }

  render() {
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

    return (
      <this.Row className="main-layout main-store-account" id="retail-sale">
        <this.Col md="8" id="left-block">
          <this.Row className="wrap-receipt-type">
            <this.Col md="12" className="receipt-type">
              <div className={`pull-left current-receipt ${this.state.selectedReceiptType === Enum.CURRENT_RECEIPT ? "selected" : ""}`} onClick={() => this.handleOnRestoreReceipt(Enum.CURRENT_RECEIPT)}>
                <span className="icon-receipt icon-padding-right"></span><this.Translate id="current_receipt_type"/>
              </div>
              {
                localStorage.getItem(Enum.PARK_RECEIPT) ?
                  <div className={`pull-left park-receipt ${this.state.selectedReceiptType === Enum.PARK_RECEIPT ? "selected" : ""}`} onClick={() => this.handleOnRestoreReceipt(Enum.PARK_RECEIPT)}>
                    <span className="icon-reports icon-padding-right"></span><this.Translate id="park_receipt_type"/>
                  </div>
                  :
                  ""
              }
              <div className="pull-left park-receipt" onClick={this.handleSetFullScreen}>
                <span className={`${this.state.iconFullScreen} icon-padding-right`}></span>{this.state.textFullScreen}
              </div>
            </this.Col>
          </this.Row>
          <this.Row className="wrap-category">
            {
              this.props.productsType.fetching ?
                <this.Spin style={{position: "absolute", left: 0, right: 0, paddingTop: 15}}/>
                :
                this.state.categoryList.concat(this.props.productsType.list).map((category, index) =>
                  <this.Col md="3" className="category-box" key={index}>
                    <div onClick={() => this.handleOnSelectCategory(category.id)} className={`category ${this.state.selectedCategoryIds.includes(category.id)? "selected": "" }`}>
                      {
                        "productTypeDescriptions" in category && category["productTypeDescriptions"].length > 0 ?
                          category["productTypeDescriptions"][0].name
                          :
                          category.name
                      }
                    </div>
                  </this.Col>
                )
            }
          </this.Row>
          <this.Row className="wrap-product-box-list">
            {
              this.props.products.fetching ?
                <this.Spin style={{position: "absolute", left: 0, right: 0, paddingTop: 15}}/>
                :
                this.renderProductList()
            }
          </this.Row>
        </this.Col>
        <this.Col md="4" id="right-block">
          <this.Row id="search-information">
            <CustomerDropDownSearch
              customers={this.props.customers}
              locale={this.props.locale}
              form={this.props.form}
              dispatch={this.props.dispatch}
              handleOnAddNewCustomer={this.handleOnAddNewCustomer}/>
            <ProductDropDownSearch
              placeholder={this.CATranslate("input_search_product_placeholder", this.props.locale)}
              productSearch={this.props.productSearch}
              handleOnSelectList={this.handleOnSelectProductSearchList}
              callBack={this.handleOnAutoSelectProductAfterSearchResult}
              handlePressEnterOnSearch={this.handleOnSelectProductSearchList}
              className="ca-input-v1-icon-left ca-input-v1"
              isAutoFocus={true}
              locale={this.props.locale}
              form={this.props.form}
              dispatch={this.props.dispatch} />
          </this.Row>
          <div className="product-order-list">
            {
              this.state.productOrderList.map((productOrder, productOrderIndex) => 
                <div className={`product-order-item ${this.state.expandOrderItemRow.includes(productOrder.productId) ? "expanded" : ""}`} key={productOrderIndex}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div className="item" onClick={() => this.handleExpandOrderItem(productOrder.productId, productOrderIndex)}>
                      <div className={`epxand-icon ${this.state.expandOrderItemRow.includes(productOrder.productId) ? "icon-move-down" : "icon-next"}`}></div>
                      <div className="description">
                        <div className="name">{productOrder.name}</div>
                        <div className="barcode-number">{<this.Translate id="text_product_code"/>}: {productOrder.barcode}</div>
                      </div>
                      <div className="quantity">{productOrder.quantity}x</div>
                      <div className="price">
                        {
                          productOrder.discount > 0 ?
                            <div className="after-discount-price">
                              {this.formatCurrency(POSUtil.getTotalAmountAfterDiscount(productOrder.quantity,  productOrder.price, productOrder.discount))}
                            </div>
                            :
                            ""
                        }
                        <div className={`main-price ${productOrder.discount > 0 ? "strike-price" : ""}`}>
                          {this.formatCurrency(POSUtil.getTotalAmount(productOrder.quantity, productOrder.price))}
                        </div>
                      </div>
                    </div>
                    <div className="delete" onClick={() => this.handleOnRemoveProductFromOrderList(productOrder)}><span className="icon-delete"></span></div>
                  </div>
                  <div className="product-order-item-detail">
                    <div className="detail-row-1">
                      <this.InputNumber
                        name={`quantity[${productOrderIndex}]`}
                        label={<this.Translate id="text_quantity"/> }
                        data={productOrder.quantity}
                        handleKeyUp={(event) => this.handleOnChangOrderField(event, productOrderIndex, "quantity")}
                        className="ca-input-v1 order-quantity"
                        isHideTool={true}
                        precision={0}
                        isAutoSelect={true}
                        form={this.props.form}/>
                      <this.InputNumber
                        name={`price[${productOrderIndex}]`}
                        label={<this.Translate id="text_price" />}
                        data={POSUtil.getTotalAmountAfterDiscount(1, productOrder.price, productOrder.discount)}
                        handleKeyUp={(event) => this.handleOnChangOrderField(event, productOrderIndex, "newPrice")}
                        className="ca-input-v1"
                        isAutoSelect={true}
                        isHideTool={true}
                        form={this.props.form}/>
                      <this.InputNumber
                        name={`discount[${productOrderIndex}]`}
                        label={<span><this.Translate id="text_discount"/> (%)</span>}
                        data={productOrder.discount}
                        handleKeyUp={(event) => this.handleOnChangOrderField(event, productOrderIndex, "discount")}
                        className="ca-input-v1"
                        precision={0}
                        isAutoSelect={true}
                        isHideTool={true}
                        form={this.props.form} />
                      {/* <div className="detail-inventory">
                        <span className="icon-help icon-padding-right"></span>Show Inventories & Details
                      </div> */}
                    </div>
                    <div className="detail-row-2">
                      <this.InputText
                        name={`description[${productOrderIndex}]`}
                        label={<this.Translate id="text_notation"/>}
                        data={productOrder.description}
                        className="ca-input-v1"
                        handleKeyUp={(event) => this.handleOnChangOrderField(event, productOrderIndex, "description")}
                        placeholder={this.CATranslate("text_add_notation", this.props.locale)}
                        form={this.props.form}/>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
          <div id="wrap-payment">
            <this.Col md="12">
              <this.Row className="payment">
                <this.Col md="6" className="text-left">
                  {
                    !this.state.isDiscountHasAdded && summaryTotal.discount <= 0 ?
                      <div className="sub-total add-discount" style={{justifyContent: "end"}} onClick={this.handleOnSetupDiscount}>
                        <span className="icon-add icon-padding-right"></span> <span><this.Translate id="text_add"/> <this.Translate id="text_discount"/></span>
                      </div>
                      :
                      ""
                  }
                  
                  {/* SUB TOTAL ROW */}
                  <div className="sub-total">
                    <div className="sub-total-title"><this.Translate id="text_sub_total"/></div>
                    <div className="sub-total-value">{this.formatCurrency(summaryTotal.subTotalAfterDiscount)}</div>
                  </div>
                  {
                    summaryTotal.discount > 0 ?
                      <div className="sub-total">
                        <div className="sub-total-title" style={{fontWeight: 600}}><this.Translate id="text_discount"/></div>
                        <div className="sub-total-value">{this.formatCurrency(discountAmount)}</div>
                      </div>
                      :
                      ""
                  }
                  {/* END SUB TOTAL ROW */}

                  {/* TAX ROW */}
                  <div className="sub-total">
                    <div className="sub-total-title" onClick={countTax > 0 ? this.handleOnOpenTaxSetting : null}>
                      <span className={`${countTax > 0 ? "ca-link" : ""}`}><this.Translate id="text_tax"/></span> {taxTitle}
                    </div>
                    <div className="sub-total-value">{this.formatCurrency(taxTotal)}</div>
                  </div>
                  {/*END TAX ROW */}

                  {/* DISCOUNT ROW */}
                  {
                    this.state.isDiscountHasAdded && summaryTotal.discount <= 0?
                      <div className="sub-total">
                        <div className="ca-link sub-total-title" style={{fontWeight: 600}} onClick={this.handleOnSetupDiscount}>
                          <this.Translate id="text_discount"/>
                          {discountTypeStr}
                        </div>
                        <div className="sub-total-value" style={{position: "relative"}}>
                          {this.formatCurrency(discountAmount)}
                          <div className="delete remove-discount" onClick={this.handleRemoveDiscount}><span className="icon-delete"></span></div>
                        </div>
                      </div>
                      :
                      ""
                  }
                  {/*END DISCOUNT ROW */}
                </this.Col>
                <this.Col md="6" className="text-right">
                  <div className="grand-total">
                    <div className="grand-total-title"><this.Translate id="text_total"/></div>
                    <div className="grand-total-value">{this.formatCurrency(POSUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount))}</div>
                  </div>
                </this.Col>
              </this.Row>
              <this.Row className="payment-action">
                <this.Button type="info" className="mg-right" onClick={this.handleOnSaveParkReceipt}>
                  <span className="icon-save icon-padding-right"></span><this.Translate id="button_text_save" />
                </this.Button>
                <this.Button type="info" onClick={this.handleOnMakePayment}>
                  <span className="icon-checked icon-padding-right"></span><this.Translate id="button_text_tender" />
                </this.Button>
              </this.Row>
            </this.Col>
          </div>
        </this.Col>
        {
          this.state.showVariantProduct ?
            <VaraintProduct
              dataSource={this.state.variantProductList}
              handleCancel={this.handleCancelVariant}/>
            :
            ""
        }
        {this.state.modalContent}
      </this.Row>
    );
  }
}