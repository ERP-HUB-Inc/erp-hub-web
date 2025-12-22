import React from "react";
import SearchPO from "./search.po";
import Enum from "../../../../enums";
import Constant from "../redux/constant";
import Action from "../redux/action";
import BaseModal from "../../../../layout/base-modal";

export default class FormItem extends BaseModal {
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
    this.props.dispatch(Action.fetchSupplier(500, 0));
    this.props.dispatch(Action.fetchUnit(100,0));
  }

  handleCheckPONumber(event){
    this.validateOrderNumber = "";
    this.errorMessageOrderNumber = "";
    const PONumber = event.target.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.dispatch(Action.orderNumber(PONumber));
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
          this.dispatch(Action.reset(Constant.RESET_REQUEST_PURCHASE_ORDER_NUMBER));
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
            name="referenceNo"
            label={<this.Translate id="text_reference_no" />}
            data={formData.referenceNo}
            placeholder={this.CATranslate("text_reference_no", locale)}
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
            defaultValue={locationId}
            dataSource={this.state.locations}
            valueKey="id"
            required={true}
            form={form} />
          <this.Select
            name="step"
            label={<this.Translate id="text_status" />}
            placeholder={this.CATranslate("text_status", locale)}
            defaultValue={formData.id ? formData.step : (this.state.isAutoReceive ? Enum.PO_STATUS.RECEIVED : Enum.PO_STATUS.DRAFT)}
            dataSource={[
              {
                name: <this.Translate id="text_draft" />,
                value: Enum.PO_STATUS.DRAFT
              },
              {
                name: <this.Translate id="text_received" />,
                value: Enum.PO_STATUS.RECEIVED
              }
            ]}
            form={form}
          />
          <this.InputTextArea
            name="description"
            label={<this.Translate id="text_notes" />}
            data={formData.description}
            placeholder={this.CATranslate("text_notes", this.props.locale)}
            max={255}
            form={this.props.form}
          />
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
    POEntries: [],
    payTermType: "",
    payTermNumber: "",
    payDueDate: ""
  },
  productSearch: []
};