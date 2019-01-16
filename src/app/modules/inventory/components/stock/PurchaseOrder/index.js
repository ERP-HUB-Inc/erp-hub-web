import React from "react";
import List from "../List";
import POEmailTemplate from "./EmailTemplate/PO";
import Enum from "../../../enums";
import FormCreate from "../../../containers/stock/PurchaseOrder/FormCreate";
import FormUpdate from "../../../containers/stock/PurchaseOrder/FormUpdate";
import Constant from "../../../constants/stock/purchaseOrder";
import PurchaseAction from "../../../actions/stock/purchaseOrder";
import SupplierAction from "../../../actions/stock/supplier";
import LocationAction from "../../../../pos/action/settings/storeLocation";
import EmailAction from "../../../../common/actions/email";
import PurchaseService from "../../../services/stock/PurchaseOrderService";
import "./index.css";

export default class PurchaseOrderLists extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      dataForSendMail: null,
      emailForPushToSupplier: null
    };
    this.columns = [
      this.columnCreatedAt,
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: <this.Translate id="text_number" />,
        dataIndex: "number",
        key: "number",
        sorter: true,
        width: 130
      },
      {
        title: <this.Translate id="text_reference" />,
        dataIndex: "referenceId",
        key: "referenceId",
        sorter: true,
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
        sorter: true,
        width: 140,
        render: receiver => receiver ? receiver.fullName: this.emptyText
      },
      {
        title: <this.Translate id="text_supplier" />,
        dataIndex: "supplier",
        key: "supplierId",
        sorter: true,
        width: 140,
        render: supplier => supplier ? supplier.name: this.emptyText
      },
      {
        title: <this.Translate id="text_location" />,
        dataIndex: "location",
        key: "location",
        sorter: true,
        width: 140,
        render: location => location ? location.name: this.emptyText
      },
      {
        title: <this.Translate id="text_due_date" />,
        dataIndex: "deliveryDueDate",
        key: "deliveryDueDate",
        sorter: true,
        // width: 180,
        render: deliveryDueDate => this.formatDate(deliveryDueDate)
      },
      {
        title: <this.Translate id="text_shipping_fee" />,
        dataIndex: "shippingFee",
        key: "shippingFee",
        sorter: true,
        width: 150,
        align: "right",
        render: shippingFee => this.formatCurrency(shippingFee)
      },
      {
        title: <this.Translate id="text_items" />,
        dataIndex: "purchaseOrderEntries",
        key: "purchaseOrderEntries",
        width: 100,
        align: "center",
        render: (text, record) => {
          let key = "requestQuantity";

          if (record.step === Enum.PO_STEP.RECEIVED) {
            key = "receiveQuantity";
          } else if (record.step === Enum.PO_STEP.RETURN) {
            key = "returnQuantity";
          }

          return this.Util.sumBy(record.purchaseOrderEntries, key);
        }
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "requestTotal",
        key: "requestTotal",
        sorter: true,
        width: 130,
        align: "right",
        render: (text, record) => {
          let key = "requestTotal";
          if (record.step === Enum.PO_STEP.RECEIVED) {
            key = "receiveTotal";
          } else if (record.step === Enum.PO_STEP.RETURN) {
            key = "returnTotal";
          }
          return this.formatCurrency(record[key]);
        }
      },
      {
        title: <this.Translate id="text_step" />,
        dataIndex: "step",
        key: "step",
        sorter: true,
        width: 100,
        render: step => step in this.PO_STEP_STR ? <this.Tag color={this.PO_STEP_STR[step].color} className="text-uppercase text-center po-step-tag">{this.PO_STEP_STR[step].name}</this.Tag> : ""
      }
    ];
    this.formCreate = <FormCreate/>;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.callBackOnDeleteRecord = 
    this.fetchingProp = "purchaseOrder";
    this.service = PurchaseService;
    this.componentHasUpdated = false;
    this.POEmailHasSend = false;

    this.PO_STEP_STR = {
      [Enum.PO_STEP.DRAFT]: {name: <this.Translate id="purchase_order_step_draff" />, color: this.Enum.PO_STEP_COLOR.DRAFT},
      [Enum.PO_STEP.PROCESS]: {name: <this.Translate id="purchase_order_step_process" />, color:  this.Enum.PO_STEP_COLOR.PROCESS},
      [Enum.PO_STEP.RECEIVED]: {name: <this.Translate id="text_received" />, color:  this.Enum.PO_STEP_COLOR.RECEIVE},
      [Enum.PO_STEP.CANCEL]: {name: <this.Translate id="text_cancel" />, color:  this.Enum.PO_STEP_COLOR.CANCEL},
      [Enum.PO_STEP.RETURN]: {name: <this.Translate id="text_returned" />, color:  this.Enum.PO_STEP_COLOR.RETURN},
      [Enum.PO_STEP.PAID]: {name: <this.Translate id="purchase_order_step_paid" />, color:  this.Enum.PO_STEP_COLOR.PAID}
    };

    this.supplierList = [{name: <this.Translate id="text_all_supplier"/>, id: 0}];
    this.columnFilterWithKey = ["name", "number", "invoiceNo", "shippingFee", "requestTotal", "returnTotal", "receiveTotal"];

    this.action = PurchaseAction;
    this.RESET_CONSTANT = Constant.RESET_PURCHASE_ORDER;
    this.getEmailPushToSupplier = this.getEmailPushToSupplier.bind(this);
    this.getEmailDataForSend = this.getEmailDataForSend.bind(this);
  }

  componentDidMount(){
    super.componentDidMount();
    this.props.dispatch(SupplierAction.fetch(100));
  }

  componentWillUpdate(nextProps) {
    if (nextProps.purchaseOrderAdd.added) {
      nextProps.dispatch(PurchaseAction.fetch(this.pageSize));
      nextProps.dispatch(PurchaseAction.reset());
    }

    if (nextProps.purchaseOrderUpdate.updated) {
      nextProps.dispatch(PurchaseAction.fetch(this.pageSize));
      nextProps.dispatch(PurchaseAction.reset(Constant.REQUEST_PURCHASE_ORDER_DETAIL_FULL_RESET));
      nextProps.dispatch(PurchaseAction.reset());
    }

    if (nextProps.purchaseOrderPushToSupplier.updated) {
      this.setState({
        modalConten: <POEmailTemplate
          data={this.state.dataForSendMail}/>
      });
      this.POEmailHasSend = false;
      nextProps.dispatch(PurchaseAction.fetch(this.pageSize));
      nextProps.dispatch(PurchaseAction.reset(Constant.PUSH_PURCHASE_ORDER_TO_SUPPLIER_RESET));
      nextProps.dispatch(PurchaseAction.reset(Constant.REQUEST_PURCHASE_ORDER_DETAIL_FULL_RESET));
    }

    // GET CONTENT TO SEND EMAIL PO
    let element = document.getElementById("po-email-template");
    if (element && !this.POEmailHasSend && this.state.emailForPushToSupplier) {
      element = `<html><head><title></title></head><body>${element.innerHTML}</body></html>`;
      nextProps.dispatch(EmailAction.send(element, this.state.emailForPushToSupplier, "Purchase Order"));
      this.POEmailHasSend = true;
      this.setState({
        modalConten: null
      });
    }

    // SAVE SETTING TO LOCALE STORAGE
    if (nextProps.storeLocation.fetched) {
      localStorage.setItem(Enum.LOCAL_SCHEMA.LOCATION, JSON.stringify(nextProps.storeLocation.list));
    }

    if (nextProps.supplier.fetched) {
      localStorage.setItem(Enum.LOCAL_SCHEMA.SUPPLIER, JSON.stringify(nextProps.supplier.list));
    }
  }

  componentDidUpdate() {
    if (!this.componentHasUpdated && this.props.purchaseOrder.fetched) {
      this.props.dispatch(LocationAction.fetch(100));
      this.componentHasUpdated = true;
    }

    if (this.props.purchaseOrderDetail.fetched) {
      this.setState({loadingPopup: false});
      this.props.dispatch(PurchaseAction.reset(Constant.REQUEST_PURCHASE_ORDER_DETAIL_RESET));
    }

    if (this.props.mail.sent) {
      this.props.dispatch(EmailAction.reset());
    }
  }

  getEmailPushToSupplier(emailForPushToSupplier) {
    this.setState({emailForPushToSupplier});
  }

  getEmailDataForSend(dataForSendMail) {
    this.setState({dataForSendMail});
  }

  showFormEdit(rowData) {
    this.props.dispatch(PurchaseAction.detail(rowData));  
    this.setState({
      loadingPopup: true,
      modalConten: <FormUpdate
        callBackGetEmail={this.getEmailPushToSupplier}
        callBackGetEmailData={this.getEmailDataForSend}/>
    });
  }

  handleDelete() {
    this.setState({deleting: true});
    PurchaseService.archive(this.state.selectedListIds)
      .then(response => {
        this.props.dispatch(PurchaseAction.fetch(this.pageSize, (this.state.current - 1) * this.pageSize));
        this.setState({
          selectedRowKeys: [],
          modalVisible: false,
          deleting: false
        });
      })
      .catch(err => {
        this.Message.error(this.CATranslate("error_warning_delete_po", this.props.locale));
        this.setState({deleting: false});
        this.setState({
          modalVisible: false,
          deleting: false
        });
      });
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

  renderFilterRecord() {
    const {form, locale} = this.props;

    const POStepList = Object.keys(this.PO_STEP_STR).map((prop) => {
      return {name: this.PO_STEP_STR[prop].name, value: prop};
    });
    POStepList.unshift({name: <this.Translate id="text_all_step"/>, value: -1});

    const fetchingProps = this.props[this.fetchingProp];
    return (
      form == null ?
        ""
        :
        <this.Form onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout">
            <this.Col md="2">
              <this.InputText
                name="key"
                label={<this.Translate id="purchase_order_search_key_place_holder" />}
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
                <label htmlFor="status" className="" title="">Filter</label>
              </div>
              <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
              </this.Button>
            </this.Col>
          </this.Row>
        </this.Form>
    );
  }

}