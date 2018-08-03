import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Employee extends Component {
    render() {
        return(
            <tr onClick={this.props.onClick}>
                <td>
                    {this.props.name}
                </td>
                <td>
                    {this.props.position}
                </td>
            </tr>
        );
    }
}

Employee.propTypes = {
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};