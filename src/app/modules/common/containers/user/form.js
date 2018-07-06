import React from "react";
import Component from "../../components/Component";
import PropTypes from "prop-types";
import ListCollapse from "./Panel";
import { reduxForm } from "redux-form/immutable"; 

function validate(values="") {
  const errors = {};
  if (!values.get("username")) {
    errors.username = "Required";
  } else if (values.get("username").length > 15) {
    errors.username = "Must be 15 characters or less";
  }
  return errors;
};

class Synvalidation extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    const { handleSubmit } = this.props;
    return(
      <div>
        
        <this.Row>   

          <this.Col md="6"> 

            <this.Form onSubmit={ handleSubmit }>
              <this.Row>
                <this.Col xs="12" md="2">
                  <this.Field 
                    component={ this.Checkboxs }
                    label={["Apple"]}
                  />
                </this.Col>
                <this.Col xs="12" md="2">
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
                <this.Col xs="12" md="2">
                  <this.Field 
                    name="datepicker" 
                    component={ this.DateRank }
                    label="Date1"
                  />
                </this.Col>
                <this.Col xs="12" md="2">
                  <this.Field 
                    name="datepicker" 
                    component={ this.DateRank }
                    label="Date2"
                    placeholder="Select Date Rank"
                  />
                </this.Col>
                <this.Col xs="12" md="2">
                  <this.Field 
                    name="searchfor" 
                    component={ this.InputRedux }
                    label="Date2"
                    placeholder="Search for Customer"
                  />
                </this.Col>
                <this.Col xs="12" md="4">
                  <this.Field 
                    name="autocomplete" 
                    component={ this.AutoComplete }
                    label="Date2"
                    placeholder="Search Product"
                  />
            
                </this.Col>
                <this.Col xs="12" md="2">
                  <this.SynField 
                    name="username"
                    type="text"
                    component={ this.Antinput }
                    label="Date2"
                    placeholder="Search Product"
                  />
                </this.Col>
                <this.Col xs="12" md="2">
                  <this.ActionButton
                    icon="search"
                    color="#093163"
                  />
                </this.Col>
          
              </this.Row>
            </this.Form>

          </this.Col>

          <this.Col md="6">  
            <ListCollapse/>
          </this.Col>
        </this.Row>
       
      </div>
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