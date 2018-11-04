import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import Component from "../../components/Component";
import HomePage from "../../components/home";

class Home extends Component {
  render(){
    return(
      <HomePage {...this.props}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    graphChat: state.reducer.homePage.listGraph,
    pipeChat: state.reducer.homePage.listChat,
    cardDashboard: state.reducer.homePage.listCardDashboard,
    locale: state.locale
  };
}
                  
function mapPropsToFields(props) {
  return {
    form: props.form
  };
}


const home = Form.create(mapPropsToFields)(Home);

export default connect(mapStateToProps)(home);