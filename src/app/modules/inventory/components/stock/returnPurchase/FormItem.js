import React from "react";
import SupplierAction from "../../../actions/stock/supplier";
import LocationAction from "../../../../pos/action/settings/storeLocation";
import Modal from "../../../../common/components/shares/Modal";
import ReturnPoList from "./ReturnPoList";

export default class FormItem extends Modal {

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(SupplierAction.fetch());
    dispatch(LocationAction.fetch());
  }


  render() {
    const { form,formData,storeLocation,supplier} = this.props;
    return (
      <div id="purchase-order-form">
        <this.Row>
          <this.Col md="2">
            <label><this.Translate id="input_stock_purchase_order_name" /> </label><br/>
            <label><b>{formData.name}</b></label>  
          </this.Col>
          <this.Col md="2">
            <label><this.Translate id="input_stock_purchase_order_number" /></label><br/>
            <label><b>{formData.number}</b></label>  
          </this.Col>
          <this.Col md="2">
            <label><this.Translate id="input_stock_purchase_invoice_no" /></label><br/>
            <label><b>{formData.invoiceNo}</b></label>  
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="supplierid"
              label={<this.Translate id="select_stock_receive_purchase_from_supplier" />}
              placeholder={<this.Translate id="select_stock_receive_purchase_from_supplier" />}
              dataSource={supplier.list}
              defaultValue={formData.supplierId}
              valueKey="id"
              form={form}
              disabled
            />
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="locationId"
              label={<this.Translate id="select_stock_receive_delivery_to_location" />}
              placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
              dataSource={storeLocation.list}
              defaultValue={formData.locationId}
              valueKey="id"
              form={form}
            />
          </this.Col>
          <this.Col md="2">
            <label><this.Translate id="input_stock_receive_shipping_fee" /></label><br/>
            <label><b>{formData.shippingFee}</b></label>  
          </this.Col>
          
          <this.Col md="2">
            <label><this.Translate id="date_picker_stock_purchase_due_date" /></label><br/>
            <label><b>{this.formatDate(formData.deliveryDueDate)}</b></label>  
          </this.Col>          
        </this.Row>
        <this.Row>
          <this.Col md="12"  className="purchase-order-entry">
            <ReturnPoList
              returnPurchaseDetail={formData.purchaseOrderEntries}
              form={this.props.form} 
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
    receivePurchaseid:""
  }
};