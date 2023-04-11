import React from "react";
import FormItem from "./FormItem";
import ConditionAction from "../../../actions/products/condition";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_condition" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(ConditionAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(ConditionAction.reset());
  }

  render() {
    const {conditionAdd, form, locale} = this.props;
    
    this.submitLoading = conditionAdd.adding;

    if (conditionAdd.showForm) {
      this.content = <FormItem form={form} locale={locale} />;
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}