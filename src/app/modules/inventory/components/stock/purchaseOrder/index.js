import React from "react";
import List from "../List";
import Enum from "../../../enums";
import FormCreate from "../../../containers/stock/purchaseOrder/FormCreate";
import FormUpdate from "../../../containers/stock/purchaseOrder/FormUpdate";
import Constant from "../../../constants/stock/purchaseOrder";
import PurchaseAction from "../../../actions/stock/purchaseOrder";
import SupplierAction from "../../../actions/stock/supplier";
import PurchaseService from "../../../services/stock/PurchaseOrderService";
import "./index.css";

export default class PurchaseOrderLists extends List {
  constructor(props) {
    super(props);
    this.columns = [
      this.columnCreatedAt,
      {
        title: <this.Translate id="col_stock_purchase_order_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true,
        render: (text, record, index) => {
          return <div>
            <div>{record.name}</div>
            <div>{<this.Translate id="purchase_order_number_text"/>}: {record.number}</div>
          </div>;
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_reference" />,
        dataIndex: "referenceId",
        key: "referenceId",
        sorter: true,
        render: (text, record, index) => {
          let referenceNo = "";
          if ("reference" in record && record["reference"] != null) {
            referenceNo = record["reference"]["number"];
          }
          return referenceNo;
        }
      },
      {
        title: <this.Translate id="col_stock_purchase_order_supplier" />,
        dataIndex: "supplier",
        key: "supplier",
        sorter: true,
        render: supplier => supplier ? supplier.name: ""
      },
      {
        title: <this.Translate id="col_stock_purchase_order_stock_location" />,
        dataIndex: "location",
        key: "location",
        sorter: true,
        render: location => location ? location.name: ""
      },
      {
        title: <this.Translate id="col_stock_purchase_order_due_date" />,
        dataIndex: "deliveryDueDate",
        key: "deliveryDueDate",
        sorter: true,
        width: 140,
        render: deliveryDueDate => this.formatDate(deliveryDueDate)
      },
      {
        title: <this.Translate id="col_stock_purchase_order_shipping_fee" />,
        dataIndex: "shippingFee",
        key: "shippingFee",
        sorter: true,
        width: 120,
        render: shippingFee => this.formatCurrency(shippingFee)
      },
      {
        title: <this.Translate id="col_stock_purchase_order_total" />,
        dataIndex: "requestTotal",
        key: "requestTotal",
        sorter: true,
        width: 120,
        align: "left",
        render: requestTotal => this.formatCurrency(requestTotal)
      },
      {
        title: <this.Translate id="col_stock_purchase_order_step" />,
        dataIndex: "step",
        key: "step",
        sorter: true,
        width: 100,
        render: step => step in this.PO_STEP_STR ? <this.Tag color={this.PO_STEP_STR[step].color} className="text-uppercase text-center po-step-tag">{this.PO_STEP_STR[step].name}</this.Tag> : ""
      },
      this.columnStatus
    ];
    this.fetchingProp = "purchaseOrder";
    this.service = PurchaseService;

    this.PO_STEP_STR = {
      [Enum.PO_STEP.DRAFT]: {name: <this.Translate id="purchase_order_step_draff" />, color: "#f50"},
      [Enum.PO_STEP.PROCESS]: {name: <this.Translate id="purchase_order_step_process" />, color: "#2db7f5"},
      [Enum.PO_STEP.RECEIVED]: {name: <this.Translate id="purchase_order_step_recieve" />, color: "#87d068"},
      [Enum.PO_STEP.CANCEL]: {name: <this.Translate id="purchase_order_step_cancel" />, color: "#108ee9"},
      [Enum.PO_STEP.RETURN]: {name: <this.Translate id="purchase_order_step_return" />, color: "blue"},
      [Enum.PO_STEP.PAID]: {name: <this.Translate id="purchase_order_step_paid" />, color: "green"},
    };

    this.supplierList = [{name: <this.Translate id="select_stock_purchase_order_supplier"/>, id: 0}];
    this.columnFilterWithKey = [
      "name",
      "number",
      "invoiceNo",
      "supplierId",
      "deliveryDueDate"
    ];

    this.action = PurchaseAction;
    this.RESET_CONSTANT = Constant.RESET_PURCHASE_ORDER;
  }

  componentDidMount(){
    const {dispatch} = this.props;
    dispatch(SupplierAction.fetch());
    dispatch(PurchaseAction.fetch(this.pageSize));
  }

  componentWillUpdate(nextProps) {
    const {purchaseOrderAdd,
      purchaseOrderUpdate,
      purchaseOrderPushToSupplier,
      dispatch
    } = nextProps;

    if (purchaseOrderAdd.added) {
      dispatch(PurchaseAction.fetch(this.pageSize));
      dispatch(PurchaseAction.reset());
    }

    if (purchaseOrderUpdate.updated) {
      dispatch(PurchaseAction.fetch(this.pageSize));
      dispatch(PurchaseAction.reset(Constant.REQUEST_PURCHASE_ORDER_DETAIL_FULL_RESET));
    }

    if (purchaseOrderPushToSupplier.updated) {
      dispatch(PurchaseAction.fetch(this.pageSize));
      dispatch(PurchaseAction.reset(Constant.PUSH_PURCHASE_ORDER_TO_SUPPLIER_RESET));
      dispatch(PurchaseAction.reset(Constant.REQUEST_PURCHASE_ORDER_DETAIL_FULL_RESET));
    }
  }

  handleShowFormAdd() {
    const {dispatch} = this.props;
    dispatch(PurchaseAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const {dispatch} = this.props;
    dispatch(PurchaseAction.detail(rowData, this.getCurrentLanguageCode()));  
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  handleDelete() {
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
        this.setState({deleting: false});
        this.setState({
          modalVisible: false,
          deleting: false
        });
        this.Message.info("Can not delete purchse order but can return");
      });
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const {dispatch} = this.props;
          let filter = {};
          let rangFilter = {};
          if (values.step !== -1) {
            filter["step"] = [values.step];
          }

          if (values.supplierId !== 0) {
            filter["supplierId"] = [values.supplierId];
          }

          if (values.deliveryDueDate) {
            values.deliveryDueDate = this.Util.formatDate(values.deliveryDueDate, "YYYY-MM-DD");
            rangFilter = JSON.stringify({column: "deliveryDueDate", value: [values.deliveryDueDate, values.deliveryDueDate]});
          }
    
          filter = JSON.stringify(filter);

          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, rangFilter));
          this.setState({isClickFilter: true});
        }
      
      }); 
    } 
  }

  renderFilterRecord() {
    const {form, locale, supplier} = this.props;

    const POStepList = Object.keys(this.PO_STEP_STR).map((prop) => {
      return {name: this.PO_STEP_STR[prop].name, value: prop};
    });
    POStepList.unshift({name: <this.Translate id="select_purchase_all_step"/>, value: -1});

    if(supplier) {
      const fetchingProps = this.props[this.fetchingProp];
      return(
        form == null ?
          ""
          :
          <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
            <this.Row className="main-search-layout form-group">
              <this.Col md="2">
                <this.InputText
                  name="key"
                  label={<this.Translate id="input_stock_purchase_key" />}
                  placeholder={this.CATranslate("purchase_order_search_key_place_holder", locale)}
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="supplierId"
                  label={<this.Translate id="select_stock_purchase_order_from_supplier" /> }
                  placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
                  dataSource={this.supplierList.concat(supplier.list)}
                  defaultValue={this.supplierList[0].id}
                  valueKey="id"
                  form={form}/>
              </this.Col>
              <this.Col md="2">
                <this.DatePickers
                  name="deliveryDueDate"
                  label={<this.Translate id="datepicker_stock_purchase_due_date" />}
                  form={form}
                />
              </this.Col>
              <this.Col md="2">
                <this.Select
                  name="step"
                  label={<this.Translate id="select_stock_purchase_order_step" />}
                  placeholder="Please select status"
                  dataSource={POStepList}
                  defaultValue={POStepList[0].value}
                  form={form}
                />
              </this.Col>
              <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
              </this.Button>
            </this.Row>
          </this.Form>
      );

    }
  }

}