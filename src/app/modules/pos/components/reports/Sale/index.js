import React from "react";
import List from "../List";
import Constant from "../../../constants/report/sale";
import SaleReportAction from "../../../action/report/sale";
import SaleReportService from "../../../services/report/SaleService";
import Enum from "../../../../inventory/enums";
import "./index.css";

export default class SaleList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      csvData: "",
      setDefaultDate:  [],
      reportType: 0
    };
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "date",
        key: "date",
        width: 200,
        className: "sale-report",
        align: "center",
        render: value => this.Util.formatDate(value)
      },
      {
        title: <this.Translate id="text_product" />,
        dataIndex: "name",
        key: "name",
        width: 200,
        className: "sale-report",
        render: (text, record) => {
          let variantName = "";
          if (record.productOption === Enum.PRODUCT_VARIANT) {
            variantName = ` / ${record.variant}`;
          }
          return record.name + variantName;
        }
      },
      {
        title: <this.Translate id="text_product_type" />,
        dataIndex: "name",
        key: "name",
        width: 200,
        className: "sale-report"
      },
      {
        title: <this.Translate id="text_user" />,
        dataIndex: "user",
        key: "user",
        width: 200,
        className: "sale-report"
      },
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "customer",
        key: "customer",
        width: 200,
        className: "sale-report"
      },
      {
        title: <this.Translate id="text_location" />,
        dataIndex: "location",
        key: "location",
        width: 200,
        className: "sale-report"
      }
    ];
  
    this.exportCsvFileName = "sale_report.csv";
    this.reportTypeList = [
      {value: 0, name: this.CATranslate("text_sale_summary", this.props.locale)},
      {value: 1, name: this.CATranslate("text_product", this.props.locale)},
      {value: 2, name: this.CATranslate("text_product_type", this.props.locale)},
      {value: 3, name: this.CATranslate("text_user", this.props.locale)},
      {value: 4, name: this.CATranslate("text_customer", this.props.locale)},
      {value: 5, name: this.CATranslate("text_location", this.props.locale)}
    ];

    this.fetchingProp = "saleReport";
    this.service = SaleReportService;
    this.action = SaleReportAction;
    this.RESET_CONSTANT = Constant.RESET_SALE_REPORT;
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.exportCsv = this.exportCsv.bind(this);
    this.exportheadersCsv = this.exportheadersCsv.bind(this);
    this.handleFilesUploadCsv = this.handleFilesUploadCsv.bind(this);
  }

  componentDidMount(){
    super.componentDidMount();
    this.loadFilter();
  }

  changeFormValueWhenExport(propertyFields){
    let getFieldValues = this.props.form.getFieldValue("reportType");
    let filedValues = {label: this.CATranslate("text_date", this.props.locale), key: "fieldNames"};
    let keyFileds;
    if(getFieldValues === 0){
      filedValues =  {label: this.CATranslate("text_sale_summary", this.props.locale), key: "fieldNames"};
    }else if(getFieldValues === 1){
      filedValues =  {label: this.CATranslate("text_product", this.props.locale), key: "fieldNames"};
    }else if(getFieldValues === 2){
      filedValues =  {label: this.CATranslate("text_product_type", this.props.locale), key: "fieldNames"};
    }else if(getFieldValues === 3){
      filedValues =  {label: this.CATranslate("text_user", this.props.locale), key: "fieldNames"};
    }else if(getFieldValues === 4){
      filedValues =  {label: this.CATranslate("text_customer", this.props.locale), key: "fieldNames"};
    }else if(getFieldValues === 5){
      filedValues =  {label: this.CATranslate("text_location", this.props.locale), key: "fieldNames"};
    }

    if(propertyFields){
      keyFileds = propertyFields.date;
      if(getFieldValues === 0){
        keyFileds = propertyFields.date;
      }else if(getFieldValues === 1){
        keyFileds = propertyFields.name;
      }else if(getFieldValues === 2){
        keyFileds = propertyFields.name;
      }else if(getFieldValues === 3){
        keyFileds = propertyFields.user;
      }else if(getFieldValues === 4){
        keyFileds = propertyFields.customer;
      }else if(getFieldValues === 5){
        keyFileds = propertyFields.location;
      }
    } 

    return { filedValues,keyFileds };
  }

  exportCsv(){
    const { saleReport } = this.props;
    let getSaleReport = [];
    if(saleReport.list && saleReport.list.length > 0){
      saleReport.list.forEach(saleReport => {
        getSaleReport.push({
          fieldNames: this.changeFormValueWhenExport(saleReport).keyFileds,
          revenue: this.formatCurrency(saleReport.revenue),
          cost: this.formatCurrency(saleReport.cost),
          profit: this.formatCurrency("profit" in saleReport ? saleReport.profit : saleReport.revenue - saleReport.cost),
          margin: this.Util.formatPercentage("margin" in saleReport ? saleReport.margin : ((saleReport.revenue - saleReport.cost)/saleReport.revenue) * 100)
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
    return (  
      <div className="main-table-sale-report">
        <this.Table 
          dataSource={this.props.saleReport.list}
          rowKey="id"
          columns={
            [
              this.columns[this.state.reportType],
              {
                title: <this.Translate id="text_revenue" />,
                dataIndex: "revenue",
                align: "right",
                key: "revenue",
                render: value => this.formatCurrency(value)
              },
              {
                title: <this.Translate id="text_cost_of_good" />,
                dataIndex: "cost",
                align: "right",
                key: "cost",
                render: value => this.formatCurrency(value)
              },
              {
                title: <this.Translate id="text_gross_profit" />,
                dataIndex: "profit",
                align: "right",
                key: "profit",
                render: (text, record) => {
                  let profit = 0;
                  profit = "profit" in record ? record.profit : record.revenue - record.cost;
                  return this.formatCurrency(profit);
                }
              },
              {
                title: <this.Translate id="text_margin" />,
                dataIndex: "margin",
                align: "right",
                key: "margin",
                render: (text, record) => {
                  let margin = 0;
                  margin = "margin" in record ? record.margin : ((record.revenue - record.cost)/record.revenue) * 100;
                  return this.Util.formatPercentage(margin);
                }
              }
            ]
          }
          onChange={this.onChange}
          locale={{emptyText: <this.Translate id="table_empty_data"/>}}
          loading={this.props.saleReport.fetching} />
      </div>
    );
  }


  handleSubmitFilter(e){
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (this.action) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {

            let filter = {};
        
            let rangFilter = "";
            filter["type"] = [0, 1];

            if (values.createdAt) {
              rangFilter = JSON.stringify({
                column: "registerDate",
                value: [
                  this.Util.formatDateForMYSQL(values.createdAt[0]) + " 00:00:00",
                  this.Util.formatDateForMYSQL(values.createdAt[1]) + " 23:59:59"
                ]});
  
            }

            filter = JSON.stringify(filter);
          
            this.props.dispatch(this.action.fetch(filter, rangFilter, values.reportType));
            this.setState({
              isClickFilter: true,
              reportType: values.reportType ? values.reportType : this.state.reportType
            });
            
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

  exportheadersCsv(){
    return [
      this.changeFormValueWhenExport().filedValues,
      {label: this.CATranslate("text_revenue", this.props.locale), key: "revenue"},
      {label: this.CATranslate("text_cost_of_good", this.props.locale), key: "cost"},
      {label: this.CATranslate("text_cost_of_good", this.props.locale), key: "profit"},
      {label: this.CATranslate("text_margin", this.props.locale), key: "margin"}
    ];
  }

  renderActionButton(){
    return(
      <this.CSVLink
        filename={this.exportCsvFileName}
        data={this.exportCsv()}
        headers={this.exportheadersCsv()}>
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
              <this.Col md="2">
                <this.Select
                  name="reportType"
                  placeholder={this.CATranslate("text_sale_summary", this.props.locale)}
                  dataSource={this.reportTypeList}
                  label={<this.Translate id="text_report_type" />}
                  defaultValue={this.reportTypeList[0].value}
                  form={this.props.form}/>
              </this.Col>
              <this.Col md="3">
                <this.DateRangePicker
                  name="createdAt"
                  label={<this.Translate id="text_date_range" />}
                  defaultValue={this.state.setDefaultDate}
                  errorRequired={<this.Translate id="errpr_text_date_range" />}
                  form={this.props.form}
                  ranges={this.dateRangeDataSource()}/>
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