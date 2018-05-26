import React, { Component } from "react";
import PropTypes from "prop-types";
import Employee from "./Employee";

export default class EmployeeList extends Component {
    render() {
        return (
            <div>
                {
                    <table border={1}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.employees.map((employee, index) => (
                                    <Employee key={index} {...employee} onClick={() => this.props.todoOnClick(employee)}/>
                                ))
                            }
                        </tbody>
                    </table>
                }
                <div>
                    <button onClick={() => this.props.changeLanguage("en")}>English</button>
                </div>
                <div>
                    <button onClick={() => this.props.changeLanguage("fr")}>French</button>
                </div>
                <div>
                    <button onClick={() => this.props.changeLanguage("es")}>Espance</button>
                </div>
            </div>
        );
    }
}

EmployeeList.propTypes = {
    employees: PropTypes.array.isRequired,
    todoOnClick: PropTypes.func.isRequired
};