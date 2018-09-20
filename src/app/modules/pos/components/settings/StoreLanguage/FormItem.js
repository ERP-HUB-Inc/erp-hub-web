import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.languageCodes = [
      {name: "en", value: "en"},
      {name: "km", value: "km"},
      {name: "bm", value: "bm"},
    ];
  }
  render() {
    const {formData, form, locale} = this.props;
    return (
      <div>
        <this.InputText
          data={formData.name}
          name="name"
          label={<this.Translate id="input_language_name" />}
          placeholder={this.CATranslate("input_language_name", locale)}
          form={form}
          required={true}
          min={3}
          max={100}
          errorLenght={<this.Translate id="error_language_name_length" />} />
        <this.Select
          name="code"
          label={<this.Translate id="col_language_code" />}
          dataSource={this.languageCodes}
          defaultValue={formData.code}
          form={form} />
        <this.Select
          name="status"
          label={<this.Translate id="text_status" />}
          dataSource={this.statusDataSource}
          defaultValue={formData.status}
          form={form}/>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    code: "en",
    status: 1
  }
};