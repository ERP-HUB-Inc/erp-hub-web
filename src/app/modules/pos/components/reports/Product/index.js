import React from "react";
import List from "../List";
import Constant from "../../../constants/report/purchase";
import PurchaseReportAction from "../../../action/report/purchaseReport";
import PurchaseReportService from "../../../services/report/PurchaseService";
import "./index.css";

export default class ProductList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.fetchingProp = "purchaseReport";
    this.addingProp = "purchaseReportAdd";
    this.updatingProp = "purchaseReportUpdate";
    this.service = PurchaseReportService;
    this.action = PurchaseReportAction;
    this.RESET_CONSTANT = Constant.RESET_PURCHASE_REPORT;
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.supplierList = [{name: <this.Translate id="text_all_supplier"/>, id: 0}];
  }

  renderTable(){
    return (  
      <div className="main-purchase">
        <this.Row>
          <this.Col md="12">
            <this.Table 
              // dataSource={incomeExpense.income}
              columns= { this.columns }
              locale={{emptyText: <this.Translate id="table_empty_data"/>}}

              // footer={() => 
              //   <div className="float-right">
              //     <div className="totals">
              //       TOTALS
              //     </div>
              //   </div>
              // }

            />
          </this.Col>
        </this.Row>
      </div>
    );
  }

  handleSubmitFilter(e){
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("values",values);
      }
    }); 
  }

  renderActionButton(){
    return(
      <div></div>
    );
  }

  renderPagination(){
    return(<div></div>);
  }

  renderFilterRecord() {
    const {form} = this.props;
    return(
      <div>
        <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout form-group"> 
            <this.Col md="3">
              <this.InputText
                name="key"
                label={<this.Translate id="text_search"/>}
                placeholder="Search for brand, code and notation"
                form={form}
              />
            </this.Col>
            <this.Col md="2" className="wrap-btn-search">
              <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                <label htmlFor="status" className="" title=""></label>
              </div>
              <this.Button htmlType="submit" type="info" >
                <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="button_stock_reorder_search" />}
              </this.Button> 
            </this.Col>

          </this.Row>
        </this.Form>
      </div>
    );

  }

}


class Column extends List {
  constructor(props) {
    super(props);
    return [
      {
        title: <this.Translate id="text_product_name" />,
        dataIndex: "productDescriptions",
        key: "productDescriptions"
      },
      {
        title: <this.Translate id="text_product_code" />,
        dataIndex: "barcode",
        align: "center",
        key: "barcode"
      },
      {
        title: <this.Translate id="col_products_type" />,
        dataIndex: "productType",
        align: "center",
        key: "productType"
      },
      {
        title: <this.Translate id="text_brand" />,
        dataIndex: "brandId",
        align: "center",
        key: "brandId"
      },
      {
        title: <this.Translate id="text_price" />,
        dataIndex: "price",
        align: "center",
        key: "price"
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "quantity",
        align: "center",
        key: "quantity"
      },
      {
        title: <this.Translate id="col_products_unit" />,
        dataIndex: "unit",
        align: "center",
        key: "unit"
      },
      {
        title: <this.Translate id="col_products_types" />,
        dataIndex: "type",
        align: "center",
        key: "type"
      }
    ];
  }
}