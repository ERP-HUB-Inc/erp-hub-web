import React from "react";
import Enum from "../../../enums";
import List from "../List";
import Constant from "../../../constants/stock/stockManagement";
import StockManagementAction from "../../../actions/stock/stockManagement";
import StockManagementService from "../../../services/stock/StockManagementService";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.columnExpend = new ColumnExpand(); 
    this.fetchingProp = "stockManagement";
    this.isShowExpandable = true;
    this.service = StockManagementService;
    this.columnFilterWithKey = ["name"];
    this.action = StockManagementAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
    this.hideActionButton = true;
  }

  expandedRender(record){
    return( 
      <div className="sub-table">
        <this.SubTable 
          columns={this.columnExpend}
          dataSource={record.productVariantToProduct}
          noDataContent="No Rows found"
        />
      </div>
    );
  }

  renderActionButton(){
    return(
      <div></div>
    );
  }


}

class ColumnExpand extends List {
  constructor(props) {
    super(props);
    return [
      {
        dataIndex: "",
        width: "246px",
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
        width: "190px",
        render: () => {}
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
        title: <this.Translate id="col_stock_management_product_name" />,
        key: "productName",
        width: 250,
        render: (text, record, index) => record.productDescriptions.length > 0 ?  record.productDescriptions[0].name : this.emptyCell,
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_management_product_tags" />,
        key: "productTag",
        width: 150,
        render: (text, record) => {
          return record.tags.map((tag, index) => <this.TagLabel color="blue" style={{marginLeft: 10}} key={index}>{tag.tag}</this.TagLabel>);
        },
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_management_product_types" />,
        key: "productType",
        width: 200,
        render: (text, record) => {
          return record.productType.productTypeDescriptions.length > 0 ?  record.productType.productTypeDescriptions[0].name : this.emptyCell;
        },
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_management_brand" />,
        key: "brand",
        width: 150,
        render: (text, record, index) => "brand" in record && record["brand"] !== null ? record.brand.name : this.emptyCell,
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_management_quantity" />,
        dataIndex: "quantity",
        key: "quantity",
        width: 150,
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_management_unit" />,
        dataIndex: "unit",
        key: "unit",
        width: 150,
        render: unit => unit.name,
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_management_types" />,
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