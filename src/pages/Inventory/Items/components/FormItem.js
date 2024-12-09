import React from "react";
import {
  Checkbox,
  Form,
  Spin,
  Button,
  Tag,
  Input,
  Tooltip,
  Icon,
  Radio,
  Row,
  Col,
  Switch
} from "antd";
import {
  Translate
} from "@redux/index";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Enum from "@enums/index";
import Util from "@helper/item";
import {
  InputNumber,
  InputText,
  Select,
  SelectSearch,
  UploadImageCrop,
  CustomCollapse,
  CustomFormItem,
  CustomCheckbox
} from "@components/index";
import ProductAction from "../redux/action";
import CategoryService from "@services/CategoryService";
import BrandService from "@services//BrandService";
import UnitService from "@services/UnitService";
import ProductService from "@services/ProductService";
import ProductConditionService from "@services/ProductConditionService";
import VendorService from "@services/VendorService";
import ExchangeRateService from "@services/ExchangeRateService";
import BaseModal from "@layout/BaseModal";
import Exchange from "./ExchangeMoneyFunc";
import "./index.css";

function SelectBrand(props) {
  const limit = 15;

  const [loading, setLoading] = React.useState(false);

  const [brands, setBrands] = React.useState([]);
  
  let timeout = null;
  
  const onSearchBrand = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      BrandService.get({ limit, search } )
        .then(response => {
          if (response && response.data) {
            setBrands(response.data.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
  };

  React.useEffect(() => {
    setLoading(true);
    BrandService.get({ limit })
    .then(response => {
      if (response && response.data) {
        setBrands(response.data.data);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [])

  return <SelectSearch
    name="brandId"
    label={<Translate id="text_brand" />}
    placeholder={props.placeholder}
    notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
    valueKey="id"
    dataSource={brands}
    form={props.form}
    onSearch={onSearchBrand}
  />;
}

function SelectManufacturer(props) {
  const limit = 15;

  const [loading, setLoading] = React.useState(false);

  const [brands, setBrands] = React.useState([]);
  
  let timeout = null;
  
  const onSearchBrand = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      BrandService.get({ limit, search } )
        .then(response => {
          if (response && response.data) {
            setBrands(response.data.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
  };

  React.useEffect(() => {
    setLoading(true);
    BrandService.get({ limit })
    .then(response => {
      if (response && response.data) {
        setBrands(response.data.data);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [])

  return <SelectSearch
    name="manufacturerId"
    label={"Manufacturer"}
    placeholder={props.placeholder}
    notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
    valueKey="id"
    dataSource={brands}
    form={props.form}
    onSearch={onSearchBrand}
  />;
}

function SelectCategory(props) {
  const limit = 15;
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  let timeout = null;
  const onSearchCategory = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (search) {
        setLoading(true);
        CategoryService.get(limit, 0, "", "", "", JSON.stringify({column: ["name", "namekm"], value: search}))
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
  
  React.useEffect(() => {
    setLoading(true);
      CategoryService.get(limit)
      .then(response => {
        if (response && response.data) {
          setCategories(response.data.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return <SelectSearch
    name="categoryId"
    label={<Translate id="text_category" />}
    placeholder={props.placeholder}
    notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
    valueKey="id"
    dataSource={categories}
    defaultValue={props.defaultValue}
    form={props.form}
    onSearch={onSearchCategory} />;
}

function SelectUnitOfMeasurement(props) {
  const limit = 15;

  const [loading, setLoading] = React.useState(false);

  const [units, setUnits] = React.useState([]);
  let timeout = null;
  const onSearchUnit = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (search) {
        setLoading(true);
        UnitService.get({ limit, search })
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

  React.useEffect(() => {
    setLoading(true);
    UnitService.get(limit)
    .then(response => {
      if (response && response.data) {
        setUnits(response.data.data);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [])

  return <SelectSearch
    name="defaultUnitId"
    label={"Unit of Measurement (UOM) (e.g., kg, piece, meter)"}
    placeholder={"Select the unit of measurement (e.g., kg, piece, meter)"}
    notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
    valueKey="id"
    dataSource={units}
    form={props.form}
    onSearch={onSearchUnit}
  />;
}

function SelectSellingUnit(props) {
  const limit = 15;

  const [loading, setLoading] = React.useState(false);

  const [units, setUnits] = React.useState([]);
  let timeout = null;
  const onSearchUnit = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (search) {
        setLoading(true);
        UnitService.get({ limit, search })
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

  React.useEffect(() => {
    setLoading(true);
    UnitService.get(limit)
    .then(response => {
      if (response && response.data) {
        setUnits(response.data.data);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [])

  return <SelectSearch
    name="sellingUnitId"
    label={"Selling Unit"}
    placeholder={"Select the unit in which the product is sold (e.g., piece, box, pack)"}
    notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
    valueKey="id"
    dataSource={units}
    form={props.form}
    onSearch={onSearchUnit}
  />;
}

function SelectStockUnit(props) {
  const limit = 15;

  const [loading, setLoading] = React.useState(false);

  const [units, setUnits] = React.useState([]);
  let timeout = null;
  const onSearchUnit = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (search) {
        setLoading(true);
        UnitService.get({ limit, search })
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

  React.useEffect(() => {
    setLoading(true);
    UnitService.get(limit)
    .then(response => {
      if (response && response.data) {
        setUnits(response.data.data);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [])

  return <SelectSearch
    name="stockUnitId"
    label={"Stock Unit"}
    placeholder={"Select the unit used for inventory management (e.g., piece, case, carton)"}
    notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
    valueKey="id"
    dataSource={units}
    form={props.form}
    onSearch={onSearchUnit}
  />;
}

function SelectOwner(props) {
  const limit = 15;
  
  const [loading, setLoading] = React.useState(false);
  const [owners, setOwners] = React.useState([]);

  let timeout = null;
  const onSearchOwner = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (search) {
        setLoading(true);
        VendorService.get(limit, 0, "", "", "", JSON.stringify({column: ["name"], value: search}))
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

  React.useEffect(() => {
    setLoading(true);
    VendorService.get(limit)
    .then(response => {
      if (response && response.data) {
        setOwners(response.data.data);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [])

  return <SelectSearch
    name="sellerId"
    // label={<Translate id="text_owner" />}
    label={"Owned by Supplier"}
    placeholder={props.placeholder}
    notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
    valueKey="id"
    dataSource={owners}
    form={props.form}
    onSearch={onSearchOwner}
  />;
}

function SelectCondition(props) {
  const limit = 15;

  const [loading, setLoading] = React.useState(false);
  const [conditions, setConditions] = React.useState([]);

  React.useEffect(() => {
    ProductConditionService.get({ limit })
    .then(response => {
      if (response.data && response.data.data) {
        setConditions(response.data.data);
      }
    });
  }, []);

  React.useEffect(() => {
    setLoading(true);
    ProductConditionService.get({ limit })
    .then(response => {
      if (response.data && response.data.data) {
        setConditions(response.data.data);
      }
    });
  }, [])

  return <SelectSearch
      name="conditionId"
      label={<Translate id="text_condition" />}
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      valueKey="id"
      dataSource={conditions}
      form={props.form}
  />;
}

export default class FormItem extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      serialType: Enum.SERIAL_TYPE.STANDARD,
      productsType: [],
      productTypeIndex: 0, // for condition three type starndard, variant, composite
      isAutoGenerateBarcode: this.Enum.GENERATE_PRODUCT_CODE.MANAUL,
      isRequireInputBarcode: true,
      isSetFocusBarcode: false,
      isComponentNotYetUpdated: true,
      isComponentNotYetLoadedWillUpdate: true,
      productOptionClassDisabled: "",
      description: "",
      specification: "",
      tags: [],
      conditions: [],
      inputVisible: false,
      editCostVisible: false,
      inputValue: "",
      exchangeRate: null
    };

    this.TAB_PRODUCT_COST_LOG = 3;

    this.TAB_PRODUCT_LOG = 4;
    this.exchangeRate = 1;

    this.productTypeContent = "";
    
    this.productTypes = [
      {
        name: <Translate id="radio_box_product_standard" />,
        description: <Translate id="radio_box_product_standard_description" />,
        value: Enum.PRODUCT_STANDARD
      },
      {
        name: <Translate id="radio_box_product_variant" />,
        description: <Translate id="radio_box_product_variant_description" />,
        value: Enum.PRODUCT_VARIANT
      },
      // {
      //   name: <Translate id="radio_box_product_composite" />,
      //   description: <Translate id="radio_box_product_composite_description" />,
      //   value: Enum.PRODUCT_COMPOSITE
      // }
    ];

    this.serialTypes = [
      {
        name: <Translate id="text_yes" />,
        value: Enum.SERIAL_TYPE.STANDARD
      },
      {
        name: <Translate id="text_no" />,
        value: Enum.SERIAL_TYPE.NON_INVENTORY
      }
    ];

    this.typesOfProduct = [
      {
        name: <Translate id="text_final_goods" />,
        value: Enum.TYPE_OF_PRODUCT.GOOD
      },
      {
        name: <Translate id="text_raw_material" />,
        value: Enum.TYPE_OF_PRODUCT.RAW_MATERIAL
      }
    ];

    this.statuses = [
      {
        name: "Active",
        value: 1
      },
      {
        name: "Inactive",
        value: 0
      }
    ];

    this.onChange = this.onChange.bind(this);
    this.onCangeIsAutoGenerateCode = this.onCangeIsAutoGenerateCode.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.getProductImageFromCallBack = this.getProductImageFromCallBack.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
  }

  componentDidMount() {
    const {formData} = this.props;
    if (formData.tag && formData.tag.length){
      this.setState({tags: formData.tag.split(",")});
    }

    const {currency, currencyId}  = this.Util.getSetting();

    if (currency !== "$"){
      ExchangeRateService.getExchangeRate(JSON.stringify({"currencyId": [currencyId]})).then(({data})=>{
        const data1 = data.data;
        if (data1 && data1.length){
          this.setState({exchangeRate: data1[data1.length-1].value});
          this.props.setExchangeRateCallBack(data1[data1.length-1].value);
        }
      });
    } else {
      this.setState({exchangeRate: 1});
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

  onChangeItemType = (e) => {
    this.setState({ serialType: e.target.value })
  }

  handleEditCost(productVariantId, newCost) {
    ProductService.editProductCost(productVariantId, newCost)
    .finally(() => this.setState({editCostVisible: false}));
  }

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
    this.props.callBackGetProductTags(tags);
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleEnableAutoBarcode = (checked) => {
    if (checked) {
      this.props.form.setFieldsValue({
        barcode: ""
      });
    }

    this.setState({
      isAutoGenerateBarcode: checked,
      isRequireInputBarcode: !checked
    });
  }

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: "",
    });
    this.props.callBackGetProductTags(tags);
  };

  saveInputRef = input => (this.input = input);

  getPrecisionByCurrency(length=2){
    return this.Util.getSetting().currency === "$"  ? length :  0;
  }

  render() {
    const { tags, inputVisible, inputValue, exchangeRate } = this.state;
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

    const radioStyle = {
      display: 'block',
      height: '40px',
      width: '100%',
      lineHeight: '30px',
      display: "none"
    };

    const selectedValue = 1;

    return (<Row gutter={[16, 16]}>
      <Col 
        md={16}
        offset={4}
        // xs={{ span: 12, offset: 0, push: 0 }}
        // sm={{ span: 12, offset: 0, push: 0 }}
        // md={{ span: 14, offset: 5, push: 5 }}
      >
        <CustomCollapse
          defaultActiveKey={["general_info"]}
          headerTitle={"Item Details"}
          subtitle={"Enter the essential information about the item, such as its name, category, and condition, to properly define and categorize it within the inventory system."}
        >
          <InputText
              name="name"
              label={<Translate id="text_item_name" />}
              data={formData.name}
              placeholder="Enter item name..."
              errorRequired={<Translate id="error_require_name" />}
              errorLenght={<Translate id="input_error_products_name" />}
              isAutoFocus={true}
              required={true}
              form={form}
            />

          <Col md={24} className="hidden">
              <this.InputText
                name="namekm"
                label={<Translate id="text_item_name" />}
                data={formData.namekm}
                placeholder={this.CATranslate("text_item_name", locale)}
                errorRequired={<Translate id="error_require_name" />}
                errorLenght={<Translate id="input_error_products_name" />}
                form={form}
                suffix={this.getLanguageIcon("km")}/>
          </Col>

          <Form.Item label="Enable Auto Barcode">
            <Switch
              // defaultChecked={formData.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.MANAUL ? this.Enum.GENERATE_PRODUCT_CODE.MANAUL : this.Enum.GENERATE_PRODUCT_CODE.AUTO}
              defaultChecked={(formData.id != null && formData.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO) || this.state.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO}
              onChange={this.handleEnableAutoBarcode}
            />
          </Form.Item>

          <InputText
            name="barcode"
            label={<Translate id="text_barcode" />}
            data={Util.getProductBarcode(formData)}
            placeholder="Scan or type the barcode here..."
            required={this.state.isRequireInputBarcode}
            errorRequired={<Translate id="error_require_sku" />}
            max={20}
            form={form}
            disabled={(formData.id != null && formData.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO) || this.state.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO}
          />

          <SelectCategory
            defaultValue={formData.categoryId}
            placeholder="Choose a category..."
            form={form}
          />

          <SelectCondition
            defaultValue={formData.conditionId}
            placeholder={this.CATranslate("text_select_condition", locale)}
            form={form}
          />

          <Form.Item label={<Translate id="text_description" />}>
            <CKEditor
              editor={ClassicEditor}
              data={formData.description ? formData.description : "<p></p>"}
              onChange={(event, editor) => {
                const data = editor.getData();
                this.props.form.setFieldsValue({
                  description: data
                });
                this.setState({ description: data });
              }}
            />
            <this.InputText
              name="description"
              data={form.description}
              form={form}
              className="hidden"
              max={null}
            />
          </Form.Item>

          <CustomCheckbox
            name="enableDescription"
            label={<Translate id="text_enable_pro_des_imei_serial_number" />}
            defaultValue={formData.enableDescription}
            form={form}
          />

          <Form.Item
            name="serialType"
            label={
              <div style={{ textAlign: "left" }}>
                <div>Choose an item type</div>
                <div style={{ fontSize: 14, color: "#888", marginTop: 5 }}>Pick the type that matches how this item will be used or managed.</div>
              </div>
            }
          >
            <Radio.Group onChange={this.onChangeItemType} style={{ width: "100%" }}>
              {[Enum.SERIAL_TYPE.STANDARD, Enum.SERIAL_TYPE.NON_INVENTORY].map((value) => (
                <Radio
                  key={value}
                  value={value}
                  style={{ width: "100%" }} // Hide the default Radio button
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px",
                      border: this.state.serialType === value ? "2px solid #1890ff" : "1px solid #d9d9d9",
                      borderRadius: 3,
                      cursor: "pointer",
                      marginBottom: "8px",
                      transition: "border-color 0.3s",
                    }}
                    onClick={() => this.setState({ serialType: value })}
                  >
                    {/* Image on the left */}
                    <img
                      src="https://via.placeholder.com/50"
                      alt={`Option ${value}`}
                      style={{ borderRadius: "4px", marginRight: "16px" }}
                    />

                    {/* Title and Subtitle on the right */}
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {value === Enum.SERIAL_TYPE.STANDARD ? "Good" : "Service"}
                      </div>
                      <div style={{ color: "#888", fontSize: "14px" }}>
                        {value === Enum.SERIAL_TYPE.STANDARD
                          ? "Physical items like products, materials, or inventory."
                          : "Non-physical offerings like maintenance, repair, or consulting."}
                      </div>
                    </div>
                  </div>
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Select
            name="status"
            label={
              <div>
                <div><Translate id="text_status" /></div>
                <div style={{ fontSize: 13, color: "#888" }}>Specify whether this item is currently active or inactive in the system.</div>
              </div>
            }
            dataSource={this.statuses}
            defaultValue={formData.status !== "" ? formData.status : this.statuses[0].status}
            form={form}
          />
        </CustomCollapse>

        <CustomCollapse
          headerTitle={"Pricing"}
          subtitle={"Define the pricing for your item across different sales channels: retail, wholesale, and distribution."}
          collapseStyle={{ marginTop: "30px" }}
        >
          <InputNumber
              name="price"
              label={<Translate id="text_retial_price" />}
              data={Exchange.dollarToRiel(Util.getProductPrice(formData), exchangeRate)}
              precision={this.getPrecisionByCurrency()}
              placeholder={"0.00"}
              errorRequired={<Translate id="error_require_price" />}
              max={99999999}
              form={form}
            />

          <InputNumber
              name="wholePrice"
              label={<Translate id="text_whole_price" />}
              data={Exchange.dollarToRiel(Util.getProductWholeSalePrice(formData), exchangeRate)}
              precision={this.getPrecisionByCurrency()}
              placeholder={"0.00"}
              form={form}
            />

          <InputNumber
              name="distributePrice"
              label={<Translate id="text_distribute_price" />}
              data={Exchange.dollarToRiel(Util.getProductDistributePrice(formData), exchangeRate)}
              precision={this.getPrecisionByCurrency()}
              placeholder={"0.00"}
              form={form}
            />
        </CustomCollapse>

        <CustomCollapse
          headerTitle={"Images and Media"}
          subtitle={"Upload and manage images or videos to visually represent your item, enhancing its appeal and providing detailed insights for users."}
          collapseStyle={{ marginTop: "30px" }}
        >
          <UploadImageCrop 
            name="image"
            data={{file: image}}
            fileList={[image]}
            endPoint={`${this.Util.getAPIURL()}/file/v1/upload/product`}
            endPointDelete={`${this.Util.getAPIURL()}/file/v1/product/delete`}
            accessToken={this.Util.getAccessToken()}
            locale={locale}
            form={form}
          />

          <InputText
              name="videoUrl"
              label={"Video URL (e.g., product demo or marketing video)"}
              data={formData.videoUrl}
              placeholder="Enter video URL (e.g., https://youtu.be/example)"
              form={form}
            />
        </CustomCollapse>

        <CustomCollapse
          headerTitle={"Inventory Details"}
          subtitle={"Provide details on stock levels, warehouse locations, and inventory management."}
          collapseStyle={{ marginTop: "30px" }}
        >
          <CustomCheckbox
            name="enableInventoryTracking"
            label={"Track Inventory for this Item"}
            subtitle={"You cannot enable/disable inventory tracking once you've created transactions for this item"}
            tooltip={"Enable this option to track this item's stock based on its sales and purchase transactions."}
            form={form}
          />

          <Select
            name="type"
            label={<Translate id="text_type" />}
            tooltip={"Select 'Raw Material' if the item is used in production, or 'Final Goods' if it is ready for direct sale."}
            dataSource={this.typesOfProduct}
            defaultValue={formData.type !== "" ? formData.type : this.typesOfProduct[0].value}
            disabled={!!formData.id}
            onChange={this.handleChangeType}
            form={form}
          />

          <InputText
            name="sku"
            label={"Stock Keeping Unit (SKU)"}
            data={formData.sku}
            placeholder="SKU code (e.g., ABC123)"
            form={form}
          />

          <InputNumber
            name="intialStockQuantity"
            label={"Initial Stock Quantity"}
            data={formData.intialStockQuantity}
            placeholder="Enter initial stock quantity"
            form={form}
          />

          <InputNumber
            name="reorderPoint"
            label={"Reorder Level"}
            data={formData.reorderPoint}
            placeholder="Enter reorder point"
            form={form}
          />

          <CustomFormItem
            name="defaultLocationId"
            label={"Default Warehouse"}
            subtitle={"Select the primary warehouse where inventory will be stored and managed. This warehouse will be used as the default location for stock allocation, order fulfillment, stock level tracking, and for processing incoming goods from purchase orders."}
          >
              <Radio.Group onChange={this.onChangeItemType} style={{ width: "100%" }}>
                {["Location A", "Location B"].map((value) => (
                  <Radio
                    key={value}
                    value={value}
                    style={{ width: "100%" }} // Hide the default Radio button
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "16px",
                        border: this.state.serialType === value ? "2px solid #1890ff" : "1px solid #d9d9d9",
                        borderRadius: 3,
                        cursor: "pointer",
                        marginBottom: "8px",
                        transition: "border-color 0.3s",
                      }}
                      onClick={() => this.setState({ serialType: value })}
                    >
                      {/* Image on the left */}
                      <img
                        src="https://via.placeholder.com/50"
                        alt={`Option ${value}`}
                        style={{ borderRadius: "4px", marginRight: "16px" }}
                      />

                      {/* Title and Subtitle on the right */}
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                          { value }
                        </div>
                        <div style={{ color: "#888", fontSize: "14px" }}>
                          Physical items like products, materials, or inventory.
                        </div>
                      </div>
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
          </CustomFormItem>
        </CustomCollapse>

        <CustomCollapse
          headerTitle={"Supplier Information"}
          subtitle={"Provide the supplier’s name, their item code for the product, purchase price, and lead time (in days) to ensure accurate order tracking and timely procurement."}
          collapseStyle={{ marginTop: "30px" }}
        >
          <SelectOwner
            formData={formData}
            placeholder={this.CATranslate("text_owner", locale)}
            form={form}
          />

          <InputNumber
              name="supplierConsignmentPercentage"
              label={"Percentage for Supplier on Sale"}
              placeholder={"0.00"}
              data={formData.supplierConsignmentPercentage}
              form={form}
          />

          <Select
              name="supplierId"
              label={"Preferred Supplier"}
              placeholder={"Select your preferred supplier from the list"}
              dataSource={[{name: <Translate id="text_day" />, value: "DAY"}]}
              defaultValue={formData.supplierId}
              form={form}
          />

          <InputText
            name="supplierCode"
            label={"Supplier Item Code"}
            data={formData.supplierCode}
            placeholder="Enter the item code provided by the supplier"
            form={form}
          />

          <InputNumber
              name="purchasePrice"
              label={"Purchase Price"}
              placeholder={"0.00"}
              data={formData.purchasePrice}
              form={form}
          />

          <InputNumber
              name="costDisplay"
              label={"Average Cost"}
              tooltip={"Costing is automatically generated based on the average cost calculation during purchasing transactions."}
              data={Exchange.dollarToRiel(Util.getProductCost(formData), exchangeRate)}
              precision={this.getPrecisionByCurrency()}
              placeholder={this.CATranslate("text_cost_placeholder", locale)}
              disabled={true}
              form={form}
          />
        </CustomCollapse>

        <CustomCollapse
          headerTitle={"Unit and Measurement"}
          subtitle={"Specify the unit of measurement for the product (e.g., pieces, kilograms, liters) to ensure accurate inventory tracking and order quantities."}
          collapseStyle={{ marginTop: "30px" }}
        >
          <CustomCheckbox
            name="isSplittable"
            label={<Translate id="text_splittable" />}
            subtitle={"Enable this option to allow the item to be sold in smaller retail units derived from the base unit."}
            defaultValue={formData.isSplittable}
            form={this.props.form}
          />

          <SelectUnitOfMeasurement
            formData={formData}
            form={form}
          />

          <SelectSellingUnit
            formData={formData}
            form={form}
          />

          <SelectStockUnit
            formData={formData}
            form={form}
          />

          <InputNumber
              name="unitConversion"
              label={"Conversion Factor (e.g., 1 box = 12 pieces)"}
              placeholder={"0.00"}
              data={formData.unitConversion}
              form={form}
            />
        </CustomCollapse>

        <CustomCollapse
          headerTitle={"Classification & Tags"}
          subtitle={"Define the units for tracking inventory and sales. The Selling Unit is used for sales, while the Stock Unit is used for storage, ensuring accurate management and reporting."}
          collapseStyle={{ marginTop: "30px" }}
        >
          <Form.Item label={"Tags (e.g., Organic, Fragile, Perishable)"}>
            <div>
              {tags.map((tag) => {
                const isLongTag = tag.length > 20;
                const tagElem = (
                  <Tag
                    key={tag}
                    style={{ marginBottom: 5, marginTop: 5 }}
                    closable={true}
                    onClose={() => this.handleClose(tag)}
                  >
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </Tag>
                );
                return isLongTag ? (
                  <Tooltip title={tag} key={tag}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                );
              })}
              {inputVisible ? (
                <Input
                  ref={this.saveInputRef}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputConfirm}
                  onPressEnter={this.handleInputConfirm}
                />
              ) : (
                <Tag onClick={this.showInput} style={{ background: "#fff", borderStyle: "dashed" }}>
                  <Icon type="plus" /> New Tag
                </Tag>
              )}
            </div>
          </Form.Item>

          <SelectBrand
            placeholder={"Select item brand..."}
            form={form}
            formData={formData}
          />

          <SelectManufacturer
            placeholder={"Select item manufacturer..."}
            form={form}
            formData={formData}
          />

          <Form.Item label={<Translate id="text_specification" />}>
            <CKEditor
              editor={ClassicEditor}
              data={formData.specification ? formData.specification : "<p></p>"}
              onChange={(event, editor) => {
                const data = editor.getData();
                this.props.form.setFieldsValue({
                  specification: data
                });
                this.setState({ specification: data });
              }}
            />
            <this.InputText name="specification" data={form.specification} form={form} className="hidden" max={null} />
          </Form.Item>
        </CustomCollapse>

        <CustomCollapse
          headerTitle={"Web Display Settings"}
          subtitle={"Configure how this item will appear on your eCommerce platform, including options for featured products and availability online."}
          collapseStyle={{ marginTop: "30px" }}
        >
          <CustomCheckbox
            name="isFeatured"
            label={<Translate id="text_featured_product" />}
            defaultValue={formData.isFeatured ? true : false}
            form={this.props.form}
          />

          <CustomCheckbox
            name="isPublic"
            label={<Translate id="text_avialable_on_ecommerce" />}
            defaultValue={formData.isPublic ? true : false}
            form={this.props.form}
          />

          <InputText
              name="highlightTag"
              label={"Highlight Tags"}
              placeholder={"Enter for promotional tags like `Best Seller` or `New Arrival`"}
              data={formData.highlightTag}
              form={form}
            />
        </CustomCollapse>
      </Col>
      </Row>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    description:"",
    defaultUnitId: "",
    brandId: "",
    categoryId: "",
    serialType: "",
    isAutoGenerateBarcode: Enum.GENERATE_PRODUCT_CODE.MANAUL,
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