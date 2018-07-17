import React from "react";
import Component from "../../Component";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form"; 

class FormSearch extends Component {
  render(){
    const { handleSubmit } = this.props;
    return(
      <this.Form onSubmit={ handleSubmit }>
        <span className="icon-search"></span>
        <this.Field
          name="generalsearch"
          type="text"
          component="input"
          className="form-control"
          placeholder="Search Transaction Invoice or help"
        />
      </this.Form>
    );
  }
}

FormSearch.propTypes = {
  handleSubmit: PropTypes.any,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func
};

export default reduxForm({
  form: "FormSearch"
})(FormSearch);