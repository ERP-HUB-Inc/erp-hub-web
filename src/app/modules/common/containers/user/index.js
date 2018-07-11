import React,{ Component } from "react";
import Form from "./Form";

function getValue(values){
  alert(JSON.stringify(values));
}

class UserList extends Component {
  render(){
    return(
      <Form onSubmit={ getValue } />
    );
  }
}

export default UserList;