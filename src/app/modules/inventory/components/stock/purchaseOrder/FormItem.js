import React from "react";
import SearchPo from "./SearchPo";
import Constant from "../../../constants/stock/purchaseOrder";
import SupplierAction from "../../../actions/stock/supplier";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import StoreLoctionAction from "../../../../pos/action/settings/storeLocation";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.timer = null;
    this.changeSupplierEmailValue = this.changeSupplierEmailValue.bind(this);
    this.handleCheckPONumber = this.handleCheckPONumber.bind(this);

    this.validateOrderNumber = "";
    this.errorMessageOrderNumber = "";

  }

  changeSupplierEmailValue(values){
    this.dispatch(SupplierAction.detail(values));
  }

  handleCheckPONumber(event){
    this.validateOrderNumber = "";
    this.errorMessageOrderNumber = "";
    const PONumber = event.target.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.dispatch(PurchaseOrderAction.orderNumber(PONumber));
    }, 200);
  }

  componentDidMount(){
    const {dispatch} = this.props;
    dispatch(SupplierAction.fetch(10));
    dispatch(StoreLoctionAction.fetch(10));
  }


  render() {
    const {
      form,
      dispatch,
      supplier,
      storeLocation,
      locale,
      formData,
      productSearch,
      requestOrderNumber
    } = this.props;
    
    if(requestOrderNumber.error) {
      if (requestOrderNumber.error.response &&
        requestOrderNumber.error.response.data &&
        requestOrderNumber.error.response.data.error
      ) {
        if (requestOrderNumber.error.response.data.error.code === this.HttpCode.PO_NUMBER_ALREADY_EXIST) {
          this.errorMessageOrderNumber = <this.Translate id="purchase_order_po_number_already_exist" />;
          this.validateOrderNumber = "error";
          this.dispatch(PurchaseOrderAction.reset(Constant.RESET_REQUEST_PURCHASE_ORDER_NUMBER));
        }
      }
    }
    
    return (
      <div id="purchase-order-form">
        <this.Row>
          <this.Col md="2">
            <this.InputText
              name="name"
              label={<this.Translate id="input_stock_purchase_order_name" />}
              data={formData.name}
              placeholder={this.CATranslate("input_stock_purchase_order_name", locale)}
              required={true}
              max={100}
              form={form}/> 
          </this.Col>
          <this.Col md="2">
            { formData.deliveryDueDate == null ?

              <this.DatePickers
                name="deliveryDueDate"
                defaultValue=""
                label={<this.Translate id="date_picker_stock_purchase_due_date" />}
                placeholder={this.CATranslate("date_picker_stock_purchase_due_date", locale)}
                required={true}
                form={form}
              />
              :
              <this.DatePickers
                name="deliveryDueDate"
                defaultValue={ this.Util.formatDatePicker(formData.deliveryDueDate) } 
                label={<this.Translate id="date_picker_stock_purchase_due_date" />}
                placeholder={this.CATranslate("date_picker_stock_purchase_due_date", locale)}
                required={true}
                form={form}
              />

            }

          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="number"
              label={<this.Translate id="input_stock_purchase_order_number" />}
              data={formData.number}
              handleKeyUp={this.handleCheckPONumber}
              validateStatus={this.props.requestOrderNumber.fetching ? "validating" : this.validateOrderNumber}
              placeholder={this.CATranslate("input_stock_purchase_order_number", locale)}
              form={form}
              help={this.errorMessageOrderNumber}/> 
          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="invoiceNo"
              label={<this.Translate id="input_stock_purchase_invoice_no" />}
              data={formData.invoiceNo}
              placeholder={this.CATranslate("input_stock_purchase_invoice_no",locale)}
              max={100}
              form={form}/>
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="supplierId"
              label={<this.Translate id="select_stock_purchase_order_from_supplier" /> }
              placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
              defaultValue={formData.supplierId}
              dataSource={supplier.list}
              valueKey="id"
              required={true}
              form={form}
              onChange={this.changeSupplierEmailValue}
            />
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="locationId"
              label={<this.Translate id="input_stock_purchase_order_delivery_to_location" />}
              defaultValue={formData.locationId}
              placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
              dataSource={storeLocation.list}
              valueKey="id"
              required={true}
              form={form}
            />
          </this.Col>
        </this.Row>
        <this.Row>
          <this.Col md="12" className="purchase-order-entry">
            <SearchPo
              dataSource={productSearch}
              purchaseOrderEntries={formData.purchaseOrderEntries}
              locale={locale}
              dispatch={dispatch}
              form={form}
            />
          </this.Col>
        </this.Row>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    description:"",
    status: 1,
    supplierid:"",
    purchaseOrderEntries: []
  },
  productUpdate:[],
  productSearch: [],
  PurchseOrderNumber: []
};