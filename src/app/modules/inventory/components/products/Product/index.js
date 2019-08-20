import React from "react";
import List from "../../List";
import Util from "../../../utils";
import Enum from "../../../enums";
// import history from "../../../../common/router/history";
import FormCreate from "../../../containers/products/Product/FormCreate";
import FormUpdate from "../../../containers/products/Product/FormUpdate";
import Constant from "../../../constants/products/product";
import LocalStorageUtil from "../../../../common/localstorage/util";
import ProductTypeAction from "../../../actions/products/productsType";
import UnitAction from "../../../actions/products/productsUnit";
import ProductAction from "../../../actions/products/product";
import BrandAction from "../../../actions/products/brand";
import ProductService from "../../../services/products/ProductService";
import "./index.css";

export default class ProductList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      brands: [],
      locations: [],
      productTypes: [],
      dataSourceToPrint: []
    };
    this.brandList = [{name: <this.Translate id="text_all_brand"/>, id: 0}];
    this.locationList = [{name: <this.Translate id="text_all_store"/>, id: 0}];
    this.productTypeList = [{productTypeDescriptions: {name: <this.Translate id="text_all_product_type"/>}, id: 0}];
    this.stockList = [
      {name: <this.Translate id="select_text_all_stock"/>, id: 0},
      {name: <this.Translate id="text_in_stock"/>, id: 1},
      {name: <this.Translate id="text_out_of_stock"/>, id: 2}
    ];
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.columnExpend = new ColumnExpand(); 
    this.fetchingProp = "products";
    this.placeHolderForGeneralSearch = "text_general_seach_product";
    this.isShowExpandable = true;
    this.rowClassName = record => record.productOption !== Enum.PRODUCT_VARIANT ? "standard-product-row" : "";
    this.componentHasUpdated = false;
    this.service = ProductService;
    this.columnFilterWithKey = ["name", "barcode"];
    this.action = ProductAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCT;
    this.handleClone = this.handleClone.bind(this);
    // this.handleOnPrintLabel = this.handleOnPrintLabel.bind(this);
  }

  componentWillUpdate(nextProps) {
    const {productAdd, productUpdate, productClone, dispatch} = nextProps;
    if (productAdd.added || productUpdate.updated) {
      dispatch(ProductAction.fetch(this.pageSize));
      dispatch(ProductAction.reset(Constant.RESET_FORM_PRODUCT));
      dispatch(ProductAction.reset(Constant.RESET_DETAIL_PRODUCTS));
    }

    if (productClone.added) {
      if (productClone.response.data) {
        dispatch(ProductAction.requestAndShowForm(productClone.response.data));
        dispatch(ProductAction.reset(Constant.RESET_FORM_PRODUCT));
        this.setState({
          modalConten: <FormUpdate/>,
          selectedRowKeys: []
        });
      }
    }

    // WHEN CREATE NEW SAVE SETTING TO LOCALE STORAGE
    if (nextProps.brandsAdd.added) {
      let existBrands = localStorage.getItem(Enum.LOCAL_SCHEMA.BRAND);
      existBrands = existBrands ? JSON.parse(existBrands) : [];
      localStorage.setItem(Enum.LOCAL_SCHEMA.BRAND, JSON.stringify(existBrands.concat([nextProps.brandsAdd.response.data])));
    }

    if (nextProps.productsTypeAdd.added) {
      let existProductTypes = localStorage.getItem(Enum.LOCAL_SCHEMA.PRODUCT_TYPE);
      existProductTypes = existProductTypes ? JSON.parse(existProductTypes) : [];
      localStorage.setItem(Enum.LOCAL_SCHEMA.PRODUCT_TYPE, JSON.stringify(existProductTypes.concat(nextProps.productsTypeAdd.response.data)));
    }

    if (nextProps.unitsAdd.added) {
      let existUnits = localStorage.getItem(Enum.LOCAL_SCHEMA.UNIT);
      existUnits = existUnits ? JSON.parse(existUnits) : [];
      localStorage.setItem(Enum.LOCAL_SCHEMA.UNIT, JSON.stringify(existUnits.concat(nextProps.unitsAdd.response.data)));
    }

    // SAVE SETTING TO LOCALE STORAGE
    if (nextProps.brands.fetched) {
      this.setState({brands: nextProps.brands.list});
      localStorage.setItem(Enum.LOCAL_SCHEMA.BRAND, JSON.stringify(nextProps.brands.list));
      this.props.dispatch(BrandAction.reset());
    }

    if (nextProps.units.fetched) {
      localStorage.setItem(Enum.LOCAL_SCHEMA.UNIT, JSON.stringify(nextProps.units.list));
    }

    if (nextProps.productsType.fetched) {
      this.setState({productTypes: nextProps.productsType.list});
      localStorage.setItem(Enum.LOCAL_SCHEMA.PRODUCT_TYPE, JSON.stringify(nextProps.productsType.list));
      this.props.dispatch(ProductTypeAction.reset());
    }
  }

  componentDidMount() {
    // this.props.dispatch(ProductAction.reset()); // reset state to make 2: check condition again
    super.componentDidMount();
    this.requestSubDataAsync();

    this.setState({
      brands: LocalStorageUtil.getItemFromCollection(Enum.LOCAL_SCHEMA.BRAND),
      locations: LocalStorageUtil.getItemFromCollection(Enum.LOCAL_SCHEMA.LOCATION),
      productTypes: LocalStorageUtil.getItemFromCollection(Enum.LOCAL_SCHEMA.PRODUCT_TYPE)
    });
  }

  componentDidUpdate() {
    if (this.props.productDetail.fetched) {
      this.setState({
        loadingPopup: false
      });
      this.props.dispatch(ProductAction.reset(Constant.PARTIAL_RESET_DETAIL_PRODUCTS));
    }

    if (this.props.productAdd.error) {
      const errorCode = this.Util.getErrorCodeFromState(this.props.productAdd.error);
      if (errorCode === this.Enum.TAX_NOT_FOUND) {
        this.CATranslate("error_tax_not_found", this.props.locale);
      } else if (errorCode === this.Enum.BRAND_NOT_FOUND) {
        this.CATranslate("error_brand_not_found", this.props.locale);
      } else if (errorCode === this.Enum.PRODUCT_TYPE_NOT_FOUND) {
        this.CATranslate("error_product_type_not_found", this.props.locale);
      } else if (errorCode === this.Enum.PRODUCT_UNIT_NOT_FOUND) {
        this.CATranslate("error_unit_not_found", this.props.locale);
      }

      this.props.dispatch(ProductAction.reset(Constant.RESET_ADD_PRODUCT));
    }
  }

  requestSubDataAsync() {
    return new Promise(() => {
      setTimeout(() => {

        if (!localStorage.getItem(Enum.LOCAL_SCHEMA.BRAND)) {
          this.props.dispatch(BrandAction.fetch(100));
        }

        if (!localStorage.getItem(Enum.LOCAL_SCHEMA.UNIT)) {
          this.props.dispatch(UnitAction.fetch(20));
        }

        if (!localStorage.getItem(Enum.LOCAL_SCHEMA.PRODUCT_TYPE)) {
          this.props.dispatch(ProductTypeAction.fetch(100));
        }
      }, 2000);
    });
  }

  showFormEdit(rowData) {
    this.props.dispatch(ProductAction.requestAndShowForm(rowData));
    this.setState({
      loadingPopup: true,
      modalConten: <FormUpdate/>
    });
  }

  handleClone() {
    if (this.state.selectedListIds.length > 0) {
      this.props.dispatch(ProductAction.clone(this.state.selectedListIds[0]));
    }
  }

  getAllQTY(record) {
    return Util.getProductQTYLocation(record["productVariants"]);
  }

  handleDelete() {
    let product = this.state.selectedRows;
    if(product){
      let quantity = this.getAllQTY(product[0]);

      if (product[0].serialType === Enum.SERIAL_TYPE.NON_INVENTORY){
        super.handleDelete();
      }else if(quantity === 0){
        super.handleDelete();
      } else{
        this.setState({modalVisible: false});
        this.Message.warning(this.CATranslate("error_delete_product", this.props.locale));
      }

    }
  }

  handleConfirm() {
    let selectedRows = this.state.selectedRows;
    if(selectedRows.length === 1){
      this.setState({ modalVisible: true });
    }else if(selectedRows.length > 1){
      this.Message.warning(this.CATranslate("text_allow_select_one_record", this.props.locale));
    }else{
      this.Message.warning(this.CATranslate("text_please_select_record", this.props.locale));
    }
  }

  // handleOnPrintLabel() {
  //   const productList = this.props.products.list.filter(product => this.state.dataSourceToPrint.includes(product.id));
  //   this.props.dispatch(PriceTagAction.selectProductFromListToPrint(productList));
  //   history.push("/products/price-tags");
  // }

  buttonActionCollection() {
    return [
      this.renderButtonAddNew(),
      this.renderButtonDelete()
      // <this.Button
      //   key={2}
      //   disabled={this.state.selectedRowKeys.length <= 0 || this.state.selectedRowKeys.length > 1}
      //   htmlType="submit"
      //   className="info"
      //   loading={this.props.productClone.adding}
      //   onClick={() => this.handleClone()}>
      //   <span className="icon-add icon-padding-right"></span><this.Translate id="btn_product_clone" />
      // </this.Button>,
      // <this.Button
      //   propKey="btn_product_print_label"
      //   disabled={this.state.selectedRowKeys.length <= 0}
      //   className="info margin-left-8"
      //   onClick={this.handleOnPrintLabel}>
      //   <span className="icon-barcode icon-padding-right"></span>
      //   <this.Translate id="btn_product_print_label" />
      // </this.Button>
    ];
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          let locationId = 0;
          if (values.locationId !== 0) {
            locationId = values.locationId;
          }

          if (values.brandId !== 0) {
            filter["brandId"] = [values.brandId];
          }

          if (values.productTypeId !== 0) {
            filter["productTypeId"] = [values.productTypeId];
          }

          filter["status"] = values.status === this.Enum.ALL_STATE ? [this.Enum.ACTIVE, this.Enum.DEACTIVE] : [values.status];
    
          filter = JSON.stringify(filter);

          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, locationId));
          this.setState({isClickFilter: true});
        }
      }); 
    } 
  }

  renderFilterRecord() {
    const {form} = this.props;
    const fetchingProps = this.props[this.fetchingProp];
    return (
      form == null ?
        ""
        :
        <this.Form onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout">
            {this.renderFilterGeneralKey()}
            <this.Col md="2">
              <this.Select
                name="locationId"
                label={<this.Translate id="text_store"/>}
                dataSource={this.locationList.concat(this.state.locations)}
                valueKey="id"
                nameKey="name"
                form={form}
                defaultValue={this.locationList[0].id}/>
            </this.Col>
            {/* <this.Col md="2">            
              <this.Select
                name="stockId"
                label={<this.Translate id="text_stock"/>}
                dataSource={this.stockList}
                valueKey="id"
                nameKey="name"
                form={form}
                defaultValue={0}
              />
            </this.Col> */}
            <this.Col md="2">
              <this.Select
                name="brandId"
                label={<this.Translate id="text_brand"/>}
                dataSource={this.brandList.concat(Array.isArray(this.state.brands) ? this.state.brands : [])}
                valueKey="id"
                nameKey="name"
                form={form}
                defaultValue={this.brandList[0].id}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="productTypeId"
                label={<this.Translate id="text_product_type"/>}
                dataSource={this.productTypeList.concat(Array.isArray(this.state.productTypes) ? this.state.productTypes : [])}
                defaultValue={this.productTypeList[0].id}
                valueKey="id"
                nestedName="productTypeDescriptions"
                nameKey="name"
                form={form}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="status"
                label={<this.Translate id="text_status" />}
                dataSource={this.statusList}
                defaultValue={this.Enum.ALL_STATE}
                form={form}/>
            </this.Col>
            <this.Col md="2" className="wrap-btn-search">
              <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
              </this.Button>
            </this.Col>
          </this.Row>
        </this.Form>
    ); 
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    super.onSelectChange(selectedRowKeys, selectedRows);
    this.setState({dataSourceToPrint: this.mapSelectedListIds(selectedRows)});
  }

  expandedRender(record){
    return( 
      <div className="sub-table">
        <this.SubTable 
          columns={this.columnExpend}
          dataSource={record.productVariants}
          locale={{emptyText: <this.Translate id="placeholder_table_variant_product" />}}/>
      </div>
    );
  }
}

