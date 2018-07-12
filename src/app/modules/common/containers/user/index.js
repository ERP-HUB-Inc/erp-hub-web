import React,{ Component } from "react";
import Form from "./Form";

class UserList extends Component {
  constructor(props) {
    super(props);
  } 

  render(){
    return(
      <Form onSubmit />
    );
  }
}

export default UserList;