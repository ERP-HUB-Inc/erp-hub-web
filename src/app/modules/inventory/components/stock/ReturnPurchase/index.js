import React from "react";
import List from "../List";
import Enum from "../../../enums";
import FormUpdate from "../../../containers/stock/ReturnPurchase/FormUpdate";
import Constant from "../../../constants/stock/returnPurchase";
import LocationAction from "../../../../pos/action/settings/storeLocation";
import SupplierAction from "../../../actions/stock/supplier";
import ReturnPurchaseAction from "../../../actions/stock/returnPurchase";
import ReturnPurchaseService from "../../../services/stock/ReturnPurchaseService";
import "./index.css";

export default class ReturnPurchaseList extends List {
  constructor(props) {
    super(props);
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
        key: "invoiceNo",
        width: 150,
        sorter: true
      },
      {
        title: <this.Translate id="text_due_date" />,
        dataIndex: "deliveryDueDate",
        key: "deliveryDueDate",
        width: 160,
        sorter: true,
        render: deliveryDueDate => this.formatDate(deliveryDueDate)
      },
      {
        title: <this.Translate id="text_shipping_fee" />,
        dataIndex: "shippingFee",
        key: "shippingFee",
        width: 150,
        align: "right",
        sorter: true,
        render: shippingFee => this.formatCurrency(shippingFee)
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
        dataIndex: "returnTotal",
        key: "returnTotal",
        width: 130,
        align: "right",
        sorter: true,
        render: returnTotal => this.formatCurrency(returnTotal) 
      },
      {
        title: <this.Translate id="text_action" />,
        dataIndex: "id",
        key: "action",
        align: "center",
        width: 100,
        render: id => <this.Tag onClick={() => this.handleShowFormEdit({id})} color="blue" className="text-uppercase text-center po-step-tag"><this.Translate id="text_return"/></this.Tag>
      }
    ];
    this.supplierList = [{name: <this.Translate id="text_all_supplier"/>, id: 0}];
    this.ExportheadersCsv = [
      {label: "Date", key: "createdAt"},
      {label: "Name", key: "name"},
      {label: "Invoice No", key: "invoiceNo"},
      {label: "Due Date", key: "deliveryDueDate"},
      {label: "Shipping", key: "shippingFee"},
      {label: "Total", key: "returnTotal"}
    ];
    this.callBackOnShowEditForm = this.showFormEdit;
    this.componentHasUpdated = false;
    this.exportCsvFileName = "stock_return.csv"; 
    this.fetchingProp = "returnPurchase";
    this.service = ReturnPurchaseService;
    this.columnFilterWithKey = ["name", "number", "invoiceNo", "shippingFee", "requestTotal", "returnTotal", "receiveTotal"];
    this.action = ReturnPurchaseAction;
    this.RESET_CONSTANT = Constant.RESET_RETURN_PURCHASE;
  }

  componentDidMount() {
    super.componentDidMount();
    this.props.dispatch(SupplierAction.fetch(100));
  }

  componentWillUpdate(nextProps) {
    if (nextProps.returnPurchaseUpdate.updated) {
      this.props.dispatch(ReturnPurchaseAction.fetch(this.pageSize));
      nextProps.dispatch(ReturnPurchaseAction.reset());
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
    if (!this.componentHasUpdated && this.props.returnPurchase.fetched) {
      this.props.dispatch(LocationAction.fetch(100));
      this.componentHasUpdated = true;
    }
  }

  showFormEdit(rowData) {
    this.props.dispatch(ReturnPurchaseAction.detail(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }
  

  renderActionButton(){
    return this.renderButtonExportCSV();
  }

  handleSubmitFilter(e) {
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
            values.deliveryDueDate = this.Util.formatDate(values.deliveryDueDate, "YYYY-MM-DD");
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
    return (
      <this.Form onSubmit={this.handleSubmitFilter}>
        <this.Row className="main-search-layout">
          <this.Col md="2">
            <this.InputText
              name="key"
              label={<this.Translate id="text_key" />}
              placeholder={this.CATranslate("stock_purchase_search_key_place_holder", locale)}
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
              form={form}/>
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