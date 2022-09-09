import React from "react";
import {
  Spin,
  Button
} from "antd";
import {
  Translate
} from "react-localize-redux";
import FormComposite from "./FormComposite";
import FormVariant from "./FormVariant";
import Enum from "../../../enums";
import Util from "../../../utils";
import {
  SelectSearch
} from "../../../../common/elements/ant-ui/Select/selectSearch";
import {
  InputText
} from "../../../../common/elements/ant-ui";
import ProductAction from "../../../actions/products/product";
import ProductsTypeService from "../../../services/products/ProductsTypeService";
import BrandService from "../../../services/products/BrandService";
import ProductsUnitService from "../../../services/products/ProductsUnitService";
import SupplierService from "../../../services/stock/SupplierService";
import Modal from "../../../../common/components/shares/Modal";
import CommonEnum from "../../../../common/enums";
import "./index.css";

function SelectBrand(props) {
  const limit = 15;
  const {formData} = props;
  const [loading, setLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false || !formData.brand);
  const [brands, setBrands] = React.useState([]);
  let timeout = null;
  const onSearchBrand = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (search) {
        setLoading(true);
        BrandService.lists(limit, 0, "", "", "", JSON.stringify({column: ["name"], value: search}))
        .then(response => {
          if (response && response.data) {
            setBrands(response.data.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
      }
    }, 1000);
  };

  return <div style={{display: "flex", alignItems: "center"}}>
      <InputText
        name="brandName"
        label={<Translate id="text_brand" />}
        data={formData.brand ? formData.brand.name : ""}
        disabled={true}
        className={isEdit ? "hidden" : ""}
        form={props.form} />
      <SelectSearch
        name="brandId"
        label={<Translate id="text_brand" />}
        placeholder={props.placeholder}
        notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
        valueKey="id"
        dataSource={brands}
        form={props.form}
        className={!isEdit ? "hidden" : ""}
        onSearch={onSearchBrand} />
      
      {
        formData.brand && 
        <Button onClick={() => setIsEdit(!isEdit)} style={{marginLeft: 10, marginTop: 15}}>{isEdit ? <Translate id="text_back" /> : <Translate id="text_edit" />}</Button>
      }
    </div>;
}

function SelectCategory(props) {
  const limit = 15;
  const {formData} = props;
  const [loading, setLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false || !formData.productType);
  const [categories, setCategories] = React.useState([]);
  let timeout = null;
  const onSearchCategory = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (search) {
        setLoading(true);
        ProductsTypeService.lists(limit, 0, "", "", "", JSON.stringify({column: ["name", "namekm"], value: search}))
        .then(response => {
          if (response && response.data) {
            setCategories(response.data.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
      }
    }, 1000);
  };

  return <div style={{display: "flex", alignItems: "center"}}>
      <InputText
        name="productTypeName"
        label={<Translate id="text_category" />}
        data={formData.productType ? formData.productType.name : ""}
        disabled={true}
        form={props.form}
        className={isEdit ? "hidden" : ""} />
      <SelectSearch
        name="productTypeId"
        label={<Translate id="text_category" />}
        placeholder={props.placeholder}
        notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
        valueKey="id"
        dataSource={categories}
        form={props.form}
        className={!isEdit ? "hidden" : ""}
        onSearch={onSearchCategory} />
        {
          formData.productType && 
          <Button onClick={() => setIsEdit(!isEdit)} style={{marginLeft: 10, marginTop: 15}}>{isEdit ? <Translate id="text_back" /> : <Translate id="text_edit" />}</Button>
        }
    </div>;
}

function SelectUnit(props) {
  const limit = 15;
  const {formData} = props;
  const [loading, setLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false || !formData.unit);
  const [units, setUnits] = React.useState([]);
  let timeout = null;
  const onSearchUnit = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (search) {
        setLoading(true);
        ProductsUnitService.lists(limit, 0, "", "", "", JSON.stringify({column: ["name"], value: search}))
        .then(response => {
          if (response && response.data) {
            setUnits(response.data.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
      }
    }, 1000);
  };

  return <div style={{display: "flex", alignItems: "center"}}>
      <InputText
        name="unitName"
        label={<Translate id="text_unit" />}
        data={formData.unit ? formData.unit.name : ""}
        disabled={true}
        className={isEdit ? "hidden" : ""}
        form={props.form} />
      <SelectSearch
        name="defaultUnitId"
        label={<Translate id="text_unit" />}
        placeholder={props.placeholder}
        notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
        valueKey="id"
        dataSource={units}
        form={props.form}
        className={!isEdit ? "hidden" : ""}
        onSearch={onSearchUnit} />
        {
          formData.unit && 
          <Button onClick={() => setIsEdit(!isEdit)} style={{marginLeft: 10, marginTop: 15}}>
            {isEdit ? <Translate id="text_back" /> : <Translate id="text_edit" />}
          </Button>
        }
    </div>;
}

function SelectOwner(props) {
  const limit = 15;
  const {formData} = props;
  const [loading, setLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false || !formData.seller);
  const [owners, setOwners] = React.useState([]);
  let timeout = null;
  const onSearchOwner = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (search) {
        setLoading(true);
        SupplierService.lists(limit, 0, "", "", "", JSON.stringify({column: ["name"], value: search}))
        .then(response => {
          if (response && response.data) {
            setOwners([{id: "", name: "N/A"}].concat(response.data.data));
          }
        })
        .finally(() => {
          setLoading(false);
        });
      }
    }, 1000);
  };

  return <div style={{display: "flex", alignItems: "center"}}>
      <InputText
        name="ownerName"
        label={<Translate id="text_owner" />}
        data={formData.seller ? formData.seller.name : ""}
        disabled={true}
        className={isEdit ? "hidden" : ""}
        form={props.form} />
      <SelectSearch
        name="sellerId"
        label={<Translate id="text_owner" />}
        placeholder={props.placeholder}
        notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
        valueKey="id"
        dataSource={owners}
        form={props.form}
        className={!isEdit ? "hidden" : ""}
        onSearch={onSearchOwner} />
        {
          formData.unit && 
          <Button onClick={() => setIsEdit(!isEdit)} style={{marginLeft: 10, marginTop: 15}}>
            {isEdit ? <Translate id="text_back" /> : <Translate id="text_edit" />}
          </Button>
        }
    </div>;
}

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      productsType: [],
      productTypeIndex: 0, // for condition three type starndard, variant, composite
      isAutoGenerateBarcode: this.Enum.GENERATE_PRODUCT_CODE.MANAUL,
      isRequireInputBarcode: true,
      isSetFocusBarcode: false,
      isComponentNotYetUpdated: true,
      isComponentNotYetLoadedWillUpdate: true,
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
      // {
      //   name: <this.Translate id="radio_box_product_composite" />,
      //   description: <this.Translate id="radio_box_product_composite_description" />,
      //   value: Enum.PRODUCT_COMPOSITE
      // }
    ];

    this.serialTypes = [
      {
        name: <this.Translate id="text_yes" />,
        value: Enum.SERIAL_TYPE.STANDARD
      },
      {
        name: <this.Translate id="text_no" />,
        value: Enum.SERIAL_TYPE.NON_INVENTORY
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
    this.onChangeTab = this.onChangeTab.bind(this);
    this.getProductImageFromCallBack = this.getProductImageFromCallBack.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
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

  onCangeIsAutoGenerateCode(value) {
    if (value === this.Enum.GENERATE_PRODUCT_CODE.AUTO) {
      this.props.form.setFieldsValue({
        barcode: ""
      });
    }

    this.setState({
      isAutoGenerateBarcode: value,
      isRequireInputBarcode: value === this.Enum.GENERATE_PRODUCT_CODE.MANAUL
    });

    this.props.dispatch(ProductAction.switchTypeOfGenerateSKU(value));
  }

  handleChangeType(value) {
    if (value === Enum.TYPE_OF_PRODUCT.RAW_MATERIAL) {
      this.setState({productOptionClassDisabled: "disabled-click"});
    } else {
      this.setState({productOptionClassDisabled: ""});
    }
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

    const currentUser = this.getCurrentUser();
    
    if (this.state.productsType) {
      this.state.productsType.forEach((productTypeValue, productTypeIndex) => {
        this.state.productsType[productTypeIndex].name = productTypeValue.name;
        this.state.productsType[productTypeIndex].namekm = productTypeValue.namekm;
        this.state.productsType[productTypeIndex].namebm = productTypeValue.namebm;
      });
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

    return (<this.Row id="wrap-product-form">
        <this.Col md="6" className="create-product-column-left">
          <this.Row>
              <this.Col md="4" className="form-group">
                <this.InputText
                  name="name"
                  label={<this.Translate id="text_product_name" />}
                  data={formData.name}
                  placeholder={this.CATranslate("text_product_name", locale)}
                  errorRequired={<this.Translate id="error_require_name" />}
                  errorLenght={<this.Translate id="input_error_products_name" />}
                  isAutoFocus={true}
                  required={true}
                  max={100}
                  min={0}
                  form={form}
                  suffix={this.getLanguageIcon("en")}/>
              </this.Col>

              <this.Col md="4" className="form-group">
                <this.InputText
                  name="namekm"
                  label={<this.Translate id="text_product_name" />}
                  data={formData.namekm}
                  placeholder={this.CATranslate("text_product_name", locale)}
                  errorRequired={<this.Translate id="error_require_name" />}
                  errorLenght={<this.Translate id="input_error_products_name" />}
                  max={100}
                  min={0}
                  form={form}
                  suffix={this.getLanguageIcon("km")}/>
              </this.Col>

              <this.Col md="4" className="form-group">
                <this.Select
                  name="serialType"
                  label={
                    <span>
                      <this.Translate id="text_manage_stock" />&nbsp;
                      <this.Tooltip title="Do you want your product calculate stock or not?">
                        <this.Icon type="question-circle-o" />
                      </this.Tooltip>
                    </span>
                  }
                  placeholder={this.CATranslate("text_do_you_want_manage_stock", locale)}
                  dataSource={this.serialTypes}
                  defaultValue={formData.serialType}
                  errorRequired={<this.Translate id="error_require_serial_type" />}
                  disabled={formData.id != null}
                  required={true}
                  form={form}/>
              </this.Col>
              
              <this.Col md="4">
                <div className="ant-col ant-form-item-label">
                    <label htmlFor="unitName" className="ant-form-item-required"><this.Translate id="text_barcode" /></label>
                  </div>
                <div id="wrap-input-barcode" style={{display: "flex", alignItems: "center"}}>
                  <SelectSearch
                    name="isAutoGenerateBarcode"
                    defaultValue={formData.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.MANAUL ? this.Enum.GENERATE_PRODUCT_CODE.MANAUL : this.Enum.GENERATE_PRODUCT_CODE.AUTO}
                    disabled={formData.id != null}
                    dataSource={[
                      {
                        value: this.Enum.GENERATE_PRODUCT_CODE.MANAUL,
                        name: <this.Translate id="input_product_enter_custom_code" />}, 
                      { 
                        value: this.Enum.GENERATE_PRODUCT_CODE.AUTO,
                        name: <this.Translate id="input_product_auto_generate_code" />
                      }
                    ]}
                    form={form}
                    onChange={this.onCangeIsAutoGenerateCode}
                    className="barcode-option" />
                  <this.InputText
                    name="barcode"
                    data={Util.getProductBarcode(formData)}
                    placeholder={this.CATranslate("text_barcode", locale)}
                    required={this.state.isRequireInputBarcode}
                    errorRequired={<this.Translate id="error_require_sku" />}
                    max={20}
                    form={form}
                    disabled={(formData.id != null && formData.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO) || this.state.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO} />
                  </div>
            </this.Col>

            <this.Col md="4" className="form-group">
              <SelectUnit formData={formData} placeholder={this.CATranslate("text_unit", locale)} form={form} />
            </this.Col>

            <this.Col md="4">
                <SelectOwner
                  formData={formData}
                  placeholder={this.CATranslate("text_owner", locale)}
                  form={form}/>
            </this.Col>


            <this.Col md="12" className="form-group">
              <this.Checkboxs
                name="isSplittable"
                label={<this.Translate id="text_splittable" />}
                defaultValue={formData.isSplittable}
                form={this.props.form} />
            </this.Col>

            <this.Col md="4" className="form-group">
              <this.InputNumber
                name="price"
                label={<span><this.Translate id="text_retial_price" /><span> ({currentUser.setting.currency})</span></span>}
                data={Util.getProductPrice(formData)}
                isAutoSelect={true}
                placeholder={this.CATranslate("input_product_price_placeholder", locale)}
                errorRequired={<this.Translate id="error_require_price" />}
                max={99999999}
                form={form} />
            </this.Col>

            <this.Col md="4" className="form-group">
              <this.InputNumber
                name="wholePrice"
                label={<span><this.Translate id="text_whole_price" /><span> ({currentUser.setting.currency})</span></span>}
                data={Util.getProductWholeSalePrice(formData)}
                isAutoSelect={true}
                placeholder={this.CATranslate("input_product_price_placeholder", locale)}
                errorRequired={<this.Translate id="error_require_price" />}
                max={99999999}
                form={form} />
            </this.Col>

            <this.Col md="4" className="form-group">
              <this.InputNumber
                name="distributePrice"
                label={<span><this.Translate id="text_distribute_price" /><span> ({currentUser.setting.currency})</span></span>}
                data={Util.getProductDistributePrice(formData)}
                isAutoSelect={true}
                placeholder={this.CATranslate("input_product_price_placeholder", locale)}
                errorRequired={<this.Translate id="error_require_price" />}
                max={99999999}
                form={form} />
            </this.Col>

            <this.Col md="12" className="main-product-collapse form-group">
              <this.Collapse bordered={false}>
                <this.Panel header={<Translate id="text_other" />} key="1">
                  <this.Row>
                    <this.Col md="4">
                        <SelectCategory
                          formData={formData}
                          placeholder={this.CATranslate("text_category", locale)}
                          form={form}/>
                    </this.Col>
                    <this.Col md="4">
                      <SelectBrand
                        placeholder={this.CATranslate("text_brand", locale)}
                        form={form}
                        formData={formData} />
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
                    <this.Col md="4" className="form-group">
                      <this.InputNumber
                        name="costDisplay"
                        label={<span><this.Translate id="text_cost" /><span> ({currentUser.setting.currency})</span></span>}
                        data={Util.getProductCost(formData)}
                        placeholder={this.CATranslate("text_cost_placeholder", locale)}
                        disabled={true}
                        form={form}/>
                    </this.Col>
                    <this.Col md="4">
                      <this.InputNumber
                        name="reorderPoint"
                        label={<this.Translate id="text_alert_quantity" />}
                        data={formData.reorderPoint === 0 ? null : formData.reorderPoint}
                        placeholder={this.CATranslate("input_product_re_order_point_placeholder", locale)}
                        max={9999999}
                        form={form}/>
                    </this.Col>
                    <this.Col md="4" style={{ display: "flex", alignItems: "center", paddingTop: 20 }}>
                      <this.Switchs
                        name="isAvialableSale"
                        label={<this.Translate id="input_product_is_avialable_sale" />}
                        checked={formData.isAvialableSale}
                        form={form} />
                    </this.Col>
                  </this.Row>
                </this.Panel>
              </this.Collapse>
            </this.Col>

            <this.Col md="12">
              <this.UploadImg
                name="image"    
                label={<this.Translate id="text_image" />}
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
    isAutoGenerateBarcode: CommonEnum.GENERATE_PRODUCT_CODE.MANAUL,
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
    status: 1
  },
  tagList: []
};