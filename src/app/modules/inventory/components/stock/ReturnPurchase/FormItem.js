import React from "react";
import ReturnPoList from "./ReturnPOList";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      locations: [],
      suppliers: []
    };
  }
  componentDidMount(){
    this.setState({
      locations: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.LOCATION)),
      suppliers: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.SUPPLIER))
    });
  }

  render() {
    const {form, formData} = this.props;
    return (
      <div id="return-order-form">
        <this.Row className="ca-penel-v1 wrap-po-filter">
          <this.Col md="2">
            <this.InputText
              name="name"
              label={<this.Translate id="text_name" />}
              data={formData.name}
              disabled={true}
              form={this.props.form}/>
          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="number"
              label={<this.Translate id="text_number" />}
              data={formData.number}
              disabled={true}
              form={this.props.form}/>
          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="invoice"
              label={<this.Translate id="text_supplier_invoice" />}
              data={formData.number}
              disabled={true}
              form={this.props.form}/>
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="supplierid"
              label={<this.Translate id="select_stock_receive_purchase_from_supplier" />}
              placeholder={<this.Translate id="select_stock_receive_purchase_from_supplier" />}
              dataSource={this.state.suppliers}
              defaultValue={formData.supplierId}
              valueKey="id"
              form={form}
              disabled/>
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="locationId"
              label={<this.Translate id="select_stock_receive_delivery_to_location" />}
              placeholder={<this.Translate id="placeholder_table_purchase_place_holder" />}
              dataSource={this.state.locations}
              defaultValue={formData.locationId}
              valueKey="id"
              form={form}/>
          </this.Col>
          <this.Col md="2">
            <this.InputNumber
              name="shipping_fee"
              label={<this.Translate id="text_shipping_fee" />}
              data={this.formatCurrency(formData.shippingFee)}
              disabled={true}
              form={this.props.form}/>
          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="deliveryDueDate"
              label={<this.Translate id="text_due_date" />}
              data={this.Util.formatDate(formData.deliveryDueDate)}
              disabled={true}
              form={this.props.form}/>
          </this.Col>          
        </this.Row>
        <this.Row>
          <this.Col md="12" className="purchase-order-entry">
            <ReturnPoList
              returnPurchaseDetail={formData.purchaseOrderEntries}
              form={this.props.form} />
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