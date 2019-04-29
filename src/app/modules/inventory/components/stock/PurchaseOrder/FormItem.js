import React from "react";
import SearchPO from "./SearchPO";
import Enum from "../../../enums";
import Constant from "../../../constants/stock/purchaseOrder";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      suppliers: [],
      isAutoReceive: false
    };
    this.timer = null;
    this.handleCheckPONumber = this.handleCheckPONumber.bind(this);
    this.validateOrderNumber = "";
    this.errorMessageOrderNumber = "";
    this.handleOnChangeIsAutoReceive = this.handleOnChangeIsAutoReceive.bind(this);
  }

  componentDidMount(){
    this.setState({
      locations: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.LOCATION)),
      suppliers: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.SUPPLIER))
    });
  }

  handleCheckPONumber(event){
    this.validateOrderNumber = "";
    this.errorMessageOrderNumber = "";
    const PONumber = event.target.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.dispatch(PurchaseOrderAction.orderNumber(PONumber));
    }, 500);
  }

  handleOnChangeIsAutoReceive(event) {
    if (event.target.checked) {
      document.getElementById("btnModalSave").innerHTML = this.CATranslate("text_save_and_auto_send_receive", this.props.locale);
    } else {
      document.getElementById("btnModalSave").innerHTML = this.CATranslate("text_save", this.props.locale);
    }

  }

  render() {
    const {
      form,
      dispatch,
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

    let locationId = formData.locationId;
    if (!locationId && Array.isArray(this.state.locations)) {
      const defaultLocation = this.state.locations.find(location => location.isDefault === this.Enum.IS_DEFAULT);
      if (defaultLocation) {
        locationId = defaultLocation.id;
      }
    }
    
    return (
      <this.Row id="purchase-order-form">
        <this.Col md="12">
          <this.Row className="ca-penel-v1 wrap-po-filter-create">
            <this.Col md="4">
              <this.InputText
                name="name"
                label={<this.Translate id="text_name" />}
                data={formData.name}
                placeholder={this.CATranslate("text_name", locale)}
                errorRequired={<this.Translate id="error_require_name" />}
                required={true}
                isAutoFocus={true}
                max={100}
                form={form}/> 
            </this.Col>
            <this.Col md="2">
              <this.InputText
                name="number"
                label={<this.Translate id="input_stock_purchase_order_number" />}
                data={formData.number}
                // handleKeyUp={this.handleCheckPONumber}
                // validateStatus={this.props.requestOrderNumber.fetching ? "validating" : this.validateOrderNumber}
                // help={this.errorMessageOrderNumber}
                placeholder={this.CATranslate("input_stock_purchase_order_number", locale)}
                errorRequired={<this.Translate id="error_require_po_number" />}
                form={form} /> 
            </this.Col>
            <this.Col md="2">
              { formData.deliveryDueDate == null ?
                <this.DatePickers
                  name="deliveryDueDate"
                  label={<this.Translate id="text_due_date" />}
                  placeholder={this.CATranslate("text_due_date", locale)}
                  errorRequired={<this.Translate id="error_select_due_date" />}
                  form={form}/>
                :
                <this.DatePickers
                  name="deliveryDueDate"
                  defaultValue={this.Util.formatDatePicker(formData.deliveryDueDate)} 
                  label={<this.Translate id="text_due_date" />}
                  placeholder={this.CATranslate("text_due_date", locale)}
                  errorRequired={<this.Translate id="error_select_due_date" />}
                  form={form}/>
              }

            </this.Col>
            <this.Col md="2">
              <this.Select
                name="supplierId"
                label={<this.Translate id="text_supplier" /> }
                placeholder={this.CATranslate("text_supplier", locale)}
                errorRequired={<this.Translate id="error_require_supplier" />}
                defaultValue={formData.supplierId}
                dataSource={this.state.suppliers}
                valueKey="id"
                form={form}/>
            </this.Col>
            <this.Col md="2">
              <this.InputText
                name="invoiceNo"
                label={<this.Translate id="text_invoice_no" />}
                data={formData.invoiceNo}
                placeholder={this.CATranslate("text_invoice_no",locale)}
                max={100}
                form={form}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="locationId"
                label={<this.Translate id="text_delivery_to_location" />}
                placeholder={this.CATranslate("text_delivery_to_location", locale)}
                errorRequired={<this.Translate id="error_select_delivery_location" />}
                defaultValue={locationId}
                dataSource={this.state.locations}
                valueKey="id"
                form={form}/>
            </this.Col>
            <this.Col md="4" style={{marginTop: 25}}>
              <this.Checkboxs
                name="isAutoReceive" 
                label={<this.Translate id="text_auto_send_receive"/>}
                onChange={this.handleOnChangeIsAutoReceive}
                form={this.props.form}/>
            </this.Col>
          </this.Row>
        </this.Col>
        <this.Col md="12" className="purchase-order-entry">
          <SearchPO
            dataSource={productSearch}
            productVariant={this.props.productVariant}
            purchaseOrderEntries={formData.purchaseOrderEntries}
            locale={locale}
            dispatch={dispatch}
            form={form} />
        </this.Col>
      </this.Row>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    supplierid:"",
    purchaseOrderEntries: []
  },
  productSearch: []
};