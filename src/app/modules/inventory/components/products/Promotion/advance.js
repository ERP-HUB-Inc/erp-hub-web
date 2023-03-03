import React from "react";
import { Translate } from "react-localize-redux";
import {
  Row,
  Col,
  Table,
  message,
  Icon
} from "antd";
import Util from "../../../../common/util";
import ProductVariantAction from "../../../../inventory/actions/products/productVariant";
import {
  InputNumber,
  RadioNormal,
  Select
} from "../../../../common/elements/ant-ui";
import Enum from "../../../../pos/enums";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import SearchProductDropdown from "../../../../pos/components/transactions/Invoice/SearchProduct";
import VariantProduct from "../../../../pos/components/transactions/RetailSale/VaraintProduct";

const targetProduct = {
  all: "all",
  specific: "specific"
};

const targetDiscount = {
  all: "all",
  some: "some"
};

const whenBuy= {
  BUY_ITEMS: "BUY_ITEMS",
  SPEND_AMOUNT: "SPEND_AMOUNT"
};

const getItem = {
  GET_ITEMS: "GET_ITEMS",
  SAVE_AMOUNT: "SAVE_AMOUNT"
};

export default class AdvanceDiscount extends React.Component {
  state = {
    buyProductSearch: [],
    giftProductSearch: [],
    whenBuyProducts: [],
    thenGetProducts: [],
    modalVariant: null
  }
  util = new Util();

  componentDidMount() {
    this.setState({
      whenBuyProducts: this.props.whenBuyProducts,
      thenGetProducts: this.props.thenGetProducts
    });
  }

  componentDidUpdate() {
    if (this.props.productBuyVariant.fetched) {
      if (this.props.productBuyVariant.list) {
          this.handleOnSelectList(this.state.selectedProduct, [this.props.productBuyVariant.list], false);
      } else {
          message.error(stringTranslate("error_product_not_found", this.props.locale));
          this.props.form.setFieldsValue({searchProduct: ""});
          document.getElementById("searchProduct").focus();
      }
      this.props.dispatch(ProductVariantAction.reset("RESET_PRODUCT_VARIANT"));
    }
  }

  handleRemoveWhenEntry = (index) => {
    const whenBuyProducts = this.util.copyArrayObj(this.state.whenBuyProducts);
    if (whenBuyProducts && whenBuyProducts[index].id) {
      this.util.sweetAlertConfirm(stringTranslate("text_confirm_delete", this.props.locale), "warning")
      .then(isDelete => {
        if (isDelete) {
          whenBuyProducts[index].status = 3;
          this.setState({whenBuyProducts});
          this.props.handleUpdateWhenEntries(whenBuyProducts);
        }
      });
    } else {
      whenBuyProducts.splice(index, 1);
      this.setState({whenBuyProducts});
      this.props.handleUpdateWhenEntries(whenBuyProducts);
    }
  }

  handleRemoveTheEntry = (index) => {
    const thenGetProducts = this.util.copyArrayObj(this.state.thenGetProducts);
    if (thenGetProducts && thenGetProducts[index].id) {
      this.util.sweetAlertConfirm(stringTranslate("text_confirm_delete", this.props.locale), "warning")
      .then(isDelete => {
        if (isDelete) {
          thenGetProducts[index].status = 3;
          this.setState({thenGetProducts});
          this.props.handleUpdateThenEntries(thenGetProducts);
        }
      });
    } else {
      thenGetProducts.splice(index, 1);
      this.setState({thenGetProducts});
      this.props.handleUpdateThenEntries(thenGetProducts);
    }
  }


  handleOnSelectList1 = (product, productVariant, isRequestVariantForm = true) => {
    let isProductVariant = product.productOption === Enum.PRODUCT_VARIANT;
    if (isProductVariant && isRequestVariantForm) {
      this.setState({
        selectedProduct: product,
        modalVariant: <VariantProduct
        product={product}
        handleCancel={this.handleCancelVariantProduct}/>
      });
      return;
    } else if (productVariant && productVariant.length > 0) {
      productVariant = productVariant[0];
      productVariant.name = isProductVariant ? productVariant.name : "";
    }
    
    const existingProductList = this.state.whenBuyProducts;
    if (existingProductList.length === 0) {
      existingProductList.push({
        id: null,
        productId: productVariant.productId,
        productVariantId: productVariant.id,
        barcode: productVariant.barcode,
        productName: product.name,
        status: 1
      });
    } else {
      let isNotTheSameProduct = true;
      existingProductList.forEach((product, index) => {
        if (product.productVariantId === productVariant.id) {
          if (existingProductList[index]["status"] === 3) {
            existingProductList[index]["status"] = 1;
          }
          isNotTheSameProduct = false;
        }
      });
      if (isNotTheSameProduct) {
        existingProductList.push({
          id: null,
          productId: productVariant.productId,
          productVariantId: productVariant.id,
          productName: product.name,
          barcode: productVariant.barcode,
          price: productVariant.price,
          status: 1
        });
      }
    }

    this.setState({whenBuyProducts: existingProductList});
    this.props.handleUpdateWhenEntries(existingProductList);
    this.props.form.setFieldsValue({searchBuyProduct: ""});
  }

