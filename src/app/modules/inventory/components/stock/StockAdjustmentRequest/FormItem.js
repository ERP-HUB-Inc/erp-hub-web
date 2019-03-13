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
      locationId: "",
      handleOnChangeLocation: false
    };
    this.handleOnChangeLocation = this.handleOnChangeLocation.bind(this);
  }

  componentDidMount(){
    this.props.dispatch(LocationAction.fetchLocationAccess(100));
    this.setState({
      locations: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.LOCATION))
    });
  }

  handleOnChangeLocation(value) {
    this.setState({
      locationId: value
    });
  }

  render() {
    const {
      form,
      dispatch,
      locale,
      formData,
      productSearch
    } = this.props;

    let locationId = parseFloat(formData.locationId);
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
                name="title"
                label={<this.Translate id="text_title" />}
                data={formData.title}
                placeholder={this.CATranslate("text_title", locale)}
                errorRequired={<this.Translate id="error_require_name" />}
                required={true}
                isAutoFocus={true}
                max={255}
                form={form}/> 
            </this.Col>
            <this.Col md="4">
              <this.InputText
                name="reason"
                label={<this.Translate id="text_reason" />}
                data={formData.reason}
                placeholder={this.CATranslate("text_reason",locale)}
                required={true}
                max={255}
                form={form}/>
            </this.Col>
            <this.Col md="4">
              <this.Select
                name="locationId"
                label={<this.Translate id="text_location" /> }
                placeholder={this.CATranslate("text_location", locale)}
                defaultValue={locationId}
                dataSource={this.state.locations}
                onChange={this.handleOnChangeLocation}
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
            locationId={this.state.locationId}
            stockAdjustmentRequest={formData.stockAdjustmentEntries}
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
    stockAdjustmentEntries: [],
    locationId: ""
  },
  productSearch: []
};