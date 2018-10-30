import React from "react";
import ReceivePO from "./ReceivedPoList";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";
import "./index.css";


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
    const {formData} = this.props;
    return (
      <div id="purchase-receive-form">
        <this.Row className="ca-penel-v1 wrap-po-filter">
          <this.Col md="2">
            <this.InputText
              name="name"
              label={<this.Translate id="text_name" />}
              data={this.props.formData.name}
              disabled={true}
              form={this.props.form}/>
          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="number"
              label={<this.Translate id="text_number" />}
              data={this.props.formData.number}
              disabled={true}
              form={this.props.form}/>
          </this.Col>
          <this.Col md="2">
            <this.InputText
              name="invoiceNo"
              label={<this.Translate id="text_supplier_invoice" />}
              data={this.props.formData.invoiceNo}
              placeholder={this.CATranslate("text_supplier_invoice", this.props.locale)}
              max={100}
              min={3}
              isAutoFocus={true}
              form={this.props.form}/>
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="supplierId"
              label={<this.Translate id="select_stock_receive_purchase_from_supplier" />}
              dataSource={this.state.suppliers}
              defaultValue={formData.supplierId}
              valueKey="id"
              form={this.props.form}/>
          </this.Col>
          <this.Col md="2">
            <this.Select
              name="locationId"
              label={<this.Translate id="select_stock_receive_delivery_to_location" />}
              dataSource={this.state.locations}
              defaultValue={formData.locationId}
              valueKey="id"
              form={this.props.form}/>
          </this.Col>
          <this.Col md="2">
            <this.InputNumber
              name="shippingFee"
              label={<this.Translate id="text_shipping_fee" />}
              data={this.props.formData.shippingFee}
              placeholder={this.CATranslate("text_shipping_fee", this.props.locale)}
              max={100}
              min={3}
              isAutoSelect={true}
              form={this.props.form}/>
          </this.Col>
          <this.Col md="2" className="wrap-due-date">
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
            <ReceivePO 
              receivePurchaseDetail={formData.purchaseOrderEntries}
              form={this.props.form}/>
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