  handleOnSelectList2 = (product, productVariant, isRequestVariantForm = true) => {
    let isProductVariant = product.productOption === Enum.PRODUCT_VARIANT;
    if (isProductVariant && isRequestVariantForm) {
      this.setState({
        selectedProduct: product,
        modalVariant: <VariantProduct
        product={product}
        handleCancel={this.handleCancelVariantProduct}/>
      });
      return;
    } else if (productVariant && productVariant.length > 0) {
      productVariant = productVariant[0];
      productVariant.name = isProductVariant ? productVariant.name : "";
    }
    
    const existingProductList = this.state.thenGetProducts;
    if (existingProductList.length === 0) {
      existingProductList.push({
        id: null,
        productId: productVariant.productId,
        productVariantId: productVariant.id,
        productName: product.name,
        barcode: productVariant.barcode,
        status: 1
      });
    } else {
      let isNotTheSameProduct = true;
      existingProductList.forEach((product, index) => {
        if (product.productVariantId === productVariant.id) {
          if (existingProductList[index]["status"] === 3) {
            existingProductList[index]["status"] = 1;
          }
          isNotTheSameProduct = false;
        }
      });
      if (isNotTheSameProduct) {
        existingProductList.push({
          id: null,
          productId: productVariant.productId,
          productVariantId: productVariant.id,
          productName: product.name,
          barcode: productVariant.barcode,
          status: 1
        });
      }
    }

    this.setState({thenGetProducts: existingProductList});
    this.props.handleUpdateThenEntries(existingProductList);
    this.props.form.setFieldsValue({searchGiftProduct: ""});
  }

