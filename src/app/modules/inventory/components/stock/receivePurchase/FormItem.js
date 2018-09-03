import React from "react";
import SupplierAction from "../../../actions/stock/supplier";
import ProductsAction from "../../../actions/products/product";
import LocationAction from "../../../../pos/action/settings/storeLocation";
import { Modal  } from "../../shares/Modal/modal";

export default class FormItem extends Modal {
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(SupplierAction.fetch());
    dispatch(ProductsAction.fetch(this.pageSize));
    dispatch(LocationAction.fetch());
  }

  render() {
    const { form,locale,formData,supplier,product,storeLocation } = this.props;
    const {
      getFieldDecorator,
      getFieldValue
    } = this.props.form;
  
    return (
      <div>
        <this.Row>
          <this.Col md="2">
            <this.InputText
              name="name"
              label={<this.Translate id="input_stock_purchase_order_name" />}
              data={formData.name}
              placeholder={this.CATranslate("input_stock_purchase_order_name", locale)}
              required={true}
              max={100}
              min={3}
              form={form}/> 
          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="number"
              label={<this.Translate id="input_stock_purchase_order_number" />}
              handleKeyUp={this.orderNumber}
              placeholder={this.CATranslate("input_stock_purchase_order_number", locale)}
              form={form}/> 
          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="invoiceNo"
              label={<this.Translate id="input_stock_purchase_invoice_no" />}
              placeholder={this.CATranslate("input_stock_purchase_invoice_no",locale)}
              max={100}
              min={3}
              form={form}/>
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="supplierid"
              label={<this.Translate id="select_stock_purchase_order_from_supplier" />}
              placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
              dataSource={supplier.list}
              valueKey="id"
              form={form}
            />
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="locationId"
              label={<this.Translate id="select_stock_purchase_delivery_to_location" />}
              placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
              dataSource={storeLocation.list}
              valueKey="id"
              form={form}
            />
          </this.Col>
          <this.Col md="2">
            <this.InputNumber
              name="shippingFee"
              label={<this.Translate id="input_stock_receive_shipping_fee" />}
              placeholder={this.CATranslate("input_stock_purchase_invoice_no",locale)}
              max={100}
              min={3}
              form={form}/>
          </this.Col>
          
          <this.Col md="2">
            <this.DatePickers
              name="deliveryDueDate"
              data={formData.dueDate}
              label={<this.Translate id="date_picker_stock_purchase_due_date" />}
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
    supplierid:""
  }
};