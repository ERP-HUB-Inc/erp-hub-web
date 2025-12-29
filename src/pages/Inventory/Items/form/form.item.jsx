import React from "react";
import {
  Form,
  Spin,
  Tag,
  Input,
  Tooltip,
  Icon,
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
  CustomCheckbox
} from "@components/index";
import ProductAction from "../redux/action";
import CategoryService from "@services/CategoryService";
import BrandService from "@services//BrandService";
import ManufacturerService from "@services/ManufacturerService";
import UnitService from "@services/UnitService";
import ProductService from "@services/ItemService";
import VariantService from "@services/VariantService";
import ProductConditionService from "@services/ProductConditionService";
import VendorService from "@services/VendorService";
import ExchangeRateService from "@services/ExchangeRateService";
import BaseModal from "@layout/base-modal";
import { orderBy } from "lodash";
import Exchange from "./exchange-money-func";
import "./index.css";
import FormVariant from "./form.variant";

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

  const handleChange = (value) => {
    if (!value) {
      BrandService.get({ limit })
      .then((response) => {
        if (response?.data) {
          setBrands(response.data.data);
        }
      });
    }
  };

  React.useEffect(() => {
    setLoading(true);
    BrandService.get({ limit })
    .then(response => {
      if (response && response.data) {
        if (props?.selected) {
          setBrands([props.selected].concat(response.data.data));
        } else {
          setBrands(response.data.data);
        }
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
    defaultValue={props.defaultValue}
    dataSource={brands}
    form={props.form}
    onSearch={onSearchBrand}
    onChange={handleChange}
  />;
}

function SelectManufacturer(props) {
  const limit = 15;

  const [loading, setLoading] = React.useState(false);

  const [data, setData] = React.useState([]);
  
  let timeout = null;
  
  const onSearch = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      BrandService.get({ limit, search } )
        .then(response => {
          if (response && response.data) {
            setData(response.data.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
  };

  const handleChange = (value) => {
    if (!value) {
      BrandService.get({ limit })
      .then((response) => {
        if (response?.data) {
          setData(response.data.data);
        }
      });
    }
  };

  React.useEffect(() => {
    setLoading(true);
    ManufacturerService.get({ limit })
    .then(response => {
      if (response && response.data) {
        setData(response.data.data);
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
    defaultValue={props.defaultValue}
    dataSource={data}
    form={props.form}
    onSearch={onSearch}
    onChange={handleChange}
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
        CategoryService.get({ limit, search })
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

  const handleChange = (value) => {
    if (!value) {
      CategoryService.get({ limit })
      .then((response) => {
        if (response?.data) {
          setCategories(response.data.data);
        }
      });
    }
  };
  
  React.useEffect(() => {
    setLoading(true);
      CategoryService.get(limit)
      .then(response => {
        if (response && response.data) {
          if (props.selected && response.data.data.findIndex(value => value.id === props.selected.id) <= -1) {
            setCategories(orderBy([props.selected].concat(response.data.data), ["name"]));
          } else {
            setCategories(orderBy(response.data.data, ["name"]));
          }
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
    onSearch={onSearchCategory}
    onChange={handleChange}
  />;
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
    name="unitOfMeasurementId"
    label={"Unit of Measurement (UOM) (e.g., kg, piece, meter)"}
    placeholder={"Select the unit of measurement (e.g., kg, piece, meter)"}
    notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
    valueKey="id"
    dataSource={units}
    defaultValue={props.defaultValue}
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

  const handleChange = (value) => {
    if (!value) {
      UnitService.get({ limit })
      .then((response) => {
        if (response?.data) {
          setUnits(response.data.data);
        }
      });
    }
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
    name="sellUnitId"
    label={"Selling Unit"}
    placeholder={"Select the unit in which the product is sold (e.g., piece, box, pack)"}
    notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
    valueKey="id"
    dataSource={units}
    defaultValue={props.defaultValue}
    form={props.form}
    onSearch={onSearchUnit}
    onChange={handleChange}
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

  const handleChange = (value) => {
    if (!value) {
      UnitService.get({ limit })
      .then((response) => {
        if (response?.data) {
          setUnits(response.data.data);
        }
      });
    }
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
    defaultValue={props.defaultValue}
    form={props.form}
    onSearch={onSearchUnit}
    onChange={handleChange}
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
        VendorService.get({ limit, search })
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

  const handleChange = (value) => {
    if (!value) {
      VendorService.get({ limit })
      .then((response) => {
        if (response?.data) {
          setOwners(response.data.data);
        }
      });
    }
  };

  React.useEffect(() => {
    setLoading(true);
    VendorService.get(limit)
    .then(response => {
      if (response && response.data) {
        if (props.selected && response.data.data.findIndex(value => value.id === props.selected.id) <= -1) {
          setOwners([props.selected].concat(response.data.data));
        } else {
          setOwners(response.data.data);
        }
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [])

  return <SelectSearch
    name="supplierId"
    label={"Owned by Supplier"}
    placeholder={props.placeholder}
    notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
    valueKey="id"
    dataSource={owners}
    defaultValue={props.defaultValue}
    form={props.form}
    onSearch={onSearchOwner}
    onChange={handleChange}
  />;
}

function SelectPreferredSupplier(props) {
  const limit = 15;
  
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState([]);

  let timeout = null;
  const onSearch = search => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (search) {
        setLoading(true);
        VendorService.get({ limit, search })
        .then(response => {
          if (response && response.data) {
            setItems([{id: "", name: "N/A"}].concat(response.data.data));
          }
        })
        .finally(() => {
          setLoading(false);
        });
      }
    }, 1000);
  };

  const handleChange = (value) => {
    if (!value) {
      VendorService.get()
      .then((response) => {
        if (response?.data) {
          setItems(response.data.data);
        }
      });
    }
  };

  React.useEffect(() => {
    setLoading(true);
    VendorService.get(limit)
    .then(response => {
      if (response && response.data) {
        if (props.selected && response.data.data.findIndex(value => value.id === props.selected.id) <= -1) {
          setItems([props.selected].concat(response.data.data));
        } else {
          setItems(response.data.data);
        }
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [])

  return <SelectSearch
    name="preferredSupplierId"
    label={"Preferred Supplier"}
    placeholder={props.placeholder}
    notFoundContent={loading ? <Spin size="small" /> : <Translate id="text_please_search" />}
    valueKey="id"
    dataSource={items}
    defaultValue={props.defaultValue}
    form={props.form}
    onSearch={onSearch}
    onChange={handleChange}
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

  const handleChange = (value) => {
    if (!value) {
      ProductConditionService.get({ limit })
      .then((response) => {
        if (response?.data) {
          setConditions(response.data.data);
        }
      });
    }
  };

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
      onChange={handleChange}
  />;
}

export default class FormItem extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      serialType: Enum.SERIAL_TYPE.PRODUCT,
      productsType: [],
      variants: [],
      productTypeIndex: 0, // for condition three type starndard, variant, composite
      isAutoGenerateBarcode: false,
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
        value: Enum.NO_VARIANT
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
        value: Enum.SERIAL_TYPE.PRODUCT
      },
      {
        name: <Translate id="text_no" />,
        value: Enum.SERIAL_TYPE.SERVICE
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
        name: "Draft",
        value: 1
      },
      {
        name: "Ready for Sale",
        value: 2
      },
      {
        name: "Inactive",
        value: 3
      }
    ];
    this.timer = null;
  }

  componentDidMount() {
    const { formData } = this.props;
    this.setState(prevState => {
      return {
        ...prevState,
        serialType: formData.id ? formData.serialType : prevState.serialType,
        tags: formData.tag && formData.tag.length ? formData.tag.split(",") : [],
        variants: formData?.productVariants ? formData.productVariants : [],
      }
    });

    const { currency, currencyId }  = this.Util.getSetting();

    if (currency !== "$"){
      ExchangeRateService.getExchangeRate(JSON.stringify({"currencyId": [currencyId]})).then(({data})=>{
        const data1 = data.data;
        if (data1 && data1.length){
          this.setState({exchangeRate: data1[data1.length-1].value});
          this.props.setExchangeRateCallBack(data1[data1.length-1].value);
        }
      });
    } else {
      this.setState({ exchangeRate: 1 });
    }
    
    if (formData.id && formData.productOption === Enum.PRODUCT_VARIANT) {
      VariantService.getVariantsByItemId({ itemId: formData.id })
      .then(response => {
        if (response?.data) {
          this.setState({ variants: response.data });
        }
      })
    }
  }

  getProductImageFromCallBack = (value) => {
    this.props.form.setFieldsValue({image: value});
  } 

  onChangeTab = (activeKey) => {
    const {dispatch, formData} = this.props;
    const productVariantId = formData.productVariants.length > 0 ? formData.productVariants[0].id : "";
    if ((activeKey - this.TAB_PRODUCT_COST_LOG) === 0) {
      dispatch(ProductAction.fetchCostLog(productVariantId, 100));
    } else if ((activeKey - this.TAB_PRODUCT_LOG) === 0) {
      dispatch(ProductAction.fetchLog(productVariantId, 100));
    }
  }

  onChange = (e) => {
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

  onCangeIsAutoGenerateCode = (value) => {
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

  onSearchVariant = (e) => {
    const search = e.target.value;
    
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
       VariantService.getVariantsByItemId({ itemId: this.props.formData.id, search })
       .then(response => {
        this.setState({ variants: response.data })
       })
    }, 800);
 }

  handleChangeType = (value) => {
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
    // if (checked) {
    //   this.props.form.setFieldsValue({
    //     barcode: ""
    //   });
    // }

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

  getPrecisionByCurrency(length = 2){
    return this.Util.getSetting().currency === "$"  ? length :  0;
  }

  render() {
    const { tags, inputVisible, inputValue, exchangeRate } = this.state;
    const {
      dispatch,
      form,
      locale,
      formData,
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

    const productHasVariant = formData.productOption === Enum.PRODUCT_VARIANT;
    const productNoVariant = formData.productOption === Enum.NO_VARIANT;

    const image = {
      uid: "-1",
      name: formData.image,
      status: "done",
      url: this.Util.getProductImage(formData.image).url
    };

    return (
      <Row gutter={[16, 16]}>
        <Col
          xs={{ span: 24, offset: 0 }}
          sm={{ span: 20, offset: 2 }}
          md={{ span: 16, offset: 4 }}
          lg={{ span: 16, offset: 4 }}
        >
          <CustomCollapse
            defaultActiveKey={["general_info"]}
            headerTitle={"Item Details"}
            subtitle={
              "Enter the essential information about the item, such as its name, category, and condition, to properly define and categorize it within the inventory system."
            }
          >
            <InputText
              name="name"
              label={<Translate id="text_item_name" />}
              data={formData.name}
              placeholder="Enter item name..."
              errorRequired={<Translate id="error_require_name" />}
              errorLenght={<Translate id="text.error.item.length" />}
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
                errorLenght={<Translate id="text.error.item.length" />}
                form={form}
                suffix={this.getLanguageIcon("km")}
              />
            </Col>

            {productNoVariant && (
              <>
                <Form.Item label="Enable Auto Barcode">
                  {form.getFieldDecorator("isAutoGenerateBarcode", {
                    valuePropName: "checked",
                    initialValue:
                      (formData.id != null &&
                        formData.isAutoGenerateBarcode ===
                          this.Enum.GENERATE_PRODUCT_CODE.AUTO) ||
                      this.state.isAutoGenerateBarcode ===
                        this.Enum.GENERATE_PRODUCT_CODE.AUTO,
                  })(
                    <Switch
                      // defaultChecked={formData.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.MANAUL ? this.Enum.GENERATE_PRODUCT_CODE.MANAUL : this.Enum.GENERATE_PRODUCT_CODE.AUTO}
                      // defaultChecked={(formData.id != null && formData.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO) || this.state.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO}
                      onChange={this.handleEnableAutoBarcode}
                      // disabled={(formData.id != null && formData.isAutoGenerateBarcode === this.Enum.GENERATE_PRODUCT_CODE.AUTO)}
                    />
                  )}
                </Form.Item>

                <InputText
                  name="barcode"
                  label={<Translate id="text_barcode" />}
                  data={Util.getItemBarcode(formData)}
                  placeholder="Scan or type the barcode here..."
                  // required={this.state.isRequireInputBarcode}
                  errorRequired={<Translate id="error_require_sku" />}
                  max={20}
                  form={form}
                  disabled={
                    (formData.id != null &&
                      formData.isAutoGenerateBarcode ===
                        this.Enum.GENERATE_PRODUCT_CODE.AUTO) ||
                    this.state.isAutoGenerateBarcode == true
                  }
                />
              </>
            )}

            <SelectCategory
              defaultValue={formData.categoryId}
              selected={formData?.category}
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
                    description: data,
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
                  <div style={{ fontSize: 13, color: "#888", marginTop: 5 }}>
                    Pick the type that matches how this item will be used or
                    managed.
                  </div>
                </div>
              }
            >
              <div style={{ marginTop: 10 }}>
                {[Enum.SERIAL_TYPE.PRODUCT, Enum.SERIAL_TYPE.SERVICE].map(
                  (value, key) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "16px",
                        border:
                          this.state.serialType === value
                            ? "2px solid #1890ff"
                            : "1px solid #d9d9d9",
                        borderRadius: 3,
                        cursor: "pointer",
                        marginBottom: 15,
                        transition: "border-color 0.3s",
                      }}
                      onClick={() => this.setState({ serialType: value })}
                    >
                      {/* Image on the left */}
                      <img
                        src={
                          value === Enum.SERIAL_TYPE.PRODUCT
                            ? "https://cdn-icons-png.flaticon.com/128/10951/10951884.png"
                            : "https://cdn-icons-png.flaticon.com/128/2706/2706962.png"
                        }
                        alt={`Option ${value}`}
                        style={{ borderRadius: 4, marginRight: 16, width: 60 }}
                      />
                      {/* Title and Subtitle on the right */}
                      <div style={{ lineHeight: "24px" }}>
                        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {value === Enum.SERIAL_TYPE.PRODUCT
                            ? "Good"
                            : "Service"}
                        </div>
                        <div style={{ color: "#888", fontSize: "14px" }}>
                          {value === Enum.SERIAL_TYPE.PRODUCT
                            ? "Physical items like products, materials, or inventory."
                            : "Non-physical offerings like maintenance, repair, or consulting."}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              <InputNumber
                name="serialType"
                data={this.state.serialType}
                form={form}
                style={{ display: "none" }}
              />
            </Form.Item>

            <Select
              name="status"
              label={
                <div>
                  <div>
                    <Translate id="text_status" />
                  </div>
                  <div style={{ fontSize: 13, color: "#888" }}>
                    Specify whether this item is currently active or inactive in
                    the system.
                  </div>
                </div>
              }
              dataSource={this.statuses}
              value={formData.status}
              defaultValue={
                formData.status !== ""
                  ? formData.status
                  : this.statuses[0].status
              }
              form={form}
            />
          </CustomCollapse>

          {productHasVariant ? (
            <CustomCollapse
              headerTitle={`Variants(${this.state.variants?.pagination?.total})`}
              subtitle={
                "Manage product variations like size, color, and style while setting custom pricing and stock levels for each option."
              }
              collapseStyle={{ marginTop: "30px" }}
            >
              <FormVariant
                currentUser={currentUser}
                dispatch={dispatch}
                form={form}
                locale={locale}
                formData={formData}
                exchangeRate={exchangeRate}
                getPrecisionByCurrency={(length) =>
                  this.getPrecisionByCurrency(length)
                }
                switchAutoGenerateSKU={this.props.switchAutoGenerateSKU}
                productVariantArchive={this.props.productVariantArchive}
                productVariantCheckStatus={this.props.productVariantCheckStatus}
                productAttributeCheckStatus={
                  this.props.productAttributeCheckStatus
                }
                productAttributeValueCheckStatus={
                  this.props.productAttributeValueCheckStatus
                }
                callBackGetProductAttribute={
                  this.props.callBackGetProductAttribute
                }
                callBackGetProductVariant={this.props.callBackGetProductVariant}
                handleCallBackGetArchiveProductVariant={
                  this.props.handleCallBackGetArchiveProductVariant
                }
                handleCallBackGetArchiveProductAttributes={
                  this.props.handleCallBackGetArchiveProductAttributes
                }
                productVariants={this.state.variants}
                onSearch={this.onSearchVariant}
                productAttributes={formData.productAttributes}
                variantAttributes={this.props.variantAttributes}
                variantAttributeAdd={variantAttributeAdd}
                handleAddVariantAttribute={this.props.handleAddVariantAttribute}
              />
            </CustomCollapse>
          ) : (
            <CustomCollapse
              headerTitle={"Pricing"}
              subtitle={
                "Define the pricing for your item across different sales channels: retail, wholesale, and distribution."
              }
              collapseStyle={{ marginTop: "30px" }}
            >
              <InputNumber
                name="price"
                label={<Translate id="text_retial_price" />}
                data={Exchange.dollarToRiel(
                  Util.getItemPrice(this.state.variants),
                  exchangeRate
                )}
                precision={this.getPrecisionByCurrency()}
                placeholder={"0.00"}
                errorRequired={<Translate id="error_require_price" />}
                max={99999999}
                form={form}
              />

              {/* <InputNumber
                name="wholePrice"
                label={<Translate id="text_whole_price" />}
                data={Exchange.dollarToRiel(
                  Util.getItemWholeSalePrice(this.state.variants),
                  exchangeRate
                )}
                precision={this.getPrecisionByCurrency()}
                placeholder={"0.00"}
                form={form}
              />

              <InputNumber
                name="distributePrice"
                label={<Translate id="text_price_to_distributors" />}
                data={Exchange.dollarToRiel(
                  Util.getItemDistributePrice(this.state.variants),
                  exchangeRate
                )}
                precision={this.getPrecisionByCurrency()}
                placeholder={"0.00"}
                form={form}
              /> */}
            </CustomCollapse>
          )}

          <CustomCollapse
            headerTitle={"Images and Media"}
            subtitle={
              "Upload and manage images or videos to visually represent your item, enhancing its appeal and providing detailed insights for users."
            }
            collapseStyle={{ marginTop: "30px" }}
          >
            <UploadImageCrop
              name="image"
              data={{ file: image }}
              fileList={[image]}
              endPoint={`${this.Util.getAPIURL()}/file/v1/upload/product`}
              endPointDelete={`${this.Util.getAPIURL()}/file/v1/product/delete`}
              accessToken={this.Util.getAccessToken()}
              locale={locale}
              form={form}
            />

            <InputText
              name="imageUrl"
              label="Image URL (e.g., product demo or marketing banner)"
              data={formData.imageUrl}
              placeholder="Enter image URL (e.g., https://example.com/image.png)"
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
            subtitle={
              "Provide details on stock levels, warehouse locations, and inventory management."
            }
            collapseStyle={{ marginTop: "30px" }}
          >
            <CustomCheckbox
              name="enableInventoryTracking"
              defaultValue={formData.enableInventoryTracking}
              label={"Track Inventory for this Item"}
              subtitle={
                "You cannot enable/disable inventory tracking once you've created transactions for this item"
              }
              tooltip={
                "Enable this option to track this item's stock based on its sales and purchase transactions."
              }
              disabled={this.state.serialType === Enum.SERIAL_TYPE.SERVICE}
              form={form}
            />

            <Select
              name="type"
              label={<Translate id="text_type" />}
              tooltip={
                "Select 'Raw Material' if the item is used in production, or 'Final Goods' if it is ready for direct sale."
              }
              dataSource={this.typesOfProduct}
              defaultValue={
                formData.type !== ""
                  ? formData.type
                  : this.typesOfProduct[0].value
              }
              disabled={!!formData.id}
              onChange={this.handleChangeType}
              form={form}
            />

            {productNoVariant && (
              <InputText
                name="sku"
                label={"Stock Keeping Unit (SKU)"}
                data={Util.getItemSku(formData)}
                placeholder="SKU code (e.g., ABC123)"
                form={form}
              />
            )}

            {!formData.id && (
              <InputNumber
                name="intialStockQuantity"
                label={"Initial Stock Quantity"}
                data={formData.intialStockQuantity}
                placeholder="Enter initial stock quantity"
                form={form}
              />
            )}

            {productNoVariant && (
              <InputNumber
                name="reorderPoint"
                label={"Reorder Level"}
                data={formData.reorderPoint}
                placeholder="Enter reorder point"
                form={form}
              />
            )}

            <Select
              name="defaultLocationId"
              label={"Default Warehouse"}
              placeholder="Please select default wharehouse"
              valueKey="id"
              dataSource={this.props.locations.list}
              defaultValue={parseInt(formData.defaultLocationId)}
              form={form}
            />
          </CustomCollapse>

          <CustomCollapse
            headerTitle={"Supplier Information"}
            subtitle={
              "Provide the supplier’s name, their item code for the product, purchase price, and lead time (in days) to ensure accurate order tracking and timely procurement."
            }
            collapseStyle={{ marginTop: "30px" }}
          >
            <SelectOwner
              defaultValue={formData.supplierId}
              selected={formData.supplier}
              placeholder={this.CATranslate("text_owner", locale)}
              form={form}
            />

            <InputNumber
              name="supplierPercentage"
              label={"Percentage for Supplier on Sale"}
              placeholder={"0.00"}
              data={formData.supplierPercentage}
              form={form}
            />

            <SelectPreferredSupplier
              defaultValue={formData.preferredSupplierId}
              selected={formData.preferredSupplier}
              placeholder={"Select your preferred supplier from the list"}
              form={form}
            />

            <InputText
              name="supplierItemCode"
              label={"Supplier Item Code"}
              data={formData.supplierItemCode}
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
              tooltip={
                "Costing is automatically generated based on the average cost calculation during purchasing transactions."
              }
              data={Exchange.dollarToRiel(
                Util.getProductCost(formData),
                exchangeRate
              )}
              precision={this.getPrecisionByCurrency()}
              placeholder={this.CATranslate("text_cost_placeholder", locale)}
              disabled={true}
              form={form}
            />
          </CustomCollapse>

          <CustomCollapse
            headerTitle={"Unit and Measurement"}
            subtitle={
              "Specify the unit of measurement for the product (e.g., pieces, kilograms, liters) to ensure accurate inventory tracking and order quantities."
            }
            collapseStyle={{ marginTop: "30px" }}
          >
            <CustomCheckbox
              name="isSplittable"
              label={<Translate id="text_splittable" />}
              subtitle={
                "Enable this option to allow the item to be sold in smaller retail units derived from the base unit."
              }
              defaultValue={formData.isSplittable}
              form={this.props.form}
            />

            <SelectUnitOfMeasurement
              defaultValue={formData.unitOfMeasurementId}
              form={form}
            />

            <SelectSellingUnit defaultValue={formData.sellUnitId} form={form} />

            <SelectStockUnit defaultValue={formData.stockUnitId} form={form} />

            <InputNumber
              name="unitConversion"
              label={"Conversion Factor (e.g., 1 box = 12 pieces)"}
              placeholder={"0.00"}
              data={formData.unitConversion}
              form={form}
            />
          </CustomCollapse>
          {/* 
          <CustomCollapse
            headerTitle={"Classification & Tags"}
            subtitle={
              "Define the units for tracking inventory and sales. The Selling Unit is used for sales, while the Stock Unit is used for storage, ensuring accurate management and reporting."
            }
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
                  <Tag
                    onClick={this.showInput}
                    style={{ background: "#fff", borderStyle: "dashed" }}
                  >
                    <Icon type="plus" /> New Tag
                  </Tag>
                )}
              </div>
            </Form.Item>

            <SelectBrand
              placeholder={"Select item brand..."}
              selected={formData?.brand}
              form={form}
              defaultValue={formData.brandId}
            />

            <SelectManufacturer
              placeholder={"Select item manufacturer..."}
              form={form}
              defaultValue={formData.manufacturerId}
            />

            <Form.Item label={<Translate id="text_specification" />}>
              <CKEditor
                editor={ClassicEditor}
                data={
                  formData.specification ? formData.specification : "<p></p>"
                }
                onChange={(event, editor) => {
                  const data = editor.getData();
                  this.props.form.setFieldsValue({
                    specification: data,
                  });
                  this.setState({ specification: data });
                }}
              />
              <this.InputText
                name="specification"
                data={form.specification}
                form={form}
                className="hidden"
                max={null}
              />
            </Form.Item>
          </CustomCollapse>

          <CustomCollapse
            headerTitle={"Web Display Settings"}
            subtitle={
              "Configure how this item will appear on your eCommerce platform, including options for featured products and availability online."
            }
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
              placeholder={
                "Enter for promotional tags like `Best Seller` or `New Arrival`"
              }
              data={formData.highlightTag}
              form={form}
            />
          </CustomCollapse>
           */}
        </Col>
      </Row>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    description:"",
    stockUnitId: "",
    brandId: "",
    categoryId: "",
    serialType: "",
    isAutoGenerateBarcode: Enum.GENERATE_PRODUCT_CODE.MANAUL,
    barcode: "",
    type: "",
    productOption: Enum.NO_VARIANT,
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