import React from "react";
import List from "../../List";
import Enum from "../../../enums";
import FormCreate from "../../../containers/products/Product/FormCreate";
import FormUpdate from "../../../containers/products/Product/FormUpdate";
import Constant from "../../../constants/products/product";
import ProductAction from "../../../actions/products/product";
import ProductService from "../../../services/products/ProductService";
import "./index.css";

export default class ProductList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "products";
    this.service = ProductService;
    this.columnFilterWithKey = ["name"];
    this.action = ProductAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCT;
  }

  componentWillUpdate(nextProps) {
    const {productAdd, dispatch} = nextProps;
    if (productAdd.added) {
      dispatch(ProductAction.fetch(this.pageSize));
      dispatch(ProductAction.reset());
    }
  }

  handleShowFormAdd() {
    const {dispatch} = this.props;
    dispatch(ProductAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const {dispatch} = this.props;
    dispatch(ProductAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      {
        title: <this.Translate id="col_products_name" />,
        key: "productName",
        render: (text, record, index) => record.productDescriptions.length > 0 ?  record.productDescriptions[0].name : this.emptyCell,
        width: 300,
        sorter: true
      },
      {
        title: <this.Translate id="col_products_tag" />,
        key: "productTag",
        width: 200,
        render: (text, record) => {
          return record.tags.map((tag, index) => <this.TagLabel color="blue" style={{marginLeft: 10}} key={index}>{tag.tag}</this.TagLabel>);
        },
        sorter: true
      },
      {
        title: <this.Translate id="col_products_type" />,
        key: "productType",
        render: (text, record) => {
          return record.productType.productTypeDescriptions.length > 0 ?  record.productType.productTypeDescriptions[0].name : this.emptyCell;
        },
        sorter: true
      },
      {
        title: <this.Translate id="col_products_brand" />,
        key: "brand",
        render: (text, record, index) => "brand" in record && record["brand"] !== null ? record.brand.name : this.emptyCell,
        sorter: true
      },
      {
        title: <this.Translate id="col_products_price" />,
        key: "price",
        render: (text, record, index) => this.formatCurrency(record.price),
        sorter: true
      },
      {
        title: <this.Translate id="col_products_quantity" />,
        dataIndex: "quantity",
        key: "quantity",
        sorter: true
      },
      {
        title: <this.Translate id="col_products_unit" />,
        dataIndex: "unit",
        key: "unit",
        render: unit => unit.name,
        sorter: true
      },
      {
        title: <this.Translate id="col_products_types" />,
        dataIndex: "type",
        key: "type",
        render: type => type === Enum.TYPE_OF_PRODUCT.GOOD ? <this.Translate id="input_product_good" /> : <this.Translate id="input_product_raw_material" />,
        sorter: true
      },
      this.columnStatus
    ];
  }
}