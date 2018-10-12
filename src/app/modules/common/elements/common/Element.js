import { Component } from "react";
import {
  Form as form,
  Input,
  Radio,
  Checkbox,
  Select,
  InputNumber,
  Spin,
  Icon,
  DatePicker,
  Tag
} from "antd";
import { FormGroup, Label } from "reactstrap";
import { Translate, } from "react-localize-redux";

export default class Element extends Component {
  constructor(props) {
    super(props);
    const {Option, OptGroup} = Select;

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
    this.OptGroup = OptGroup;
    this.Spin = Spin;
    this.Icon = Icon;
    this.Tag = Tag;
    this.DatePicker = DatePicker;

    //localization
    this.Translate = Translate;

  }
}

export const Form = form;
