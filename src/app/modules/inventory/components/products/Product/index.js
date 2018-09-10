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
    this.columnExpend = new ColumnExpand(); 
    this.fetchingProp = "products";
    this.isShowExpandable = true;
    this.service = ProductService;
    this.columnFilterWithKey = ["name"];
    this.action = ProductAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCT;
  }

  componentWillUpdate(nextProps) {
    const {productAdd, productUpdate, dispatch} = nextProps;
    if (productAdd.added || productUpdate.updated) {
      dispatch(ProductAction.fetch(this.pageSize));
      dispatch(ProductAction.reset());
      dispatch(ProductAction.reset(Constant.RESET_DETAIL_PRODUCTS));
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
    dispatch(ProductAction.requestAndShowForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  buttonActionCollection() {
    return [
      this.renderButtonAddNew(),
      <this.Button
        key={2}
        disabled={this.state.selectedRowKeys.length <= 0 || this.state.selectedRowKeys.length > 1}
        htmlType="submit"
        className="info">
        <span className="icon-add icon-padding-right"></span><this.Translate id="btn_product_clone" />
      </this.Button>,
      <this.Button
        propKey="btn_product_print_label"
        disabled={this.state.selectedRowKeys.length <= 0}
        htmlType="submit"
        className="info margin-left-8">
        <span className="icon-barcode icon-padding-right"></span>
        <this.Translate id="btn_product_print_label" />
      </this.Button>
    ];
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
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_products_name" />,
        key: "productDescriptions",
        width: 250,
        render: (text, record, index) => {
          const productName = record.productDescriptions.length > 0 ?  record.productDescriptions[0].name : this.emptyCell;
          return <div>
            <div>{productName}</div>
            <div className="barcode-number text-uppercase"><this.Translate id="text_product_code"/>: {record.barcode}</div>
          </div>;
        }
      },
      {
        title: <this.Translate id="col_products_tag" />,
        key: "tag",
        width: 150,
        render: (text, record) => {
          return record.tags.map((tag, index) => <this.TagLabel color="blue" style={{marginLeft: 10}} key={index}>{tag.tag}</this.TagLabel>);
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
        title: <this.Translate id="col_products_brand" />,
        key: "brand",
        width: 150,
        render: (text, record, index) => "brand" in record && record["brand"] !== null ? record.brand.name : this.emptyCell,
        sorter: true
      },
      {
        title: <this.Translate id="col_products_price" />,
        key: "price",
        width: 150,
        render: (text, record, index) => this.formatCurrency(record.price),
        sorter: true
      },
      {
        title: <this.Translate id="col_products_quantity" />,
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