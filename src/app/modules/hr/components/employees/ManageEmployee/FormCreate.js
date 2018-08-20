import React from "react";
import FormItem from "./FormItem";
import { Modal } from "../../shares/Modal/modal";
import ManageEmployeeAction from "../../../actions/employees/manageEmployee";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      value: "123"
    };

    this.title = "Manage Employee";
    this.addingPropReducer = "manageEmployeeAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleCardChange = this.handleCardChange.bind(this);
  }

  onChange(checked){
    this.setState({
      disabled : checked === 1,
    });
    this.props.form.setFieldsValue({password: ""});
  }

  handleCardChange(){
    alert("form create");
  }


  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      

      if (!err) {
        values["isPasswordExpired"] = this.Util.checkValueSwitch(values.isPasswordExpired);
        values["isMustChangePWNextLogin"] = this.Util.checkValueSwitch(values.isMustChangePWNextLogin);
        this.dispatch(ManageEmployeeAction.add(values));   
      }

    });
  }
      
  handleCancel() {
    this.dispatch(ManageEmployeeAction.reset());
  }

  render() {
    const {manageEmployeeAdd, form, locale} = this.props;
    
    this.submitLoading = manageEmployeeAdd.adding;

    // this.validatorAddRecord(manageEmployeeAdd);

    if (manageEmployeeAdd.showForm) {
      this.content = (
        <div>
          { manageEmployeeAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" }
          <FormItem form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}