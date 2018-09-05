import React from "react";
import FormComposite from "./FormComposite";
import FormVariant from "./FormVariant";
import Enum from "../../../enums";
import BrandAction from "../../../actions/products/brand";
import ProductTypeAction from "../../../actions/products/productsType";
import UnitAction from "../../../actions/products/productsUnit";
import TagAction from "../../../actions/products/productsTag";
import VariantAttributeAction from "../../../actions/products/variantAttribute";
import TaxAction from "../../../../pos/action/settings/tax";
import LanguageAction from "../../../../pos/action/settings/storeLanguage";
import Modal from "../../../../common/components/shares/Modal";
import "./index.css";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      productTypeIndex: 0, // for condition thre type starndard, variant, composite
      isAutoGenerateCode: 0,
      isComponentNotYetUpdated: true,
      isComponentNotYetLoadedWillUpdate: true, 
      productNameDefault: "",
      productDescriptionDefault: ""
    };

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
      {
        name: <this.Translate id="input_product_serial" />,
        value: Enum.SERIAL_TYPE.SERIAL
      },
      {
        name: <this.Translate id="input_product_non_inventory" />,
        value: Enum.SERIAL_TYPE.NON_INVENTORY
      },
      {
        name: <this.Translate id="input_product_standard" />,
        value: Enum.SERIAL_TYPE.STANDARD
      },
      {
        name: <this.Translate id="input_product_license" />,
        value: Enum.SERIAL_TYPE.LICENSE
      }
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
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(BrandAction.fetch(100));
    dispatch(ProductTypeAction.fetch(100));
    dispatch(UnitAction.fetch(100));
    dispatch(TaxAction.fetch(100));
    dispatch(TagAction.fetch(100));
    dispatch(VariantAttributeAction.fetch(100));
    dispatch(LanguageAction.fetch(100));
  }

  componentWillUpdate(nextProps) {
    const {formData} = nextProps;
    if (formData.productDescriptions.length > 0 && this.state.isComponentNotYetLoadedWillUpdate) {
      const currentLanguageDescription = formData.productDescriptions.find(value => value.languageId === this.getCurrentLanguageCode());
      this.setState({
        productNameDefault: currentLanguageDescription.name,
        productDescriptionDefault: currentLanguageDescription.description,
        isComponentNotYetLoadedWillUpdate: false
      });
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
      tags
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
      this.props.form.setFieldsValue({unitId: unitAdd.response.data.id});
      dispatch(UnitAction.reset());
    }

    if (taxAdd.added) {
      this.props.form.setFieldsValue({taxId: taxAdd.response.data.id});
      dispatch(TaxAction.reset());
    }

    if (formData.productTagToProduct.length > 0 && this.state.isComponentNotYetUpdated) {
      // this.props.form.setFieldsValue({tagId: formData.productTagToProduct.map(value => value.productTagToTag.tag)});
      this.setState({isComponentNotYetUpdated: false});
    }
  }

  onChange(e) {
    this.setState({
      productTypeIndex:  e.target.value
    });
  }

  onCangeIsAutoGenerateCode(e) {
    this.setState({isAutoGenerateCode: e.target.value});
  }

  renderDescription(language, languagesIndex) {
    const {locale, form, formData} = this.props;
    let productId = "",
      productName = "",
      productDescription = "";
    
    formData.productDescriptions.forEach(product => {
      if (language.code === product.languageId) {
        productId = product.id;
        productName = product.name;
        productDescription = product.description;
      }
    });

    if (languagesIndex === 0) {
      productName = this.state.productNameDefault;
      productDescription = this.state.productDescriptionDefault;
    }

    return (
      <this.TabPane tab={this.getLanguageIcon(language.code)} key={languagesIndex}>
        <this.Row>
          <this.InputText 
            name={`language[${languagesIndex}]`} 
            type="hidden"
            data={language.code}
            form={form} />
          <this.InputText 
            name={`id[${languagesIndex}]`} 
            type="hidden"
            data={productId}
            form={form} />
          <this.Col md="12">
            <this.InputText
              name={`productName[${languagesIndex}]`}
              data={productName}
              label={<this.Translate id="input_product_name" />}
              placeholder={this.CATranslate("input_product_name", locale)}
              onChange={languagesIndex === 0 ? this.onChangeProductName : null}
              max={100}
              form={form}/>
          </this.Col>
          <this.Col md="12">
            <this.InputTextArea
              name={`productDescription[${languagesIndex}]`}
              data={productDescription}
              label={<this.Translate id="input_product_description" />}
              placeholder={this.CATranslate("input_product_description", locale)}
              onChange={languagesIndex === 0 ? this.onChangeDefaultDescription : null}
              max={255}
              form={form}/>
          </this.Col>
        </this.Row>
      </this.TabPane>
    );
  }

  onChangeProductName(e) {
    this.setState({
      productNameDefault: e.target.value
    });
  }

  onChangeDefaultDescription(e) {
    this.setState({
      productDescriptionDefault: e.target.value
    });
  }

  render() {
    const {
      dispatch,
      form,
      locale,
      languages,
      formData,
      productVariantArchive,
      unitAdd,
      taxAdd,
      brandAdd,
      productsTypeAdd,
      productSearch,
      variantAttributes,
      variantAttributeAdd
    } = this.props;

    let {
      brands,
      productsType,
      units,
      taxs,
      tags
    } = this.props;

    let defaultUnit = {id: ""};

    const currentUser = this.getCurrentUser();

    if (brandAdd.response != null) {
      brands.list = [brandAdd.response.data, ...brands.list];
      productsType.list.forEach((productTypeValue, productTypeIndex) => {
        productsType.list[productTypeIndex].name = productTypeValue.productTypeDescriptions.length > 0 ? productTypeValue.productTypeDescriptions[0].name : "";
      });
    }

    if (productsTypeAdd.response != null) {
      productsType.list = [productsTypeAdd.response.data, ...productsType.list];
    }

    if (productsType.fetched) {
      productsType.list.forEach((productTypeValue, productTypeIndex) => {
        productsType.list[productTypeIndex].name = productTypeValue.productTypeDescriptions.length > 0 ? productTypeValue.productTypeDescriptions[0].name : "";
      });
    }

    if (unitAdd.response != null) {
      units.list = [unitAdd.response.data, ...units.list];
    }
  
    if (taxAdd.added) {
      taxs.list = [taxAdd.response.data, ...taxs.list];
    }

    if (units.fetched) {
      const findDefaultUnit = units.list.find(unitValue => unitValue.isDefault === this.Enum.IS_DEFAULT);

      if (findDefaultUnit) {
        defaultUnit = findDefaultUnit;
      }

      defaultUnit.id = this.props.formData.unitId ? this.props.formData.unitId : defaultUnit.id;
    }

    let productTypeBox = Enum.PRODUCT_STANDARD;
    if (formData.productVariantToProduct.length > 0 ) {
      productTypeBox = Enum.PRODUCT_VARIANT;
    } else if (formData.productPackageToProduct.length > 0) {
      productTypeBox = Enum.PRODUCT_COMPOSITE;
    }

    return (
      <this.Tabs type="card">
        <this.TabPane tab={<this.Translate id="tab_general" />} key="1">
          <this.Row>
            <this.Col md="6" className="create-product-column-left">
              <this.Row>
                <this.Col md="4">
                  <this.InputText
                    name="productNameDefault"
                    label={<this.Translate id="input_product_name" />}
                    data={this.state.productNameDefault}
                    placeholder={this.CATranslate("input_product_name", locale)}
                    onChange={this.onChangeProductName}
                    max={100}
                    min={3}
                    required={true}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.SelectSearch
                    name="brandId"
                    label={<this.Translate id="input_product_brand" />}
                    placeholder={this.CATranslate("input_product_brand", locale)}
                    valueKey="id"
                    dataSource={brands.list}
                    defaultValue={formData.brandId}
                    addNew={this.props.handleAddBrand}
                    required={true}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.SelectSearch
                    name="productTypeId"
                    label={<this.Translate id="input_product_type" />}
                    placeholder={this.CATranslate("input_product_type", locale)}
                    valueKey="id"
                    dataSource={productsType.list}
                    defaultValue={formData.productTypeId}
                    addNew={this.props.handleAddProductType}
                    required={true}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.Select
                    name="serialType"
                    label={<this.Translate id="input_product_serial_type" />}
                    dataSource={this.serialTypes}
                    defaultValue={formData.serialType !== "" ? formData.serialType : this.serialTypes[0].value}
                    disabled={formData.id != null}
                    form={form}/>
                </this.Col>

                <this.Col md="8">
                  <this.Row className="group-code-generate">
                    <this.Col md="6" className="wrap-generate-code">
                      <this.RadioButton 
                        name="isAutoGenerateCode"
                        defaultValue={formData.isAutoGenerateCode === "" ? this.Enum.GENERATE_PRODUCT_CODE.MANAUL : formData.isAutoGenerateCode}
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
                    <this.Col md="6">
                      <this.InputText
                        name="barcode"
                        label={<this.Translate id="input_product_code" />}
                        data={formData.barcode}
                        placeholder={this.CATranslate("input_product_code", locale)}
                        max={20}
                        form={form}
                        disabled={formData.id != null || this.state.isAutoGenerateCode === this.Enum.GENERATE_PRODUCT_CODE.AUTO} />
                    </this.Col>
                  </this.Row>
                </this.Col>

                <this.Col md="4">
                  <this.SelectSearch
                    name="defaultUnitId"
                    label={<this.Translate id="input_product_unit" />}
                    placeholder={this.CATranslate("input_product_unit", locale)}
                    valueKey="id"
                    dataSource={units.list}
                    defaultValue={formData.defaultUnitId}
                    addNew={this.props.handleAddUnit}
                    required={true}
                    form={form}/>
                </this.Col>  

                <this.Col md="4">
                  <this.Select
                    name="type"
                    label={<this.Translate id="input_product_kind" />}
                    dataSource={this.typesOfProduct}
                    defaultValue={formData.type !== "" ? formData.type : this.typesOfProduct[0].value}
                    disabled={formData.id != null}
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
                  <this.SelectSearch
                    name="taxId"
                    label={<this.Translate id="input_product_tax" />}
                    valueKey="id"
                    dataSource={taxs.list}
                    defaultValue={currentUser.setting.defaultTaxId}
                    addNew={this.props.handleAddTax}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.Switchs
                    name="isAvialableSale"
                    label={<this.Translate id="input_product_is_avialable_sale" />}
                    checked={formData.isAvialableSale}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.Switchs
                    name="isPublic"
                    label={<this.Translate id="input_product_is_publish" />}
                    checked={formData.isPublic}
                    form={form}/>
                </this.Col>

                <this.Col md="12">
                  <this.SelectTag
                    name="tagId"
                    label={<this.Translate id="input_product_tag" />}
                    placeholder={this.CATranslate("input_product_tag", locale)}
                    nameKey="tag"
                    dataSource={tags.list}
                    onChange={this.props.handleChangeTag}
                    onSelect={this.props.handleSelectTag}
                    onDeselect={this.props.handleDeselectTag}
                    style={{ width: "100%" }}
                    form={form} />
                </this.Col>

                <this.Col md="12">
                  <this.InputTextArea
                    name="productDescriptionDefault"
                    label={<this.Translate id="input_product_description" />}
                    data={this.state.productDescriptionDefault}
                    placeholder={this.CATranslate("input_product_description", locale)}
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
                    label={<span><this.Translate id="input_product_shipping_fee" /><span> ({currentUser.setting.currency})</span></span>}
                    data={formData.shippingFee === 0 ? null : formData.shippingFee}
                    placeholder={this.CATranslate("input_product_shipping_fee_placeholder", locale)}
                    max={99999999}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                </this.Col>

                <this.Col md="4">
                  <this.InputNumber
                    name="cost"
                    label={<span><this.Translate id="input_product_cost" /><span> ({currentUser.setting.currency})</span></span>}
                    data={formData.cost === 0 ? null : formData.cost}
                    placeholder={this.CATranslate("input_product_cost_placeholder", locale)}
                    max={99999999}
                    required={true}
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
                    label={<span><this.Translate id="input_product_price" /><span> ({currentUser.setting.currency})</span></span>}
                    data={formData.price}
                    placeholder={this.CATranslate("input_product_price_placeholder", locale)}
                    max={99999999}
                    required={true}
                    form={form}/>
                </this.Col>

                <this.Col md="12">
                  <this.UploadImg
                    name="image"    
                    label={<this.Translate id="input_hr_employee_upload" />}
                    form={form}   
                  />
                </this.Col>
                
              </this.Row> 
            </this.Col>
            <this.Col md="6">
              <this.RadioBox 
                className="main-radio-acc product-type"
                name="productTypeBox"
                type="radio"
                defaultValue={productTypeBox}
                disabled={formData.id != null}
                form={form}
                onSelect={this.onSelect}
                onChange={this.onChange}>
                { this.productTypes.map( (productType, key) => 
                  <this.RadioChildBox
                    key={key}
                    title={productType.name}
                    language={productType.description}
                    value={productType.value}
                    className={productType.value === productTypeBox && formData.id != null ? "" : "disabled-click"} /> 
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
                      productVariantArchive={productVariantArchive}
                      productVariantToProduct={formData.productVariantToProduct}
                      variantAttributes={variantAttributes}
                      variantAttributeAdd={variantAttributeAdd}
                      handleAddVariantAttribute={this.props.handleAddVariantAttribute}/>
                    :
                    productTypeBox === Enum.PRODUCT_COMPOSITE ?
                      <FormComposite
                        dispatch={dispatch}
                        form={form}
                        locale={locale}
                        productSearch={productSearch} />
                      :
                      ""
                }
              </div>
            </this.Col>
          </this.Row>
        </this.TabPane>
        <this.TabPane tab={<this.Translate id="tab_language" />} key="2">
          <this.Tabs type="card">
            {languages.map((language, languagesIndex) => this.renderDescription(language, languagesIndex))}
          </this.Tabs>
        </this.TabPane>
        <this.TabPane tab={<this.Translate id="tab_cost_log" />} key="3">

        </this.TabPane>
        <this.TabPane tab={<this.Translate id="tab_product_log" />} key="4">

        </this.TabPane>
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
    isAutoGenerateCode: "",
    barcode: "",
    type: "",
    reorderPoint: null,
    factoryCost: null,
    shippingFee: null,
    cost: null,
    markup: null,
    price: null,
    isAvialableSale: 1,
    isPublic: 0,
    productTagToProduct: [],
    productVariantToProduct: [],
    productPackageToProduct: [],
    productDescriptions:[],
    status: 1
  }
};