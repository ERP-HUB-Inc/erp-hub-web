import React from "react";
import { Form } from "antd";
import Component from "../../Component";
import Supplier from "../Component/SupplierSelect";
import StoreLocation from "../Component/StoreLocationSelect";
import Brand from "../Component/Brand";
import Modals from "../../../../common/components/shares/Modal";
import "./index.css";

export class Modal extends Modals {
  constructor(props) {
    super(props);
    this.title = this.props.title;
    this.dispatch = this.props.dispatch;
    this.content = "";
    this.responseError = "";
    this.isRepsonseBackError = "none";
    this.submitLoading = false;
    this.submited = false;
    this.requiredMessage = "Error: Please make sure all data input correctly.";
    this.statusDataSource = [
      {
        name: <this.Translate id="select_text_active" />,
        value: 1
      },
      {
        name: <this.Translate id="select_text_deactive" />,
        value: 0
      }
    ];
    this.handleSubmit = this.handleSubmit.bind(this);
    this.Supplier = Supplier;
    this.StoreLocation = StoreLocation;
    this.Brand = Brand;
  }

  handleSubmit() {
    
  }
    
  handleCancel() {

  }

  validatorAddRecord(responseAdd) {
    if (
      responseAdd.error != null 
      && "error" in responseAdd.error 
      && responseAdd.error.error.code === 400) {
      this.isRepsonseBackError = "";
    }
  }

  validatorUpdateRecord(responseUpdate) {
    if (
      responseUpdate.error != null 
      && "data" in responseUpdate.error 
      && responseUpdate.error.data.error.code === 400) {
      this.isRepsonseBackError = "";
    }
  }

}