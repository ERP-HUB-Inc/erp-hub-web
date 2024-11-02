import React from "react";
import FormItem from "./FormItem";
import BrandAction from "../redux/action";
import BaseModal from "@layout/BaseModal";

export default class Form extends BaseModal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="text_brand" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.brandUpdate.data.id;
        if (values["image"]) {
          values["image"] = this.getImageFromUpload(values, "image");
        }
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(BrandAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(BrandAction.reset());
  }

  render() {
    const {brandUpdate, form, locale} = this.props;

    this.submitLoading = brandUpdate.updating;

    if (brandUpdate.showForm) {
      this.content = (
        <FormItem formData={brandUpdate.data} form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}