class ColumnExpand extends List {
  constructor(props) {
    super(props);
    this.colorStockStatus = ["#4cb64c", "#f3a638"];
    return [
      {
        dataIndex: "blank1",
        key: "blank1",
        width: 50,
        render: () => {},
      },
      {
        dataIndex: "name",
        key: "name"
      },
      {
        dataIndex: "barcode",
        key: "barcode",
        width: 100,
        render: barcode => barcode ? barcode : this.emptyCell
      },
      {
        dataIndex: "tag",
        key: "tag",
        width: 150,
        render: () => {},
      },
      {
        dataIndex: "productType",
        key: "productType",
        width: 200,
        render: () => {}
      },
      {
        dataIndex: "brandId",
        key: "brandId",
        width: 100,
        render: () => {}
      },
      {
        dataIndex: "price",
        key: "price",
        width: 150,
        align: "center",
        render: price => this.formatCurrency(price)
      },
      {
        dataIndex: "quantity",
        key: "quantity",
        width: 130,
        align: "center",
        render: (text, record) => {
          const virtaulProduct = {
            productVariants: [
              {
                ...record,
                productLocations: record.productLocations
              }
            ]
          };
          let quantity = this.getQTY(virtaulProduct);
          
          let colorIndex = 0;
          if (quantity === 0) {
            colorIndex = 1;
          } else if (quantity < 0) {
            colorIndex = 1;
          }

          return <this.Tag color={this.colorStockStatus[colorIndex]} className="text-center label-stock-status">{quantity}</this.Tag>;
        },
      },
      {
        dataIndex: "all_quantity",
        key: "all_quantity",
        width: 150,
        align: "center",
        render: (text, record) => {
          const virtaulProduct = {
            productVariants: [
              {
                ...record,
                productLocations: record.productLocations
              }
            ]
          };

          let quantity = this.getAllQTY(virtaulProduct);
          
          let colorIndex = 0;
          if (quantity === 0) {
            colorIndex = 1;
          } else if (quantity < 0) {
            colorIndex = 2;
          }

          if (quantity <= record.reorderPoint) {
            colorIndex = 1;
          }

          return <this.Tag color={this.colorStockStatus[colorIndex]} className="text-center label-stock-status">{quantity}</this.Tag>;
        }
      },
      {
        dataIndex: "unit",
        key: "unit",
        width: 100,
        render: () => {}
      },
      {
        dataIndex: "type",
        key: "type",
        width: 130,
        render: () => {}
      },
      this.columnStatus
    ];
  }

