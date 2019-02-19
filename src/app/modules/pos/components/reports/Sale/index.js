import React from "react";
import List from "../List";
import Constant from "../../../constants/report/sale";
import SaleReportAction from "../../../action/report/sale";
import SaleReportService from "../../../services/report/SaleService";
import "./index.css";

export default class SaleList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      csvData: "",
      setDefaultDate:  []
    };
    this.columns = new Column();
    this.ExportheadersCsv = [
      {label: this.CATranslate("text_date", this.props.locale), key: "date"},
      {label: this.CATranslate("text_revenue", this.props.locale), key: "revenue"},
      {label: this.CATranslate("text_cost_of_good", this.props.locale), key: "cost"},
      {label: this.CATranslate("text_cost_of_good", this.props.locale), key: "profit"},
      {label: this.CATranslate("text_margin", this.props.locale), key: "margin"}
    ];
    this.exportCsvFileName = "sale_report.csv"; 

    this.fetchingProp = "saleReport";
    this.service = SaleReportService;
    this.action = SaleReportAction;
    this.RESET_CONSTANT = Constant.RESET_SALE_REPORT;
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.exportCsv = this.exportCsv.bind(this);
    this.handleFilesUploadCsv = this.handleFilesUploadCsv.bind(this);
  }

  componentDidMount(){
    super.componentDidMount();
    this.loadFilter();
  }

  exportCsv(){
    const { saleReport } = this.props;
    let getSaleReport = [];
    if(saleReport.list){
      saleReport.list.forEach(saleReport => {
        getSaleReport.push({
          date: this.formatDate(saleReport.date),
          revenue: saleReport.revenue,
          cost: this.formatCurrency(saleReport.cost),
          profit: this.formatCurrency(saleReport.profit),
          margin: saleReport.margin + "%"
        });
      });
    }
    return getSaleReport;
  }

  //read file for import
  handleFilesUploadCsv(files){
    let reader = new FileReader();
    reader.onload = () => {
      // Use reader.result
      this.setState({
        csvData: reader.result
      });
    };
    reader.readAsText(files[0]);
  }

  renderTable(){
    const { saleReport } = this.props;
    return (  
      <div className="main-table-sale-report">
        <this.Table 
          dataSource={saleReport.list}
          rowKey="date"
          columns={this.columns}
          onChange={this.onChange}
          locale={{emptyText: <this.Translate id="table_empty_data"/>}}
          loading={this.props.saleReport.fetching} />
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
                  this.Util.formatDateForMYSQL(values.createdAt[0]) + " 00:00:00",
                  this.Util.formatDateForMYSQL(values.createdAt[1]) + " 23:59:59"
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

  loadFilter(){
    let getCurrentDate = new Date().toISOString().slice(0, 10);

    this.setState({
      setDefaultDate : [this.Util.formatDatePicker(getCurrentDate),this.Util.formatDatePicker(getCurrentDate)]
    });

    let filter = {};

    filter["type"] = [0, 1];

    let rangFilter = "";
   
    rangFilter = JSON.stringify({
      column: "registerDate",
      value: [
        this.Util.formatDateForMYSQL(getCurrentDate) + " 00:00:00",
        this.Util.formatDateForMYSQL(getCurrentDate) + " 23:59:59"
      ]});

    filter = JSON.stringify(filter);
    this.props.dispatch(this.action.fetch(filter, rangFilter));
    this.setState({isClickFilter: true});

  }


  renderActionButton(){
    return(
      <this.CSVLink
        filename={this.exportCsvFileName}
        data={this.exportCsv()}
        headers={this.ExportheadersCsv}>
        <this.Button type="info" disabled={ this.props.saleReport.list.length > 0 ? false : true }>
          <span className="icon-export icon-padding-right"></span>{<this.Translate id="text_export_csv" />}
        </this.Button>
      </this.CSVLink>
    );
  }

  renderPagination(){}

  renderFilterRecord() {
    const fetchingProps = this.props[this.fetchingProp];
    return(
      this.props.form == null ?
        ""
        :
        <div>
          <this.Form onSubmit={this.handleSubmitFilter}>
            <this.Row className="main-search-layout"> 
              <this.Col md="3">
                <this.DateRangePicker
                  name="createdAt"
                  label={<this.Translate id="text_date_range" />}
                  defaultValue={this.state.setDefaultDate}
                  errorRequired={<this.Translate id="errpr_text_date_range" />}
                  form={this.props.form}/>
              </this.Col>
              <this.Col md="2">
                <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching} className="wrap-report-btn-search">
                  <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="text_search" />}
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
        width: 200,
        className: "sale-report",
        align: "center",
        render: value => this.Util.formatDate(value)
      },
      {
        title: <this.Translate id="text_revenue" />,
        dataIndex: "revenue",
        align: "center",
        key: "revenue",
        render: value => this.formatCurrency(value)
      },
      {
        title: <this.Translate id="text_cost_of_good" />,
        dataIndex: "cost",
        align: "center",
        key: "cost",
        render: value => this.formatCurrency(value)
      },
      {
        title: <this.Translate id="text_gross_profit" />,
        dataIndex: "profit",
        align: "center",
        key: "profit",
        render: value => this.formatCurrency(value)
      },
      {
        title: <this.Translate id="text_margin" />,
        dataIndex: "margin",
        align: "center",
        key: "margin",
        render: value => this.Util.formatPercentage(value)
      }
    ];
  }
}