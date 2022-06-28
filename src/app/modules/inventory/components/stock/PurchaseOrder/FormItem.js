import React from "react";
import SearchPO from "./SearchPO";
import Enum from "../../../enums";
import Constant from "../../../constants/stock/purchaseOrder";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import SupplierAction from "../../../actions/stock/supplier";
import UnitAction from "../../../actions/products/productsUnit";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      isAutoReceive: false
    };
    this.timer = null;
    this.handleCheckPONumber = this.handleCheckPONumber.bind(this);
    this.validateOrderNumber = "";
    this.errorMessageOrderNumber = "";
    this.handleOnChangeIsAutoReceive = this.handleOnChangeIsAutoReceive.bind(this);
  }

  componentDidMount() {
    const isAutoReceive = parseInt(localStorage.getItem(Constant.IS_AUTO_RECEIVE_STOCK_KEY), 10) === Enum.IS_AUTO_RECEIVE_STOCK;
    this.setState({
      locations: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.LOCATION)),
      isAutoReceive
    });
    this.props.dispatch(SupplierAction.fetch(500, 0));
    this.props.dispatch(UnitAction.fetch(100,0));
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
      localStorage.setItem(Constant.IS_AUTO_RECEIVE_STOCK_KEY, Enum.IS_AUTO_RECEIVE_STOCK);
    } else {
      localStorage.removeItem(Constant.IS_AUTO_RECEIVE_STOCK_KEY);
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
        <this.Col md="4">
          <this.InputText
            name="name"
            label={<this.Translate id="text_description" />}
            data={formData.name}
            placeholder={this.CATranslate("text_description", locale)}
            errorRequired={<this.Translate id="error_require_name" />}
            required={true}
            isAutoFocus={true}
            max={100}
            form={form} />
          <this.InputText
            name="number"
            label={<this.Translate id="input_stock_purchase_order_number" />}
            data={formData.number}
            placeholder={this.CATranslate("input_stock_purchase_order_number", locale)}
            errorRequired={<this.Translate id="error_require_po_number" />}
            form={form} />
          <this.Select
            name="supplierId"
            label={<this.Translate id="text_supplier" /> }
            placeholder={this.CATranslate("text_supplier", locale)}
            errorRequired={<this.Translate id="error_require_supplier" />}
            defaultValue={formData.supplierId}
            dataSource={this.props.supplier.list}
            valueKey="id"
            required={true}
            form={form} />
          <this.InputText
            name="invoiceNo"
            label={<this.Translate id="text_invoice_no" />}
            data={formData.invoiceNo}
            placeholder={this.CATranslate("text_invoice_no",locale)}
            max={100}
            form={form}
            className="hidden" />
          <this.Select
            name="locationId"
            label={<this.Translate id="text_location" />}
            placeholder={this.CATranslate("text_location", locale)}
            errorRequired={<this.Translate id="error_select_delivery_location" />}
            defaultValue={locationId}
            dataSource={this.state.locations}
            valueKey="id"
            form={form} />
          <this.Select
              name="step"
              label={<this.Translate id="text_status" />}
              placeholder={this.CATranslate("text_status", locale)}
              defaultValue={formData.id ? formData.step : (this.state.isAutoReceive ? Enum.PO_STEP.RECEIVED : Enum.PO_STEP.DRAFT)}
              dataSource={[
                {
                  name: <this.Translate id="text_draft" />,
                  value: Enum.PO_STEP.DRAFT
                },
                {
                  name: <this.Translate id="text_received" />,
                  value: Enum.PO_STEP.RECEIVED
                }
              ]}
              form={form} />
          {/* <this.Checkboxs
            name="isAutoReceive"
            defaultValue={this.state.isAutoReceive}
            label={<this.Translate id="text_auto_send_receive"/>}
            onChange={this.handleOnChangeIsAutoReceive}
            form={this.props.form} /> */}
          <this.Row className="ca-penel-v1 wrap-po-filter-create hidden">
          </this.Row>
        </this.Col>
        <this.Col md="8" className="purchase-order-entry">
          <SearchPO
            dataSource={productSearch}
            productVariant={this.props.productVariant}
            purchaseOrderEntries={formData.POEntries}
            locale={locale}
            productReOrderPointList={this.props.productReOrderPointList}
            product={this.props.product}
            unit={this.props.unit}
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