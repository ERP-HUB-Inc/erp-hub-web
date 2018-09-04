import React from "react";
import { reduxForm } from "redux-form";
import Component from "../../Component";
import "./index.css";

class FormSearch extends Component {
  render(){
    const { handleSubmit } = this.props;
    return(
      <this.Form
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <span className="icon-search"></span>
        <input
          name="generalsearch"
          type="text"
          className="form-control"
          placeholder={this.CATranslate("text_search_transaction", this.props.locale)}
        />
      </this.Form>
    );
  }
}

export default reduxForm({
  form: "FormSearch"
})(FormSearch);