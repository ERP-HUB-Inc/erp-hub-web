import React from "react";
import FormItem from "./FormItem";
import ConditionAction from "../../../actions/products/condition";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="text_condition" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.conditionUpdate.data.id;
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(ConditionAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(ConditionAction.reset());
  }

  render() {
    const {conditionUpdate, form, locale} = this.props;

    this.submitLoading = conditionUpdate.updating;

    if (conditionUpdate.showForm) {
      this.content = (
        <FormItem formData={conditionUpdate.data} form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}