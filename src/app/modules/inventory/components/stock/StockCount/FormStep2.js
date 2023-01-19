import React from "react";
import { Translate } from "react-localize-redux";
import {
  PageHeader,
  Switch,
  Table,
  Tabs,
  Tag
} from "antd";
import EnumStock from "../../../enums";
import EnumProduct from "../../../../inventory/enums";
import {
  Button,
  InputNumber
} from "../../../../common/elements/ant-ui";
import Util from "../../../../common/util";
import ProductVariantService from "../../../services/products/ProductVariantService";
import ProductVariantAction from "../../../../inventory/actions/products/productVariant";
import SearchProductDropdown from "../../../../pos/components/transactions/Invoice/SearchProduct";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import VariantProduct from "../../../../pos/containers/transactions/SaleWalkin/VariantProduct";
import "./style.css";

const {TabPane} = Tabs;

export default class FormStep2 extends React.Component {
  state = {
    products: [],
    productSearch: [],
    modalVariant: null,
    selectedProduct: null,
    selectCountIndex: -1,
    enableQuickScan: false,
    loading: false
  }
  util = new Util();

  componentDidMount() {
    const {formData} = this.props;
    if (formData.countType === EnumStock.STOCK_COUNT_TYPE.PARTIAL) {
      this.setState({products: this.props.products});
    } else {
      this.setState({loading: true});
      ProductVariantService.lists(10, 0)
      .then(response => {
        this.setState({products: response.data.data});
      })
      .finally(() => this.setState({loading: false}));
    }
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

  handleReview = () => {
    this.props.handleReview(this.state.products);
  }

  handleEnterQuantity = () => {
    this.handleCount();
    this.props.form.setFieldsValue({quantity: 0, searchProduct: ""});
  }

  handleCount = () => {
    const {selectCountIndex} = this.state;
    const products = this.util.copyArrayObj(this.state.products);
    const quantity = this.props.form.getFieldValue("quantity");
    if (selectCountIndex >= 0) {
      products[selectCountIndex].count = quantity;
      products[selectCountIndex].counting = false;
      this.setState({
        products,
        selectCountIndex: -1
      });
      this.props.form.setFieldsValue({quantity: 0});
    } else {
      this.util.sweetAlertMessageV2("", "Please select product to count", "warning");
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

    let index = "";
    const existingProducts = Util.prototype.copyArrayObj(this.state.products);
    if (this.props.formData.countType === EnumStock.STOCK_COUNT_TYPE.FULL_COUNT) {
      index = existingProducts.findIndex(p => p.id === productVariant.id);
    } else {
      index = existingProducts.findIndex(p => p.productVariantId === productVariant.id);
    }

    this.setState({products: existingProducts, selectCountIndex: index});
  }

  renderTable(formData) {
    return (
      <Table
        rowKey={((row, index) => index)}
        bordered={true}
        style={{marginTop: -10}}
        loading={this.state.loading}
        columns={[
          {
            title: <Translate id="text_product_name" />,
            dataIndex: "name",
            key: "name",
            render: (name, record, index) => {
              if (formData.countType === EnumStock.STOCK_COUNT_TYPE.FULL_COUNT) {
                name = record.product && record.product.name;
                record.variantName = record.name;
              }

              return <div style={{display: "flex"}}>
                {name} {record.variantName ? <div className="variant-name" style={{marginLeft: 15}}>{record.variantName}</div> : ""}
                {index === this.state.selectCountIndex ? <Tag color="#ffa940" style={{marginLeft: 20}}><Translate id="text_process" /> <Translate id="text_count" /></Tag> : ""}
              </div>;
            }
          },
          {
            title: <Translate id="text_barcode" />,
            dataIndex: "barcode",
            key: "barcode"
          },
          {
            title: <Translate id="text_expected" />,
            dataIndex: "quantity",
            key: "expected",
            render: (quantity, record) => `${quantity} ${record.unitName ? record.unitName : ""}`
          },
          {
            title: <Translate id="text_count" />,
            dataIndex: "count",
            key: "count",
            render: (count, record) => `${count ? count : 0} ${record.unitName ? record.unitName : ""}`
          }
        ]}
        dataSource={this.state.products}
      />
    );
  }

  render() {
    const {formData} = this.props;
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
          title={formData && formData.name}
          extra={[
            <div key={1}>
              <Button type="danger" htmlType="button" style={{width: 90, marginRight: 15}} onClick={this.props.goBack}>
                <Translate id="text_pause" />
              </Button>
              <Button type="info" htmlType="button" style={{width: 90}} onClick={this.handleReview}>
                <Translate id="text_review" />
              </Button>
            </div>
          ]}
        />

        <div style={{display: "flex", marginTop: 10}} className="input-product-count">
          <SearchProductDropdown 
            productSearch={this.state.productSearch}
            handleOnSelectList={this.handleOnSelectList}
            placeholder={`${stringTranslate("text_search_product", this.props.locale)}`}
            className="ca-input-v1 purchase-order"
            locale={this.props.locale}
            style={{flexGrow: 1}}
            form={this.props.form} /> 

          <InputNumber 
            name="quantity"
            className="input-count-quantity"
            placeholder={`${stringTranslate("text_quantity", this.props.locale)}`}
            style={{padding: "0 15px", marginTop: -4}}
            disabled={this.state.enableQuickScan}
            isAutoSelect={true}
            handlePressEnter={this.handleEnterQuantity}
            form={this.props.form}/>

          <Button style={{width: 80, height: 40, marginRight: 15}} htmlType="button" onClick={this.handleCount} disabled={this.state.enableQuickScan}>
            <Translate id="text_count" />
          </Button>
          <Switch
            checkedChildren="Quick Scan"
            unCheckedChildren="Quick Scan"
            className="quick-scan-count-switch"
            onChange={() => this.setState({enableQuickScan: !this.state.enableQuickScan})}
          />
        </div>

        <Tabs type="card" onChange={this.onChangeTabs} style={{marginTop: 20}}>
          <TabPane tab={<Translate id="text_all" />} key="1">
            {this.renderTable(formData)}
          </TabPane>
          <TabPane tab={<Translate id="text_counted" />} key="2">
            {this.renderTable(formData)}
          </TabPane>
          <TabPane tab={<Translate id="text_uncounted" />} key="3">
            {this.renderTable(formData)}
          </TabPane>
        </Tabs>

        <div className="clearFloat"></div>
        {this.state.modalVariant}
      </React.Fragment>
    );
  }
}