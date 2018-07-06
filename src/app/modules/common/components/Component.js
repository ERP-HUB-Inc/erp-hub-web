import React, { Component as RComponent } from "react";
import { Translate, setActiveLanguage } from "react-localize-redux";
import { Field } from "redux-form";
import { Field as SynField } from "redux-form/immutable";
import { connect } from "react-redux";
import 
{ 
  CTable,
  CModal,
  Noteicon,
  Selects,
  DateRank,
  ActionButton,
  Switchs,
  SapleInput as Antinput,
  Waiting,
  Checkboxs
} from "../elements/ant-ui";
import Header from "../elements/ant-ui/Header";
import { InputRedux,
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
  Button,
  Dropdown, 
  DropdownItem, 
  DropdownToggle, 
  DropdownMenu,
  FormGroup,
  Label,
  FormText
} from "reactstrap";
import { NavLink } from "react-router-dom";
import "./layout/styles/Style.css";
import "bootstrap/dist/css/bootstrap.css";
import { Layout, Menu, Icon , Select, Collapse } from "antd";
const Panel = Collapse.Panel;

export default class Component extends RComponent {
  constructor(props) {
    super(props);

    // Element Ant ui
    this.Table = () => (<CTable/>);
    this.Modal = () => (<CModal/>);
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
    this.SynField = SynField;
    this.connect = connect;

    //React Strap 
    this.Container = Container;
    this.Col = Col;
    this.Row = Row;
    this.InputRedux = InputRedux;
    this.Form = Form;
    this.Button = Button;
    this.Dropdown = Dropdown;
    this.DropdownItem = DropdownItem;
    this.DropdownToggle = DropdownToggle;
    this.DropdownMenu = DropdownMenu;
    this.NavLink = NavLink;
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
    
    //Redux
    // this.Field = Field;

    //Ant
    this.Layout = Layout;
    this.Menu = Menu;
    this.Icon = Icon;
    this.Select = Select;
    this.ActionButton = ActionButton;
    this.Switchs = Switchs;
    this.Antinput = Antinput;
    this.Waiting = Waiting;
    this.Checkboxs = Checkboxs;
    this.Collapse = Collapse;
    this.Panel = Panel;

  }

  changeLanguage(key) {
    return setActiveLanguage(key);
  }
}