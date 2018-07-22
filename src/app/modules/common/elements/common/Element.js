import { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Form as form, Input, Checkbox } from "antd";
import { FormGroup, Label } from "reactstrap";
import { Translate, } from "react-localize-redux";
import TextInput from "../ant-ui/Input";

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
    this.FormItem = form.Item;
    this.TextInput = TextInput;
    this.Checkbox = Checkbox;

    //localization
    this.Translate = Translate;

  }
}

export const ReduxForm = reduxForm;

export const Form = form;
