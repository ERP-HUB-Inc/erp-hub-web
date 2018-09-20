import React from "react";
import FormItem from "./FormItem";
import StoreLocationAction from "../../../action/settings/storeLocation";
import Modal from "../../../../common/components/shares/Modal";

export default class FormStoreLocationCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_store_location_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(StoreLocationAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(StoreLocationAction.reset());
  }
  
  render() {
    const {storeLocationAdd, form, locale} = this.props;

    this.submitLoading = storeLocationAdd.adding;

    this.validatorAddRecord(storeLocationAdd);

    if (storeLocationAdd.showForm) {
      this.content = (
        <FormItem form={form} locale={locale} />
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}