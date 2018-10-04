import React from "react";
import VaraintProduct from "./VaraintProduct";
import DiscountSetup from "./DiscountSetup";
import Enum from "../../../enums";
import TransactionAction from "../../../action/transaction/transaction";
import PaymentMethodAction from "../../../../pos/action/settings/paymentMethod";
import FormCreateCustomer from "../../../../crm/containers/customers/ManageCustomers/FormCreate";
import CustomerAction from "../../../../crm/actions/customers/customer";
import ProductTypeAction from "../../../../inventory/actions/products/productsType";
import ProductAction from "../../../../inventory/actions/products/product";
import TaxAction from "../../../../pos/action/settings/tax";
import ConstAuth from "../../../../common/constants/authentication";
import CustomerDropDownSearch from "../../../../crm/components/customers/customer/DropDownSearch";
import ProductDropDownSearch from "../../../../inventory/components/products/Product/DropDownSearch";
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
      categoryList: [
        {id: 0, name: <this.Translate id="text_all_category"/>},
      ],
      productList: [
        {id: 1, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/sting.PNG", options: [
          {attribute: "Color", variant: [{name: "GOLD"}, {name: "WHITE"}, {name: "BLACK"}]},
          {attribute: "Size", variant: [{name: "8G"}, {name: "12G"}, {name: "128G"}]}
        ]},
        {id: 2, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/barcase.PNG", options: []},
        {id: 3, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/coca.PNG", options: []},
        {id: 4, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/milk.PNG", options: []},
        {id: 5, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/fanta.PNG", options: []},
        {id: 6, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/carabav.PNG", options: []},
        {id: 7, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/soda.PNG", options: []},
        {id: 8, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/sting.PNG", options: []},
        {id: 9, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/sting.PNG", options: []},
        {id: 10, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/sting.PNG", options: []},
        {id: 11, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/sting.PNG", options: []},
        {id: 12, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/sting.PNG", options: []},
        {id: 13, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/soda.PNG", options: []},
        {id: 14, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/sting.PNG", options: []},
        {id: 15, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/sting.PNG", options: []},
        {id: 16, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/sting.PNG", options: []},
        {id: 17, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/sting.PNG", options: []},
        {id: 18, name: "Coca Cola 2 L Bottle", price: 1.75, image: "http://ca.localhost:3081/sting.PNG", options: []}
      ],
      productOrderList: [],
      discountValue: {type: Enum.DISCOUNT_TYPE.PERCENTAGE, value: 0},
      initialOrderQuantity: 1,
      initialOrderDiscount: 0,
      initialOrderDiscountType: Enum.DISCOUNT_TYPE.PERCENTAGE,
      initialTax: 0,
      isDiscountHasAdded: false,
      selectedCategoryIds: [0]
    };

    this.handleOnSelectCategory = this.handleOnSelectCategory.bind(this);
    this.handleOnSelectProduct = this.handleOnSelectProduct.bind(this);
    this.handleCancelVariant = this.handleCancelVariant.bind(this);
    this.handleOnAddNewCustomer = this.handleOnAddNewCustomer.bind(this);
    this.handleOnSelectProductSearchList = this.handleOnSelectProductSearchList.bind(this);
    this.handleExpandOrderItem = this.handleExpandOrderItem.bind(this);
    this.handleSetFullScreen = this.handleSetFullScreen.bind(this);
    this.handleOnMakePayment = this.handleOnMakePayment.bind(this);
    this.handleCancelMakePayment = this.handleCancelMakePayment.bind(this);
    this.appendProductOrder = this.appendProductOrder.bind(this);
    this.handleOnRemoveProductFromOrderList = this.handleOnRemoveProductFromOrderList.bind(this);
    this.handleOnChangOrderField = this.handleOnChangOrderField.bind(this);
    this.handleOnSetupDiscount = this.handleOnSetupDiscount.bind(this);
    this.handleCancelDiscountSetup = this.handleCancelDiscountSetup.bind(this);
    this.handleOnResizeScreen = this.handleOnResizeScreen.bind(this);
    this.handleRemoveDiscount = this.handleRemoveDiscount.bind(this);
    this.handleGetDiscount = this.handleGetDiscount.bind(this);
    this.handleOnResetOrder = this.handleOnResetOrder.bind(this);
    this.handleOnSaveParkReceipt = this.handleOnSaveParkReceipt.bind(this);
    this.handleOnRestoreParkReceipt = this.handleOnRestoreParkReceipt.bind(this);
  }


  componentDidMount() {
    this.props.dispatch(ProductTypeAction.fetch(18));
    this.props.dispatch(ProductAction.fetch(25));
    this.props.dispatch(PaymentMethodAction.fetch(100, "", "", "", JSON.stringify({isEnableOnPOS: [Enum.PAYMENT_METHOD_AVIALE_ON_POS]})));

    // RESTRIEVE DEFAUL TAX
    const setting = this.Util.getSetting(ConstAuth.ACCESS_TOKEN);
    let taxId = "";
    if (setting !== null) {
      taxId = setting.defaultTaxId;
    }
    this.props.dispatch(TaxAction.detail(taxId));

    window.addEventListener("resize", this.handleOnResizeScreen);
  }

  handleOnResetOrder() {
    this.setState({
      expandOrderItemRow: [],
      productOrderList: [],
      discountValue: {type: Enum.DISCOUNT_TYPE.PERCENTAGE, value: 0},
      isDiscountHasAdded: false,
    });
  }

  handleOnResizeScreen() {
    this.setState({modalContent: null});
  }

  appendProductOrder(targetList, product) {
    targetList.push({
      productId: product.id,
      name: Util.getProductName(product),
      barcode: product.barcode,
      price: product.price,
      quantity: this.state.initialOrderQuantity,
      discount: this.state.initialOrderDiscount,
      discountType: this.state.initialOrderDiscountType,
      tax: this.state.initialTax,
      description: "",
      options: []
    });
  }

  handleOnSelectCategory(value) {
    let filter = "";
    if (value !== 0) {
      filter = JSON.stringify({productTypeId: [value]});
    }

    this.props.dispatch(ProductAction.fetch(25, "", "", "", filter));
    this.setState({selectedCategoryIds: [value]});
  }

  handleExpandOrderItem(expandOrderItemRow, productOrderIndex) {
    if (this.state.expandOrderItemRow.includes(expandOrderItemRow)) {
      this.setState({expandOrderItemRow: []});
    } else {
      this.setState({expandOrderItemRow: [expandOrderItemRow]});
    }
  }

  handleCancelVariant() {
    this.setState({
      showVariantProduct: false,
      variantProductList: []
    });
  }

  handleOnSelectProduct(product) {
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

    this.setState({productOrderList: existingProductOrderList});
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
  }

  handleOnChangOrderField(event, proderOrderRowIndex, field = "quantity") {
    const value = parseFloat(event.target.value);
    let existingProductOrderList = this.state.productOrderList;
    existingProductOrderList[proderOrderRowIndex][field] = isNaN(value) ? 0 : value;
    this.setState({
      productOrderList: existingProductOrderList,
    });

    if (field === "discount") {
      if (!isNaN(value) && value > 0) {
        this.setState({
          isDiscountHasAdded: true,
          discountValue: {
            type: Enum.DISCOUNT_TYPE.EACH_ITEM
          }
        });
      } else {
        this.setState({
          isDiscountHasAdded: false,
          discountValue: {
            type: Enum.DISCOUNT_TYPE.PERCENTAGE,
            value: 0
          }
        });
      }
    }
  }

  handleOnAddNewCustomer() {
    this.props.dispatch(CustomerAction.showForm());
    this.setState({
      modalContent: <FormCreateCustomer/>
    });
  }

  handleOnSelectProductSearchList(value) {
    if (value.productVariantToProduct.length > 0) {
      this.setState({
        showVariantProduct: true,
        variantProductList: this.state.productList[0].options
      });
    } else {
      this.handleOnSelectProduct(value);
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

  handleOnMakePayment() {
    if (this.state.productOrderList.length > 0) {
      this.props.dispatch(TransactionAction.showForm());
      this.setState({modalContent: <PaymentForm
        handleCancel={this.handleCancelMakePayment}
        productOrderList={this.state.productOrderList}
        paymentMethodList={this.props.paymentMethod}
        handleOnResetOrder={this.handleOnResetOrder}
        summaryTotal={this.getSummaryTotal()}/>
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
      element.classList.remove("full-screen");
    } else {
      element.classList.add("full-screen");
    }
    this.Util.toggleFullScreen(body);
  }

  handleOnSaveParkReceipt() {
    localStorage.setItem(Enum.PARK_RECEIPT, JSON.stringify({
      productOrderList: this.state.productOrderList,
      discountValue: this.state.discountValue,
      isDiscountHasAdded: this.state.isDiscountHasAdded
    }));
    this.handleOnResetOrder();
  }

  handleOnRestoreParkReceipt() {
    let parkReceipt = localStorage.getItem(Enum.PARK_RECEIPT);
    if (this.Util.isJsonString(parkReceipt)) {
      parkReceipt = JSON.parse(parkReceipt);
      this.setState({
        ...parkReceipt
      });
    }
  }

  getSummaryTotal() {
    const summaryTotal = POSUtil.getSummaryTotalInOrder(this.state.productOrderList);
    let taxRate = 0;
    let discountAmount = 0;
    let discountTypeStr = "";

    if (this.props.tax.data) {
      taxRate = this.props.tax.data.rate;
    }
    const taxAmount = POSUtil.getTaxAmount(summaryTotal.subTotal, taxRate);

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
      taxRate,
      discountAmount,
      taxAmount,
      discountTypeStr,
      discountType: this.state.discountValue.type
    };
  }

  renderProductList() {
    return (
      this.props.products.list.length > 0 ?
        this.props.products.list.map((product, index) =>
          <this.Col md="3" className="product-box" key={index}>
            <div onClick={() => this.handleOnSelectProduct(product)} className="product">
              <div className="image">
                <img alt="" src={`${process.env.REACT_APP_RESOURCE_HOST}/${product.image}`} />
              </div>
              <div className="name">
                {
                  product.productDescriptions.length > 0 ?
                    product.productDescriptions[0].name
                    :
                    ""
                }
              </div>
              <div className="price">{this.Util.formatCurrency(product.price)}</div>
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
      taxRate,
      discountAmount,
      taxAmount,
      discountTypeStr
    } = this.getSummaryTotal();

    return (
      <this.Row className="main-layout main-store-account" id="retail-sale">
        <this.Col md="8" id="left-block">
          <this.Row className="wrap-receipt-type">
            <this.Col md="12" className="receipt-type">
              <div className="pull-left current-receipt selected">
                <span className="icon-receipt icon-padding-right"></span><this.Translate id="current_receipt_type"/>
              </div>
              {
                localStorage.getItem(Enum.PARK_RECEIPT) ?
                  <div className="pull-left park-receipt" onClick={this.handleOnRestoreParkReceipt}>
                    <span className="icon-receipt icon-padding-right"></span><this.Translate id="park_receipt_type"/>
                  </div>
                  :
                  ""
              }
              <div className="pull-left park-receipt" onClick={this.handleSetFullScreen}>
                <span className="icon-receipt icon-padding-right"></span>Full Sreen
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
                              {this.Util.formatCurrency(POSUtil.getTotalAmountAfterDiscount(productOrder.quantity,  productOrder.price, productOrder.discount))}
                            </div>
                            :
                            ""
                        }
                        <div className={`main-price ${productOrder.discount > 0 ? "strike-price" : ""}`}>
                          {this.Util.formatCurrency(POSUtil.getTotalAmount(productOrder.quantity, productOrder.price))}
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
                        data={productOrder.price}
                        handleKeyUp={(event) => this.handleOnChangOrderField(event, productOrderIndex, "price")}
                        className="ca-input-v1"
                        isAutoSelect={true}
                        isHideTool={true}
                        form={this.props.form}/>
                      <this.InputNumber
                        name={`discound[${productOrderIndex}]`}
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
                        {/* <div className="sub-total-title text-uppercase" style={{letterSpacing: 1.5}}><this.Translate id="text_add"/></div>
                        <div className="sub-total-value ca-link" style={{fontWeight: 600}} onClick={this.handleOnSetupDiscount}>{<this.Translate id="text_discount"/>}</div> */}
                      </div>
                      :
                      ""
                  }
                  <div className="sub-total">
                    <div className="sub-total-title"><this.Translate id="text_sub_total"/></div>
                    <div className="sub-total-value">{this.Util.formatCurrency(summaryTotal.subTotalAfterDiscount)}</div>
                  </div>
                  {
                    summaryTotal.discount > 0 ?
                      <div className="sub-total">
                        <div className="sub-total-title" style={{fontWeight: 600}}><this.Translate id="text_discount"/></div>
                        <div className="sub-total-value">{this.Util.formatCurrency(discountAmount)}</div>
                      </div>
                      :
                      ""
                  }
                  {
                    this.state.isDiscountHasAdded && summaryTotal.discount <= 0?
                      <div className="sub-total">
                        <div className="ca-link sub-total-title" style={{fontWeight: 600}} onClick={this.handleOnSetupDiscount}>
                          <this.Translate id="text_discount"/>
                          {discountTypeStr}
                        </div>
                        <div className="sub-total-value" style={{position: "relative"}}>
                          {this.Util.formatCurrency(discountAmount)}
                          <div className="delete remove-discount" onClick={this.handleRemoveDiscount}><span className="icon-delete"></span></div>
                        </div>
                      </div>
                      :
                      ""
                  }
                  <div className="sub-total">
                    <div className="sub-total-title"><this.Translate id="text_tax"/>{taxRate > 0 ? ` (${taxRate}%)` : <this.Translate id="text_no_tax"/>}</div>
                    <div className="sub-total-value">{this.Util.formatCurrency(taxAmount)}</div>
                  </div>
                </this.Col>
                <this.Col md="6" className="text-right">
                  <div className="grand-total">
                    <div className="grand-total-title"><this.Translate id="text_total"/></div>
                    <div className="grand-total-value">{this.Util.formatCurrency(POSUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount))}</div>
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