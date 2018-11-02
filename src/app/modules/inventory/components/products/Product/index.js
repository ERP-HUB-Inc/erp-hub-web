import React from "react";
import List from "../../List";
import Util from "../../../utils";
import Enum from "../../../enums";
import history from "../../../../common/router/history";
import FormCreate from "../../../containers/products/Product/FormCreate";
import FormUpdate from "../../../containers/products/Product/FormUpdate";
import Constant from "../../../constants/products/product";
import BrandAction from "../../../actions/products/brand";
import ProductTypeAction from "../../../actions/products/productsType";
import UnitAction from "../../../actions/products/productsUnit";
import TaxAction from "../../../../pos/action/settings/tax";
import LanguageAction from "../../../../pos/action/settings/storeLanguage";
import LocationAction from "../../../../pos/action/settings/storeLocation";
import ProductAction from "../../../actions/products/product";
import PriceTagAction from "../../../actions/products/priceTag";
import VariantAttributeAction from "../../../actions/products/variantAttribute";
import ProductTagAction from "../../../actions/products/productsTag";
import ProductService from "../../../services/products/ProductService";
import "./index.css";

export default class ProductList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      dataSourceToPrint: []
    };
    this.brandList = [{name: <this.Translate id="text_all_brand"/>, id: 0}];
    this.locationList = [{name: <this.Translate id="text_all_store"/>, id: 0}];
    this.productTypeList = [{productTypeDescriptions: {name: <this.Translate id="text_all_product_type"/>}, id: 0}];
    this.columns = new Column();
    this.columnExpend = new ColumnExpand(); 
    this.fetchingProp = "products";
    this.isShowExpandable = true;
    this.componentHasUpdated = false;
    this.service = ProductService;
    this.columnFilterWithKey = ["name", "barcode"];
    this.action = ProductAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCT;
    this.handleClone = this.handleClone.bind(this);
    this.handleOnPrintLabel = this.handleOnPrintLabel.bind(this);
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

    // SAVE SETTING TO LOCALE STORAGE
    if (nextProps.brands.fetched) {
      localStorage.setItem(Enum.LOCAL_SCHEMA.BRAND, JSON.stringify(nextProps.brands.list));
    }

    if (nextProps.units.fetched) {
      localStorage.setItem(Enum.LOCAL_SCHEMA.UNIT, JSON.stringify(nextProps.units.list));
    }

    if (nextProps.taxs.fetched) {
      localStorage.setItem(Enum.LOCAL_SCHEMA.TAX, JSON.stringify(nextProps.taxs.list));
    }

    if (nextProps.productsType.fetched) {
      localStorage.setItem(Enum.LOCAL_SCHEMA.PRODUCT_TYPE, JSON.stringify(nextProps.productsType.list));
    }

    if (nextProps.storeLanguage.fetched) {
      localStorage.setItem(Enum.LOCAL_SCHEMA.LANGUAGE, JSON.stringify(nextProps.storeLanguage.list));
    }

    if (nextProps.variantAttributes.fetched) {
      localStorage.setItem(Enum.LOCAL_SCHEMA.VARIANT_ATTRIBUTE, JSON.stringify(nextProps.variantAttributes.list));
    }

    if (nextProps.tags.fetched) {
      localStorage.setItem(Enum.LOCAL_SCHEMA.PRODUCT_TAG, JSON.stringify(nextProps.tags.list));
    }
  }

  componentDidMount() {
    this.props.dispatch(ProductTypeAction.fetch(100));
    this.props.dispatch(BrandAction.fetch(100));
    this.props.dispatch(LocationAction.fetch(100));
    this.props.dispatch(ProductAction.reset()); // reset state to make 2: check condition again
    super.componentDidMount();
  }

  componentDidUpdate() {
    if (!this.componentHasUpdated && this.props.products.fetched) { // 2:
      this.props.dispatch(UnitAction.fetch(100));
      this.props.dispatch(TaxAction.fetch(100));
      this.props.dispatch(LanguageAction.fetch(10));
      this.props.dispatch(VariantAttributeAction.fetch(100));
      this.props.dispatch(ProductTagAction.fetch(100));
      this.componentHasUpdated = true;
    }
  }

  handleShowFormAdd() {
    this.props.dispatch(ProductAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    this.props.dispatch(ProductAction.requestAndShowForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  handleClone() {
    if (this.state.selectedListIds.length > 0) {
      this.props.dispatch(ProductAction.clone(this.state.selectedListIds[0]));
    }
  }

  handleOnPrintLabel() {
    const productList = this.props.products.list.filter(product => this.state.dataSourceToPrint.includes(product.id));
    this.props.dispatch(PriceTagAction.selectProductFromListToPrint(productList));
    history.push("/products/price-tags");
  }

  buttonActionCollection() {
    return [
      this.renderButtonAddNew(),
      <this.Button
        key={2}
        disabled={this.state.selectedRowKeys.length <= 0 || this.state.selectedRowKeys.length > 1}
        htmlType="submit"
        className="info"
        loading={this.props.productClone.adding}
        onClick={() => this.handleClone()}>
        <span className="icon-add icon-padding-right"></span><this.Translate id="btn_product_clone" />
      </this.Button>,
      <this.Button
        propKey="btn_product_print_label"
        disabled={this.state.selectedRowKeys.length <= 0}
        className="info margin-left-8"
        onClick={this.handleOnPrintLabel}>
        <span className="icon-barcode icon-padding-right"></span>
        <this.Translate id="btn_product_print_label" />
      </this.Button>
    ];
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          let locationId = "";
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
    return (
      form == null ?
        ""
        :
        <this.Form onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout">
            <this.Col md="3">
              <this.InputText
                name="key"
                label={<this.Translate id="text_search"/>}
                placeholder="Search for brand, code and notation"
                form={form}
              />
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="locationId"
                label={<this.Translate id="text_store"/>}
                dataSource={this.locationList.concat(this.props.locations.list)}
                valueKey="id"
                nameKey="name"
                form={form}
                defaultValue={this.locationList[0].id}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="brandId"
                label={<this.Translate id="text_brand"/>}
                dataSource={this.brandList.concat(this.props.brands.list)}
                valueKey="id"
                nameKey="name"
                form={form}
                defaultValue={this.brandList[0].id}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="productTypeId"
                label={<this.Translate id="text_product_type"/>}
                dataSource={this.productTypeList.concat(this.props.productsType.list)}
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
              <this.Button htmlType="submit" type="info">
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
          dataSource={record.productVariantToProduct}
          locale={{emptyText: <this.Translate id="placeholder_table_variant_product" />}}
        />
      </div>
    );
  }
}

class ColumnExpand extends List {
  constructor(props) {
    super(props);
    return [
      {
        dataIndex: "",
        render: () => {}
      },
      {
        dataIndex: "name",
        key: "name"
      },
      {
        dataIndex: "",
        render: () => {}
      },
      {
        dataIndex: "",
        render: () => {}
      },
      {
        dataIndex: "",
        render: () => {}
      },
      {
        dataIndex: "price",
        key: "price",
        render: price => this.formatCurrency(price)
      },
      {
        dataIndex: "quantity",
        key: "quantity",
        render: quantity => quantity === null ? 0 : quantity
      },
      {
        dataIndex: "",
        render: () => {}
      },
      {
        dataIndex: "",
        render: () => {}
      },
      {
        dataIndex: "",
        render: () => {}
      }
    ];
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
        render: barcode => barcode ? barcode : this.emptyCell,
        sorter: true
      },
      {
        title: <this.Translate id="col_products_tag" />,
        key: "tag",
        width: 150,
        render: (text, record) => {
          return record.tags.map((tag, index) => `${tag.tag}${(index + 1) !== record.tags.length ? ", " : ""}`);
        }
      },
      {
        title: <this.Translate id="col_products_type" />,
        key: "productType",
        width: 200,
        render: (text, record) => {
          return record.productType.productTypeDescriptions.length > 0 ?  record.productType.productTypeDescriptions[0].name : this.emptyCell;
        }
      },
      {
        title: <this.Translate id="text_brand" />,
        dataIndex: "brandId",
        key: "brand",
        width: 100,
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
        render: price => this.formatCurrency(price),
        sorter: true
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "quantity",
        key: "quantity",
        width: 130,
        align: "center",
        render: (text, record) => {
          let quantity = record.quantity;
          let colorIndex = 0;
          if ("productLocations" in record) {
            quantity = Util.getProductQTYLocation(record["productLocations"]);
          }
          colorIndex = quantity > 0 ? 0 : 1;
          return <this.Tag color={this.colorStockStatus[colorIndex]} className="text-center label-stock-status">{quantity}</this.Tag>;
        },
        sorter: true
      },
      {
        title: <this.Translate id="col_products_unit" />,
        dataIndex: "unit",
        key: "unit",
        width: 100,
        render: unit => unit.name
      },
      {
        title: <this.Translate id="col_products_types" />,
        dataIndex: "type",
        key: "type",
        width: 100,
        render: type => type === Enum.TYPE_OF_PRODUCT.GOOD ? <this.Translate id="input_product_good" /> : <this.Translate id="input_product_raw_material" />,
        sorter: true
      },
      this.columnStatus
    ];
  }
}