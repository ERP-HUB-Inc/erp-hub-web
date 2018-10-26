import React from "react";
import List from "../../List";
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
    this.columns = new Column();
    this.columnExpend = new ColumnExpand(); 
    this.fetchingProp = "products";
    this.isShowExpandable = true;
    this.componentHasUpdated = false;
    this.service = ProductService;
    this.columnFilterWithKey = ["name"];
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
    this.props.dispatch(ProductAction.reset()); // reset state to make 2: check condition again
    super.componentDidMount();
  }

  componentDidUpdate() {
    if (!this.componentHasUpdated && this.props.products.fetched) { // 2:
      this.props.dispatch(BrandAction.fetch(100));
      this.props.dispatch(ProductTypeAction.fetch(100));
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

  handleSubmitFilter(e) {

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
                label="Search"
                placeholder="Search for brand, code and notation"
                form={form}
              />
            </this.Col>
            <this.Col md="3">
              <this.InputText
                name="tag"
                label="Tags"
                placeholder="Search for tags"
                form={form}
              />
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="locationId"
                label="Store"
                dataSource={[{value: 1, name: "All Stores"}]}
                form={form}
                defaultValue={1}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="brandId"
                label="Brand"
                dataSource={[{value: 1, name: "All Brands"}]}
                form={form}
                defaultValue={1}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="productTypeId"
                label="Product Type"
                dataSource={[{value: 1, name: "All Product Types"}]}
                defaultValue={1}
                form={form}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="supplierId"
                label="Supplier"
                dataSource={[{value: 1, name: "All Supplier"}]}
                defaultValue={1}
                form={form}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="statusId"
                label="Status"
                dataSource={[{value: 1, name: "All Status"}]}
                defaultValue={1}
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
    return [
      {
        title: <this.Translate id="col_products_name" />,
        key: "productDescriptions",
        width: 300,
        render: (text, record, index) => {
          const productName = record.productDescriptions.length > 0 ?  record.productDescriptions[0].name : this.emptyCell;
          return <div>
            <div>{productName}</div>
            <div className="barcode-number text-uppercase"><this.Translate id="text_product_code"/>: {record.barcode}</div>
            {/* {
              "brand" in record && record["brand"] !== null ? 
                <div><span className="text-uppercase"><this.Translate id="col_products_brand"/></span>: {record.brand.name}</div> : ""
            } */}
          </div>;
        }
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
        title: <this.Translate id="text_price" />,
        key: "price",
        dataIndex: "price",
        width: 150,
        render: price => this.formatCurrency(price),
        sorter: true
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "quantity",
        key: "quantity",
        width: 150,
        sorter: true
      },
      {
        title: <this.Translate id="col_products_unit" />,
        dataIndex: "unit",
        key: "unit",
        width: 150,
        render: unit => unit.name
      },
      {
        title: <this.Translate id="col_products_types" />,
        dataIndex: "type",
        key: "type",
        width: 150,
        render: type => type === Enum.TYPE_OF_PRODUCT.GOOD ? <this.Translate id="input_product_good" /> : <this.Translate id="input_product_raw_material" />,
        sorter: true
      },
      this.columnStatus
    ];
  }
}