import { Component } from "react";
import { Field, reduxForm } from "redux-form";
import {
  Form as form,
  Input,
  Radio,
  Checkbox,
  Select,
  InputNumber,
  DatePicker
} from "antd";
import { FormGroup, Label } from "reactstrap";
import { Translate, } from "react-localize-redux";

export default class Element extends Component {
  constructor(props) {
    super(props);
    const { Option } = Select;

    // redux-form
    this.Field = Field;

    //react-strap
    this.FormGroup = FormGroup;
    this.Label = Label;

    //ant ui
    this.Input = Input;
    this.InputNumber = InputNumber;
    this.FormItem = form.Item;
    this.Checkbox = Checkbox;
    this.Radio = Radio;
    this.Select = Select;
    this.Option = Option;
    this.DatePicker = DatePicker;

    //localization
    this.Translate = Translate;

  }
}

export const ReduxForm = reduxForm;

export const Form = form;
