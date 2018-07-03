import React from "react";
import Component from "../../components/Component";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form/immutable"; 

function validate(values="") {
  const errors = {};
  if (!values.get("username")) {
    errors.username = "Required";
  } else if (values.get("username").length > 15) {
    errors.username = "Must be 15 characters or less";
  }

  
  // if (!values.get("email")) {
  //   errors.email = "Required";
  // } else if (
  //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.get("email"))
  // ) {
  //   errors.email = "Invalid email address";
  // }
  // if (!values.get("age")) {
  //   errors.age = "Required";
  // } else if (isNaN(Number(values.get("age")))) {
  //   errors.age = "Must be a number";
  // } 
  
  return errors;
};


class Synvalidation extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    const { handleSubmit } = this.props;
    return(
      <this.Form onSubmit={ handleSubmit }>
        <this.Row>
          <this.Col md="2">
            <this.Field name="favoriteColor" 
              component={ this.Selects }
              defaultValue="all"
              placeholder="Status"
              label="test"
            >
              <option value="all" selected>All</option>
              <option value="red">Red</option>
              <option value="redd">Reddd</option>
            </this.Field>
          </this.Col>
          <this.Col md="2">
            <this.Field 
              name="datepicker" 
              component={ this.DateRank }
              label="Date1"
            />
          </this.Col>
          <this.Col md="2">
            <this.Field 
              name="datepicker" 
              component={ this.DateRank }
              label="Date2"
              placeholder="Select Date Rank"
            />
          </this.Col>
          <this.Col md="2">
            <this.Field 
              name="searchfor" 
              component={ this.InputRedux }
              label="Date2"
              placeholder="Search for Customer"
            />
          </this.Col>
          <this.Col md="4">
            <this.Field 
              name="autocomplete" 
              component={ this.AutoComplete }
              label="Date2"
              placeholder="Search Product"
            />
            
          </this.Col>
          <this.Col md="2">
            <this.SynField 
              name="username"
              type="text"
              component={ this.Antinput }
              label="Date2"
              placeholder="Search Product"
            />
          </this.Col>
          <this.Col md="2">
            <this.SearchButton />
          </this.Col>
          
        </this.Row>
      </this.Form>
    );
  }
}

Synvalidation.propTypes = {
  handleSubmit: PropTypes.any,
  submitting: PropTypes.string,
  onSubmit: PropTypes.func
};

export default reduxForm({
  form: "syncValidation",
  validate
})(Synvalidation);