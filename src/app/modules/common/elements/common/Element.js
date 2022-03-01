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
import {Doughnut, Line} from "react-chartjs-2";
import Util from "../../util";
import {FormGroup, Label} from "reactstrap";
import {Translate} from "react-localize-redux";

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

    this.Util = new Util();

    this.Doughnut = Doughnut;
    this.Line = Line;

  }

  getName(value) {
    if (this.props.nestedName && this.props.nestedName in value && value[this.props.nestedName]) {
      if (Array.isArray(value[this.props.nestedName]) && value[this.props.nestedName].length > 0) {
        value[this.props.nestedName] = value[this.props.nestedName][0];
      }
      return value[this.props.nestedName][this.props.nameKey];
    }
    return value[this.props.nameKey];
  }
  
}



export const Form = form;
