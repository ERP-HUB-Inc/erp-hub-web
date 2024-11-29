import React from "react";
import {Form, Slider, Icon} from "antd";
import PriceTagList from "./PriceTagList";
import DropDownSearch from "../Product/DropDownSearch";
import Enum from "../../../enums";
import Util from "../../../utils";
import List from "../../List";
import VariantProduct from "../../../../pos/containers/transactions/SaleWalkin/VariantProduct";
import ProductVariantAction from "../../../actions/products/productVariant";
import ProductVariantConstant from "../../../constants/products/productVariant";
import "./index.css";

export default class PrintPriceTag extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      type: 1,
      dataSourceToPrint: [],
      productList: [],
      typeOfPrintLabel: 1,
      modalVariant: null,
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
      isAutoFocusInputNumberToPrint: false,
      isFocusSearchInput: false,
      iconType: "down"
    };
    this.TYPE_OF_PRINT = {
      QTY_IN_STOCK: 1,
      ALL_QTY: 2,
      CUSTOM: 3
    };
    this.columns = [
      {
        title: <this.Translate id="text_item_name" />,
        dataIndex: "productDescriptions",
        width: 200,
        key: "name",
        render: (text, record, index) => {
          let variantName = "";
          if (record.productOption === Enum.PRODUCT_VARIANT) {
            variantName = ` / ${record.variantName}`;
          }
          return <this.InputText name={`name[${index}]`} data={record.productName + variantName} form={this.props.form}/>;
        }
      },
      {
        title: <this.Translate id="text_qty_in_stock" />,
        width: 140,
        dataIndex: "qauntityInStore",
        align: "center",
        key: "qauntityInStore"
      },
      {
        title: <this.Translate id="text_quantity" />,
        width: 100,
        dataIndex: "quantity",
        align: "center",
        key: "qauntity"
      },
      {
        title: <this.Translate id="text_qty_label" />,
        width: 120,
        key: "quantityLabel",
        render: (text, record, index) => {
          return <div>
            <this.InputNumber name={`barcode[${index}]`} data={record.barcode} className="hidden" form={this.props.form}/>
            <this.InputNumber name={`price[${index}]`} data={record.price} className="hidden" form={this.props.form}/>
            <this.InputNumber
              disabled={this.state.typeOfPrintLabel !== this.TYPE_OF_PRINT.CUSTOM}
              data={record.qauntityInStore}
              precision={0}
              isAutoSelect={true}
              isAutoFocus={true}
              didUpdateMakeAutoFocus={this.state.isAutoFocusInputNumberToPrint && index === 0}
              name={`numberOfPrint[${index}]`}
              handleOnFocus={this.handleFocusInputNumberToPrint}
              placeholder="Number of print"
              form={this.props.form}/>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_action" />,
        width: 80,
        align: "center",
        key: "action",
        render: (text, record, index) => <this.Button type="danger" className="btn-icon" onClick={() => this.handleRemoveProductList(index)}>
          <span className="icon-delete icon-padding-right"></span>
        </this.Button>
      },
    ];

    this.handleOnFocusSearch = this.handleOnFocusSearch.bind(this);
    this.handleFocusInputNumberToPrint = this.handleFocusInputNumberToPrint.bind(this);
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
    this.handleCancelVariantProduct = this.handleCancelVariantProduct.bind(this);
    this.handleSelectType = this.handleSelectType.bind(this);
  }

  componentDidMount() {
    
    super.componentDidMount();
  }

  componentDidUpdate() {
    if (this.props.productVariant.fetched) {
      this.handleOnSelectList(this.state.selectedProduct, [this.props.productVariant.list], false); // SET IT AS ARRAY TO MAKE IT MATCH ALL CONDITION BOTH STANDARD AND VARIANT
      this.props.dispatch(ProductVariantAction.reset(ProductVariantConstant.RESET_PRODUCT_VARIANT));
    }
  }

  handleSelectType(e) {
    this.setState({type: e.target.value});
    if (e.target.value === Enum.TYPE_OF_PRINT.BARCODE) {
      this.setState({
        widthOfLabel: 2,
        heightOfLabel: 38
      });
    } else {
      this.setState({
        widthOfLabel: 8,
        heightOfLabel: 8
      });
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

  handleFocusInputNumberToPrint() {
    this.setState({isAutoFocusInputNumberToPrint: false});
  }

  handleOnPrint() {
    // const element = document.getElementById("print-tag-content");
    // if (element) {
    //   this.Util.printElem(element.innerHTML);
    //   this.setState({
    //     dataSourceToPrint: [],
    //     productList: []
    //   });
    // }
    window.print();
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
    existingProductList.forEach((product, index) => {
      if (e.target.value === this.TYPE_OF_PRINT.ALL_QTY) {
        this.props.form.setFieldsValue({[`numberOfPrint[${index}]`]: product.quantity});
        this.setState({isAutoFocusInputNumberToPrint: false});
      } else if(e.target.value === this.TYPE_OF_PRINT.QTY_IN_STOCK) {
        this.setState({isAutoFocusInputNumberToPrint: false});
        this.props.form.setFieldsValue({[`numberOfPrint[${index}]`]: Util.countProductQTYCurrentLocation(product, this.Util.getLocationId())});
      } else {
        this.setState({isAutoFocusInputNumberToPrint: true});
        this.props.form.setFieldsValue({[`numberOfPrint[${index}]`]: 0});
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

  handleCancelVariantProduct() {
    this.setState({modalVariant: null});
  }

  handleOnSelectList(product, productVariant, isRequestVariantForm = true) {

    if (!productVariant) {
      this.Message.error(this.CATranslate("product_not_found", this.props.locale));
    }

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
      productVariant = productVariant[0]; // ACCESS TO PRODUCT VARIANT DEFAUTL FOR STARTDARD PRODUCT
      if(productVariant){
        productVariant.name = isProductVariant ? productVariant.name : ""; // Remove product variant name away from label table
      }
    }

    if(productVariant){
      
      const productName = product.name;
      const {quantity} = productVariant;

      const existingProductList = this.state.productList;

      if (existingProductList.length === 0) {
        existingProductList.push({
          id: productVariant.id,
          barcode: productVariant.barcode,
          price: productVariant.price,
          productName,
          variantName: productVariant.name,
          qauntityInStore: Util.countProductQTYCurrentLocation(product, this.Util.getLocationId()),
          quantity,
          productVariants: product.productVariants,
          productOption: product.productOption
        });
      } else {
        let isNotTheSame = true;
        existingProductList.forEach(data => {
          if (data.barcode === productVariant.barcode) {
            isNotTheSame = false;
          }
        });

        if (isNotTheSame) {
          existingProductList.push({
            id: productVariant.id,
            barcode: productVariant.barcode,
            price: productVariant.price,
            productName,
            variantName: productVariant.name,
            qauntityInStore: Util.countProductQTYCurrentLocation(product, this.Util.getLocationId()),
            quantity,
            productVariants: product.productVariants,
            productOption: product.productOption
          });
        }

      }
      this.props.form.setFieldsValue({searchProduct: ""});
      this.setState({productList: existingProductList, isFocusSearchInput: true});
    }else{
      this.Message.warning(this.CATranslate("text_check_product_qty_is_null", this.props.locale));
    }

   
  }

  handleRemoveProductList(index) {
    let existingProductList = this.state.productList;
    existingProductList.splice(index, 1);
    this.setState({productList: existingProductList});
  }

  handlePressEnterOnSearch(product) {
    this.handleOnSelectList(product);
  }

  handleOnFocusSearch() {
    this.setState({isFocusSearchInput: false});
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
              <div><this.Translate id="text_width" /></div>
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
                    isHideTool={true}
                    data={this.state.widthOfLabel}
                    onChange={this.onChangeWidthOfLabel}/>
                </this.Col>
              </this.Row>
              <div><this.Translate id="text_height" /></div>
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
                    isHideTool={true}
                    data={this.state.heightOfLabel}
                    onChange={this.onChangeHeightOfLabel}
                    precision={0} />
                </this.Col>
              </this.Row>
              <div><this.Translate id="text_font_size_of_label" /></div>
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
                    isHideTool={true}
                    data={this.state.fontSizeOfValue}
                    onChange={this.onChangeFontSizeOfValue}
                    precision={0}/>
                </this.Col>
              </this.Row>
              <div><this.Translate id="text_font_size_name_barcode"/></div>
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
                    isHideTool={true}
                    data={this.state.fontSizeOfName}
                    onChange={this.onChangeFontSizeOfName}
                    precision={0}/>
                </this.Col>
              </this.Row>
              <div><this.Translate id="text_font_price_barcode" /></div>
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
                    isHideTool={true}
                    data={this.state.fontSizeOfPrice}
                    onChange={this.onChangeFontSizeOfPrice}
                    precision={0}/>
                </this.Col>
              </this.Row>
            </this.Col>
            <this.Col md="6">
              <div><this.Translate id="text_padding_left" /></div>
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
                    isHideTool={true}
                    data={this.state.paddingLeft}
                    onChange={this.onChangePaddingLeft}
                    precision={0}/>
                </this.Col>
              </this.Row>
              <div><this.Translate id="text_padding_right" /></div>
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
                    isHideTool={true}
                    data={this.state.paddingRight}
                    onChange={this.onChangePaddingRight}
                    precision={0}/>
                </this.Col>
              </this.Row>
              <div><this.Translate id="text_padding_top" /></div>
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
                    isHideTool={true}
                    data={this.state.paddingTop}
                    onChange={this.onChangePaddingTop}
                    precision={0}/>
                </this.Col>
              </this.Row>
              <div><this.Translate id="text_padding_bottom" /></div>
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
                    isHideTool={true}
                    data={this.state.paddingBottom}
                    onChange={this.onChangePaddingBottom}
                    precision={0}/>
                </this.Col>
              </this.Row>
              <div><this.Translate id="text_number_of_column" /></div>
              <this.Row>
                <this.Col md="9">
                  <Slider
                    min={1}
                    max={20}
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
                    isHideTool={true}
                    data={this.state.numberOfColumn}
                    onChange={this.onChangeLabelColumn}
                    precision={0}/>
                </this.Col>
              </this.Row>
            </this.Col>
          </this.Row>
          <div className="text-center" style={{marginTop: 15}}>
            <this.Button className="danger" onClick={this.handleOnClickLabelSetting}>
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
        </this.Col>
      </this.Row>
    );
  }
  render() {
    return (
      <div style={{height: "100%", display: "flex", flexDirection: "column", width: "100%"}}>
        {this.renderBreadCrumb()}
        <div className="main-layout" style={{height: "100%", display: "flex", flexDirection: "column", padding: 0}}>
          <Form autoComplete="off" onSubmit={this.handleOnGeneratePriceTag} style={{display: "flex", flexDirection: "column", height: "100%"}}>
            <this.Row style={{height: "100%", marginLeft: 0}}>
              <this.Col md="6" id="print-price-tag">
                <div>
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
                            title: <this.Translate id="text_print_type_option_1" />
                          }, 
                          {
                            value: this.TYPE_OF_PRINT.ALL_QTY,
                            title: <this.Translate id="text_print_type_option_2" /> 
                          },
                          {
                            value: this.TYPE_OF_PRINT.CUSTOM,
                            title: <this.Translate id="text_print_type_option_3" />
                          }
                        ]}
                        form={this.props.form} />
                        
                      <div className="wrap-label-setting-button">
                        <div>
                          <div onClick={this.handleOnClickLabelSetting}><this.Translate id="text_label_setting" /> <Icon type="down" /></div>
                          { this.state.isShowLabelSetting ? this.renderLabelSetting() : ""}
                        </div>
                      </div>
                    </this.Col>
                    <DropDownSearch
                      productSearch={this.props.productSearch}
                      handleOnSelectList={this.handleOnSelectList}
                      handlePressEnterOnSearch={this.handlePressEnterOnSearch}
                      handleOnFocusSearch={this.handleOnFocusSearch}
                      dispatch={this.props.dispatch}
                      isAutoFocus={true}
                      didUpdateMakeAutoFocus={this.state.isFocusSearchInput}
                      className="ca-input-v1 print-price-tag"
                      locale={this.props.locale}
                      form={this.props.form}/>
                  </this.Row>
                  <this.Table
                    dataSource={this.state.productList}
                    columns={this.columns}
                    locale={{emptyText: <this.Translate id="table_empty_data"/>}} />

                  <this.RadioButton 
                    name="QROrBarcode"
                    defaultValue={this.state.type}
                    onChange={this.handleSelectType}
                    dataSource={[
                      {
                        value: 1,
                        title: <this.Translate id="text_print_barcode" />
                      }, 
                      {
                        value: 2,
                        title: <this.Translate id="text_print_qr" />
                      }
                    ]}
                    form={this.props.form} />
                  <this.Button htmlType="submit" type="info" className="btn-print-label" onClick={this.handleOnGeneratePriceTag}>
                    <span className="icon-print icon-padding-right"></span> <this.Translate id="text_generate"/>
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
              <this.Col md="6" style={{borderLeft: "1px solid #f7f7f7", overflow: "auto", height: "100%"}} id="print-price-tag-list">
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
                  numberOfColumn={this.state.numberOfColumn}
                  isGenerateQR={this.state.type}/>
              </this.Col>
            </this.Row>
          </Form>
          {this.state.modalVariant}
        </div>
      </div>
    );
  }
}
