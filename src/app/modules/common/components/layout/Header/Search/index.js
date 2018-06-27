import React from "react";
import FormSearch from "./form";
import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import { submit } from "redux-form";
import { SubmissionError } from "redux-form";
import Component from "../../../Component";

class SearchForm extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit({txtsearch=""}){
    let error = null;
    alert(txtsearch);
    if (error != null) {
      throw new SubmissionError(error);
    } else {
      
    }
  }

  render(){
    return(
      <div>
        <FormSearch onSubmit={this.onSubmit}/>
      </div>
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