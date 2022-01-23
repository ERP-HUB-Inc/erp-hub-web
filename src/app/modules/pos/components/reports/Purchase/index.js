import React from "react";
import List from "../List";
import Constant from "../../../constants/report/purchase";
import Enum from "../../../../inventory/enums";
import PurchaseReportAction from "../../../action/report/purchaseOrder";
import SupplierAction from "../../../../inventory/actions/stock/supplier";
import PurchaseReportService from "../../../services/report/PurchaseService";
import "./index.css";

export default class PurchaseList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      setDefaultDate: [],
      reportType: 0,
      columns: this.columnSummary()
    };

    this.RESET_CONSTANT = Constant.RESET_PURCHASE_REPORT;

    this.fetchingProp = "purchaseReport";
    this.service = PurchaseReportService;
    this.action = PurchaseReportAction;
  
    this.columnFilterWithKey = [
      "name",
      "number",
      "invoiceNo",
      "shippingFee",
      "requestTotal",
      "returnTotal",
      "receiveTotal"
    ];
    this.supplierList = [{name: <this.Translate id="text_all_supplier"/>, id: 0}];
    this.PO_STEP_STR = {
      [Enum.PO_STEP.DRAFT]: {name: this.CATranslate("purchase_order_step_draff", this.props.locale), color: this.Enum.PO_STEP_COLOR.DRAFT},
      [Enum.PO_STEP.PROCESS]: {name: this.CATranslate("text_process", this.props.locale), color: this.Enum.PO_STEP_COLOR.PROCESS},
      [Enum.PO_STEP.RECEIVED]: {name: this.CATranslate("text_received", this.props.locale), color: this.Enum.PO_STEP_COLOR.RECEIVE},
      [Enum.PO_STEP.CANCEL]: {name: this.CATranslate("text_cancel", this.props.locale), color: this.Enum.PO_STEP_COLOR.CANCEL},
      [Enum.PO_STEP.RETURN]: {name: this.CATranslate("text_return", this.props.locale), color: this.Enum.PO_STEP_COLOR.RETURN},
      [Enum.PO_STEP.PAID]: {name: this.CATranslate("purchase_order_step_paid", this.props.locale), color: this.Enum.PO_STEP_COLOR.PAID},
    };

    this.reportTypeList = [
      {value: 0, name: this.CATranslate("text_purchase_summary", this.props.locale)},
      {value: 1, name: this.CATranslate("text_product", this.props.locale)},
      {value: 2, name: this.CATranslate("text_supplier", this.props.locale)}
    ];

    this.ExportheadersCsv = [
      {label: this.CATranslate("text_date", this.props.locale), key: "createdAt"},
      {label: this.CATranslate("text_name", this.props.locale) , key: "name"},
      {label: this.CATranslate("text_number", this.props.locale), key: "number"},
      {label: this.CATranslate("text_reference", this.props.locale), key: "number"},
      {label: this.CATranslate("text_receiver", this.props.locale), key: "receiverId"},
      {label: this.CATranslate("text_supplier", this.props.locale), key: "supplier"},
      {label: this.CATranslate("text_location", this.props.locale), key: "location"},
      {label: this.CATranslate("text_due_date", this.props.locale), key: "deliveryDueDate"},
      {label: this.CATranslate("text_step", this.props.locale), key: "step"},
      {label: this.CATranslate("text_shipping_fee", this.props.locale), key: "shippingFee"},
      {label: this.CATranslate("text_total", this.props.locale), key: "requestTotal"},
    ];
    this.exportCsvFileName = "purchase_report.csv"; 
    
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.summaryPurchaseReprot = this.summaryPurchaseReprot.bind(this);
  }

  componentDidMount(){
    super.componentDidMount();
    this.props.dispatch(SupplierAction.fetch(100));
  }

  columnProduct() {
    return [
      {
        title: <this.Translate id="text_product_name" />,
        dataIndex: "name",
        key: "name",
        render: (text, record) => {
          let variantName = "";
          if (record.productOption === Enum.PRODUCT_VARIANT) {
            variantName = ` / ${record.variant}`;
          }
          return record.name + variantName;
        }
      },
      {
        title: <this.Translate id="text_product_code" />,
        dataIndex: "barcode",
        key: "barcode"
      },
      {
        title: <this.Translate id="text_purchase_date" />,
        dataIndex: "date",
        key: "date",
        render: date => this.formatDate(date)
      },
      {
        title: <this.Translate id="text_quantity_buy_in" />,
        dataIndex: "quantity",
        key: "quantity",
        width: 250,
        align: "center",
        render: (quantity, record) => `${quantity} ${record.unit}`
      },
      {
        title: <this.Translate id="text_unit_cost" />,
        dataIndex: "price",
        key: "price",
        width: 250,
        align: "right",
        render: price => this.formatCurrency(price)
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "amount",
        key: "amount",
        width: 250,
        align: "right",
        render: amount => this.formatCurrency(amount)
      }
    ];
  }

  columnSupplier() {
    return [
      {
        title: <this.Translate id="text_supplier" />,
        dataIndex: "supplier",
        key: "supplier"
      },
      {
        title: <this.Translate id="text_amount" />,
        dataIndex: "amount",
        key: "amount",
        width: 250,
        align: "right",
        render: amount => this.formatCurrency(amount)
      }
    ];
  }

  columnSummary() {
    return [
      this.columnCreatedAt,
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name"
      },
      {
        title: <this.Translate id="text_number" />,
        dataIndex: "number",
        key: "number",
        width: 130
      },
      {
        title: <this.Translate id="text_reference" />,
        dataIndex: "referenceId",
        key: "referenceId",
        width: 130,
        render: (text, record, index) => {
          let referenceNo = this.emptyText;
          if ("reference" in record && record["reference"] != null) {
            referenceNo = record["reference"]["number"];
          }
          return referenceNo;
        }
      },
      {
        title: <this.Translate id="text_receiver"/>,
        dataIndex: "receiver",
        key: "receiverId",
        width: 140,
        render: receiver => receiver ? receiver.fullName: this.emptyText
      },
      {
        title: <this.Translate id="text_supplier" />,
        dataIndex: "supplier",
        key: "supplierId",
        width: 140,
        render: supplier => supplier ? supplier.name: this.emptyText
      },
      {
        title: <this.Translate id="text_location" />,
        dataIndex: "location",
        key: "location",
        width: 140,
        render: location => location ? location.name: this.emptyText
      },
      {
        title: <this.Translate id="text_due_date" />,
        dataIndex: "deliveryDueDate",
        key: "deliveryDueDate",
        width: 180,
        render: deliveryDueDate => this.formatDate(deliveryDueDate)
      },
      {
        title: <this.Translate id="text_step" />,
        dataIndex: "step",
        key: "step",
        width: 100,
        render: step => step in this.PO_STEP_STR ? <this.Tag color={this.PO_STEP_STR[step].color} className="text-uppercase text-center po-step-tag">{this.PO_STEP_STR[step].name}</this.Tag> : ""
      },
      {
        title: <this.Translate id="text_shipping_fee" />,
        dataIndex: "shippingFee",
        key: "shippingFee",
        width: 130,
        align: "right",
        render: shippingFee => this.formatCurrency(shippingFee)
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "requestTotal",
        key: "requestTotal",
        width: 130,
        align: "right",
        render: (text, record) => {
          let key = "requestTotal";
          if (record.step === Enum.PO_STEP.RECEIVED) {
            key = "receiveTotal";
          } else if (record.step === Enum.PO_STEP.RETURN) {
            key = "returnTotal";
          }
          const value = record[key];
          return this.formatCurrency(value ? value : 0);
        }
      }
    ];
  }

  summaryPurchaseReprot(){
    const {purchaseReport} = this.props;
    let total = [];
    let totalShippingFee = [];
    let totalSummary = 0;
    let totalSummaryShippingFee = 0;

    if (Array.isArray(purchaseReport.list)) {
      purchaseReport.list.forEach(poReport => {
        if (poReport.step === Enum.PO_STEP.RECEIVED) {
          totalSummary += poReport.receiveTotal;
        } else if (poReport.step === Enum.PO_STEP.RETURN) {
          totalSummary += poReport.returnTotal;
        } else {
          totalSummary += poReport.requestTotal;
        }
        totalSummaryShippingFee += poReport.shippingFee;
      });
      total.push(totalSummary);
      totalShippingFee.push(totalSummaryShippingFee);
    }

    return {total, totalShippingFee};

  }

  renderTable(){
    return (  
      <this.Row className="main-purchase">
        <this.Col md="12">
          <this.Table 
            dataSource={this.props.purchaseReport.list}
            columns= {this.state.columns}
            loading={this.props.purchaseReport.fetching}
            locale={{emptyText: <this.Translate id="table_empty_data"/>}}
            footer={() => 
              !this.state.reportType || this.state.reportType === this.reportTypeList[0].value ?
                <div className="wrap-table-footer" style={{minWidth: 347}} >
                  <div className="text-uppercase pull-left">
                    <this.Translate id="text_total" />:
                  </div>
                  <div className="item pull-left" style={{minWidth: 160, textAlign: "right", paddingRight: 0 }}>
                    {this.formatCurrency(this.summaryPurchaseReprot().totalShippingFee)}
                  </div>
                  <div className="item pull-left" style={{minWidth: 124, paddingRight: 0}}>
                    {this.formatCurrency(this.summaryPurchaseReprot().total)}
                  </div>
                </div>
                :
                <div className="wrap-table-footer" style={{minWidth: 175}} >
                  <div className="text-uppercase pull-left">
                    <this.Translate id="text_total" />:
                  </div>
                  <div className="item pull-left" style={{minWidth: 124, paddingRight: 0}}>
                    {this.formatCurrency(this.Util.sumBy(this.props.purchaseReport.list, "amount"))}
                  </div>
                </div>
            }
          />
        </this.Col>
      </this.Row>
    );
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          let rangFilter = "";

          if (values.reportType === this.reportTypeList[1].value) {
            this.setState({columns: this.columnProduct()});
          } else if (values.reportType === this.reportTypeList[2].value) {
            this.setState({columns: this.columnSupplier()});
          } else {
            this.setState({columns: this.columnSummary()});
          }

          if (values.step !== -1) {
            filter["step"] = [values.step];
          }

          if (values.supplierId !== 0) {
            filter["supplierId"] = [values.supplierId];
          }

          if (values.deliveryDueDate) {
            rangFilter = JSON.stringify({
              column: "deliveryDueDate",
              value: [
                this.Util.formatDateForMYSQL(values.deliveryDueDate[0]) + " 00:00:00",
                this.Util.formatDateForMYSQL(values.deliveryDueDate[1]) + " 23:59:59"
              ]
            });
          }
    
          filter = JSON.stringify(filter);

          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, rangFilter, values.reportType));
          this.setState({
            isClickFilter: true,
            reportType: values.reportType
          });
        }
      
      }); 
    } 
  }

  exportCsv(){
    const { purchaseReport } = this.props;
    let getpurchaseReport = [];
  
    if(purchaseReport.list){
      purchaseReport.list.forEach(poReport => {
      
        getpurchaseReport.push({
          createdAt: this.formatDate(poReport.createdAt),
          name: poReport.name,
          number: poReport.number,
          referenceId: poReport.reference !=null ? poReport.reference.number : this.emptyText,
          receiverId: poReport.receiver ? poReport.receiver.fullName: this.emptyText,
          supplier: poReport.supplier.name,
          location: poReport.location.name,
          deliveryDueDate: this.formatDate(poReport.deliveryDueDate),
          step: poReport.step in this.PO_STEP_STR ? this.PO_STEP_STR[poReport.step].name : "",
          shippingFee: this.formatCurrency(poReport.shippingFee),
          requestTotal: this.formatCurrency(poReport.requestTotal),
        });

      });

      getpurchaseReport.push({
        createdAt: "",
        name: "",
        number: "",
        referenceId: "",
        receiverId: "",
        supplier: "",
        location: "",
        deliveryDueDate: "",
        step: "Total",
        shippingFee: this.formatCurrency(this.summaryPurchaseReprot().totalShippingFee),
        requestTotal: this.formatCurrency(this.summaryPurchaseReprot().total)
      });
      
    }
    return getpurchaseReport;
  }

  renderActionButton(){
    return(
      <this.CSVLink
        filename={this.exportCsvFileName}
        // data={this.exportCsv}
        data={[]}
        headers={this.ExportheadersCsv}>
        <this.Button type="info" disabled={ this.props.purchaseReport.list.length > 0 ? false : true }>
          <span className="icon-export icon-padding-right"></span>{<this.Translate id="text_export_csv" />}
        </this.Button>
      </this.CSVLink>
    );
  }

  renderPagination() {}

  renderFilterRecord() {
    const {form, locale} = this.props;
    const fetchingProps = this.props[this.fetchingProp];
    const POStepList = Object.keys(this.PO_STEP_STR).map((prop) => {
      return {name: this.PO_STEP_STR[prop].name, value: prop};
    });
    POStepList.unshift({name: <this.Translate id="text_all_step"/>, value: -1});
   
    return(
      form == null ?
        ""
        :
        <div>
          <this.Form onSubmit={this.handleSubmitFilter}>
            <this.Row className="main-search-layout">
              <this.Col md="2">
                <this.Select
                  name="reportType"
                  placeholder={this.CATranslate("text_purchase_summary", this.props.locale)}
                  dataSource={this.reportTypeList}
                  label={<this.Translate id="text_report_type" />}
                  defaultValue={this.reportTypeList[0].value}
                  form={this.props.form}/>
              </this.Col>
              <this.Col md="2">
                <this.InputText
                  name="key"
                  label={<this.Translate id="text_search" />}
                  placeholder={this.CATranslate("text_po_general_search", locale)}
                  isAutoFocus={true}
                  form={form}/>
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="supplierId"
                  label={<this.Translate id="text_supplier" /> }
                  dataSource={this.supplierList.concat(this.props.supplier.list)}
                  defaultValue={this.supplierList[0].id}
                  valueKey="id"
                  form={form}/>
              </this.Col>
              <this.Col md="2">
                <this.DateRangePicker
                  name="deliveryDueDate"
                  label={<this.Translate id="text_date_range" />}
                  form={form}
                  defaultValue={this.state.setDefaultDate}
                  ranges={this.dateRangeDataSource()} />
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="step"
                  label={<this.Translate id="text_step" />}
                  dataSource={POStepList}
                  defaultValue={POStepList[0].value}
                  form={form}
                />
              </this.Col>
              <this.Col md="2" className="wrap-btn-search">
                <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                  <label htmlFor="status" className="" title=""></label>
                </div>
                <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                  <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="text_search" />}
                </this.Button> 
              </this.Col>

            </this.Row>
          </this.Form>
        </div>
    );

  }

}
