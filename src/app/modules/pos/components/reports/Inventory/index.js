import React from "react";
import moment from "moment";
import List from "../List";
import Constant from "../../../constants/report/inventory";
import InventoryReportAction from "../../../action/report/inventoryReport";
import InventoryReportService from "../../../services/report/InventoryService";
import "./index.css";

export default class InventoryList extends List {
  constructor(props) {
    super(props);
    this.state =  {
      columnFilter: new Column()
    };

    this.columnNew = [
      {
        title: "",
        dataIndex: "name",
        className: "col-inventory-left",
        children: [
          {
            title: <this.Translate id="col_inventory_report_product_name" />,
            dataIndex: "name",
            sorter: true,
            align: "center",
            key: "name"
          },
          {
            title: <this.Translate id="col_inventory_report_sku" />,
            dataIndex: "sku",
            align: "center",
            key: "sku"
          },
          {
            title: <this.Translate id="col_inventory_report_supplier_code" />,
            dataIndex: "supplier_code",
            align: "center",
            key: "supplier_code"
          },
          {
            title: <this.Translate id="col_inventory_report_brand" />,
            dataIndex: "report_brand",
            align: "center",
            key: "report_brand"
          },
          {
            title: <this.Translate id="col_inventory_report_supplier" />,
            dataIndex: "report_supplier",
            align: "center",
            key: "report_supplier"
          },
          {
            title: <this.Translate id="col_inventory_report_type" />,
            dataIndex: "report_type",
            align: "center",
            key: "report_type"
          },
          {
            title: <this.Translate id="col_inventory_report_tag" />,
            dataIndex: "tag",
            align: "center",
            key: "tag"
          },
          {
            title: "Outlet",
            dataIndex: "name",
            key: "name",
            filters: [

              {
                text: "SKU",
                value: "sku"
              },
              {
                text: "Supplier Code",
                value: "supplier_code"
              },
              {
                text: "Brand",
                value: "report_brand"
              },
              {
                text: "Supplier",
                value: "supplier"
              },
              {
                text: "Type",
                value: "report_type"
              },
              {
                text: "Tag",
                value: "tag"
              }
            ]
          },
        ]
       
      },
      {
        title: <this.Translate id="col_inventory_total_outlet" />,
        className: "col-inventory-right",
        dataIndex: "shippingFee",
        children: [
          {
            title: <this.Translate id="col_inventory_report_supplier" />,
            dataIndex: "shippingFee",
            align: "center",
            key: "shippingFee"
          },
          {
            title: <this.Translate id="col_inventory_report_type" />,
            dataIndex: "shippingFee",
            align: "center",
            key: "shippingFee"
          },
          {
            title: <this.Translate id="col_inventory_report_tag" />,
            dataIndex: "shippingFee",
            align: "center",
            key: "shippingFee"
          }
        ]
      }
      
    ];

    // this.columns = this.state.columnFilter;
    this.fetchingProp = "inventoryReport";
    this.addingProp = "inventoryReportAdd";
    this.updatingProp = "inventoryReportUpdate";
    this.service = InventoryReportService;
    this.action = InventoryReportAction;
    this.RESET_CONSTANT = Constant.RESET_INVENTORY_REPORT;

    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.disabledDate = this.disabledDate.bind(this);

  }

  disabledDate(current){
    return current && current < moment().subtract(7, "d") ;
  }

  handleTableChange(pagination, filters, sorter){
    console.log("columnFilter",this.state.columnFilter[0].children);
    const Valfilters = [];

    this.state.columnFilter[0].children.forEach(valuesCol => {  
    
      filters.name.forEach(valuesFil => {
        if(valuesCol.key === valuesFil){
          Valfilters.push({
            children:[
              {
                title: valuesCol.title,
                dataIndex: valuesCol.dataIndex,
                align: valuesCol.align,
                key: valuesCol.key
              },
            ],
          });
        }
      });

    });
    console.log("value fil",Valfilters);
  }
  
