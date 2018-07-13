import React from "react";
import FormSearch from "./form";
import { connect } from "react-redux";
import { 
  getFormValues,
  submit,
  SubmissionError
} from "redux-form";
import Component from "../../Component";
import "./index.css";

class SearchForm extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit({txtsearch=""}){
    let error = null;
    if (error != null) {
      throw new SubmissionError(error);
    } else {
      
    }
  }

  render(){
    return(
      <FormSearch onSubmit={this.onSubmit}/>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    values: getFormValues("FormSearch")(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    submitForm: () => dispatch(submit("FormSearch"))
  };
};
  

export default connect(mapStateToProps,mapDispatchToProps)(SearchForm);