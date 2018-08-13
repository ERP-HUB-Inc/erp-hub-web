import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import Component from "../../components/Component";
import HomePage from "../../components/home";

class Home extends Component {
  render(){
    return(
      <HomePage {...this.props}/>
    );
  }
}
                  
function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const home =  Form.create(mapPropsToFields)(Home);

export default connect()(home);