import React from "react";
import Modal from "../../shares/Modal";
import RoleAccessAction from "../../../action/settings/roleAccess";
export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Access Role";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(RoleAccessAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(RoleAccessAction.reset());
  }
  
  render() {
    const { roleAccessAdd, locale, form } = this.props;

    this.submitLoading = roleAccessAdd.adding;

    if (roleAccessAdd.showForm) {
      this.content = (
        <div>
          {roleAccessAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <this.InputText
            form={form}
            name="name"
            errorRequired={<this.Translate id="error_require_input_role_name"/>}
            errorLenght={<this.Translate id="error_length_input_role_name"/>}
            label={<this.Translate id="input_text_role_name" />}
            placeholder={this.CATranslate("place_holder_role_name", locale)}
            required={true} min={3} />

          <this.InputText
            form={form}
            name="code"
            label={<this.Translate id="input_text_role_code" />}
            placeholder={this.CATranslate("place_holder_role_code", locale)} />

          <this.Select
            name="status"
            label={<this.Translate id="text_status" />}
            dataSource={this.statusDataSource}
            defaultValue={1}
            form={form}/>

        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}