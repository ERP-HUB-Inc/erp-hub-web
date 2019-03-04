import React from "react";
import FormComposite from "./FormComposite";
import FormVariant from "./FormVariant";
import FormCostLog from "./FormCostLog";
import FormProductLog from "./FormProductLog";
import Enum from "../../../enums";
import Util from "../../../utils";
import ProductAction from "../../../actions/products/product";
import BrandAction from "../../../actions/products/brand";
import ProductTypeAction from "../../../actions/products/productsType";
import UnitAction from "../../../actions/products/productsUnit";
import TaxAction from "../../../../pos/action/settings/tax";
import Modal from "../../../../common/components/shares/Modal";
import "./index.css";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      brands: [],
      units: [],
      taxs: [],
      productsType: [],
      languages: [],
      tags: [],
      productTypeIndex: 0, // for condition three type starndard, variant, composite
      isAutoGenerateBarcode: 0,
      isRequireInputBarcode: true,
      isSetFocusBarcode: false,
      isComponentNotYetUpdated: true,
      isComponentNotYetLoadedWillUpdate: true,
      productDescriptionIdDefault: "",
      productNameDefault: "",
      productDescriptionDefault: "",
      productOptionClassDisabled: ""
    };

    this.TAB_PRODUCT_COST_LOG = 3;

    this.TAB_PRODUCT_LOG = 4;

    this.productTypeContent = "";
    
    this.productTypes = [
      {
        name: <this.Translate id="radio_box_product_standard" />,
        description: <this.Translate id="radio_box_product_standard_description" />,
        value: Enum.PRODUCT_STANDARD
      },
      {
        name: <this.Translate id="radio_box_product_variant" />,
        description: <this.Translate id="radio_box_product_variant_description" />,
        value: Enum.PRODUCT_VARIANT
      },
      {
        name: <this.Translate id="radio_box_product_composite" />,
        description: <this.Translate id="radio_box_product_composite_description" />,
        value: Enum.PRODUCT_COMPOSITE
      }
    ];

    this.serialTypes = [
      // {
      //   name: <this.Translate id="input_product_serial" />,
      //   value: Enum.SERIAL_TYPE.SERIAL
      // },
      {
        name: <this.Translate id="input_product_non_inventory" />,
        value: Enum.SERIAL_TYPE.NON_INVENTORY
      },
      {
        name: <this.Translate id="input_product_standard" />,
        value: Enum.SERIAL_TYPE.STANDARD
      },
      // {
      //   name: <this.Translate id="input_product_license" />,
      //   value: Enum.SERIAL_TYPE.LICENSE
      // }
    ];

    this.typesOfProduct = [
      {
        name: <this.Translate id="input_product_good" />,
        value: Enum.TYPE_OF_PRODUCT.GOOD
      },
      {
        name: <this.Translate id="input_product_raw_material" />,
        value: Enum.TYPE_OF_PRODUCT.RAW_MATERIAL
      }
    ];

    this.onChange = this.onChange.bind(this);
    this.onCangeIsAutoGenerateCode = this.onCangeIsAutoGenerateCode.bind(this);
    this.onChangeProductName = this.onChangeProductName.bind(this);
    this.onChangeDefaultDescription = this.onChangeDefaultDescription.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.getProductImageFromCallBack = this.getProductImageFromCallBack.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
  }

  componentDidMount() {
    this.setState({
      brands: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.BRAND)),
      units: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.UNIT)),
      taxs: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.TAX)),
      productsType: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.PRODUCT_TYPE)),
      languages: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.LANGUAGE)),
      tags: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.PRODUCT_TAG))
    });
  }

  componentWillUpdate(nextProps) {
    if (nextProps.formData.productDescriptions.length > 0 && this.state.isComponentNotYetLoadedWillUpdate) {
      let currentLanguageDescription = nextProps.formData.productDescriptions.find(value => value.languageId === this.getCurrentLanguageCode());
      if (!currentLanguageDescription) {
        currentLanguageDescription = {};
        currentLanguageDescription["id"] = "";
        currentLanguageDescription["name"] = "";
        currentLanguageDescription["description"] = "";
      }
      this.setState({
        productDescriptionIdDefault: currentLanguageDescription.id,
        productNameDefault: currentLanguageDescription.name,
        productDescriptionDefault: currentLanguageDescription.description,
        isComponentNotYetLoadedWillUpdate: false
      });
    }

    // APEND DATA WHEN ADD MORE IN SELECT LIST
    if (nextProps.brandAdd.response) {
      this.setState({brands: [nextProps.brandAdd.response.data, ...this.state.brands]});
    }

    if (nextProps.productsTypeAdd.response) {
      this.setState({productsType: [nextProps.productsTypeAdd.response.data, ...this.state.productsType]});
    }

    if (nextProps.unitAdd.response) {
      this.setState({units: [nextProps.unitAdd.response.data, ...this.state.units]});
    }

    if (nextProps.taxAdd.response) {
      this.setState({taxs: [nextProps.taxAdd.response.data, ...this.state.taxs]});
    }
  }

  componentDidUpdate() {
    const {
      dispatch,
      formData,
      brandAdd,
      productsTypeAdd,
      unitAdd,
      taxAdd,
    } = this.props;

    if (brandAdd.added) {
      this.props.form.setFieldsValue({brandId: brandAdd.response.data.id});
      dispatch(BrandAction.reset());
    }

    if (productsTypeAdd.added) {
      this.props.form.setFieldsValue({productTypeId: productsTypeAdd.response.data.id});
      dispatch(ProductTypeAction.reset());
    }

    if (unitAdd.added) {
      this.props.form.setFieldsValue({defaultUnitId: unitAdd.response.data.id});
      dispatch(UnitAction.reset());
    }

    if (taxAdd.added) {
      this.props.form.setFieldsValue({taxId: taxAdd.response.data.id});
      dispatch(TaxAction.reset());
    }

    if (formData.tags.length > 0 && this.state.isComponentNotYetUpdated) {
      this.setState({isComponentNotYetUpdated: false});
    }
  }

  getProductImageFromCallBack(value) {
    this.props.form.setFieldsValue({image: value});
  } 

  onChangeTab(activeKey) {
    const {dispatch, formData} = this.props;
    const productVariantId = formData.productVariants.length > 0 ? formData.productVariants[0].id : "";
    if ((activeKey - this.TAB_PRODUCT_COST_LOG) === 0) {
      dispatch(ProductAction.fetchCostLog(productVariantId, 100));
    } else if ((activeKey - this.TAB_PRODUCT_LOG) === 0) {
      dispatch(ProductAction.fetchLog(productVariantId, 100));
    }
  }

  onChange(e) {
    this.setState({
      productTypeIndex: e.target.value
    });

    if (e.target.value === Enum.PRODUCT_VARIANT) {
      this.setState({
        isAutoGenerateBarcode: this.Enum.GENERATE_PRODUCT_CODE.AUTO
      });
    } else {
      this.setState({
        isAutoGenerateBarcode: this.props.form.getFieldValue("isAutoGenerateBarcode")
      });
    }
  }

  onCangeIsAutoGenerateCode(e) {
    if (e.target.value === this.Enum.GENERATE_PRODUCT_CODE.AUTO) {
      this.props.form.setFieldsValue({
        barcode: ""
      });
    } else {
      this.setState({
        isSetFocusBarcode: true
      });
    }

    this.setState({
      isAutoGenerateBarcode: e.target.value,
      isRequireInputBarcode: e.target.value === this.Enum.GENERATE_PRODUCT_CODE.MANAUL
    });

    this.props.dispatch(ProductAction.switchTypeOfGenerateSKU(e.target.value));
  }

  onChangeProductName(e) {
    this.setState({
      productNameDefault: e.target.value
    });
  }

  handleChangeType(value) {
    if (value === Enum.TYPE_OF_PRODUCT.RAW_MATERIAL) {
      this.setState({productOptionClassDisabled: "disabled-click"});
    } else {
      this.setState({productOptionClassDisabled: ""});
    }
  }

  onChangeDefaultDescription(e) {
    this.setState({
      productDescriptionDefault: e.target.value
    });
  }

  renderDescription(language, languagesIndex) {
    const {locale, form, formData} = this.props;
    let productDescriptionId = "",
      productName = "",
      productDescription = "";
    
    formData.productDescriptions.forEach(productDescription => {
      if (language.code === productDescription.languageId) {
        productDescriptionId = productDescription.id;
        productName = productDescription.name;
        productDescription = productDescription.description;
      }
    });

    if (languagesIndex === 0) {
      productDescriptionId = this.state.productDescriptionIdDefault;
      productName = this.state.productNameDefault;
      productDescription = this.state.productDescriptionDefault;
    }

    return (
      <this.TabPane tab={this.getLanguageIcon(language.code)} key={languagesIndex}>
        <this.Row className="wrapRowContentTab">
          <this.InputText 
            name={`language[${languagesIndex}]`} 
            className="hidden"
            data={language.code}
            form={form} />
          <this.InputText 
            name={`id[${languagesIndex}]`} 
            className="hidden"
            data={productDescriptionId}
            form={form} />
          <this.Col md="12">
            <this.InputText
              name={`productName[${languagesIndex}]`}
              data={productName}
              label={<this.Translate id="text_product_name" />}
              placeholder={this.CATranslate("text_product_name", locale)}
              onChange={languagesIndex === 0 ? this.onChangeProductName : null}
              max={100}
              form={form}/>
          </this.Col>
          <this.Col md="12">
            <this.InputTextArea
              name={`productDescription[${languagesIndex}]`}
              data={productDescription}
              label={<this.Translate id="text_description" />}
              placeholder={this.CATranslate("text_description", locale)}
              onChange={languagesIndex === 0 ? this.onChangeDefaultDescription : null}
              max={255}
              form={form}/>
          </this.Col>
        </this.Row>
      </this.TabPane>
    );
  }

  render() {
    const {
      dispatch,
      form,
      locale,
      formData,
      productSearch,
      variantAttributeAdd
    } = this.props;

    let defaultUnit = {id: ""};

    const currentUser = this.getCurrentUser();
    
    this.state.productsType.forEach((productTypeValue, productTypeIndex) => {
      this.state.productsType[productTypeIndex].name = productTypeValue.productTypeDescriptions.length > 0 ? productTypeValue.productTypeDescriptions[0].name : "";
    });

    if (Array.isArray(this.state.units) && this.state.units.length > 0) {
      const findDefaultUnit = this.state.units.find(unitValue => unitValue.isDefault === this.Enum.IS_DEFAULT);

      if (findDefaultUnit) {
        defaultUnit = findDefaultUnit;
      }

      defaultUnit.id = this.props.formData.unitId ? this.props.formData.unitId : defaultUnit.id;
    }

    let productTypeBox = Enum.PRODUCT_STANDARD;
    if (formData.id) {
      productTypeBox = formData.productOption;
    } else {
      productTypeBox = this.state.productTypeIndex;
    }

    const image = {
      uid: "-1",
      name: formData.image,
      status: "done",
      url: this.Util.getProductImage(formData.image).url
    };

    return (
      <this.Tabs type="card" onChange={(activeKey) => this.onChangeTab(activeKey)}>
        <this.TabPane tab={<this.Translate id="tab_general" />} key="1">
          <this.Row>
            <this.Col md="6" className="create-product-column-left">
              <this.Row>
                <this.Col md="4">
                  <this.InputText
                    name="productNameDefault"
                    label={<this.Translate id="text_name" />}
                    data={this.state.productNameDefault}
                    placeholder={this.CATranslate("text_name", locale)}
                    errorRequired={<this.Translate id="error_require_name" />}
                    errorLenght={<this.Translate id="input_error_products_name" />}
                    onChange={this.onChangeProductName}
                    isAutoFocus={true}
                    required={true}
                    max={255}
                    min={0}
                    form={form}/>
                  <this.InputText
                    name="productDescriptionId"
                    data={this.state.productDescriptionIdDefault}
                    className="hidden"
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.SelectSearch
                    name="brandId"
                    label={<this.Translate id="text_brand" />}
                    placeholder={this.CATranslate("text_brand", locale)}
                    errorRequired={<this.Translate id="error_require_brand" />}
                    valueKey="id"
                    dataSource={this.state.brands}
                    defaultValue={formData.brandId}
                    addNew={this.props.handleAddBrand}
                    required={true}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.SelectSearch
                    name="productTypeId"
                    label={<this.Translate id="text_product_type" />}
                    placeholder={this.CATranslate("text_product_type", locale)}
                    errorRequired={<this.Translate id="error_require_type" />}
                    valueKey="id"
                    dataSource={this.state.productsType}
                    defaultValue={formData.productTypeId}
                    addNew={this.props.handleAddProductType}
                    nestedName="productTypeDescriptions"
                    nameKey="name"
                    required={true}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.Select
                    name="serialType"
                    label={
                      <span>
                        <this.Translate id="text_serial_type" />&nbsp;
                        <this.Tooltip title="Do you want your product calculate stock or not?">
                          <this.Icon type="question-circle-o" />
                        </this.Tooltip>
                      </span>
                    }
                    placeholder={this.CATranslate("text_serial_type", locale)}
                    dataSource={this.serialTypes}
                    defaultValue={formData.serialType}
                    errorRequired={<this.Translate id="error_require_serial_type" />}
                    disabled={formData.id != null}
                    required={true}
                    form={form}/>
                </this.Col>

                <this.Col md="8">
                  <this.Row className="group-code-generate">
                    <this.Col md="6" className="wrap-generate-code">
                      <this.RadioButton 
                        name="isAutoGenerateBarcode"
                        defaultValue={formData.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.MANAUL ? this.Enum.GENERATE_PRODUCT_CODE.MANAUL : this.Enum.GENERATE_PRODUCT_CODE.AUTO}
                        disabled={formData.id != null}
                        onChange={this.onCangeIsAutoGenerateCode}
                        dataSource={[
                          {
                            value: this.Enum.GENERATE_PRODUCT_CODE.MANAUL,
                            title: <this.Translate id="input_product_enter_custom_code" />}, 
                          { 
                            value: this.Enum.GENERATE_PRODUCT_CODE.AUTO,
                            title: <this.Translate id="input_product_auto_generate_code" />
                          }
                        ]}
                        form={form}/>
                    </this.Col>
                    {
                      this.state.productTypeIndex === Enum.PRODUCT_VARIANT || formData.productOption === Enum.PRODUCT_VARIANT ?
                        ""
                        :
                        <this.Col md="6">
                          <this.InputText
                            name="barcode"
                            label={<this.Translate id="text_product_code" />}
                            data={Util.getProductBarcode(formData)}
                            placeholder={this.CATranslate("text_product_code", locale)}
                            required={this.state.isRequireInputBarcode}
                            errorRequired={<this.Translate id="error_require_sku" />}
                            isAutoFocus={this.state.isSetFocusBarcode}
                            didUpdateMakeAutoFocus={this.state.isSetFocusBarcode}
                            max={20}
                            form={form}
                            disabled={
                              (formData.id != null && formData.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO) || 
                          this.state.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO
                            } />
                        </this.Col>
                    }
                  </this.Row>
                </this.Col>

                <this.Col md="4">
                  <this.SelectSearch
                    name="defaultUnitId"
                    label={<this.Translate id="input_product_unit" />}
                    placeholder={this.CATranslate("input_product_unit", locale)}
                    errorRequired={<this.Translate id="error_require_unit" />}
                    valueKey="id"
                    dataSource={this.state.units}
                    defaultValue={formData.defaultUnitId}
                    addNew={this.props.handleAddUnit}
                    required={true}
                    form={form}/>
                </this.Col>  

                <this.Col md="4">
                  <this.Select
                    name="type"
                    label={<this.Translate id="text_type" />}
                    dataSource={this.typesOfProduct}
                    defaultValue={formData.type !== "" ? formData.type : this.typesOfProduct[0].value}
                    disabled={formData.id != null}
                    onChange={this.handleChangeType}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.InputNumber
                    name="reorderPoint"
                    label={<this.Translate id="input_product_re_order_point" />}
                    data={formData.reorderPoint === 0 ? null : formData.reorderPoint}
                    placeholder={this.CATranslate("input_product_re_order_point_placeholder", locale)}
                    max={9999999}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.Select
                    name="taxId"
                    label={<this.Translate id="input_product_tax" />}
                    valueKey="id"
                    dataSource={this.state.taxs}
                    defaultValue={formData.id !== null && formData.productTaxes.length > 0 ? formData.productTaxes[0].taxId : currentUser.setting.defaultTaxId}
                    addNew={this.props.handleAddTax}
                    form={form}/>
                </this.Col>

                <this.Col md="4" style={{display: "flex", alignItems: "center", paddingTop: 20}}>
                  <this.Switchs
                    name="isAvialableSale"
                    label={<this.Translate id="input_product_is_avialable_sale" />}
                    checked={formData.isAvialableSale}
                    form={form}/>
                </this.Col>

                <this.Col md="4" style={{display: "flex", alignItems: "center", paddingTop: 20}}>
                  <this.Switchs
                    name="isPublic"
                    label={<this.Translate id="input_product_is_publish" />}
                    checked={formData.isPublic}
                    form={form}/>
                </this.Col>

                {/* <this.Col md="12">
                  <this.SelectTag
                    name="tagId"
                    label={<this.Translate id="input_product_tag" />}
                    placeholder={this.CATranslate("input_product_tag", locale)}
                    nameKey="tag"
                    valueKey="id"
                    dataSource={this.state.tags}
                    defaultValue={formData.tags.map(productTag => productTag.tagId)}
                    onChange={this.props.handleChangeTag}
                    onSelect={this.props.handleSelectTag}
                    onDeselect={this.props.handleDeselectTag}
                    style={{ width: "100%" }}
                    form={form} />
                </this.Col> */}

                <this.Col md="12">
                  <this.InputTextArea
                    name="productDescriptionDefault"
                    label={<this.Translate id="text_description" />}
                    data={this.state.productDescriptionDefault}
                    placeholder={this.CATranslate("text_description", locale)}
                    handleOnChange={this.onChangeDefaultDescription}
                    max={255}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.InputNumber
                    name="factoryCost"
                    label={<span><this.Translate id="input_product_supplier_price" /><span> ({currentUser.setting.currency})</span></span>}
                    data={formData.factoryCost === 0 ? null : formData.factoryCost}
                    placeholder={this.CATranslate("input_product_supplier_price_placeholder", locale)}
                    max={99999999}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.InputNumber
                    name="shippingFee"
                    label={<span><this.Translate id="text_shipping_fee" /><span> ({currentUser.setting.currency})</span></span>}
                    data={formData.shippingFee === 0 ? null : formData.shippingFee}
                    placeholder={this.CATranslate("input_product_shipping_fee_placeholder", locale)}
                    max={99999999}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                </this.Col>

                <this.Col md="4">
                  <this.InputNumber
                    name="costDisplay"
                    label={<span><this.Translate id="text_cost" /><span> ({currentUser.setting.currency})</span></span>}
                    data={formData.cost === 0 ? null : formData.cost}
                    placeholder={this.CATranslate("text_cost_placeholder", locale)}
                    max={99999999}
                    disabled={true}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.InputNumber
                    name="markup"
                    label={<span><this.Translate id="input_product_mark_up" /><span> (%)</span></span>}
                    data={formData.markup === 0 ? null : formData.markup}
                    placeholder={this.CATranslate("input_product_mark_up_placeholder", locale)}
                    max={20}
                    form={form}/>
                </this.Col>
                
                <this.Col md="4">
                  <this.InputNumber
                    name="price"
                    label={<span><this.Translate id="text_price" /><span> ({currentUser.setting.currency})</span></span>}
                    data={Util.getProductPrice(formData)}
                    isAutoSelect={true}
                    placeholder={this.CATranslate("input_product_price_placeholder", locale)}
                    errorRequired={<this.Translate id="error_require_price" />}
                    max={99999999}
                    form={form}/>
                </this.Col>

                <this.Col md="12">
                  <this.UploadImg
                    name="image"    
                    label={<this.Translate id="input_hr_employee_upload" />}
                    data={{file: image}}
                    fileList={[image]}
                    endPoint={`${this.Util.getAPIURL()}/file/v1/upload/product`}
                    endPointDelete={`${this.Util.getAPIURL()}/file/v1/product/delete`}
                    accessToken={this.Util.getAccessToken()}
                    form={form}/>
                </this.Col>
              </this.Row> 
            </this.Col>
            <this.Col md="6" className="create-product-column-right">
              <this.RadioBox
                className="main-radio-acc product-type"
                name="productOption"
                type="radio"
                defaultValue={formData.productOption}
                disabled={formData.id != null || this.state.productOptionClassDisabled !== ""}
                form={form}
                onSelect={this.onSelect}
                onChange={this.onChange}>
                { this.productTypes.map((productType, key) => 
                  <this.RadioChildBox
                    key={key}
                    title={productType.name}
                    language={productType.description}
                    value={productType.value}
                    className={productType.value === productTypeBox || formData.id == null ? productType.value !== Enum.PRODUCT_STANDARD ? this.state.productOptionClassDisabled : "" : "disabled-click"} /> 
                ) 
                }
              </this.RadioBox>
              <div className="product-type-content">
                {
                  productTypeBox === Enum.PRODUCT_VARIANT ?
                    <FormVariant
                      currentUser={currentUser}
                      dispatch={dispatch}
                      form={form}
                      locale={locale}
                      formData={formData}
                      switchAutoGenerateSKU={this.props.switchAutoGenerateSKU}
                      productVariantArchive={this.props.productVariantArchive}
                      productVariantCheckStatus={this.props.productVariantCheckStatus}
                      productAttributeCheckStatus={this.props.productAttributeCheckStatus}
                      productAttributeValueCheckStatus={this.props.productAttributeValueCheckStatus}
                      callBackGetProductAttribute={this.props.callBackGetProductAttribute}
                      callBackGetProductVariant={this.props.callBackGetProductVariant}
                      handleCallBackGetArchiveProductVariant={this.props.handleCallBackGetArchiveProductVariant}
                      handleCallBackGetArchiveProductAttributes={this.props.handleCallBackGetArchiveProductAttributes}
                      productVariants={formData.productVariants}
                      productAttributes={formData.productAttributes}
                      variantAttributes={this.props.variantAttributes}
                      variantAttributeAdd={variantAttributeAdd}
                      handleAddVariantAttribute={this.props.handleAddVariantAttribute}/>
                    :
                    productTypeBox === Enum.PRODUCT_COMPOSITE ?
                      <FormComposite
                        dispatch={dispatch}
                        form={form}
                        locale={locale}
                        productPackageToProduct={formData.productPackageToProduct}
                        productSearch={productSearch} />
                      :
                      ""
                }
              </div>
            </this.Col>
          </this.Row>
        </this.TabPane>
        <this.TabPane tab={<this.Translate id="text_description" />} key="2">
          <this.Tabs type="card" className="tab-item-language">
            {this.state.languages.map((language, languagesIndex) => this.renderDescription(language, languagesIndex))}
          </this.Tabs>
        </this.TabPane>
        {
          formData.id ?
            <this.TabPane tab={<this.Translate id="tab_cost_log" />} key="3">
              <FormCostLog
                productCostLog={this.props.productCostLog}
                formData={formData}
                dispatch={this.props.dispatch}
                form={this.props.form} />
            </this.TabPane>
            :
            ""
        }
        {
          formData.id ?
            <this.TabPane tab={<this.Translate id="tab_product_log" />} key="4">
              <FormProductLog
                productLog={this.props.productLog}
                formData={formData}
                dispatch={this.props.dispatch}
                form={this.props.form} />
            </this.TabPane>
            :
            ""
        }
        
      </this.Tabs>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    description:"",
    defaultUnitId: "",
    brandId: "",
    productTypeId: "",
    serialType: "",
    isAutoGenerateBarcode: 0,
    barcode: "",
    type: "",
    productOption: Enum.PRODUCT_STANDARD,
    reorderPoint: null,
    factoryCost: null,
    shippingFee: null,
    cost: null,
    markup: null,
    price: null,
    isAvialableSale: 1,
    isPublic: 0,
    tags: [],
    productVariants: [],
    productAttributes: [],
    productPackageToProduct: [],
    productDescriptions:[],
    productTaxes: [],
    status: 1
  },
  tagList: []
};