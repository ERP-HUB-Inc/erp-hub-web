import React from "react";
import List from "../List";
// import ReactFileReader from "react-file-reader";
import Constant from "../../../constants/report/sale";
import SaleReportAction from "../../../action/report/saleReport";
import SaleReportService from "../../../services/report/SaleService";
import "./index.css";

export default class InventoryList extends List {
  constructor(props) {
    super(props);
    this.state = {
      csvData: ""
    };
    this.columns = new Column();
    this.ExportheadersCsv = [
      {label: "Date", key: "date"},
      {label: "Revenue", key: "revenue"},
      {label: "Cost", key: "cost"},
      {label: "Profile", key: "profit"},
      {label: "Margin", key: "margin"}
    ];
    this.exportCsvFileName = "sale_report.csv";
    this.fetchingProp = "saleReport";
    this.addingProp = "saleReportAdd";
    this.updatingProp = "saleReportUpdate";
    this.service = SaleReportService;
    this.action = SaleReportAction;
    this.RESET_CONSTANT = Constant.RESET_SALE_REPORT;
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.exportCsv = this.exportCsv.bind(this);
    this.handleFilesUploadCsv = this.handleFilesUploadCsv.bind(this);
  }

  componentDidMount(){}

  exportCsv(){
    const { saleReport } = this.props;
    return saleReport.list;
  }

  handleFilesUploadCsv(files){
    let reader = new FileReader();
    reader.onload = () => {
      // Use reader.result
      this.setState({
        csvData: reader.result
      });
    };
    reader.readAsText(files[0]);
    console.log("file",files);
  }

  renderTable(){
    const { saleReport } = this.props;
    return (  
      <div className="main-table-sale-report">
        <this.Table 
          dataSource={saleReport.list}
          columns={this.columns}
          onChange={this.onChange}
          locale={{emptyText: <this.Translate id="table_empty_data"/>}}
          loading={this.props.saleReport.fetching}
        />
      </div>
    );
  }


  handleSubmitFilter(e){
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (this.action != null) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const {dispatch} = this.props;

            let filter = {};

            filter["type"] = [values.reportType];
        
            let rangFilter = "";
            if (values.createdAt) {
              rangFilter = JSON.stringify({
                column: "registerDate",
                value: [
                  this.Util.formatDateForMYSQL(values.createdAt[0]),
                  this.Util.formatDateForMYSQL(values.createdAt[1])
                ]});
  
            }

            filter = JSON.stringify(filter);
          
            dispatch(this.action.fetch(filter,rangFilter));

            this.setState({isClickFilter: true});
            
          }
        
        }); 
      } 
    }); 
  }

  renderButtonExportCSV(){
    return(
      <this.CSVLink
        filename={this.exportCsvFileName}
        data={this.exportCsv()}
        headers={this.ExportheadersCsv}
      >
        <this.Button type="info">
          <span className="icon-export icon-padding-right"></span>{<this.Translate id="button_search_stock_transfer_export_csv" />}
        </this.Button>
      </this.CSVLink>
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

    const {form} = this.props;
    const {csvData} = this.state;

    console.log("csvData",csvData);

    return(
      <div>
        <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout form-group"> 

            <this.Col md="3">
              <this.DateRangePicker
                name="createdAt"
                label={<this.Translate id="input_inventory_report_date_range" />}
                errorRequired={<this.Translate id="errpr_input_inventory_report_date_range" />}
                required={true}
                form={form}
              />
            </this.Col>
            {/* <this.Col md="3">
              <ReactFileReader handleFiles={this.handleFilesUploadCsv} fileTypes={".csv"}>
                <button className='btn'>Upload</button>
              </ReactFileReader>
              {this.state.csvData}
            </this.Col> */}
            {/* <this.Col md="3">
              <this.InputText
                name="key"
                label="Search For key"
                placeholder="Search for brand, code and notation"
                form={form}
              />
            </this.Col> */}

            <this.Col md="2">
              <this.Button htmlType="submit" type="info" className="wrap-report-btn-search">
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
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 350,
        className: "sale-report",
        align: "center",
        render: value => this.formatDate(value)
      },
      {
        title: <this.Translate id="col_sale_report_revenuse" />,
        dataIndex: "revenue",
        align: "center",
        key: "revenue",
        
      },
      {
        title: <this.Translate id="col_sale_report_cost_of_good" />,
        dataIndex: "cost",
        align: "center",
        key: "cost",
        render: value => this.formatCurrency(value)
      },
      {
        title: <this.Translate id="col_sale_report_gross_profit" />,
        dataIndex: "profit",
        align: "center",
        key: "profit",
        render: value => this.formatCurrency(value)
      },
      {
        title: <this.Translate id="col_sale_report_margin" />,
        dataIndex: "margin",
        align: "center",
        key: "margin",
        render: value => value + "%"
      }
    ];
  }
}