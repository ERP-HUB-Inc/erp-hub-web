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
  Col,
  Row
} from "reactstrap";
import "./layout/styles/Style.scss";

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
    this.Col = Col;
    this.Row = Row;
    this.InputRedux = InputRedux;

    //Redux
    // this.Field = Field;

  }

  changeLanguage(key) {
    return setActiveLanguage(key);
  }
}