import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import Component from "../../../components/Component";
import Profile from "../../../components/user/Profile";

class Profiles extends Component {
  render(){
    return(
      <Profile {...this.props}/>
    );
  }
}
      
function mapStateToProps(state) {
  return {
    userProfile: state.reducer.employee.detail,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const profiles =  Form.create(mapPropsToFields)(Profiles);

export default connect(mapStateToProps)(profiles);