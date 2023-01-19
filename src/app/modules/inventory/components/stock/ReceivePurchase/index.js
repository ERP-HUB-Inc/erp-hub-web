import React from "react";
import List from "../List";
import Enum from "../../../enums";
import FormUpdate from "../../../containers/stock/ReceivePurchase/FormUpdate";
import Constant from "../../../constants/stock/receivePurchase";
import ReceivePurchaseAction from "../../../actions/stock/receivePurchase";
import SupplierAction from "../../../actions/stock/supplier";
import LocationAction from "../../../../pos/action/settings/location";
import ReceivePurchaseService from "../../../services/stock/ReceivePurchaseService";
import "./index.css";

export default class ReceivePurchaseList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      suppliers: []
    };
    this.supplierList = [{name: <this.Translate id="text_all_supplier"/>, id: 0}];
    this.columns = [
      this.columnCreatedAt,
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true
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
        title: <this.Translate id="text_invoice_no" />,
        dataIndex: "invoiceNo",
        width: 150,
        key: "invoiceNo",
        sorter: true
      },
      {
        title: <this.Translate id="text_due_date" />,
        dataIndex: "deliveryDueDate",
        key: "deliveryDueDate",
        width: 180,
        sorter: true,
        render: deliveryDueDate => this.formatDate(deliveryDueDate)
      },
      {
        title: <this.Translate id="text_shipping_fee" />,
        dataIndex: "shippingFee",
        width: 150,
        align: "right",
        key: "shippingFee",
        render: shippingFee => this.formatCurrency(shippingFee),
        sorter: true
      },
      {
        title: <this.Translate id="text_items" />,
        dataIndex: "purchaseOrderEntries",
        key: "purchaseOrderEntries",
        width: 100,
        align: "center",
        render: purchaseOrderEntries => this.Util.sumBy(purchaseOrderEntries, "requestQuantity")
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "requestTotal",
        width: 130,
        key: "requestTotal",
        align: "right",
        sorter: true, 
        render: requestTotal => this.formatCurrency(requestTotal) 
      },
      {
        title: <this.Translate id="text_action" />,
        dataIndex: "id",
        key: "action",
        align: "center",
        width: 100,
        render: id => <this.Button
          type="info"
          id="btnAdd"
          className="mg-right"
          onClick={() => this.handleShowFormEdit({id})}>
          <span className="icon-completed icon-padding-right"></span>
          <this.Translate id="text_receive"/>
        </this.Button>
      }
    ];
    this.ExportheadersCsv = [{label: "Date", key: "createdAt"},
      {label: "Name", key: "name"},
      {label: "Invoice No", key: "invoiceNo"},
      {label: "Due Date", key: "deliveryDueDate"},
      {label: "Shipping", key: "shippingFee"},
      {label: "Total", key: "receiveTotal"}
    ];
    this.callBackOnShowEditForm = this.showFormEdit;
    this.exportCsvFileName = "receive_purchase.csv";  
    this.fetchingProp = "receivePurchase";
    this.service = ReceivePurchaseService;
    this.columnFilterWithKey = ["name", "number", "invoiceNo", "shippingFee", "requestTotal", "returnTotal", "receiveTotal"];
    this.action = ReceivePurchaseAction;
    this.showExport = true;
    this.componentHasUpdated = false;
    this.RESET_CONSTANT = Constant.RESET_RECEIVE_PURCHASE;
  }

  componentDidMount(){
    super.componentDidMount();
    this.props.dispatch(SupplierAction.fetch(100));
  }

  componentWillUpdate(nextProps) {
    if (nextProps.receivePurchaseUpdate.updated) {
      this.props.dispatch(ReceivePurchaseAction.fetch(this.pageSize));
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
    if (!this.componentHasUpdated && this.props.receivePurchase.fetched) {
      this.props.dispatch(LocationAction.fetch(100));
      this.componentHasUpdated = true;
    }
  }

  showFormEdit(rowData) {
    this.props.dispatch(ReceivePurchaseAction.detail(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  renderActionButton(){
    return(
      this.renderButtonExportCSV()    
    );
  }

  handleSubmitFilter(e){
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          let rangFilter = {};

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
    const {form, locale } = this.props;
    const fetchingProps = this.props[this.fetchingProp];
    return(
      <this.Form onSubmit={this.handleSubmitFilter}>
        <this.Row className="main-search-layout">
          <this.Col md="2">
            <this.InputText
              name="key"
              label={<this.Translate id="text_search" />}
              placeholder={this.CATranslate("text_po_receive_general_search", locale)}
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
          <this.Col md="2" className="wrap-btn-search">
            <div className="ant-form-item-label" style={{visibility: "hidden"}}>
              <label htmlFor="status" className="" title="">Filter</label>
            </div>
            <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
              <span className="icon-search icon-padding-right"></span><this.Translate id="button_text_search" />
            </this.Button>
          </this.Col>
        </this.Row>
      </this.Form>);

  }

}