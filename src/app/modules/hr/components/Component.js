import React, { Component as RComponent } from "react";
import { 
    CTable,
    CModal
} from "../../../components/material-ui";

export default class Component extends RComponent {
    constructor(props) {
        super(props);
        this.Table = () => (<CTable/>);
        this.Modal = () => (<CModal/>);
    }
}