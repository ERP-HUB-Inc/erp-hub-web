import React from "react";
import moment from "moment";
import {Translate} from "react-localize-redux";
import {
  PageHeader,
  Row,
  Col,
  Table,
  message
} from "antd";
import {
  InputText,
  DatePickers,
  TimePickers,
  Select,
  RadioBox,
  RadioChildBox,
  Button
} from "../../../../common/elements/ant-ui";
import Util from "../../../../common/util";
import Enum from "../../../enums";
import EnumProduct from "../../../../inventory/enums";
import ProductVariantAction from "../../../../inventory/actions/products/productVariant";
import {stringTranslate} from "../../../../common/helper/stringTranslate";
import SearchProductDropdown from "../../../../pos/components/transactions/Invoice/SearchProduct";
import VariantProduct from "../../../../pos/containers/transactions/SaleWalkin/VariantProduct";

export default class FormStep1 extends React.Component  {
  state = {
    productSearch: [],
    selectedProduct: null,
    modalVariant: null
  }

  componentDidUpdate() {
    if (this.props.productVariant.fetched) {
      if (this.props.productVariant.list) {
        this.handleOnSelectList(this.state.selectedProduct, [this.props.productVariant.list], false);
      } else {
        message.error(stringTranslate("error_product_not_found", this.props.locale));
        this.props.form.setFieldsValue({searchProduct: ""});
        document.getElementById("searchProduct").focus();
      }
      this.props.dispatch(ProductVariantAction.reset("RESET_PRODUCT_VARIANT"));
    }
  }

  handleOnSelectList = (product, productVariant, isRequestVariantForm = true) => {
    let isProductVariant = product.productOption === EnumProduct.PRODUCT_VARIANT;
    if (isProductVariant && isRequestVariantForm) {
      this.setState({
        selectedProduct: product,
        modalVariant: <VariantProduct
        product={product}
        handleCancel={() => this.setState({modalVariant: null})}/>
      });
      return;
    } else if (productVariant && productVariant.length > 0) {
      productVariant = productVariant[0];
      productVariant.name = isProductVariant ? productVariant.name : "";
    }

    const existingProductList = this.props.products;
    if (existingProductList.length === 0) {
      existingProductList.unshift({
        id: "",
        productVariantId: productVariant.id,
        variantName: productVariant.name,
        name: `${product.name ? product.name : product.namekm}`,
        unitName: product.unit.name,
        barcode: productVariant.barcode,
        quantity: productVariant.quantity,
        status: 1,
      });
    } else {
      let isNotTheSameProduct = true;
      existingProductList.forEach((product, index) => {
        if (product.productVariantId === productVariant.id) {
          isNotTheSameProduct = false;
        }
      });

      if (isNotTheSameProduct) {
        existingProductList.unshift({
          id: "",
          productVariantId: productVariant.id,
          variantName: productVariant.name,
          name: `${product.name ? product.name : product.namekm}`,
          unitName: product.unit.name,
          barcode: productVariant.barcode,
          quantity: productVariant.quantity,
          status: 1,
        });
      }
    }
    this.props.handleOnSelectList(existingProductList);
  }

  render() {
    const {formData, form, locale} = this.props;
    return (
      <React.Fragment>
        <PageHeader 
          style={{
            // backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0,
            position: "relative"
          }}
          onBack={this.props.goBack}
          title={<Translate id={this.props.pageTitle} />}
          extra={[
            <Button key={1} type="info" htmlType="button" onClick={this.props.handleStartCount}><Translate id="text_start_count" /></Button>
          ]}
        />
        
        <Row gutter={26}>
          <Col span={8} style={{padding: "12px 60px 0 14px"}}>
            <DatePickers 
              name="startDate"
              label={<Translate id="text_start_date" />}
              placeholder="DD/MM/YYYY"
              defaultValue={formData.startDate ? moment(formData.startDate) : moment()}
              onChange={this.props.handleChangeDate}
              form={form} />

            <TimePickers 
              name="startTime"
              label={<Translate id="text_start_time" />}
              placeholder="hh:mm A"
              defaultValue={formData.startTime ? moment(formData.startTime) : moment()}
              inputStyle={{width: "100%"}}
              timeFormat="hh:mm A"
              use12Hours={true}
              onChange={this.props.handleChangeTime}
              form={form} />

            <Select
              name="locationId"
              label={<Translate id="text_location" />}
              valueKey="id"
              placeholder={`${stringTranslate("text_location", locale)}`}
              defaultValue={formData.locationId ? formData.locationId : Util.prototype.getLocationId()}
              dataSource={this.props.locations}
              onChange={this.props.handleChangeLocation}
              form={form} />

            <InputText
              name="name"
              label={<Translate id="text_name" />}
              placeholder={`${stringTranslate("text_name", locale)}`}
              data={formData.name}
              form={form} />
          </Col>
          <Col span={16} style={{paddingLeft: 20}}>
            <label style={{fontSize: 18}}><Translate id="text_choose_product_to_count" /></label>
            <RadioBox
              className="main-radio-acc product-type"
              name="countType"
              type="radio"
              defaultValue={formData.countType}
              form={form}
              onSelect={this.props.onSelect}
              onChange={this.props.handleChangeCountType}
              >
                <RadioChildBox
                  key={1}
                  title={<div style={{borderBottom: "1px solid #ddd", marginBottom: 5}}><Translate id="text_partial" /></div>}
                  language="Specify the products to include in this inventory count"
                  value={Enum.STOCK_COUNT_TYPE.PARTIAL}
                />
                <RadioChildBox
                  key={2}
                  title={<div style={{borderBottom: "1px solid #ddd", marginBottom: 5}}><Translate id="text_full_count" /></div>}
                  language="Include all the products in this inventory count"
                  value={Enum.STOCK_COUNT_TYPE.FULL_COUNT}
                />
            </RadioBox>

            {
              formData.countType === Enum.STOCK_COUNT_TYPE.PARTIAL ?
              <React.Fragment>
              <SearchProductDropdown 
                productSearch={this.props.productSearch}
                handleOnSelectList={this.handleOnSelectList}
                className="ca-input-v1 purchase-order"
                locale={locale}
                style={{marginTop: 39}}
                form={form} /> 

              <label style={{marginTop: 20, fontSize: 16}}><Translate id="text_include_product" /></label>

              <Table 
                rowKey={((record, index) => index)}
                columns={this.props.columns}
                className="table-form-invoice-entry"
                dataSource={this.props.products}
                pagination={false}
                locale={{emptyText: <Translate id="text_no_sale_entries_product" />}}
                rowClassName={((record) => record.status === 3 ? "hidden" : "")}
              />
              </React.Fragment>
              :
              null
            }
            
          </Col>
        </Row>

        {this.state.modalVariant}
      </React.Fragment>
    );
  }
}