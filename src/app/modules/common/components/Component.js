import React, { Component as RComponent } from "react";
import { Translate, setActiveLanguage, getActiveLanguage } from "react-localize-redux";
import { Field } from "redux-form";
import { connect } from "react-redux";
import {  
  Container,
  Col,
  Row,
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
import 
{ 
  CTable,
  TableExpand,
  SubTable,
  Noteicon,
  Select,
  ActionButton,
  Switchs,
  Waiting,
  Checkboxs,
  FieldComponent,
  TrashButton,
  Button,
  InputText,
  InputEmail,
  InputNumber,
  InputPassword,
  LoginLayout,
  RadioBox,
  RadioChildBox,
  RadioNormal,
  DatePickers,
  RadioButton,
  UploadImg,
  Loading,
  InputTextArea,
  SearchButton,
  Radios,
  SelectSearch
} from "../elements/ant-ui";
import {
  InputRedux,
  Breadcrumb,
  BreadcrumbLayout,
  BreadcrumbTitle,
  SapleInput,
  Cards,
  ListSearch,
  AutoComplete
} from "../elements/react-strap";
import {Util} from "../util";
import Enum from "../enums";
import HttpCode from "../constants/error";
import "./layout/styles/Style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";
import {
  Layout,
  Menu,
  Icon,
  Form,
  Collapse,
  Checkbox,
  Modal,
  Popconfirm,
  message,
  Alert,
  Tooltip,
  Tabs,
  Badge,
  Spin
} from "antd";
const Panel = Collapse.Panel;
const { Option } = Select;

const TabPane = Tabs.TabPane;

const CheckboxGroup = Checkbox.Group;

export default class Component extends RComponent {
  constructor(props) {
    super(props);

    // Element Ant ui
    this.Table = CTable;
    this.TableExpand = TableExpand;
    this.SubTable = SubTable;
    this.Button = Button;
    this.Message = message;
    this.Alert = Alert;
    this.Popconfirm = Popconfirm;
    this.Modal = Modal;
    this.Noteicon = () => (<Noteicon/>);
    this.Select = Select;

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
    // this.Badges = Badges;
    this.AutoComplete = AutoComplete;

    //Ant
    this.Layout = Layout;
    this.Menu = Menu;
    this.Icon = Icon;
    this.ActionButton = ActionButton;
    this.Switchs = Switchs;
    this.Waiting = Waiting;
    this.Checkboxs = Checkboxs;
    this.Checkbox = Checkbox;
    this.CheckboxGroup = CheckboxGroup;
    this.Collapse = Collapse;
    this.Panel = Panel;
    this.Tooltip = Tooltip;
    this.Badge = Badge;
    this.Option = Option;
    this.Form = Form;
    this.FieldComponent = FieldComponent;
    this.TrashButton = TrashButton;
    this.LoginLayout = LoginLayout;
    this.InputText = InputText;
    this.InputNumber = InputNumber;
    this.InputPassword = InputPassword;
    this.RadioBox = RadioBox;
    this.RadioChildBox = RadioChildBox;
    this.RadioNormal = RadioNormal;
    this.RadioButton = RadioButton;
    this.Radios = Radios;
    this.InputEmail = InputEmail;
    this.DatePickers = DatePickers;
    this.UploadImg = UploadImg;
    this.Loading = Loading;
    this.Spin = Spin;
    this.TabPane = TabPane;
    this.Tabs = Tabs;
    this.InputTextArea = InputTextArea;
    this.SearchButton = SearchButton;
    this.SelectSearch = SelectSearch;

    // Util function
    this.Util = new Util();

    // ENUM VALUE
    this.Enum = Enum;

    // HTTP CODE
    this.HttpCode = HttpCode;

  }

  changeLanguage(key) {
    return setActiveLanguage(key);
  }

  getCurrentLanguage(state) {
    return getActiveLanguage(state);
  }

  getCurrentIndexLanguage(state) {
    const currentLanguage = getActiveLanguage(state);
    for (var i=0; i<state.languages.length; i++) {
      if (state.languages[i].code ===currentLanguage.code) {
        return i;
      }
    }
  }

  CATranslate(key, state) {
    const currentIndex = this.getCurrentIndexLanguage(state);

    if (state.translations[key] == null) return null;

    return state.translations[key][currentIndex];
  }
}