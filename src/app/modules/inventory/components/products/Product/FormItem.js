import React from "react";
import FormComposite from "./FormComposite";
import FormVariant from "./FormVariant";
import Enum from "../../../enums";
// import FormVariant from "../../../containers/products/Product/FormVariant";
import BrandAction from "../../../actions/products/brand";
import UnitAction from "../../../actions/products/productsUnit";
import TagAction from "../../../actions/products/productsTag";
import VariantAttributeAction from "../../../actions/products/variantAttribute";
import TaxAction from "../../../../pos/action/settings/tax";
import Modal from "../../../../common/components/shares/Modal";
import "./index.css";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      unitList: []
    };

    this.unitsList = [];

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
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(UnitAction.fetch(100));
    dispatch(TaxAction.fetch(100));
    dispatch(BrandAction.fetch(100));
    dispatch(TagAction.fetch(100));
    dispatch(VariantAttributeAction.fetch(100));
  }

  componentDidUpdate(prevProps) {
    const {
      dispatch,
      brandAdd,
      unitAdd,
      taxAdd
    } = this.props;

    if (brandAdd.added) {
      this.props.form.setFieldsValue({brandId: brandAdd.response.data.id});
      dispatch(BrandAction.reset());
    }

    if (unitAdd.added) {
      this.props.form.setFieldsValue({unitId: unitAdd.response.data.id});
      dispatch(UnitAction.reset());
    }

    if (taxAdd.added) {
      this.props.form.setFieldsValue({taxId: taxAdd.response.data.id});
      dispatch(TaxAction.reset());
    }
  }

  onChange(e) {
    const value = e.target.value;
    const {
      form,
      locale,
      variantAttributes,
      variantAttributeAdd
    } = this.props;
    if (value === Enum.PRODUCT_VARIANT) {
      this.productTypeContent = <FormVariant
        form={form}
        locale={locale}
        variantAttributes={variantAttributes}
        variantAttributeAdd={variantAttributeAdd}
        handleAddVariantAttribute={this.props.handleAddVariantAttribute}/>;
    } else if (value === Enum.PRODUCT_COMPOSITE) {
      this.productTypeContent = <FormComposite form={form} locale={locale} />;
    } else {
      this.productTypeContent = "";
    }
  }
  render() {
    const {
      form,
      locale,
      formData,
      unitAdd,
      taxAdd,
      brandAdd
    } = this.props;

    let {
      brands,
      units,
      taxs,
      tags
    } = this.props;

    const currentUser = this.getCurrentUser();

    if (brandAdd.response != null) {
      brands.list = [brandAdd.response.data, ...brands.list];
    }

    if (unitAdd.response != null) {
      units.list = [unitAdd.response.data, ...units.list];
    }
  
    if (taxAdd.added) {
      taxs.list = [taxAdd.response.data, ...taxs.list];
    }

    return (
      <this.Tabs type="card">
        <this.TabPane tab={<this.Translate id="tab_general" />} key="1">
          <this.Row>
            <this.Col md="6" className="create-product-column-left">
              <this.Row>
                <this.Col md="4">
                  <this.InputText
                    name="name"
                    label={<this.Translate id="input_product_name" />}
                    data={formData.name}
                    placeholder={this.CATranslate("input_product_name", locale)}
                    errorRequired={<this.Translate id="input_error_products_name" />}
                    max={100}
                    min={3}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.SelectSearch
                    name="brandId"
                    label={<this.Translate id="input_product_brand" />}
                    valueKey="id"
                    dataSource={brands.list}
                    addNew={this.props.handleAddBrand}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.Select
                    name="productTypeId"
                    label={<this.Translate id="input_product_type" />}
                    dataSource={this.statusDataSource}
                    defaultValue={formData.status}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.Select
                    name="serialTypeId"
                    label={<this.Translate id="input_product_serial_type" />}
                    dataSource={this.serialTypes}
                    defaultValue={this.serialTypes[0].value}
                    form={form}/>
                </this.Col>

                <this.Col md="8">
                  <this.Row className="group-code-generate">
                    <this.Col md="6" className="wrap-generate-code">
                      <this.RadioButton 
                        name="paymentType"
                        defaultValue={this.Enum.GENERATE_PRODUCT_CODE.CUSTOM}
                        dataSource={[
                          {
                            value: this.Enum.GENERATE_PRODUCT_CODE.CUSTOM,
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
                        data={formData.name}
                        placeholder={this.CATranslate("input_product_code", locale)}
                        max={20}
                        form={form}/>
                    </this.Col>
                  </this.Row>
                </this.Col>

                <this.Col md="4">
                  <this.SelectSearch
                    name="unitId"
                    label={<this.Translate id="input_product_unit" />}
                    valueKey="id"
                    dataSource={units.list}
                    addNew={this.props.handleAddUnit}
                    form={form}/>
                </this.Col>  

                <this.Col md="4">
                  <this.Select
                    name="typeId"
                    label={<this.Translate id="input_product_kind" />}
                    dataSource={this.typesOfProduct}
                    defaultValue={this.typesOfProduct[0].value}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.InputNumber
                    name="reorderPoint"
                    label={<this.Translate id="input_product_re_order_point" />}
                    data={formData.name}
                    placeholder={this.CATranslate("input_product_re_order_point", locale)}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.SelectSearch
                    name="taxId"
                    label={<this.Translate id="input_product_tax" />}
                    valueKey="id"
                    dataSource={taxs.list}
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
                    name="tag"
                    label={<this.Translate id="input_product_tag" />}
                    placeholder={this.CATranslate("input_product_tag", locale)}
                    mode="tags"
                    nameKey="tag"
                    dataSource={tags.list}
                    style={{ width: "100%" }}
                    form={form} />
                </this.Col>

                <this.Col md="12">
                  <this.InputTextArea
                    name="description"
                    label={<this.Translate id="input_product_description" />}
                    data={formData.description}
                    placeholder={this.CATranslate("input_product_description", locale)}
                    max={255}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.InputNumber
                    name="supplier_price"
                    label={<span><this.Translate id="input_product_supplier_price" /><span> ({currentUser.setting.currency})</span></span>}
                    data={formData.name}
                    placeholder={this.CATranslate("input_product_supplier_price_placeholder", locale)}
                    max={20}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.InputNumber
                    name="shipping_fee"
                    label={<span><this.Translate id="input_product_shipping_fee" /><span> ({currentUser.setting.currency})</span></span>}
                    data={formData.name}
                    placeholder={this.CATranslate("input_product_shipping_fee_placeholder", locale)}
                    max={20}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                </this.Col>

                <this.Col md="4">
                  <this.InputNumber
                    name="cost"
                    label={<span><this.Translate id="input_product_cost" /><span> ({currentUser.setting.currency})</span></span>}
                    data={formData.name}
                    placeholder={this.CATranslate("input_product_cost_placeholder", locale)}
                    max={20}
                    form={form}/>
                </this.Col>

                <this.Col md="4">
                  <this.InputNumber
                    name="markup"
                    label={<span><this.Translate id="input_product_mark_up" /><span> (%)</span></span>}
                    data={formData.name}
                    placeholder={this.CATranslate("input_product_mark_up_placeholder", locale)}
                    max={20}
                    form={form}/>
                </this.Col>
                
                <this.Col md="4">
                  <this.InputNumber
                    name="price"
                    label={<span><this.Translate id="input_product_price" /><span> ({currentUser.setting.currency})</span></span>}
                    data={formData.name}
                    placeholder={this.CATranslate("input_product_price_placeholder", locale)}
                    max={20}
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
                defaultValue={Enum.PRODUCT_STANDARD}
                form={form}
                onSelect={this.onSelect}
                onChange={this.onChange}>
                { this.productTypes.map( (productType, key) => 
                  <this.RadioChildBox
                    key={key}
                    title={productType.name}
                    language={productType.description}
                    value={productType.value} /> 
                ) 
                }
              </this.RadioBox>
              <div className="product-type-content">
                {this.productTypeContent}
              </div>
            </this.Col>
          </this.Row>
        </this.TabPane>
        <this.TabPane tab={<this.Translate id="tab_language" />} key="2">
          <this.Tabs type="card">
            <this.TabPane tab={this.getLanguageIcon("en")} key="1">
              <this.Row>
                <this.Col md="6">
                  <this.Row>
                    <this.Col md="12">
                      <this.InputText
                        name="productName"
                        label={<this.Translate id="input_product_name" />}
                        data={formData.name}
                        placeholder={this.CATranslate("input_product_name", locale)}
                        max={20}
                        form={form}/>
                    </this.Col>
                    <this.Col md="12">
                      <this.InputTextArea
                        name="description"
                        label={<this.Translate id="input_product_description" />}
                        data={formData.description}
                        placeholder={this.CATranslate("input_product_description", locale)}
                        max={255}
                        form={form}/>
                    </this.Col>
                  </this.Row>
                </this.Col>
              </this.Row>
            </this.TabPane>
            <this.TabPane tab={this.getLanguageIcon("bm")} key="2">
              <this.Row>
                <this.Col md="6">
                  <this.Row>
                    <this.Col md="12">
                      <this.InputText
                        name="productName"
                        label={<this.Translate id="input_product_name" />}
                        data={formData.name}
                        placeholder={this.CATranslate("input_product_name", locale)}
                        max={20}
                        form={form}/>
                    </this.Col>
                    <this.Col md="12">
                      <this.InputTextArea
                        name="description"
                        label={<this.Translate id="input_product_description" />}
                        data={formData.description}
                        placeholder={this.CATranslate("input_product_description", locale)}
                        max={255}
                        form={form}/>
                    </this.Col>
                  </this.Row>
                </this.Col>
              </this.Row>
            </this.TabPane>
            <this.TabPane tab={this.getLanguageIcon("km")} key="3">
              <this.Row>
                <this.Col md="6">
                  <this.Row>
                    <this.Col md="12">
                      <this.InputText
                        name="productName"
                        label={<this.Translate id="input_product_name" />}
                        data={formData.name}
                        placeholder={this.CATranslate("input_product_name", locale)}
                        max={20}
                        form={form}/>
                    </this.Col>
                    <this.Col md="12">
                      <this.InputTextArea
                        name="description"
                        label={<this.Translate id="input_product_description" />}
                        data={formData.description}
                        placeholder={this.CATranslate("input_product_description", locale)}
                        max={255}
                        form={form}/>
                    </this.Col>
                  </this.Row>
                </this.Col>
              </this.Row>
            </this.TabPane>
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
    isAvialableSale: 1,
    isPublic: 0,
    status: 1
  }
};