  render () {
    const {formData, form, locale} = this.props;
    let getDiscountType = [
      {value: "free", title: "free"},
      {value: "%", title: "%"},
      {value: "$", title: "$"}
    ];

    if (this.props.form.getFieldValue("then") === getItem.SAVE_AMOUNT) {
      getDiscountType[0].disabled = true;
    }

    const promotionCriteria = formData.promotionCriteria;

    let defaultGetType = "free";
    if (promotionCriteria.getAmount) {
      defaultGetType = "$";
    } else if (promotionCriteria.getPercentage) {
      defaultGetType = "%";
    }

    return (
      <Col md={18} style={{paddingLeft: 20, paddingRight: 38}}>
        <Row>
          <Col md={6}>
            <Select
              name="when"
              label={<Translate id="text_when_customer" />}
              placeholder={`${stringTranslate("text_buy_the_following_item", this.props.locale)}`}
              defaultValue={promotionCriteria.when ? promotionCriteria.when : whenBuy.BUY_ITEMS}
              dataSource={[
                {value: whenBuy.BUY_ITEMS, name: <Translate id="text_buy_the_following_item" />},
                {value: whenBuy.SPEND_AMOUNT, name: <Translate id="text_spend_the_following_amount" />}
              ]}
              style={{width: 280}}
              form={form} />
          </Col>
          
          <Col md={2} style={{textAlign: "center", marginTop: 30}}>
            {this.props.form.getFieldValue("when") === whenBuy.SPEND_AMOUNT ? <Translate id="text_spend" /> : <Translate id="text_buy" /> }
          </Col>
          <Col md={4}>
            {
              this.props.form.getFieldValue("when") === whenBuy.SPEND_AMOUNT ?
              <InputNumber 
                name="spendAmount"
                label={<Translate id="text_amount" />}
                data={promotionCriteria.spendAmount}
                isAutoSelect={true}
                form={form} />
              :
              <InputNumber 
                name="buyQuantity"
                data={promotionCriteria.buyQuantity}
                label={<Translate id="text_quantity" />}
                isAutoSelect={true}
                form={form} />
            }
            
          </Col>
          <Col md={5} style={{paddingLeft: 20, marginTop: -6}}>
            <RadioNormal
              name="whenTarget"
              label={<Translate id="text_product" />}
              defaultValue={promotionCriteria.whenTarget ? promotionCriteria.whenTarget : targetProduct.specific}
              buttonStyle="solid"
              dataSource={[
                {value: targetProduct.all, title: <Translate id="text_all" />},
                {value: targetProduct.specific, title: <Translate id="text_specific" />}
              ]}
              form={form} />
          </Col>
        </Row>
        {
          this.props.form.getFieldValue("whenTarget") !== targetProduct.all &&
          <div>
            <SearchProductDropdown
              name="searchBuyProduct"
              productSearch={this.state.buyProductSearch}
              handleOnSelectList={this.handleOnSelectList1}
              locale={locale}
              showIcon={false}
              disabled={form.getFieldValue("targetProduct") === targetDiscount.all ? true : false}
              form={form} />

            <Table 
              rowKey={((row, index) => index)}
              rowClassName={((record) => record.status === 3 ? "hidden" : "")}
              columns={[
                {
                  title: <Translate id="text_product" />,
                  dataIndex: "productName",
                  key: "productName"
                },
                {
                  title: <Translate id="text_barcode" />,
                  dataIndex: "barcode",
                  key: "barcode",
                  render: (barcode, record, index) => {
                    return <div style={{display: "flex", justifyContent: "space-between"}}>
                      <div>{barcode}</div>
                      <Icon type="delete" style={{cursor: "pointer", color: "red"}} onClick={() => this.handleRemoveWhenEntry(index)} />
                    </div>;
                  }
                }
              ]}
              dataSource={this.state.whenBuyProducts}
            />
          </div>
        }
        <Row style={{marginTop: 20}}>
          <Col md={6}>
            <Select
              name="then"
              label={<Translate id="text_then_will_be" />}
              placeholder={`${stringTranslate("text_get_following_item", this.props.locale)}`}
              defaultValue={promotionCriteria.then ? promotionCriteria.then : getItem.GET_ITEMS}
              dataSource={[
                {value: getItem.GET_ITEMS, name: <Translate id="text_get_following_item" />},
                {value: getItem.SAVE_AMOUNT, name: <Translate id="text_save_certain_amount" />}
              ]}
              style={{width: 280}}
              form={form} />
          </Col>
          <Col md={2} style={{textAlign: "center", paddingTop: 30}}>
            <Translate id={this.props.form.getFieldValue("then") === getItem.SAVE_AMOUNT ? "text_save_amount" : "text_get"} />
          </Col>
          <Col md={3} style={{marginTop: -6}}>
            <RadioNormal
              name="discountType"
              label={<Translate id="text_discount" />}
              defaultValue={defaultGetType}
              buttonStyle="solid"
              dataSource={getDiscountType}
              form={form} />
          </Col>
          <Col md={4} style={{paddingLeft: 25}}>
            {
              this.props.form.getFieldValue("then") === getItem.SAVE_AMOUNT ?
              <InputNumber 
                name="getAmount"
                label={<Translate id="text_amount" />}
                isAutoSelect={true}
                data={promotionCriteria.getAmount}
                form={form} />
              :
              <InputNumber 
                name="getQuantity"
                label={<Translate id="text_quantity" />}
                data={promotionCriteria.getQuantity}
                isAutoSelect={true}
                form={form} />
            }
            
          </Col>
          <Col md={5} style={{paddingLeft: 20, marginTop: -6}}>
            <RadioNormal
              name="thenTarget"
              label={<Translate id="text_product" />}
              defaultValue={promotionCriteria.thenTarget ? promotionCriteria.thenTarget : targetProduct.specific}
              buttonStyle="solid"
              dataSource={[
                {value: targetProduct.all, title: <Translate id="text_all" />},
                {value: targetProduct.specific, title: <Translate id="text_specific" />}
              ]}
              form={form} />
          </Col>
        </Row>
        {
          this.props.form.getFieldValue("thenTarget") !== targetProduct.all &&
          <div>
            <SearchProductDropdown
              name="searchGiftProduct"
              productSearch={this.state.giftProductSearch}
              handleOnSelectList={this.handleOnSelectList2}
              locale={locale}
              showIcon={false}
              disabled={form.getFieldValue("targetProduct") === targetDiscount.all ? true : false}
              form={form} />

            <Table 
              rowKey={((row, index) => index)}
              rowClassName={((record) => record.status === 3 ? "hidden" : "")}
              columns={[
                {
                  title: <Translate id="text_product" />,
                  dataIndex: "productName",
                  key: "productName",
                },
                {
                  title: <Translate id="text_barcode" />,
                  dataIndex: "barcode",
                  key: "barcode",
                  render: (barcode, record, index) => {
                    return <div style={{display: "flex", justifyContent: "space-between"}}>
                      <div>{barcode}</div>
                      <Icon type="delete" style={{cursor: "pointer", color: "red"}} onClick={() => this.handleRemoveTheEntry(index)} />
                    </div>;
                  }
                }
              ]}
              dataSource={this.state.thenGetProducts}
            />
          </div>
        }
      </Col>
    );
  }
}