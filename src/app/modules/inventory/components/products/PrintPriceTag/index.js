import React from "react";
import {Form, Slider, Icon} from "antd";
import PriceTagList from "./PriceTagList";
import DropDownSearch from "../Product/DropDownSearch";
import List from "../../List";
import PriceTagAction from "../../../actions/products/priceTag";
import "./index.css";

export default class PrintPriceTag extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      dataSourceToPrint: [],
      productList: [],
      typeOfPrintLabel:1,
      numberOfColumn: !localStorage.getItem("numberOfColumn") ? 4 : parseFloat(localStorage.getItem("numberOfColumn")),
      paddingLeft: !localStorage.getItem("paddingLeft") ? 5 : parseFloat(localStorage.getItem("paddingLeft")),
      paddingRight: !localStorage.getItem("paddingRight") ? 5 : parseFloat(localStorage.getItem("paddingRight")),
      paddingTop: !localStorage.getItem("paddingTop") ? 5 : parseFloat(localStorage.getItem("paddingTop")),
      paddingBottom: !localStorage.getItem("paddingBottom") ? 5 : parseFloat(localStorage.getItem("paddingBottom")),
      widthOfLabel: !localStorage.getItem("widthOfLabel") ? 2 : parseFloat(localStorage.getItem("widthOfLabel")),
      heightOfLabel: !localStorage.getItem("heightOfLabel") ? 40 : parseFloat(localStorage.getItem("heightOfLabel")),
      fontSizeOfValue: !localStorage.getItem("fontSizeOfValue") ? 10 : parseFloat(localStorage.getItem("fontSizeOfValue")),
      fontSizeOfName: !localStorage.getItem("fontSizeOfName") ? 12 : parseFloat(localStorage.getItem("fontSizeOfName")),
      fontSizeOfPrice: !localStorage.getItem("fontSizeOfPrice") ? 12 : parseFloat(localStorage.getItem("fontSizeOfPrice")),
      isShowLabelSetting: false,
      iconType: "down"
    };
    this.TYPE_OF_PRINT = {
      QTY_IN_STOCK: 1,
      ALL_QTY: 2,
      CUSTOM: 3
    };
    this.columns = [
      {
        title: "Product Name",
        dataIndex: "productDescriptions",
        width: 200,
        key: "name",
        render: (text, record, index) => {
          return <this.InputText name={`name[${index}]`} data={record.productDescriptions.length > 0 ? record.productDescriptions[0].name : ""} form={this.props.form}/>;
        }
      },
      {
        title: "QTY In Store",
        width: 100,
        dataIndex: "qauntityInStore",
        key: "qauntityInStore"
      },
      {
        title: "Quantity",
        width: 100,
        dataIndex: "quantity",
        key: "qauntity"
      },
      {
        title: "QTY label",
        width: 100,
        key: "quantityLabel",
        render: (text, record, index) => {
          return <div>
            <this.InputNumber name={`barcode[${index}]`} data={record.barcode} className="hidden" form={this.props.form}/>
            <this.InputNumber name={`price[${index}]`} data={record.price} className="hidden" form={this.props.form}/>
            <this.InputNumber
              disabled={this.state.typeOfPrintLabel !== this.TYPE_OF_PRINT.CUSTOM}
              data={record.quantity}
              precision={0}
              isAutoSelect={true}
              name={`numberOfPrint[${index}]`}
              placeholder="Number of print"
              form={this.props.form}/>
          </div>;
        }
      },
      {
        title: "Action",
        width: 100,
        key: "action",
        render: (text, record, index) => <this.Button type="danger" className="btn-icon" onClick={() => this.handleRemoveProductList(index)}>
          <span className="icon-delete icon-padding-right"></span>
        </this.Button>
      },
    ];
    this.handleOnPrint = this.handleOnPrint.bind(this);
    this.handleOnGeneratePriceTag = this.handleOnGeneratePriceTag.bind(this);
    this.handleOnReset = this.handleOnReset.bind(this);
    this.onCangeTypeOfPrintLabel = this.onCangeTypeOfPrintLabel.bind(this);
    this.onChangePaddingLeft = this.onChangePaddingLeft.bind(this);
    this.onChangePaddingRight = this.onChangePaddingRight.bind(this);
    this.onChangePaddingTop = this.onChangePaddingTop.bind(this);
    this.onChangePaddingBottom = this.onChangePaddingBottom.bind(this);
    this.onChangeWidthOfLabel = this.onChangeWidthOfLabel.bind(this);
    this.onChangeHeightOfLabel = this.onChangeHeightOfLabel.bind(this);
    this.onChangeFontSizeOfValue = this.onChangeFontSizeOfValue.bind(this);
    this.onChangeFontSizeOfName = this.onChangeFontSizeOfName.bind(this);
    this.onChangeFontSizeOfPrice = this.onChangeFontSizeOfPrice.bind(this);
    this.changeStateSetting = this.changeStateSetting.bind(this);
    this.handleOnClickLabelSetting = this.handleOnClickLabelSetting.bind(this);
    this.onChangeLabelColumn = this.onChangeLabelColumn.bind(this);
    this.handleOnSelectList = this.handleOnSelectList.bind(this);
    this.handlePressEnterOnSearch = this.handlePressEnterOnSearch.bind(this);
    this.handleRemoveProductList = this.handleRemoveProductList.bind(this);
  }

  componentDidMount() {
    if (this.props.selectProductToPrint.passedTo) {
      this.setState({productList: this.props.selectProductToPrint.selectedProduct});
      this.props.dispatch(PriceTagAction.resetSelectProductFromListToPrint());
    }
  }

  handleOnGeneratePriceTag(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const dataSourceToPrint = [];
        if (values.name) {
          values.name.forEach((name, index) => {
            dataSourceToPrint.push({
              barcode: values.barcode[index],
              name,
              price: this.formatCurrency(values.price[index]),
              numberOfPrint: values.numberOfPrint[index],
            });
          });
        }
        this.setState({dataSourceToPrint});
      }
    });
  }

  handleOnPrint() {
    const element = document.getElementById("print-tag-content");
    if (element) {
      this.Util.printElem(element.innerHTML);
      this.setState({
        dataSourceToPrint: [],
        productList: []
      });
    }
  }

  handleOnReset() {
    this.setState({
      dataSourceToPrint: [],
      productList: []
    });
  }

  changeStateSetting(settingKey, value) {
    this.setState({
      [settingKey]: value
    });
    this.props.form.setFieldsValue({[settingKey]: value});
    localStorage.setItem(settingKey, value);
  }

  onCangeTypeOfPrintLabel(e) {
    const existingProductList = this.state.productList;
    this.setState({
      typeOfPrintLabel: e.target.value
    });
    existingProductList.forEach((productList, index) => {
      if (e.target.value === this.TYPE_OF_PRINT.ALL_QTY) {
        this.props.form.setFieldsValue({[`numberOfPrint[${index}]`]: productList.quantity});
      } else if(e.target.value === this.TYPE_OF_PRINT.QTY_IN_STOCK && productList.productLocations.length > 0) {
        let quantity = 0;
        productList.productLocations.forEach(productLocation => {
          quantity += productLocation.quantity;
        });
        this.props.form.setFieldsValue({[`numberOfPrint[${index}]`]: quantity});
      }
    });
  }

  onChangePaddingLeft(value) {
    this.changeStateSetting("paddingLeft", value);
  }

  onChangePaddingRight(value) {
    this.changeStateSetting("paddingRight", value);
  }

  onChangePaddingTop(value) {
    this.changeStateSetting("paddingTop", value);
  }

  onChangePaddingBottom(value) {
    this.changeStateSetting("paddingBottom", value);
  }

  onChangeWidthOfLabel(value) {
    this.changeStateSetting("widthOfLabel", value);
  }

  onChangeHeightOfLabel(value) {
    this.changeStateSetting("heightOfLabel", value);
  }

  onChangeFontSizeOfValue(value) {
    this.changeStateSetting("fontSizeOfValue", value);
  }

  onChangeFontSizeOfName(value) {
    this.changeStateSetting("fontSizeOfName", value);
  }

  onChangeFontSizeOfPrice(value) {
    this.changeStateSetting("fontSizeOfPrice", value);
  }

  onChangeLabelColumn(value) {
    this.changeStateSetting("numberOfColumn", value);
  }

  handleOnSelectList(value) {
    const existingProductList = this.state.productList;
    if (existingProductList.length === 0) {
      existingProductList.push(value);
    } else {
      let isNotTheSame = true;
      existingProductList.forEach(data => {
        if (data.barcode === value.barcode) {
          isNotTheSame = false;
          // existingProductList[index]["quantity"] += 1;
        }
      });

      if (isNotTheSame) {
        existingProductList.push(value);
      }
    }

    this.setState({productList: existingProductList});
  }

  handleRemoveProductList(index) {
    let existingProductList = this.state.productList;
    existingProductList.splice(index, 1);
    this.setState({productList: existingProductList});
  }

  handlePressEnterOnSearch(product) {
    this.handleOnSelectList(product);
  }

  handleOnClickLabelSetting() {
    if (this.state.isShowLabelSetting) {
      this.setState({
        isShowLabelSetting: false,
        iconType: "up"
      });
    } else {
      this.setState({
        isShowLabelSetting: true,
        iconType: "down"
      });
    }
  }

  renderLabelSetting() {
    return (
      <this.Row>
        <this.Col md="12" className="wrap-setting">
          <this.Row>
            <this.Col md="6">
              <div>Width</div>
              <this.Row>
                <this.Col md="9">
                  <Slider
                    min={0}
                    max={10}
                    defaultValue={this.state.widthOfLabel}
                    onChange={this.onChangeWidthOfLabel}
                    value={typeof this.state.widthOfLabel === "number" ? this.state.widthOfLabel : 0}
                    step={0.1}
                  />
                </this.Col>
                <this.Col md="3">
                  <this.InputNumber
                    name="widthOfLabel"
                    style={{ marginLeft: 16 }}
                    form={this.props.form}
                    step={0.1}
                    precision={0}
                    data={this.state.widthOfLabel}
                    onChange={this.onChangeWidthOfLabel}/>
                </this.Col>
              </this.Row>
              <div>Height</div>
              <this.Row>
                <this.Col md="9">
                  <Slider
                    min={0}
                    max={100}
                    defaultValue={this.state.heightOfLabel}
                    onChange={this.onChangeHeightOfLabel}
                    value={typeof this.state.heightOfLabel === "number" ? this.state.heightOfLabel : 0}
                    step={0.5}/>
                </this.Col>
                <this.Col md="3">
                  <this.InputNumber
                    name="heightOfLabel"
                    style={{ marginLeft: 16 }}
                    form={this.props.form}
                    step={0.5}
                    data={this.state.heightOfLabel}
                    onChange={this.onChangeHeightOfLabel}
                    precision={0} />
                </this.Col>
              </this.Row>
              <div>Font size of label value</div>
              <this.Row>
                <this.Col md="9">
                  <Slider
                    min={0}
                    max={20}
                    defaultValue={this.state.fontSizeOfValue}
                    onChange={this.onChangeFontSizeOfValue}
                    value={typeof this.state.fontSizeOfValue === "number" ? this.state.fontSizeOfValue : 0}
                    step={1}
                  />
                </this.Col>
                <this.Col md="3">
                  <this.InputNumber
                    name="fontSizeOfValue"
                    style={{ marginLeft: 16 }}
                    form={this.props.form}
                    step={1}
                    data={this.state.fontSizeOfValue}
                    onChange={this.onChangeFontSizeOfValue}
                    precision={0}/>
                </this.Col>
              </this.Row>
              <div>Font size of product name</div>
              <this.Row>
                <this.Col md="9">
                  <Slider
                    min={0}
                    max={20}
                    defaultValue={this.state.fontSizeOfName}
                    onChange={this.onChangeFontSizeOfName}
                    value={typeof this.state.fontSizeOfName === "number" ? this.state.fontSizeOfName : 0}
                    step={1}/>
                </this.Col>
                <this.Col md="3">
                  <this.InputNumber
                    name="fontSizeOfName"
                    style={{ marginLeft: 16 }}
                    form={this.props.form}
                    step={1}
                    data={this.state.fontSizeOfName}
                    onChange={this.onChangeFontSizeOfName}
                    precision={0}/>
                </this.Col>
              </this.Row>
              <div>Font size of product price</div>
              <this.Row>
                <this.Col md="9">
                  <Slider
                    min={0}
                    max={20}
                    defaultValue={this.state.fontSizeOfPrice}
                    onChange={this.onChangeFontSizeOfPrice}
                    value={typeof this.state.fontSizeOfPrice === "number" ? this.state.fontSizeOfPrice : 0}
                    step={1} />
                </this.Col>
                <this.Col md="3">
                  <this.InputNumber
                    name="fontSizeOfPrice"
                    style={{ marginLeft: 16 }}
                    form={this.props.form}
                    step={1}
                    data={this.state.fontSizeOfPrice}
                    onChange={this.onChangeFontSizeOfPrice}
                    precision={0}/>
                </this.Col>
              </this.Row>
            </this.Col>
            <this.Col md="6">
              <div>Padding left</div>
              <this.Row>
                <this.Col md="9">
                  <Slider
                    min={0}
                    max={100}
                    defaultValue={this.state.paddingLeft}
                    onChange={this.onChangePaddingLeft}
                    value={typeof this.state.paddingLeft === "number" ? this.state.paddingLeft : 0}
                    step={0.5}/>
                </this.Col>
                <this.Col md="3">
                  <this.InputNumber
                    name="paddingLeft"
                    style={{ marginLeft: 16 }}
                    form={this.props.form}
                    step={0.5}
                    data={this.state.paddingLeft}
                    onChange={this.onChangePaddingLeft}
                    precision={0}/>
                </this.Col>
              </this.Row>
              <div>Padding right</div>
              <this.Row>
                <this.Col md="9">
                  <Slider
                    min={0}
                    max={100}
                    defaultValue={this.state.paddingRight}
                    onChange={this.onChangePaddingRight}
                    value={typeof this.state.paddingRight === "number" ? this.state.paddingRight : 0}
                    step={0.5}/>
                </this.Col>
                <this.Col md="3">
                  <this.InputNumber
                    name="paddingRight"
                    style={{ marginLeft: 16 }}
                    form={this.props.form}
                    step={0.5}
                    data={this.state.paddingRight}
                    onChange={this.onChangePaddingRight}
                    precision={0}/>
                </this.Col>
              </this.Row>
              <div>Padding top</div>
              <this.Row>
                <this.Col md="9">
                  <Slider
                    min={0}
                    max={100}
                    defaultValue={this.state.paddingTop}
                    onChange={this.onChangePaddingTop}
                    value={typeof this.state.paddingTop === "number" ? this.state.paddingTop : 0}
                    step={0.5}/>
                </this.Col>
                <this.Col md="3">
                  <this.InputNumber
                    name="paddingTop"
                    style={{ marginLeft: 16 }}
                    form={this.props.form}
                    step={0.5}
                    data={this.state.paddingTop}
                    onChange={this.onChangePaddingTop}
                    precision={0}/>
                </this.Col>
              </this.Row>
              <div>Padding bottom</div>
              <this.Row>
                <this.Col md="9">
                  <Slider
                    min={0}
                    max={100}
                    defaultValue={this.state.paddingBottom}
                    onChange={this.onChangePaddingBottom}
                    value={typeof this.state.paddingBottom === "number" ? this.state.paddingBottom : 0}
                    step={0.5}/>
                </this.Col>
                <this.Col md="3">
                  <this.InputNumber
                    name="paddingBottom"
                    style={{ marginLeft: 16 }}
                    form={this.props.form}
                    step={0.5}
                    data={this.state.paddingBottom}
                    onChange={this.onChangePaddingBottom}
                    precision={0}/>
                </this.Col>
              </this.Row>
              <div>Number of column</div>
              <this.Row>
                <this.Col md="9">
                  <Slider
                    min={1}
                    max={5}
                    defaultValue={this.state.numberOfColumn}
                    onChange={this.onChangeLabelColumn}
                    value={typeof this.state.numberOfColumn === "number" ? this.state.numberOfColumn : 0}
                    step={1}/>
                </this.Col>
                <this.Col md="3">
                  <this.InputNumber
                    name="numberOfColumn"
                    style={{ marginLeft: 16 }}
                    form={this.props.form}
                    step={1}
                    data={this.state.numberOfColumn}
                    onChange={this.onChangeLabelColumn}
                    precision={0}/>
                </this.Col>
              </this.Row>
            </this.Col>
          </this.Row>
          <div className="text-center" style={{marginTop: 15}}>
            <this.Button className="danger text-uppercase" onClick={this.handleOnClickLabelSetting}>
              <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_close" />
            </this.Button>
            {
              this.state.dataSourceToPrint.length > 0 ?
                <this.Button
                  propKey="btn_product_print_label"
                  className="info margin-left-8"
                  onClick={this.handleOnPrint}>
                  <span className="icon-barcode icon-padding-right"></span>
                  <this.Translate id="btn_product_print_label" />
                </this.Button>
                :
                ""
            }
          </div>
          {/* <this.Switchs
        name="isShowPrice"
        label="Show price"
        checked={1}
        form={this.props.form}/>
      <this.Switchs
        name="isShowName"
        label="Show name"
        checked={1}
        form={this.props.form}/>
      <this.Switchs
        name="isShowBarcode"
        label="Show barcode"
        checked={1}
        form={this.props.form}/>
      <this.Switchs
        name="isShowProductCode"
        label="Show product code"
        checked={1}
        form={this.props.form}/> */}
        </this.Col>
      </this.Row>
    );
  }
  render() {
    return (
      <div style={{height: "100%", display: "flex", flexDirection: "column", width: "100%"}}>
        {this.renderBreadCrumb()}
        <div className="main-layout" style={{height: "100%", display: "flex", flexDirection: "column", padding: 0}}>
          <Form autoComplete="off" onSubmit={this.handleOnGeneratePriceTag} style={{display: "flex", flexDirection: "column"}}>
            <this.Row style={{height: "100%", marginLeft: 0}}>
              <this.Col md="6">
                <div id="print-price-tag">
                  <this.Row>
                    <this.Col md="12">
                      <this.RadioButton 
                        name="printType"
                        disabled={this.state.productList.length <= 0}
                        defaultValue={this.TYPE_OF_PRINT.QTY_IN_STOCK}
                        onChange={this.onCangeTypeOfPrintLabel}
                        dataSource={[
                          {
                            value: this.TYPE_OF_PRINT.QTY_IN_STOCK,
                            title: "Number of label base on quantity in Store" 
                          }, 
                          {
                            value: this.TYPE_OF_PRINT.ALL_QTY,
                            title: "Number of label base on all quantity" 
                          },
                          {
                            value: this.TYPE_OF_PRINT.CUSTOM,
                            title: "Number of label base on your input" 
                          }
                        ]}
                        form={this.props.form} />
                      <div className="wrap-label-setting-button">
                        <div>
                          <div onClick={this.handleOnClickLabelSetting}>Label setting <Icon type="down" /></div>
                          { this.state.isShowLabelSetting ? this.renderLabelSetting() : ""}
                        </div>
                      </div>
                    </this.Col>
                    <DropDownSearch
                      productSearch={this.props.productSearch}
                      handleOnSelectList={this.handleOnSelectList}
                      handlePressEnterOnSearch={this.handlePressEnterOnSearch}
                      dispatch={this.props.dispatch}
                      locale={this.props.locale}
                      form={this.props.form}/>
                  </this.Row>
                  <this.Table
                    dataSource={this.state.productList}
                    columns={this.columns}
                    locale={{emptyText: <this.Translate id="placeholder_table_composite_product" />}} />
                  <this.Button htmlType="submit" type="info" className="btn-print-label text-uppercase" onClick={this.handleOnGeneratePriceTag}>
                    <span className="icon-print icon-padding-right text-uppercase"></span> Generate
                  </this.Button>
                  {
                    this.state.dataSourceToPrint.length > 0 ?
                      <this.Button
                        propKey="btn_product_print_label"
                        className="info margin-left-8"
                        onClick={this.handleOnPrint}>
                        <span className="icon-barcode icon-padding-right"></span>
                        <this.Translate id="btn_product_print_label" />
                      </this.Button>
                      :
                      ""
                  }
                </div>
              </this.Col>
              <this.Col md="6" style={{borderLeft: "1px solid #f7f7f7", overflow: "auto"}}>
                <PriceTagList
                  dataSource={this.state.dataSourceToPrint}
                  widthOfLabel={this.state.widthOfLabel}
                  heightOfLabel={this.state.heightOfLabel}
                  paddingLeft={this.state.paddingLeft}
                  paddingRight={this.state.paddingRight}
                  paddingTop={this.state.paddingTop}
                  paddingBottom={this.state.paddingBottom}
                  fontSizeOfValue={this.state.fontSizeOfValue}
                  fontSizeOfName={this.state.fontSizeOfName}
                  fontSizeOfPrice={this.state.fontSizeOfPrice}
                  numberOfColumn={this.state.numberOfColumn}/>
              </this.Col>
            </this.Row>
          </Form>
        </div>
      </div>
    );
  }
}