  getQTY(record) {
    let quantity = record.quantity;
    let isNotFilterByLocation = true;
    record["productVariants"].forEach(productVariant => {
      if ("productLocations" in productVariant && productVariant["productLocations"]) {
        isNotFilterByLocation = false;
        quantity = Util.getProductQTYLocation(productVariant["productLocations"]);
      }
    });

    if (isNotFilterByLocation) {
      quantity = Util.getProductQTYLocation(record["productVariants"]);
    }

    return quantity < 0 ? 0 : quantity;
  }

  getAllQTY(record) {
    return Util.getProductQTYLocation(record["productVariants"]);
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    this.colorStockStatus = ["#4cb64c", "#f3a638"];
    return [
      {
        title: <this.Translate id="text_product_name" />,
        key: "productDescriptions",
        render: (text, record) => {
          const productName = Util.getProductName(record);
          return <div>
            <div>{productName ? productName: this.emptyCell}</div>
            {/* <div className="barcode-number text-uppercase"><this.Translate id="text_product_code"/>: {record.barcode}</div> */}
          </div>;
        }
      },
      {
        title: <this.Translate id="text_product_code" />,
        dataIndex: "barcode",
        key: "barcode",
        width: 100,
        render: (text, record) => Util.getProductBarcode(record),
        sorter: true
      },
      {
        title: <this.Translate id="text_stock_type" />,
        dataIndex: "serialType",
        key: "serialType",
        width: 150,
        render: serialType => {
          let stockTypeStr = <this.Translate id="text_other" />;
          let stockTypeColorIndex = 1;
          if (serialType === Enum.SERIAL_TYPE.STANDARD) {
            stockTypeStr = <this.Translate id="input_product_standard" />;
            stockTypeColorIndex = 0;
          } else if (serialType === Enum.SERIAL_TYPE.NON_INVENTORY) {
            stockTypeStr = <this.Translate id="input_product_non_inventory" />;
            stockTypeColorIndex = 1;
          }

          return <this.Tag color={this.colorStockStatus[stockTypeColorIndex]} className="text-center label-stock-status" style={{minWidth: 100}}>{stockTypeStr}</this.Tag>;
        }
      },
      {
        title: <this.Translate id="text_product_type" />,
        dataIndex: "productType",
        key: "productType",
        width: 200,
        render: productType => productType ? Util.getProductTypeDescription(productType.productTypeDescriptions, "name") : ""
      },
      {
        title: <this.Translate id="text_brand" />,
        dataIndex: "brandId",
        key: "brand",
        width: 140,
        render: (text, record) => {
          return Util.getProductBrand(record, this.emptyCell);
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_price" />,
        key: "price",
        dataIndex: "price",
        width: 150,
        align: "center",
        render: (text, record) => this.formatCurrency(Util.getProductPrice(record)),
        sorter: true
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "quantity",
        key: "quantity",
        width: 130,
        align: "center",
        render: (text, record) => {
          let quantity = this.getQTY(record);
          
          let colorIndex = 0;
          if (quantity === 0) {
            colorIndex = 1;
          } else if (quantity < 0) {
            colorIndex = 1;
          }

          return <this.Tag color={this.colorStockStatus[colorIndex]} className="text-center label-stock-status">{quantity}</this.Tag>;
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_all_quantity" />,
        dataIndex: "all_quantity",
        key: "all_quantity",
        width: 150,
        align: "center",
        render: (text, record) => {
          let quantity = this.getAllQTY(record);
          
          let colorIndex = 0;
          if (quantity === 0) {
            colorIndex = 1;
          } else if (quantity < 0) {
            colorIndex = 1;
          }

          if (quantity <= record.reorderPoint) {
            colorIndex = 1;
          }

          return <this.Tag color={this.colorStockStatus[colorIndex]} className="text-center label-stock-status">{quantity}</this.Tag>;
        },
        sorter: true
      },
      {
        title: <this.Translate id="col_products_unit" />,
        dataIndex: "unit",
        key: "unit",
        width: 100,
        render: (text, record) => {
          let quantity = this.getQTY(record);
          return <div>
            <div>
              {record.unit.name}
            </div>
            <div className="unit-value">
              {quantity/record.unit.multiple} {record.unit.name}
            </div>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_type" />,
        dataIndex: "type",
        key: "type",
        width: 130,
        render: type => type === Enum.TYPE_OF_PRODUCT.GOOD ? <this.Translate id="input_product_good" /> : <this.Translate id="input_product_raw_material" />,
        sorter: true
      },
      this.columnStatus
    ];
  }

  getQTY(record) {
    let quantity = 0;
    let isNotFilterByLocation = true;
    record["productVariants"].forEach(productVariant => {
      if ("productLocations" in productVariant) {
        isNotFilterByLocation = false;
        quantity += Util.getProductQTYLocation(productVariant["productLocations"]);
      }
    });

    if (isNotFilterByLocation) {
      quantity = Util.getProductQTYLocation(record["productVariants"]);
    }

    return quantity < 0 ? 0 : quantity;
  }

  getAllQTY(record) {
    return Util.getProductQTYLocation(record["productVariants"]);
  }
}
