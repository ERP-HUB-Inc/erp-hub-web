import React,{ Component } from "react";
import Synvalidation from "./Form";

function getValue(values){
  alert(JSON.stringify(values));
}

class ValidationForm extends Component {
  render(){
    return(
      <Synvalidation onSubmit={ getValue } />
    );
  }
}

export default ValidationForm;