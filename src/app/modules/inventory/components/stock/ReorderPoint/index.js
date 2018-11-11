import React from "react";
import List from "../List";
import FormCreate from "../../../containers/stock/PurchaseOrder/FormCreate";
import Constant from "../../../constants/stock/reorderPoint";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import ReorderPointAction from "../../../actions/stock/reorderPoint";
import ReorderPointService from "../../../services/stock/ReorderPointService";
import "./index.css";

export default class ReorderPointList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.columnExpend = new ColumnExpend(); 
    this.isShowExpandable = true;
    this.fetchingProp = "reorderPoint";
    this.addingProp = "reorderPointAdd";
    this.updatingProp = "reorderPointUpdate";
    this.service = ReorderPointService;
    this.columnFilterWithKey = ["name"];
    this.action = ReorderPointAction;
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
    this.purchase = this.purchase.bind(this);
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

  purchase(){
    const { dispatch } = this.props;
    dispatch(PurchaseOrderAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  buttonActionCollection() {
    return [
      <this.Button type="info" onClick={this.purchase}>
        <span className="icon-export"></span> {<this.Translate id="button_stock_reorder_purchase" />}
      </this.Button>
    ];
  }

  renderFilterRecord() {

    const {form,locale} = this.props;

    return(
      <div className="reorder-point-form-search">
        { form == null ?
          ""
          :
          <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
            <this.Row className="main-search-layout form-group"> 
              <this.Col md="3">
                {/* <this.StoreLocation
                  label={<this.Translate id="select_stock_reorder_point_store_location" />}
                /> */}
              </this.Col>
              <this.Col md="3">
                {/* <this.Brand 
                  label={<this.Translate id="select_stock_reorder_point_brand" />}
                /> */}
                
              </this.Col>
              {/* <this.Col md="3">
                <this.Select
                  name="reorderPointid"
                  label={<this.Translate id="select_stock_reorder_point_product_type" />}
                  placeholder={<this.Translate id="select_stock_reorder_point_product_type" />}
                  dataSource={productsType.list}
                  valueKey="id"
                  form={form}
                />
              </this.Col>
              <this.Col md="3">
                <this.Select
                  name="supplierid"
                  label={<this.Translate id="text_supplier" />}
                  placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
                  dataSource={supplier.list}
                  valueKey="id"
                  form={form}
                />
              </this.Col>  */}
            </this.Row>
            <this.Row>
              <this.Col md="3">
                <this.Select
                  name="status"
                  label={<this.Translate id="select_stock_reorder_point_status" />}
                  placeholder={this.CATranslate("place_holder_stock_reorder_point_status", locale)}
                  dataSource={this.statusList}
                  defaultValue={this.Enum.ALL_STATE}
                  form={form}
                />
              </this.Col>
              <this.Col md="3">
                <this.InputText
                  name="key"
                  label={<this.Translate id="input_stock_reorder_point_tags" />}
                  placeholder="Search for Purchase Order"
                  form={form}
                />
              </this.Col>
              <this.Col md="3">
                <this.InputText
                  name="key"
                  label={<this.Translate id="input_stock_reorder_point_product_key" />}
                  placeholder={this.CATranslate("input_stock_reorder_point_product_key", locale)}
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.Button htmlType="submit" type="info" >
                  <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="button_stock_reorder_search" />}
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
        title: <this.Translate id="text_product_name" />,
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
        dataIndex: "qty",
        key: "qty",
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
