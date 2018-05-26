import React from "react";
import EmployeeList from "../comtainers/EmployeeList";
import Component from "./Component";

export default class App extends Component {
    render() {
        return (
            <div>
                <this.Modal />
                <this.Table />
                <EmployeeList />
            </div>
        );
    }
}