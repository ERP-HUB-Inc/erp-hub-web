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
    this.fetchingProp = "purchaseReport";
    this.service = PurchaseReportService;
    this.action = PurchaseReportAction;
    this.RESET_CONSTANT = Constant.RESET_PURCHASE_REPORT;
    this.columns = this.columns = [
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
        render: step => step in this.PO_STEP_STR ? this.PO_STEP_STR[step].name : ""
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
        render: requestTotal => this.formatCurrency(requestTotal)
      }
    ];
  
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.columnFilterWithKey = ["name", "number", "invoiceNo", "shippingFee", "requestTotal", "returnTotal", "receiveTotal"];
    this.supplierList = [{name: <this.Translate id="text_all_supplier"/>, id: 0}];
    this.PO_STEP_STR_EXCEL = {
      [Enum.PO_STEP.DRAFT]: {name: this.CATranslate("purchase_order_step_draff", this.props.locale), color: "#f50"},
      [Enum.PO_STEP.PROCESS]: {name: this.CATranslate("purchase_order_step_process", this.props.locale), color: "#2db7f5"},
      [Enum.PO_STEP.RECEIVED]: {name: this.CATranslate("text_receive", this.props.locale), color: "#87d068"},
      [Enum.PO_STEP.CANCEL]: {name: this.CATranslate("text_cancel", this.props.locale), color: "#108ee9"},
      [Enum.PO_STEP.RETURN]: {name: this.CATranslate("text_return", this.props.locale), color: "blue"},
      [Enum.PO_STEP.PAID]: {name: this.CATranslate("purchase_order_step_paid", this.props.locale), color: "green"},
    };

    this.PO_STEP_STR = {
      [Enum.PO_STEP.DRAFT]: {name: <this.Translate id="purchase_order_step_draff" />, color: "#f50"},
      [Enum.PO_STEP.PROCESS]: {name: <this.Translate id="purchase_order_step_process" />, color: "#2db7f5"},
      [Enum.PO_STEP.RECEIVED]: {name: <this.Translate id="text_receive" />, color: "#87d068"},
      [Enum.PO_STEP.CANCEL]: {name: <this.Translate id="text_cancel" />, color: "#108ee9"},
      [Enum.PO_STEP.RETURN]: {name: <this.Translate id="text_return" />, color: "blue"},
      [Enum.PO_STEP.PAID]: {name: <this.Translate id="purchase_order_step_paid" />, color: "green"},
    };
    this.ExportheadersCsv = [
      {label: this.CATranslate("text_created_at", this.props.locale), key: "createdAt"},
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
    
    this.summaryPurchaseReprot = this.summaryPurchaseReprot.bind(this);
  }

  componentDidMount(){
    super.componentDidMount();
    this.props.dispatch(SupplierAction.fetch(100));
  }

  summaryPurchaseReprot(){
    const {purchaseReport} = this.props;
    let total = [];
    let totalShippingFee = [];
    let totalSummary = 0;
    let totalSummaryShippingFee = 0;

    if (Array.isArray(purchaseReport.list)) {
      purchaseReport.list.forEach(poReport => {
        totalSummary += poReport.requestTotal;
        totalSummaryShippingFee += poReport.shippingFee;
      });
      total.push(totalSummary);
      totalShippingFee.push(totalSummaryShippingFee);
    }

    return {total, totalShippingFee};

  }

  renderTable(){
    return (  
      this.props.purchaseReport.fetching ? 
        <div className="text-center">
          <this.Spin/>
        </div> 
        :
        <div className="main-purchase">
          <this.Row>
            <this.Col md="12">
              <this.Table 
                dataSource={this.props.purchaseReport.list}
                columns= {this.columns}
                locale={{emptyText: <this.Translate id="table_empty_data"/>}}
                footer={() => 
                  <div className="wrap-table-footer" style={{minWidth: 347}} >
                    <div className="text-uppercase pull-left">
                      <this.Translate id="text_total" />:
                    </div>
                    <div className="item pull-left" style={{minWidth: 157,textAlign: "right" }}>
                      {this.formatCurrency(this.summaryPurchaseReprot().totalShippingFee)}
                    </div>
                    <div className="item pull-left" style={{minWidth: 124}}>
                      {this.formatCurrency(this.summaryPurchaseReprot().total)}
                    </div>
                  </div>
                }
              />
            </this.Col>
          </this.Row>
        </div>
    );
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          let rangFilter = {};
          if (values.step !== -1) {
            filter["step"] = [values.step];
          }

          if (values.supplierId !== 0) {
            filter["supplierId"] = [values.supplierId];
          }

          if (values.deliveryDueDate) {
            values.deliveryDueDate = this.Util.formatDateForMYSQL(values.deliveryDueDate);
            rangFilter = JSON.stringify({column: "deliveryDueDate", value: [values.deliveryDueDate, values.deliveryDueDate]});
          }
    
          filter = JSON.stringify(filter);

          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, rangFilter));
          this.setState({isClickFilter: true});
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
          step: poReport.step in this.PO_STEP_STR_EXCEL ? this.PO_STEP_STR_EXCEL[poReport.step].name : "",
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
        data={this.exportCsv()}
        headers={this.ExportheadersCsv}
      >
        <this.Button type="info">
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
                <this.InputText
                  name="key"
                  label={<this.Translate id="text_key" />}
                  placeholder={this.CATranslate("purchase_order_search_key_place_holder", locale)}
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
                <this.DatePickers
                  name="deliveryDueDate"
                  label={<this.Translate id="text_due_date" />}
                  form={form}
                />
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
                  <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="button_stock_reorder_search" />}
                </this.Button> 
              </this.Col>

            </this.Row>
          </this.Form>
        </div>
    );

  }

}
