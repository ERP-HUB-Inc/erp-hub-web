import React from "react";
import SupplierAction from "../../../actions/stock/supplier";
import LocationAction from "../../../../pos/action/settings/storeLocation";
import Modal from "../../../../common/components/shares/Modal";
import ReceivePo from "./ReceivedPoList";

export default class FormItem extends Modal {

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(SupplierAction.fetch());
    dispatch(LocationAction.fetch());
  }


  render() {
    const { form,locale,formData,storeLocation,supplier} = this.props;
    return (
      <div>
        <this.Row>
          <this.Col md="2">
            <label><this.Translate id="input_stock_purchase_order_name" /></label><br/>
            <label><b>{formData.name}</b></label> 
          </this.Col>
          <this.Col md="2">
            <label><this.Translate id="input_stock_purchase_order_number" /></label><br/>
            <label><b>{formData.number}</b></label> 
          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="invoiceNo"
              label={<this.Translate id="input_stock_purchase_invoice_no" />}
              data={formData.invoiceNo}
              placeholder={this.CATranslate("input_stock_purchase_invoice_no",locale)}
              max={100}
              min={3}
              form={form}/>
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
            <this.InputNumber
              name="shippingFee"
              label={<this.Translate id="input_stock_receive_shipping_fee" />}
              placeholder={this.CATranslate("input_stock_receive_shipping_fee",locale)}
              max={100}
              min={3}
              dataSource={formData.shippingFee}
              form={form}/>
          </this.Col>
          
          <this.Col md="2">
            <label><this.Translate id="date_picker_stock_purchase_due_date" /></label><br/>
            <label><b>{formData.deliveryDueDate}</b></label> 
          </this.Col>          
        </this.Row>
        <this.Row>
          <this.Col md="12">
            <ReceivePo 
              receivePurchaseDetail={formData.purchaseOrderEntries}
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