import React from "react";
import FormEntry from "./FormEntry";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";
import LoctionAction from "../../../../pos/action/settings/location";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      fromLocationId: ""
    };
  }

  componentDidMount(){
    this.props.dispatch(LoctionAction.fetch(10));
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
    if (!locationId && Array.isArray(this.props.location.list)) {
      const defaultLocation = this.props.location.list.find(location => location.id === this.Util.getLocationId());
      if (defaultLocation) {
        locationId = defaultLocation.id;
      }
    }
    return (
      <this.Row id="purchase-order-form">
        <this.Col md="4">
          <this.Select
            name="fromLocationId"
            label={<this.Translate id="text_from_location" /> }
            placeholder={this.CATranslate("text_from_location", locale)}
            defaultValue={locationId}
            dataSource={this.props.location.list}
            valueKey="id"
            required={true}
            form={form} />

          <this.Select
            name="toLocationId"
            label={<this.Translate id="text_to_location" />}
            placeholder={this.CATranslate("text_to_location", locale)}
            errorRequired={<this.Translate id="error_require_location" />}
            dataSource={this.props.location.list}
            defaultValue={formData.toLocationId}
            valueKey="id"
            required={true}
            form={form} />

          <this.Select
            name="step"
            label={<this.Translate id="text_stock_transfer_status" />}
            placeholder={this.CATranslate("text_please_search", this.props.locale)}
            dataSource={[{name: <this.Translate id="text_process" />, value: Enum.STOCK_STRANSFER_STEP.PROCESS}, {name: <this.Translate id="text_mark_as_received" />, value: Enum.STOCK_STRANSFER_STEP.RECEIVED}]}
            defaultValue={formData.id ? formData.step : Enum.STOCK_STRANSFER_STEP.PROCESS}
            required={true}
            form={form} />

          <this.InputTextArea
            name="description"
            label={<this.Translate id="text_description" />}
            data={formData.description}
            placeholder={this.CATranslate("text_description", this.props.locale)}
            form={form}/>
        </this.Col>
        <this.Col md="8" className="purchase-order-entry">
          <FormEntry
            dataSource={productSearch}
            productVariant={this.props.productVariant}
            stockTransferEntries={formData.stockTransferEntries}
            fromLocationId={this.state.fromLocationId}
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