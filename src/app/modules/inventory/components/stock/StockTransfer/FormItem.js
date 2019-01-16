import React from "react";
import FormEntry from "./FormEntry";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      locations: []
    };
  }

  componentDidMount(){
    this.setState({
      locations: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.LOCATION))
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

    let locationId = formData.fromLocationId;
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
            <this.Col md="3">
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
              { formData.deliveryDueDate == null ?
                <this.DatePickers
                  name="deliveryDueDate"
                  label={<this.Translate id="text_due_date" />}
                  placeholder={this.CATranslate("text_due_date", locale)}
                  errorRequired={<this.Translate id="error_select_due_date" />}
                  required={true}
                  form={form}/>
                :
                <this.DatePickers
                  name="deliveryDueDate"
                  defaultValue={this.Util.formatDatePicker(formData.deliveryDueDate)} 
                  label={<this.Translate id="text_due_date" />}
                  placeholder={this.CATranslate("text_due_date", locale)}
                  errorRequired={<this.Translate id="error_select_due_date" />}
                  required={true}
                  form={form}/>
              }

            </this.Col>
            <this.Col md="2">
              <this.Select
                name="fromLocationId"
                label={<this.Translate id="text_from_location" /> }
                placeholder={this.CATranslate("text_from_location", locale)}
                defaultValue={locationId}
                dataSource={this.state.locations}
                valueKey="id"
                required={true}
                form={form}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="toLocationId"
                label={<this.Translate id="text_to_location" />}
                placeholder={this.CATranslate("text_to_location", locale)}
                errorRequired={<this.Translate id="error_require_location" />}
                dataSource={this.state.locations}
                defaultValue={formData.toLocationId}
                valueKey="id"
                required={true}
                form={form}/>
            </this.Col>
            <this.Col md="3">
              <this.InputText
                name="description"
                label={<this.Translate id="text_description" />}
                data={formData.description}
                placeholder={this.CATranslate("text_description", locale)}
                max={255}
                form={form}/> 
            </this.Col>
          </this.Row>
        </this.Col>
        <this.Col md="12" className="purchase-order-entry">
          <FormEntry
            dataSource={productSearch}
            productVariant={this.props.productVariant}
            stockTransferEntries={formData.stockTransferEntries}
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
    toLocationId: "",
    stockTransferEntries: []
  },
  productSearch: []
};