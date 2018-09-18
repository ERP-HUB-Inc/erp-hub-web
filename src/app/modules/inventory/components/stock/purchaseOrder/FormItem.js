import React from "react";
import ProductsAction from "../../../actions/products/product";
import Constant from "../../../constants/stock/purchaseOrder";
import SupplierAction from "../../../actions/stock/supplier";
import PurchaseOrderService from "../../../services/stock/PurchaseOrderService";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import StoreLoctionAction from "../../../../pos/action/settings/storeLocation";
import SearchPo from "./SearchPo";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.timer = null;
    this.ChangeSupplierEmailValue = this.ChangeSupplierEmailValue.bind(this);
    this.orderNumber = this.orderNumber.bind(this);

    this.validateOrderNumber="";
    this.errorMessageOrderNumber = "";

  }

  ChangeSupplierEmailValue(values){
    this.dispatch(SupplierAction.detail(values));
  }
  
  productList(){
    return(
      this.props.product.list
    );
  }

  // check ordernumber if exist
  orderNumber(e){
    clearTimeout(this.timer);
    this.timer  =  setTimeout(() => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        this.dispatch(PurchaseOrderAction.orderNumber(values.number));
      });
    }, 1000);
  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(ProductsAction.fetch(10));
    dispatch(SupplierAction.fetch(10));
    dispatch(StoreLoctionAction.fetch(10));
  }


  render() {
    const { form, dispatch, supplier, storeLocation, locale, formData, productSearch, purchaseOrderNumber } = this.props;
    

    let PurchseOrderNumber = purchaseOrderNumber;

    if(PurchseOrderNumber == null || PurchseOrderNumber.error == null) { 
      PurchseOrderNumber = [];
    }

    if(purchaseOrderNumber.error !== null ) { 
      const {error} = purchaseOrderNumber.error.data;
      if (error.code === this.HttpCode.PO_NUMBER_ALREADY_EXIST) {
        this.errorMessageOrderNumber = "PO is already Exist";
        this.validateOrderNumber = "error";
        this.dispatch(PurchaseOrderAction.reset(Constant.RESET_REQUEST_PURCHASE_ORDER_NUMBER));
        
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
                form={form}
              />
              :
              <this.DatePickers
                name="deliveryDueDate"
                defaultValue={ this.Util.formatDatePicker(formData.deliveryDueDate) } 
                label={<this.Translate id="date_picker_stock_purchase_due_date" />}
                placeholder={this.CATranslate("date_picker_stock_purchase_due_date", locale)}
                form={form}
              />

            }

          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="number"
              label={<this.Translate id="input_stock_purchase_order_number" />}
              data={formData.number}
              handleKeyUp={this.orderNumber}
              placeholder={this.CATranslate("input_stock_purchase_order_number", locale)}
              form={form}
              help={this.errorMessageOrderNumber}
              validateStatus={this.validateOrderNumber}
            /> 
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
              form={form}
              onChange={this.ChangeSupplierEmailValue}
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