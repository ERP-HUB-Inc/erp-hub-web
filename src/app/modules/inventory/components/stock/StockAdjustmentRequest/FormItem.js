import React from "react";
import Enum from "../../../enums";
import SearchAdjustment from "./SearchAdjustment";
import Modal from "../../../../common/components/shares/Modal";
import LocationAction from "../../../../pos/action/settings/location";

export default class FormItem extends Modal {
  constructor(props){
    super(props);
    this.state = {
      locations: [],
      locationId: ""
    };
    this.handleOnChangeFromLocation = this.handleOnChangeFromLocation.bind(this);
  }

  componentDidMount(){
    this.props.dispatch(LocationAction.fetchLocationAccess(100));
    this.setState({
      locations: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.LOCATION))
    });
  }

  handleOnChangeFromLocation(value) {
    if (value === this.props.form.getFieldValue("locationId")) {
      this.Message.error(this.CATranslate("error_the_same_location", this.props.locale));
    }
    this.setState({locationId: value});
  }

  render() {
    const {
      form,
      dispatch,
      locale,
      formData,
      productSearch
    } = this.props;

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
                label={<this.Translate id="col_stock_adjustment_request_title" />}
                data={formData.name}
                placeholder={this.CATranslate("col_stock_adjustment_request_title", locale)}
                errorRequired={<this.Translate id="error_require_name" />}
                required={true}
                isAutoFocus={true}
                max={100}
                form={form}/> 
            </this.Col>
            <this.Col md="4">
              <this.InputText
                name="reason"
                label={<this.Translate id="col_stock_adjustment_request_reason" />}
                data={formData.invoiceNo}
                placeholder={this.CATranslate("col_stock_adjustment_request_reason",locale)}
                required={true}
                max={100}
                form={form}/>
            </this.Col>
            <this.Col md="4">
              <this.Select
                name="locationId"
                label={<this.Translate id="text_delivery_to_location" /> }
                placeholder={this.CATranslate("text_delivery_to_location", locale)}
                defaultValue={locationId}
                onChange={this.handleOnChangeFromLocation}
                dataSource={this.props.accessLocation.list}
                valueKey="id"
                required={true}
                form={form}/>
            </this.Col>
          </this.Row>
        </this.Col>
        <this.Col md="12" className="purchase-order-entry">
          <SearchAdjustment
            dataSource={productSearch}
            productVariant={this.props.productVariant}
            stockAdjustmentRequest={formData.purchaseOrderEntries}
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
    purchaseOrderEntries: [],
    locationId: ""
  },
  productSearch: []
};