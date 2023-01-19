import React from "react";
import {Translate} from "react-localize-redux";
import {Select} from "antd";
import EmployeeService from "../../../hr/services/employees/EmployeeService";

export default function SelectSeller(props) {
    const { Option } = Select;
    const [sellers, setSellers] = React.useState([]);

    React.useState(() => {
        EmployeeService.lists(15, 0)
        .then(response => {
            if (response.data) {
                setSellers(response.data.data);
            }
        });
    }, []);

    return <Select
        value={props.value}
        defaultValue={props.defaultValue}
        style={{ width: 200, marginRight: 15 }}
        allowClear={true}
        onChange={props.onChange}
        placeholder={props.placeholder}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        id={props.id}>
        <Option value={0}><Translate id="text_all_seller" /></Option>
        {sellers.map((seller, index) => <Option value={seller.id} key={index}>{seller.firstName} {seller.lastName}</Option>)}
    </Select>;
};