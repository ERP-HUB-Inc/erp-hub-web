import React from "react";
import List from "../List";
import FormCreate from "../../../containers/stock/reorderPoint/FormCreate";
import FormUpdate from "../../../containers/stock/reorderPoint/FormUpdate";
import Constant from "../../../constants/stock/reorderPoint";
import SupplierAction from "../../../actions/stock/reorderPoint";
import SupplierService from "../../../services/stock/SupplierService";
import "./index.css";

export default class SupplierList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.columnExpend = new ColumnExpend(); 
    this.isShowExpandable = true;
    this.fetchingProp = "reorderPoint";
    this.addingProp = "reorderPointAdd";
    this.updatingProp = "reorderPointUpdate";
    this.service = SupplierService;
    this.columnFilterWithKey = ["name"];
    this.action = SupplierAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(SupplierAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(SupplierAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  expandedRender(record){
    console.log("record",record.productVariantToProduct);
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

  renderFilterRecord() {
    const {form,supplier} = this.props;

    return(
      <div className="reorder-point-form-search">
        { form == null ?
          ""
          :
          <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
            <this.Row className="main-search-layout form-group"> 
              <this.Col md="3">
                <this.Select
                  name="status"
                  label="Store"
                  placeholder="Please select status"
                  dataSource={this.statusList}
                  defaultValue={this.Enum.ALL_STATE}
                  form={form}
                />
              </this.Col>
              <this.Col md="3">
                <this.Brand 
                  label="Brand"
                />
              </this.Col>
              <this.Col md="3">
                <this.ProductType
                  label="Prodcut Type"
                />
              </this.Col>
              <this.Col md="3">
                <this.Supplier
                  label={<this.Translate id="col_stock_purchase_order_supplier" />}
                />
              </this.Col> 

            </this.Row>
            <this.Row>
              <this.Col md="3">
                <this.Select
                  name="status"
                  label="status"
                  placeholder="Please select status"
                  dataSource={this.statusList}
                  defaultValue={this.Enum.ALL_STATE}
                  form={form}
                />
              </this.Col>
              <this.Col md="3">
                <this.InputText
                  name="key"
                  label="Tags"
                  placeholder="Search for Purchase Order"
                  form={form}
                />
              </this.Col>

              <this.Col md="3">
                <this.InputText
                  name="key"
                  label="Product Key"
                  placeholder="Search for Purchase Order"
                  form={form}
                />
              </this.Col>
              <this.Col md="2" className="reorder-point-button-search">
                <this.Button htmlType="submit" type="info" >
                  <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
                </this.Button> 
              </this.Col>

            </this.Row>
          </this.Form>
        }
      </div>
    );
  }

}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_stock_reorder_point_product_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_reorder_point_product_type" />,
        dataIndex: "proType",
        key: "proType",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_reorder_point_brand" />,
        dataIndex: "brand",
        key: "brand",
        sorter: true,
        render: (brand) => brand.name
      },
      {
        title: <this.Translate id="col_stock_reorder_point_supplier" />,
        dataIndex: "supplier",
        key: "supplier",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_reorder_point_quantity" />,
        dataIndex: "reorderPoint",
        key: "reorderPoint",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_reorder_point_qty" />,
        dataIndex: "supplier",
        key: "supplier",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_reorder_point_unit" />,
        dataIndex: "unit",
        key: "unit",
        sorter: true
      },
      {
        title: <this.Translate id="col_stock_reorder_point_type" />,
        dataIndex: "type",
        key: "type",
        sorter: true
      },
      this.columnStatus
    ];
  }
}

class ColumnExpend extends List {
  constructor(props) {
    super(props);
    return [
      {
        dataIndex: "createdAt",  
        key: "createdAt",
        width: "117px",
        render: createdAt => {}
      },
      {
        dataIndex: "",
        width: "130px",
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
        dataIndex: "phoneNumber",
        key: "phoneNumber"
      },
      {
        dataIndex: "address",
        key: "address"
      },
      {
        dataIndex: "",
        render: () => " " ,
        colSpan:5
      },
    ];
  }
}
