import React, { Component as RComponent } from "react";
import { Translate, setActiveLanguage, getActiveLanguage } from "react-localize-redux";
import { Field } from "redux-form";
import { connect } from "react-redux";
import 
{ 
  CTable,
  Noteicon,
  Selects,
  DateRank,
  ActionButton,
  Switchs,
  Waiting,
  Checkboxs,
  Tooltips,
  FieldComponent,
  TrashButton,
  AnimationInput,
  Button,
  LoginLayout,
  RadioRegister
} from "../elements/ant-ui";
import Antinput from "../elements/ant-ui/Input";
import Header from "../elements/ant-ui/Header";
import {
  InputRedux,
  Breadcrumb,
  BreadcrumbLayout,
  BreadcrumbTitle,
  SapleInput,
  Cards,
  ListSearch,
  Badges,
  AutoComplete
} from "../elements/react-strap";
import {  
  Container,
  Col,
  Row,
  Form,
  Dropdown, 
  DropdownItem, 
  DropdownToggle, 
  DropdownMenu,
  FormGroup,
  Label,
  FormText
} from "reactstrap";
import { 
  NavLink,
  Link 
} from "react-router-dom";
import "./layout/styles/Style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";
import {
  Layout,
  Menu,
  Icon,
  Select,
  Collapse,
  Checkbox,
  Modal,
  Popconfirm,
  message
} from "antd";
const Panel = Collapse.Panel;
const { Option } = Select;

export default class Component extends RComponent {
  constructor(props) {
    super(props);

    // Element Ant ui
    this.Table = CTable;
    this.Button = Button;
    this.Message = message;
    this.Popconfirm = Popconfirm;
    this.Modal = Modal;
    this.Header = () => (<Header/>);
    this.Noteicon = () => (<Noteicon/>);
    this.Selects = Selects;
    this.DateRank = DateRank;

    // Other
    this.clearFloating = () => <div className="clearFloat"></div>;

    // Localization
    this.Translate = Translate;

    // Function
    this.changeLanguage = this.changeLanguage.bind(this);

    // Redux Form
    this.Field = Field;
    // this.SynField = SynField;
    this.connect = connect;

    //React Strap 
    this.Container = Container;
    this.Col = Col;
    this.Row = Row;
    this.InputRedux = InputRedux;
    this.Form = Form;
    this.Dropdown = Dropdown;
    this.DropdownItem = DropdownItem;
    this.DropdownToggle = DropdownToggle;
    this.DropdownMenu = DropdownMenu;
    this.NavLink = NavLink;
    this.Link = Link;
    this.Breadcrumb = Breadcrumb;
    this.BreadcrumbTitle = BreadcrumbTitle;
    this.BreadcrumbLayout = BreadcrumbLayout;
    this.SapleInput = SapleInput;
    this.FormGroup = FormGroup;
    this.Label = Label;
    this.FormText = FormText;
    this.Cards = Cards;
    this.ListSearch = ListSearch;
    this.Badges = Badges;
    this.AutoComplete = AutoComplete;

    //Ant
    this.Layout = Layout;
    this.Menu = Menu;
    this.Icon = Icon;
    this.Select = Select;
    this.ActionButton = ActionButton;
    this.Switchs = Switchs;
    this.Antinput = Antinput;
    this.AnimationInput = AnimationInput;
    this.Waiting = Waiting;
    this.Checkboxs = Checkboxs;
    this.Checkbox = Checkbox;
    this.Collapse = Collapse;
    this.Panel = Panel;
    this.Tooltips = Tooltips;
    this.Option = Option;
    this.FieldComponent = FieldComponent;
    this.TrashButton = TrashButton;
    this.LoginLayout = LoginLayout;
    this.RadioRegister = RadioRegister;

  }

  changeLanguage(key) {
    return setActiveLanguage(key);
  }

  getCurrentLanguage(state) {
    return getActiveLanguage(state);
  }
}