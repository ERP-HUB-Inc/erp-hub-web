import React from "react";
import BaseModal from "@layout/BaseModal";
import "./index.css";

export default class FormItem extends BaseModal {
  render() {
    const { form,locale,formData } = this.props;
    return (
      <this.Row>
        <this.Col md="12">
          <div className="cans-layouts">
              <div className="cans-label-fix-values">
                {<this.Translate id="text_number_one" />}
              </div>
              <div className="cans-input" style={{ width: "356px" }}>
                <this.InputText
                  name="name"
                  label={<this.Translate id="text_name" />}
                  data={formData.name}
                  placeholder={this.CATranslate("text_case", locale)}
                  errorRequired={<this.Translate id="error_require_name" />}
                  required={true}
                  max={100}
                  form={form}/>
              </div>
              <div style={{ marginTop: "33px", marginRight: "5px", marginLeft: "5px" }}>
                {<this.Translate id="text_have" />}
              </div>
              <div style={{ marginRight: "6px" }}>
                <div style={{ marginBottom: "4px" }}>
                  <label>{" "}</label>
                </div>
                <this.InputNumber
                  name="multiple"
                  data={formData.multiple}
                  errorRequired={<this.Translate id="input_error_products_in_unit" />}
                  required={true}
                  precision={0}
                  form={form}/>
              </div>
              <div className="cans-label">
                <div style={{ marginBottom: "4px" }}>
                  <label>{" "}</label>
                </div>
                <this.InputText
                  name="label"
                  data={formData.label}
                  placeholder={this.CATranslate("text_cans", locale)}
                  required={true}
                  form={form}/>
              </div>
            </div>
        </this.Col>
        <this.Col md="12">
          <this.Select
            name="isDefault"
            label={<this.Translate id="text_is_default" />}
            dataSource={this.isDefaultDataSource}
            defaultValue={formData.isDefault}
            form={form}/>
        </this.Col>
      </this.Row>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    multiple:"",
    status: 1,
    isDefault: 0
  }
};