import React, { Component as RComponent } from "react";
import { Translate, setActiveLanguage } from "react-localize-redux";
import { Field } from "redux-form";
import 
{ 
  CTable,
  CModal
} from "../elements/ant-ui";
import Header from "../elements/ant-ui/Header";
import { InputRedux } from "../elements/react-strap";
import {  
  Container,
  Col,
  Row,
  Form,
  Button,
  Dropdown, 
  DropdownItem, 
  DropdownToggle, 
  DropdownMenu
} from "reactstrap";
import "./layout/styles/Style.css";
import "bootstrap/dist/css/bootstrap.css";
import { Layout, Menu, Icon } from "antd";

export default class Component extends RComponent {
  constructor(props) {
    super(props);

    // Element
    this.Table = () => (<CTable/>);
    this.Modal = () => (<CModal/>);
    this.Header = () => (<Header/>);

    // Other
    this.clearFloating = () => <div className="clearFloat"></div>;

    // Localization
    this.Translate = Translate;

    // Function
    this.changeLanguage = this.changeLanguage.bind(this);

    // Redux Form
    this.Field = Field;

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

    //Redux
    // this.Field = Field;

    //Ant
    this.Layout = Layout;
    this.Menu = Menu;
    this.Icon = Icon;

  }

  changeLanguage(key) {
    return setActiveLanguage(key);
  }
}