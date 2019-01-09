import React from "react";
import FormItem from "./FormItem";
import LocationAction from "../../../action/settings/storeLocation";
import ReceiptTemplate from "../../../action/settings/receiptTemplate";
import Modal from "../../../../common/components/shares/Modal";

export default class FormUpdate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="update_store_location_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(ReceiptTemplate.fetch(100));
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {storeLocationUpdate} = this.props;
        values["id"] = storeLocationUpdate.data.id;
        values["isDefault"] = storeLocationUpdate.data.isDefault;
        values["isSystem"] = storeLocationUpdate.data.isSystem;
        this.dispatch(LocationAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(LocationAction.reset());
  }
  
  render() {
    const {storeLocationUpdate, form, locale} = this.props;

    this.submitLoading = storeLocationUpdate.updating;

    this.validatorUpdateRecord(storeLocationUpdate);
    
    if (storeLocationUpdate.showForm) {
      this.content = <FormItem
        formData={storeLocationUpdate.data}
        form={form}
        locale={locale}
        receiptTemplates={this.props.receiptTemplates.list}/>;
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}