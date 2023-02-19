import React from "react";
import { Translate } from "react-localize-redux";
import {
  Table,
  Col,
  Icon
} from "antd";
import Util from "../../../../common/util";
import Enum from "../../../../pos/enums";
import ProductVariantAction from "../../../../inventory/actions/products/productVariant";
import {
  RadioNormal,
  InputText,
  InputNumber
} from "../../../../common/elements/ant-ui";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import SearchProductDropdown from "../../../../pos/components/transactions/Invoice/SearchProduct";
import VariantProduct from "../../../../pos/components/transactions/RetailSale/VaraintProduct";

const util = new Util();
const targetDiscount = {
  all: "all",
  some: "some"
};

const targetProduct = {
  all: "all",
  specific: "specific"
};

export default class BasicDiscount extends React.Component {
  state = {
    productEntries: [],
    productSearch: [],
    modalVariant: null
  };
  util = new Util();

  componentDidMount() {
    this.setState({productEntries: this.props.productEntries});
  }

  componentDidUpdate() {
    if (this.props.productVariant.fetched) {
      if (this.props.productVariant.list) {
          this.handleOnSelectList(this.state.selectedProduct, [this.props.productVariant.list], false);
      } else {
          this.Message.error(stringTranslate("error_product_not_found", this.props.locale));
          this.props.form.setFieldsValue({searchProduct: ""});
          document.getElementById("searchProduct").focus();
      }
      this.props.dispatch(ProductVariantAction.reset("RESET_PRODUCT_VARIANT"));
    }
  }

  handleRemoveEntry = (index) => {
    const productEntries = this.util.copyArrayObj(this.state.productEntries);
    if (productEntries && productEntries[index].id) {
      this.util.sweetAlertConfirm(stringTranslate("text_confirm_delete", this.props.locale), "warning")
      .then(isDelete => {
        if (isDelete) {
          productEntries[index].status = 3;
          this.setState({productEntries});
          this.props.handleUpdateProductEntries(productEntries);
        }
      });
    } else {
      productEntries.splice(index, 1);
      this.setState({productEntries});
      this.props.handleUpdateProductEntries(productEntries);
    }
  }

  handleOnSelectList = (product, productVariant, isRequestVariantForm = true) => {
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
    
    const existingProductList = this.state.productEntries;
    if (existingProductList.length === 0) {
      existingProductList.push({
        id: null,
        productId: productVariant.productId,
        productVariantId: productVariant.id,
        variantName: product.name ? product.name : product.namekm,
        barcode: productVariant.barcode,
        price: productVariant.price,
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
          variantName: product.name ? product.name : product.namekm,
          barcode: productVariant.barcode,
          price: productVariant.price,
          status: 1
        });
      }
    }

    this.setState({productEntries: existingProductList});
    this.props.handleOnSelectList(existingProductList);
    this.props.form.setFieldsValue({searchProduct: ""});
    document.getElementById("searchProduct").focus();
  };

  render() {
  console.log("product", this.state.productEntries);
  const {formData, form, locale} = this.props;
  return (
    <Col md={18} style={{paddingLeft: 20, paddingRight: 38}}>
      <div style={{display: "flex", height: 70}}>
        <RadioNormal
          name="targetProduct"
          label={<Translate id="text_product" />}
          defaultValue={formData.targetProduct}
          buttonStyle="solid"
          dataSource={[
            {value: targetProduct.all, title: <Translate id="text_all" />},
            {value: targetProduct.specific, title: <Translate id="text_specific" />}
          ]}
          form={form} />
        <SearchProductDropdown
          productSearch={this.state.productSearch}
          handleOnSelectList={this.handleOnSelectList}
          locale={locale}
          showIcon={false}
          disabled={form.getFieldValue("targetProduct") === targetDiscount.all ? true : false}
          style={{marginTop: 30, flexGrow: 1, paddingLeft: 17}}
          form={form} />
      </div>

      <Table 
        rowKey={((record, index) => index)}
        columns={[
          {
            title: <Translate id="text_number_of" />,
            dataIndex: "id",
            key: "id",
            render: (id, record, index) => {
              return <div>
                {index + 1}
                <InputText
                  name={`id[${index}]`}
                  style={{display: "none"}}
                  data={id}
                  form={form} />
                <InputText
                  style={{display: "none"}}
                  name={`productVariantId[${index}]`}
                  data={record.productVariantId}
                  form={form} />
                <InputText
                  style={{display: "none"}}
                  name={`productId[${index}]`}
                  data={record.productId}
                  form={form} />
                <InputText
                  style={{display: "none"}}
                  name={`variantName[${index}]`}
                  data={record.variantName}
                  form={form} />
                <InputNumber
                  name={`status[${index}]`}
                  style={{display: "none"}}
                  data={record.status}
                  precision={0}
                  form={form} />
              </div>;
            }
          },
          {
            title: <Translate id="text_product" />,
            dataIndex: "variantName",
            key: "variantName"
          },
          {
            title: <Translate id="text_barcode" />,
            dataIndex: "barcode",
            key: "barcode"
          },
          {
            title: <Translate id="text_price" />,
            dataIndex: "price",
            key: "price",
            render: (price) => util.formatCurrency(price)
          },
          {
            title: <Translate id="text_promotion_price" />,
            dataIndex: "price",
            key: "discountPrice",
            render: (price, record, index) => {
              const discountType = form.getFieldValue("discountType");
              let discount = form.getFieldValue("discount");
              if (discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
                discount = util.getValueFromPercentage(price, discount);
              }
              price = price - discount;
              return <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>{util.formatCurrency(price)}</div>
                <Icon type="delete" style={{cursor: "pointer", color: "red"}} onClick={() => this.handleRemoveEntry(index)} />
                <InputNumber
                  style={{display: "none"}}
                  name={`price[${index}]`}
                  data={price}
                  form={form} />
              </div>;
            }
          }
        ]}
        dataSource={this.state.productEntries}
        pagination={false}
        locale={{emptyText: <Translate id="text_no_sale_entries_product" />}}
        rowClassName={((record) => record.status === 3 ? "hidden" : "")}
      />

      {this.state.modalVariant}
    </Col>
  );
  }
}