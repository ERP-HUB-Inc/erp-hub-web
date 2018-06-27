import React from "react";
import Component from "../../../Component";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form"; 

class FormSearch extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    const { handleSubmit } = this.props;
    return(
      <this.Form onSubmit={ handleSubmit }>
        <this.Icon type="search" className="search-icon"/>
        <this.Field
          name="txtsearch"
          type="text"
          component={ this.InputRedux }
          placeholder="Search Transaction Invoice or"
        />
      </this.Form>
    );
  }
}

FormSearch.propTypes = {
  handleSubmit: PropTypes.any,
  submitting: PropTypes.string,
  onSubmit: PropTypes.func
};

export default reduxForm({
  form: "FormSearch"
})(FormSearch);