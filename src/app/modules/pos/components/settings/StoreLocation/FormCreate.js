import React from "react";
import FormItem from "./FormItem";
import LocationAction from "../../../action/settings/location";
import ReceiptTemplate from "../../../action/settings/receiptTemplate";
import Modal from "../../../../common/components/shares/Modal";

export default class FormStoreLocationCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_store_location_title" />;
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
        this.dispatch(LocationAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(LocationAction.reset());
  }
  
  render() {
    const {storeLocationAdd, form, locale} = this.props;

    this.submitLoading = storeLocationAdd.adding;

    this.validatorAddRecord(storeLocationAdd);

    if (storeLocationAdd.showForm) {
      this.content = <FormItem
        form={form}
        locale={locale}
        receiptTemplates={this.props.receiptTemplates.list}/>;
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}