import React from "react";
import moment from "moment";
import {Translate} from "react-localize-redux";
import {
  PageHeader,
  Row,
  Col,
  Table,
  message,
  Icon,
  Form,
  Badge
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
import Enum from "../../../../common/enums";
import EnumStock from "../../../../inventory/enums";
import EnumProduct from "../../../../inventory/enums";
import history from "../../../../common/router/history";
import StockCountService from "../../../services/stock/StockCountService";
import LocationService from "../../../../pos/services/settings/LocationService";
import ProductVariantAction from "../../../../inventory/actions/products/productVariant";
import {stringTranslate} from "../../../../common/helper/stringTranslate";
import SearchProductDropdown from "../../../../pos/components/transactions/Invoice/SearchProduct";
import VariantProduct from "../../../../pos/containers/transactions/SaleWalkin/VariantProduct";
import ProductVariantService from "../../../services/products/ProductVariantService";

export default class FormStep1 extends React.Component  {
  state = {
    formData: {},
    entries: [],
    locations: [],
    productSearch: [],
    selectedProduct: null,
    modalVariant: null,
    loadingSubmit: false
  }
  util = new Util();
  ST_COUNT_STR = {
    [EnumStock.STOCK_COUNT_STATUS.IN_PROGRESS]: {title: stringTranslate("text_in_progress", this.props.locale), color: "#ffa940"},
    [EnumStock.STOCK_COUNT_STATUS.PAUSE]: {title: stringTranslate("text_pause", this.props.locale), color: "#f50"},
    [EnumStock.STOCK_COUNT_STATUS.COMPLETED]: {title: stringTranslate("text_completed", this.props.locale), color: "#87d068"}
  };
  pageTitle = "";
  id = "";

  componentDidMount() {
    const idParam = this.props.match.params.id;

    if (idParam) {
      this.id = idParam;
    }

    if (idParam) {
      this.pageTitle = "text_update_stock_count";
      this.fetchDetail(this.id);
    } else {
      this.pageTitle = "text_create_stock_count";
      this.setState({
        formData: {
          type: EnumStock.STOCK_COUNT_TYPE.PARTIAL
        }
      });
    }

    LocationService.lists(50, 0)
    .then(response => {
      const locations = response.data.data;
      this.setState(preState => {
        if (!this.state.formData.name) {
          const location = locations.find(location => location.id === this.util.getLocationId());
          let name = "";
          if (location) {
            name = `${location.name} - ${moment().format("MMM DD, YYYY")} at ${moment().format("hh:mm A")}`;
          }
          preState.formData.name = name;
        }
        
        preState.locations = locations;
        return preState;
      });
    });
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

  fetchDetail(id) {
    StockCountService.detail(id)
    .then(response => {
      const data = response.data.data;
      let entries = [];
      if (data.type === EnumStock.STOCK_COUNT_TYPE.PARTIAL) {
        entries = data.stockCountEntries;
      }
      delete data.stockCountEntries;
      this.setState({
        formData: data,
        entries: entries
      });
    });
  }

  handleStartCount = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.formData.type === EnumStock.STOCK_COUNT_TYPE.PARTIAL && !this.state.entries.length) {
          return this.util.sweetAlertMessageV2(
            stringTranslate("text_warning", this.props.locale),
            "Please insert products for count",
            "error"
          );
        }

        values.startDate = this.util.formatDateForMYSQL(values.startDate);
        values.startTime = moment(values.startTime).format("HH:mm:ss");
        const stockCountEntries = [];
        this.state.entries.forEach(entry => {
          stockCountEntries.push({
            id: entry.id,
            productId: entry.productId,
            productVariantId: entry.productVariantId,
            expected: entry.expected,
            count: entry.count,
            status: entry.status
          });
        });
        values.stockCountEntries = stockCountEntries;
        delete values.searchProduct;
        this.save(values);
      }
    });
  }

  save(data) {
    if (this.id) {
      if (this.state.formData.type === EnumStock.STOCK_COUNT_TYPE.FULL_COUNT) {
        return this.props.goStep(2);
      }

      data.status = this.state.formData.status;
      let entries = data.stockCountEntries;
      delete data.stockCountEntries;
      entries = entries.filter(entry => !entry.id || entry.status === `${Enum.ARCHIVE}`);
      data.stockCountEntries = entries;
      if (entries.length && data.status !== EnumStock.STOCK_COUNT_STATUS.PAUSE) {
        StockCountService.update(data, this.id)
        .then(() => {
          this.props.handleStartCount(this.state.formData, this.state.entries);
        });
      } else {
        this.props.goStep(2);
      }
    } else {
      this.setState({loadingSubmit: true});
      StockCountService.create(data)
      .then(response => {
        history.push(`/stock/stock-count/update/${response.data.data.id}`);
        this.props.handleStartCount(this.state.formData, this.state.entries);
      })
      .catch(err => {
        const error = err.response && err.response.data;
        if (error) {
          console.log("err", error);
        }
      })
      .finally(() => this.setState({loadingSubmit: false}));
    }
  }

  handleRemoveProduct = (id, index) => {
    const selectedProducts = this.util.copyArrayObj(this.state.entries);

    if (id) {
      this.util.sweetAlertConfirm(
        "",
        stringTranslate("text_are_you_sure", this.props.locale),
        [stringTranslate("text_cancel", this.props.locale), stringTranslate("text_yes", this.props.locale)]
      )
      .then(willRemove => {
        if (willRemove) {
          selectedProducts[index].status = `${Enum.ARCHIVE}`;
          return this.setState({entries: selectedProducts});
        }
      });
    } else {
      selectedProducts.splice(index, 1);
      this.setState({entries: selectedProducts});
    }
  }

  handleChangeDate = (date) => {
    let locationName = "";
    const locationId = this.props.form.getFieldValue("locationId");
    const startTime = this.props.form.getFieldValue("startTime");
    const location = this.state.locations.find(location => location.id === locationId);
    if (location) {
      locationName = location.name;
    }
    this.setState(preState => {
      preState.formData.startDate = date;
      return preState;
    });
    this.setStockCountName(locationName, date, startTime);
  }

  handleChangeTime = (time) => {
    let locationName = "";
    const locationId = this.props.form.getFieldValue("locationId");
    const startDate = this.props.form.getFieldValue("startDate");
    const location = this.state.locations.find(location => location.id === locationId);
    if (location) {
      locationName = location.name;
    }
    this.setState(preState => {
      preState.formData.startTime = time;
      return preState;
    });
    this.setStockCountName(locationName, startDate, time);
  }

  handleChangeLocation = (locationId) => {
    const location = this.state.locations.find(location => location.id === locationId);
    const startDate = this.props.form.getFieldValue("startDate");
    const startTime = this.props.form.getFieldValue("startTime");
    this.setState(preState => {
      preState.formData.locationId = locationId;
      return preState;
    });
    this.setStockCountName(location.name, startDate, startTime);
  }

  setStockCountName(location, startDate, startTime) {
    let name = "";
    const formData = this.util.copyObj(this.state.formData);
    if (location) {
      name += location;
    }

    if (startDate) {
      name += ` - ${this.util.formatDate(startDate, "MMM DD, YYYY")}`;
    }

    if (startTime) {
      name += ` at ${this.util.formatDate(startTime, "hh:mm A")}`;
    }

    formData.name = name;
    this.setState({formData});
  }

  handleOnSelectList = async (product, productVariant, isRequestVariantForm = true) => {
    let isProductVariant = product.productOption === EnumProduct.PRODUCT_VARIANT;
    let locationId = Number(this.props.form.getFieldValue("locationId"));
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

    const productLocation = (await ProductVariantService.getDetailWithLocation(productVariant.id, locationId)).data.data;
    if (productLocation) {
      productVariant.quantity = productLocation.quantity;
    }
    
    const existingProductList = this.util.copyArrayObj(this.state.entries);
    if (existingProductList.length === 0) {
      existingProductList.unshift({
        id: "",
        productId: product.id,
        productVariantId: productVariant.id,
        variantName: productVariant.name,
        productName: `${product.name ? product.name : product.namekm}`,
        unitName: product.unit.name,
        barcode: productVariant.barcode,
        expected: productVariant.quantity,
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
          productId: product.id,
          productVariantId: productVariant.id,
          variantName: productVariant.name,
          productName: `${product.name ? product.name : product.namekm}`,
          unitName: product.unit.name,
          barcode: productVariant.barcode,
          expected: productVariant.quantity,
          status: 1,
        });
      }
    }
    this.setState({
      entries: existingProductList
    });
  }

  handleClearProduct = () => {
    Util.prototype.sweetAlertConfirm(
      "",
      stringTranslate("text_are_you_sure", this.props.locale),
      [stringTranslate("text_cancel", this.props.locale), stringTranslate("text_clear", this.props.locale)],
    )
    .then(willClear => {
      if (willClear) {
        this.setState({entries: []});
      }
    });
  }

  render() {
    const {form, locale} = this.props;
    const {formData} = this.state;
    return (
      <Form onSubmit={this.handleStartCount}>
        <PageHeader 
          style={{
            backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0,
            position: "relative"
          }}
          onBack={this.props.goBack}
          title={<Translate id={this.pageTitle} />}
          subTitle={formData.status ? <Badge count={this.ST_COUNT_STR[formData.status].title} style={{background: this.ST_COUNT_STR[formData.status].color}} /> : ""}
          extra={[
            <Button key={1} type="info" htmlType="submit"><Translate id="text_start_count" /></Button>
          ]}
        />
        
        <Row gutter={26}>
          <Col span={8} style={{padding: "12px 60px 0 14px"}}>
            <DatePickers 
              name="startDate"
              label={<Translate id="text_start_date" />}
              placeholder="DD/MM/YYYY"
              defaultValue={formData.startDate ? moment(formData.startDate) : moment()}
              onChange={this.handleChangeDate}
              form={form} />

            <TimePickers 
              name="startTime"
              label={<Translate id="text_start_time" />}
              placeholder="hh:mm A"
              defaultValue={formData.startTime ? moment(`${this.util.formatDateForMYSQL(formData.startDate)} ${formData.startTime} `) : moment()}
              inputStyle={{width: "100%"}}
              timeFormat="hh:mm A"
              use12Hours={true}
              onChange={this.handleChangeTime}
              form={form} />

            <Select
              name="locationId"
              label={<Translate id="text_location" />}
              valueKey="id"
              placeholder={`${stringTranslate("text_location", locale)}`}
              defaultValue={formData.locationId ? formData.locationId : Util.prototype.getLocationId()}
              dataSource={this.state.locations}
              onChange={this.handleChangeLocation}
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
              className="main-radio-acc product-type radio-count-type"
              name="type"
              type="radio"
              defaultValue={formData.type ? formData.type : EnumStock.STOCK_COUNT_TYPE.PARTIAL}
              form={form}
              onChange={(e) => {
                const value = e.target.value;
                this.setState(preState => {
                  preState.formData.type = value;
                  return preState;
                });
              }}
              >
                <RadioChildBox
                  key={1}
                  title={<div style={{borderBottom: "1px solid #ddd", marginBottom: 5}}><Translate id="text_partial" /></div>}
                  language="Specify the products to include in this inventory count"
                  value={EnumStock.STOCK_COUNT_TYPE.PARTIAL}
                />
                <RadioChildBox
                  key={2}
                  title={<div style={{borderBottom: "1px solid #ddd", marginBottom: 5}}><Translate id="text_full_count" /></div>}
                  language="Include all the products in this inventory count"
                  value={EnumStock.STOCK_COUNT_TYPE.FULL_COUNT}
                />
            </RadioBox>

            {
              formData.type === EnumStock.STOCK_COUNT_TYPE.PARTIAL ?
              <React.Fragment>
                <SearchProductDropdown 
                  productSearch={this.props.productSearch}
                  handleOnSelectList={this.handleOnSelectList}
                  className="ca-input-v1 purchase-order"
                  locale={locale}
                  style={{marginTop: 39}}
                  filter={JSON.stringify({locationId: formData.locationId})}
                  form={form} /> 

                <div style={{display: "flex", justifyContent: "space-between", marginTop: 20}}>
                  <div style={{fontSize: 16}}><Translate id="text_include_product" /></div>
                  <Button onClick={this.handleClearProduct} disabled={formData.status === EnumStock.STOCK_COUNT_STATUS.COMPLETED}>
                    <Translate id="text_clear" />
                  </Button>
                </div>

                <Table 
                  rowKey={((record, index) => index)}
                  className="table-form-invoice-entry"
                  pagination={false}
                  locale={{emptyText: <Translate id="text_no_sale_entries_product" />}}
                  rowClassName={((record) => record.status === `${Enum.ARCHIVE}` ? "hidden" : "")}
                  columns={[
                    {
                      title: <Translate id="text_product_name" />,
                      dataIndex: "productName",
                      key: "name",
                      render: (productName, record) => {
                        return <div>
                          <div>{productName}</div>
                          {record.variantName ? <div className="variant-name">{record.variantName}</div> : ""}
                        </div>;
                      }
                    },
                    {
                      title: <Translate id="text_barcode" />,
                      dataIndex: "barcode",
                      key: "barcode"
                    },
                    {
                      title: <Translate id="text_action" />,
                      dataIndex: "id",
                      key: "id",
                      render: (id, record, index) => {
                        return <Button htmlType="button" onClick={() => this.handleRemoveProduct(id, index)} disabled={formData.status === EnumStock.STOCK_COUNT_STATUS.COMPLETED}>
                          <Icon type="delete" /> <Translate id="text_remove" />
                        </Button>;
                      }
                    }
                  ]}
                  dataSource={this.state.entries}
                  style={{marginBottom: 20}}
                />
              </React.Fragment>
              :
              null
            }
            
          </Col>
        </Row>

        {this.state.modalVariant}
      </Form>
    );
  }
}