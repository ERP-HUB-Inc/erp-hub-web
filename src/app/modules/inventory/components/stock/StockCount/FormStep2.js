import React from "react";
import { Translate } from "react-localize-redux";
import {
  Badge,
  PageHeader,
  Switch,
  Table,
  Tabs
} from "antd";
import EnumStock from "../../../enums";
import EnumProduct from "../../../../inventory/enums";
import {
  Button,
  InputNumber
} from "../../../../common/elements/ant-ui";
import Util from "../../../../common/util";
import StockCountService from "../../../services/stock/StockCountService";
import ProductVariantAction from "../../../../inventory/actions/products/productVariant";
import SearchProductDropdown from "../../../../pos/components/transactions/Invoice/SearchProduct";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import VariantProduct from "../../../../pos/containers/transactions/SaleWalkin/VariantProduct";
import "./style.css";

const {TabPane} = Tabs;

const TABS_LIST = {
  ALL: 1,
  COUNTED: 2,
  UNCOUNTED: 3
};

export default class FormStep2 extends React.Component {
  state = {
    formData: {},
    products: [],
    productSearch: [],
    modalVariant: null,
    selectedProduct: null,
    selectCountIndex: -1,
    enableQuickScan: false,
    loading: false
  }
  util = new Util();
  ST_COUNT_STR = {
    [EnumStock.STOCK_COUNT_STATUS.IN_PROGRESS]: {title: stringTranslate("text_in_progress", this.props.locale), color: "#ffa940"},
    [EnumStock.STOCK_COUNT_STATUS.PAUSE]: {title: stringTranslate("text_pause", this.props.locale), color: "#f50"},
    [EnumStock.STOCK_COUNT_STATUS.COMPLETED]: {title: stringTranslate("text_completed", this.props.locale), color: "#87d068"}
  };

  componentDidMount() {
    StockCountService.detail(this.props.id)
    .then(response => {
      this.setState({formData: response.data.data});
    });
    this.fetchEntries(this.props.id, "");
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

  fetchEntries(id, status) {
    this.setState({loading: true});
    StockCountService.getStockCountEntriesByStatus(id, status)
    .then(response => {
      this.setState({products: response.data});
    })
    .catch(err => console.log("error", err.response))
    .finally(() => this.setState({loading: false}));
  }

  handleReview = () => {
    const {formData} = this.state;
    const data = {
      startDate: this.util.formatDateForMYSQL(formData.startDate),
      startTime: formData.startTime,
      status: formData.status
    };

    const stockCountEntries = [];
    this.state.products.forEach(entry => {
      if (entry.count) {
        stockCountEntries.push({
          id: entry.id,
          count: entry.count ? entry.count : 0,
          status: EnumStock.STOCK_COUNT_ENTRY_STATUS.COUNTED
        });
      }
    });

    if (stockCountEntries.length) {
      data.stockCountEntries = stockCountEntries;

      StockCountService.update(data, formData.id)
      .then(() => {
        this.props.handleReview();
      });
    } else {
      this.props.handleReview();
    }
  }

  handlePause = () => {
    
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
      products[selectCountIndex].status = EnumStock.STOCK_COUNT_ENTRY_STATUS.COUNTED;
      this.setState({
        products,
        selectCountIndex: -1
      });
      this.props.form.setFieldsValue({quantity: 0, searchProduct: ""});
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

    const existingProducts = Util.prototype.copyArrayObj(this.state.products);
    const index = existingProducts.findIndex(p => p.productVariantId === productVariant.id);
    this.setState({products: existingProducts, selectCountIndex: index});
    this.props.form.setFieldsValue({searchProduct: `${product.name} ${productVariant.name}`});
  }

  onChangeTabs = (key) => {
    key = Number(key);
    let status = "";
    if (key === TABS_LIST.COUNTED) {
      status = "counted";
    } else if (key === TABS_LIST.UNCOUNTED) {
      status = "uncounted";
    }
    this.fetchEntries(this.props.id, status);
  }

  renderTable() {
    return (
      <Table
        rowKey={((row, index) => index)}
        bordered={true}
        style={{marginTop: -10}}
        loading={this.state.loading}
        columns={[
          {
            title: <Translate id="text_product_name" />,
            dataIndex: "productName",
            key: "productName",
            render: (productName, record) => {
              return <div style={{display: "flex"}}>
                {productName} {record.variantName ? <div className="variant-name" style={{marginLeft: 15}}>{record.variantName}</div> : ""}
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
            dataIndex: "expected",
            key: "expected",
            align: "right",
            render: (expected) => Number(expected)
          },
          {
            title: <Translate id="text_count" />,
            dataIndex: "count",
            key: "count",
            align: "right",
            render: (count) => count ? count : 0
          }
        ]}
        dataSource={this.state.products}
      />
    );
  }

  render() {
    const {formData} = this.state;
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
          subTitle={formData.status ? <Badge count={this.ST_COUNT_STR[formData.status].title} style={{background: this.ST_COUNT_STR[formData.status].color}} /> : ""}
          extra={[
            <div key={1}>
              <Button type="danger" htmlType="button" style={{width: 90, marginRight: 15}} onClick={this.handlePause}>
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
            {this.renderTable()}
          </TabPane>
          <TabPane tab={<Translate id="text_counted" />} key="2">
            {this.renderTable()}
          </TabPane>
          <TabPane tab={<Translate id="text_uncounted" />} key="3">
            {this.renderTable()}
          </TabPane>
        </Tabs>

        <div className="clearFloat"></div>
        {this.state.modalVariant}
      </React.Fragment>
    );
  }
}