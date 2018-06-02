import React, { Component as RComponent } from "react";
import { Translate, setActiveLanguage } from "react-localize-redux";
import { 
    CTable,
    CModal
} from "../elements/ant-ui";
import "./layout/styles/Style.css";
import "./layout/styles/Style.scss";

export default class Component extends RComponent {
    constructor(props) {
        super(props);

        // Element
        this.Table = () => (<CTable/>);
        this.Modal = () => (<CModal/>);

        // Other
        this.clearFloating = () => <div className="clearFloat"></div>;

        // Localization
        this.Translate = Translate;

        // Function
        this.changeLanguage = this.changeLanguage.bind(this);
    }

    changeLanguage(key) {
        return setActiveLanguage(key);
    }
}