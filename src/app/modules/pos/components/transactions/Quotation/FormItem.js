import React from "react";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props){
    super(props);
    this.state = {
      locations: []
    };
  }

  componentDidMount(){
    this.setState({
      locations: JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.LOCATION))
    });
  }

  render() {
    return (
      <div>
      
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    symbol: "",
    value: 0,
    status: 1
  }
};