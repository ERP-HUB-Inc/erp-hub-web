import React from "react";
import SearchAdjustment from "./SearchAdjustment";
import {
  Select
} from "../../../../common/elements/ant-ui/Select";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";
import LocationService from "../../../../pos/services/settings/StoreLocationService";

function SelectLocation({form, label, placeholder, formData, onChange}) {
  const [locations, setLocations] = React.useState([]);
  const [locationId, setLocation] = React.useState(null);
  React.useEffect(() => {
    LocationService.listsLocationAccess(10)
    .then(response => {
      if (response.data) {
        const locations = response.data.data;
        const defaultLocation = locations.find(location => location.isDefault === 1);
        setLocations(locations);

        if (defaultLocation) {
          setLocation(defaultLocation.id);
        }
      }
    });
  }, []);

  return <Select
    name="locationId"
    label={label}
    placeholder={placeholder}
    defaultValue={formData.locationId ? formData.locationId : locationId}
    dataSource={locations}
    onChange={onChange}
    valueKey="id"
    required={true}
    form={form} />;
}

export default class FormItem extends Modal {
  constructor(props){
    super(props);
    this.state = {
      locationId: "",
    };
    this.handleOnChangeLocation = this.handleOnChangeLocation.bind(this);
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

    return (
      <this.Row id="purchase-order-form">
        <this.Col md="4">
          <this.InputText
            name="title"
            label={<this.Translate id="text_description" />}
            data={formData.title}
            placeholder={this.CATranslate("text_description", locale)}
            errorRequired={<this.Translate id="error_require_description" />}
            required={true}
            isAutoFocus={true}
            max={100}
            form={form} />
          <SelectLocation
            form={form}
            formData={formData}
            label={<this.Translate id="text_location" />}
            placeholder={this.CATranslate("text_location", locale)}
            onChange={this.handleOnChangeLocation}
            />
          <this.Select
            name="step"
            label={<this.Translate id="text_adjustment_status" />}
            placeholder={this.CATranslate("text_please_search", this.props.locale)}
            dataSource={[{name: <this.Translate id="text_request" />, value: Enum.STOCK_ADJUST_STEP.REQUEST}, {name: <this.Translate id="text_mark_as_approved" />, value: Enum.STOCK_ADJUST_STEP.COMPLETE}]}
            defaultValue={formData.id ? formData.step : Enum.STOCK_ADJUST_STEP.REQUEST}
            required={true}
            form={form} />
          <this.InputTextArea
            name="reason"
            label={<this.Translate id="text_reason" />}
            data={formData.reason}
            placeholder={"សូមបញ្ជាក់មូលហេតុដែលអ្នកកែប្រែស្តុកទំនិញ"}
            required={true}
            max={1}
            form={form}/>
        </this.Col>
        <this.Col md="8" className="purchase-order-entry" style={{marginTop: 30}}>
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