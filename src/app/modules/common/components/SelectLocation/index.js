import React from "react";
import {Translate} from "react-localize-redux";
import {Select} from "antd";
import LocationService from "../../../pos/services/settings/LocationService";

export default function SelectLocation(props) {
    const { Option } = Select;
    const [locations, setLocations] = React.useState([]);

    React.useState(() => {
        LocationService.lists()
        .then(response => {
            if (response.data) {
                setLocations(response.data.data);
            }
        });
    }, []);

    return <div style={{ position: "relative", minWidth: 200 }}>
        <Select
            value={props.value}
            defaultValue={props.defaultValue}
            style={{ width: 200, marginRight: 15 }}
            onChange={props.onChange}
            id={props.id}>
            <Option value={0}><Translate id="text_all_stores" /></Option>
            {
                locations.map((location, index) => 
                    <Option value={location.id} key={index}>{location.name}</Option>
                )
            }
        </Select>
        <div style={{ position: "absolute", top: 0, paddingLeft: 7, paddingTop: 5, cursor: "pointer"}}>{props.prefixString}: </div>
    </div>
}