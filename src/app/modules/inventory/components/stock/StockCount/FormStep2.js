import React from "react";
import { Translate } from "react-localize-redux";
import {
  Badge,
  PageHeader,
  Pagination,
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
import ProductVariantService from "../../../services/products/ProductVariantService";
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
    pagination: {},
    products: [],
    productSearch: [],
    modalVariant: null,
    selectedProduct: null,
    current: 1,
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
  
  pageSize = 10;
  activeTab = "all";
  pagSizeOption = ["10", "20", "40", "50"];

  componentDidMount() {
    StockCountService.detail(this.props.id)
    .then(response => {
      const detail = response.data.data;
      delete detail.stockCountEntries;
      this.setState({formData: detail});
      this.fetchEntries(detail.id, "all", this.pageSize, this.state.current, detail.type, detail.locationId);
    });
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

  async fetchEntries(id, status, limit, offset, type, locationId) {
    offset = (offset - 1) * limit;
    this.setState({loading: true});
    StockCountService.getStockCountEntriesByStatus(id, status, limit, offset, type, locationId)
    .then(response => {
      const products = response.data.data.length && response.data.data.map(entry => ({...entry, oldCount: entry.count}));
      this.setState({
        products,
        pagination: response.data.pagination
      });
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
      if (Number(entry.count) && entry.count !== entry.oldCount) {
        stockCountEntries.push({
          id: entry.id ? entry.id : "",
          expected: entry.expected,
          count: entry.count ? Number(entry.count) : 0,
          productId: entry.productId,
          productVariantId: entry.productVariantId,
          status: EnumStock.STOCK_COUNT_ENTRY_STATUS.COUNTED
        });
      }
    });

    if (stockCountEntries.length && formData.status !== EnumStock.STOCK_COUNT_STATUS.PAUSE) {
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
    const {formData} = this.state;
    const data = {
      startDate: this.util.formatDateForMYSQL(formData.startDate),
      startTime: formData.startTime,
      status: EnumStock.STOCK_COUNT_STATUS.PAUSE
    };
    data.stockCountEntries = [];

    StockCountService.update(data, formData.id)
    .then(() => {
      StockCountService.detail(this.props.id)
      .then(response => {
        this.setState({formData: response.data.data});
      });
      this.fetchEntries(formData.id, this.activeTab, this.pageSize, this.state.current, formData.type, formData.locationId);
    });
  }

  handleResume = () => {
    const {formData} = this.state;
    const data = {
      startDate: this.util.formatDateForMYSQL(formData.startDate),
      startTime: formData.startTime,
      status: EnumStock.STOCK_COUNT_STATUS.IN_PROGRESS
    };
    data.stockCountEntries = [];

    StockCountService.update(data, formData.id)
    .then(() => {
      StockCountService.detail(this.props.id)
      .then(response => {
        this.setState({formData: response.data.data});
      });
      this.fetchEntries(formData.id, this.activeTab, this.pageSize, this.state.current, formData.type, formData.locationId);
    });
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

    const existingProducts = this.state.products;
    const index = existingProducts.findIndex(p => p.barcode === productVariant.barcode);
    if (index >= 0) {
      existingProducts[index].productId = product.id;
      existingProducts[index].productVariantId = productVariant.id;
      this.props.form.setFieldsValue({searchProduct: `${product.name} ${productVariant.name}`});
      this.setState({selectCountIndex: index, products: existingProducts});
    } else {
      this.util.sweetAlertMessageV2(
        "",
        stringTranslate("text_product_not_in_list", this.props.locale),
        "error"
      );
    }
  }

  handleScan = (value) => {
    ProductVariantService.fetchByBarcode(value)
    .then(response => {
      const variant = response.data.data;
      const products = this.util.copyArrayObj(this.state.products);
      const index = products.findIndex(p => p.barcode = variant && variant.barcode);
      if (index >= 0) {
        this.setState(preState => {
          preState.products[index].count = products[index].count + 1;
          return preState;
        });
      } else {
        this.util.sweetAlertMessageV2(
          "",
          stringTranslate("text_product_not_in_list", this.props.locale),
          "error"
        );
      }
    });
  }

  onChangeTabs = (key) => {
    const {formData} = this.state;
    key = Number(key);
    let status = "all";
    if (key === TABS_LIST.COUNTED) {
      status = "counted";
    } else if (key === TABS_LIST.UNCOUNTED) {
      status = "uncounted";
    }
    this.activeTab = status;
    this.setState({current: 1});
    this.fetchEntries(this.props.id, status, this.pageSize, 1, formData.type, formData.locationId);
  }

  onTableChange = (current, pageSize) => {
    const {formData} = this.state;
    this.pageSize = pageSize;
    this.setState({current});
    this.fetchEntries(formData.id, this.activeTab, pageSize, current, formData.type, formData.locationId);
  }

  renderTable() {
    return (
      <Table
        rowKey={((row, index) => index)}
        bordered={true}
        style={{marginTop: -10}}
        loading={this.state.loading}
        rowClassName={((record, index) => index === this.state.selectCountIndex ? "process-count-row" : "")}
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
        pagination={false}
      />
    );
  }

  render() {
    const {formData, pagination} = this.state;

    const searchProductProps = {
      productSearch: this.state.productSearch,
      handleOnSelectList: this.handleOnSelectList
    };

    if (this.state.enableQuickScan) {
      searchProductProps.handleOnSelectList = () => {};
      searchProductProps.handleScan = this.handleScan;
      searchProductProps.onChange = (e) => {
        const value = e.target.value;
        if (value.length > 5) {
          this.handleScan(value);
        }
      };
    }

    let disableCount = false;
    if (formData.status === EnumStock.STOCK_COUNT_STATUS.PAUSE) {
      disableCount = true;
    }

    return (
      <React.Fragment>
        <PageHeader
          style={{
            backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0,
            position: "relative"
          }}
          onBack={this.props.goBack}
          title={formData && formData.name}
          subTitle={formData.status ? <Badge count={this.ST_COUNT_STR[formData.status].title} style={{background: this.ST_COUNT_STR[formData.status].color}} /> : ""}
          extra={[
            <div key={1}>
              {
                formData.status === EnumStock.STOCK_COUNT_STATUS.PAUSE ?
                  <Button type="danger" htmlType="button" style={{width: 90, marginRight: 15}} onClick={this.handleResume}>
                    <Translate id="text_resume" />
                  </Button>
                :
                  <Button type="danger" htmlType="button" style={{width: 90, marginRight: 15}} onClick={this.handlePause}>
                    <Translate id="text_pause" />
                  </Button>
              }
              <Button type="info" htmlType="button" style={{width: 90}} onClick={this.handleReview}>
                <Translate id="text_review" />
              </Button>
            </div>
          ]}
        />

        <div style={{display: "flex", marginTop: 10}} className="input-product-count">
          <SearchProductDropdown 
            {...searchProductProps}
            placeholder={`${stringTranslate("text_search_product", this.props.locale)}`}
            className="ca-input-v1 purchase-order"
            locale={this.props.locale}
            style={{flexGrow: 1}}
            disabled={disableCount}
            form={this.props.form} /> 

          <InputNumber 
            name="quantity"
            className="input-count-quantity"
            placeholder={`${stringTranslate("text_quantity", this.props.locale)}`}
            style={{padding: "0 15px", marginTop: -4}}
            disabled={this.state.enableQuickScan || disableCount}
            isAutoSelect={true}
            handlePressEnter={this.handleEnterQuantity}
            form={this.props.form}/>

          <Button type="info" style={{width: 80, height: 40, marginRight: 15}} htmlType="button" onClick={this.handleCount} disabled={this.state.enableQuickScan || disableCount}>
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

        {
          pagination.total ?
          <div className="float-right" style={{margin: "20px -8px"}}>
            <Pagination
              total={pagination.total}
              showTotal={(total) => `${stringTranslate("text_total", this.props.locale)} ${total} ${stringTranslate("text_records", this.props.locale)}`}
              pageSize={pagination.limit}
              current={this.state.current}
              size="small"
              showSizeChanger
              onShowSizeChange={this.onTableChange}
              onChange={this.onTableChange}
            />
          </div>
          : null
        }

        <div className="clearFloat"></div>
        {this.state.modalVariant}
      </React.Fragment>
    );
  }
}