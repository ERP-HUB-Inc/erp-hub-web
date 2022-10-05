import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import EmployeeAction from "../../../actions/employees/employee";
import Modal from "../../../../common/components/shares/Modal";
import "./index.css";

class FormWarning extends Modal {
  constructor(props) {
    super(props);
    this.maskClosable = true;
    this.wrapClassName = "wrap-warning-create-location";
    this.action = EmployeeAction;
  }
  renderCrudAction() {}

  handleCancel() {
    this.dispatch(this.action.reset());
  }

  render() {
    const {employeeAdd} = this.props;

    if (employeeAdd.showForm) {
      let textPlan = "Free Plan";
      this.content = <div>
        <div className="text-center" style={{marginBottom: 10, paddingTop: 10}}>
          <img style={{width: 80}} alt="" src={this.Util.getGeneralImage("storeVein/business_lite.png").url} /> 
        </div>
        <h3 className="text-center">
          {textPlan}
        </h3>
        <p className="text-center" style={{paddingBottom: 10}}>
          Your currently subscription free plan can not add more employee or user account, please upgrade your <a href="http://www.storevein.com/#pricing" rel="noopener noreferrer" target="_blank">plan</a> from <span style={{fontWeight: 500}}>Free Plan</span> to <span style={{fontWeight: 500}}>Other Business Plan</span> to get additional user.
        </p>
      </div>;
      return super.render();
    } else {
      return <div/>;
    }
  }
}

function mapStateToProps(state) {
  return {
    employeeAdd: state.reducer.employee.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formWarning =  Form.create(mapPropsToFields)(FormWarning);

export default connect(mapStateToProps)(formWarning);