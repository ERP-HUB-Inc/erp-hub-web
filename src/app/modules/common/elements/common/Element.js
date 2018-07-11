import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Form, Input } from "antd";
import { FormGroup, Label } from "reactstrap";
import { Translate, setActiveLanguage } from "react-localize-redux";
import TextInput from "../ant-ui/Input";
import Utils from "./utils";

export default class Element extends Component {
  constructor(props) {
    super(props);
    // redux-form
    this.Field = Field;

    //react-strap
    this.FormGroup = FormGroup;
    this.Label = Label;

    //ant ui
    this.Input = Input;
    this.FormItem = Form.Item;
    this.TextInput = TextInput;

    //localization
    this.Translate = Translate;

    //share function
    this.Utils = new Utils;
  }
}

export const ReduxForm = reduxForm;