  renderTable(){
    return (  
      <div className="main-inventory-report">
        <this.Table 
          // dataSource={this.props.saleReport.list}
          // columns={this.columns}    
          columns={this.state.columnFilter}
          // onChange={this.onChange}
          locale={{emptyText: <this.Translate id="table_empty_data"/>}}
          // loading={this.props.saleReport.fetching}
          onChange={this.handleTableChange}
          footer={() => <div className="totals">
            TOTALS
          </div>}
        />
      </div>
      
    );
   
  }

  renderActionButton(){
    return(
      <div>
        { this.renderButtonExportCSV() }  
      </div> 
    );
  }

  renderPagination(){
    return(<div></div>);
  }

  renderFilterRecord() {

    const {form,locale} = this.props;
    return(
      <div>
        <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout form-group"> 

            <this.Col md="3">
              <this.Select
                name="status"
                placeholder={this.CATranslate("place_holder_stock_reorder_point_status", locale)}
                dataSource={this.statusList}
                label="Report Type"
                defaultValue={this.Enum.ALL_STATE}
                form={form}
              />
            </this.Col>
            <this.Col md="3">
              <this.DatePickers
                name="datepicker"
                label="Date"
                disabledDate={this.disabledDate}
                form={form}
              />
            </this.Col>
            
            <this.Col md="3" className="reorder-point-button-search report-button">

              {/* <this.Button htmlType="submit" type="info" >
                <span className="icon-export icon-padding-right text-uppercase"></span>{<this.Translate id="button_inventory_report_export_to_csv" />}
              </this.Button>  */}

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
        title: "",
        dataIndex: "name",
        className: "col-inventory-left",
        children: [
          {
            title: <this.Translate id="col_inventory_report_product_name" />,
            dataIndex: "name",
            sorter: true,
            align: "center",
            key: "name"
          },
          {
            title: <this.Translate id="col_inventory_report_sku" />,
            dataIndex: "sku",
            align: "center",
            key: "sku"
          },
          {
            title: <this.Translate id="col_inventory_report_supplier_code" />,
            dataIndex: "supplier_code",
            align: "center",
            key: "supplier_code"
          },
          {
            title: <this.Translate id="col_inventory_report_brand" />,
            dataIndex: "report_brand",
            align: "center",
            key: "report_brand"
          },
          {
            title: <this.Translate id="col_inventory_report_supplier" />,
            dataIndex: "report_supplier",
            align: "center",
            key: "report_supplier"
          },
          {
            title: <this.Translate id="col_inventory_report_type" />,
            dataIndex: "report_type",
            align: "center",
            key: "report_type"
          },
          {
            title: <this.Translate id="col_inventory_report_tag" />,
            dataIndex: "tag",
            align: "center",
            key: "tag"
          },
          {
            title: "Outlet",
            dataIndex: "name",
            key: "name",
            filters: [

              {
                text: "SKU",
                value: "sku"
              },
              {
                text: "Supplier Code",
                value: "supplier_code"
              },
              {
                text: "Brand",
                value: "report_brand"
              },
              {
                text: "Supplier",
                value: "supplier"
              },
              {
                text: "Type",
                value: "report_type"
              },
              {
                text: "Tag",
                value: "tag"
              }
            ]
          },
        ]
       
      },
      {
        title: <this.Translate id="col_inventory_total_outlet" />,
        className: "col-inventory-right",
        dataIndex: "shippingFee",
        children: [
          {
            title: <this.Translate id="col_inventory_report_supplier" />,
            dataIndex: "shippingFee",
            align: "center",
            key: "shippingFee"
          },
          {
            title: <this.Translate id="col_inventory_report_type" />,
            dataIndex: "shippingFee",
            align: "center",
            key: "shippingFee"
          },
          {
            title: <this.Translate id="col_inventory_report_tag" />,
            dataIndex: "shippingFee",
            align: "center",
            key: "shippingFee"
          }
        ]
      }
      
    ];
  
   
    
  }

}