import React from "react";
import {Translate} from "react-localize-redux";
import {Select} from "antd";
import CategoryService from "../../../inventory/services/products/ProductsTypeService";

export default function SelectCategory(props) {
    const { Option } = Select;
    const [categories, setCategories] = React.useState([]);

    React.useState(() => {
        CategoryService.lists()
        .then(response => {
            if (response.data) {
                setCategories(response.data.data);
            }
        });
    }, []);

    return <Select
        value={props.value}
        defaultValue={props.defaultValue}
        style={{ width: 200, marginRight: 15 }}
        onChange={props.onChange}
        placeholder={props.placeholder}
        label={props.label}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        id={props.id}>
        <Option value={0}><Translate id="text_all" /></Option>
        {
            categories.map((category, index) => 
                <Option value={category.id} key={index}>{category.name}</Option>
            )
        }
    </Select>;
};