import React from "react";
import { Select } from "antd";
import { 
    useState, 
    useEffect, 
    useImperativeHandle, 
    forwardRef
} from "react";
import LocationService from "@services/LocationService";
import { Translate } from "@redux/index";

const SelectLocation = forwardRef((props, ref) => {
  const locationsList = [{ name: <Translate id="text_all_stores"/>, id: 0 }];
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    LocationService.get()
    .then(response => {
        if (response && response.data) {
            setLocations(response.data.data);
        }
    });
  }, []);

  const handleChange = (value) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const handleSearch = (search) => {
    LocationService.get({ search })
    .then(response => {
       if (response && response.data) {
        setLocations(response.data.data);
       }
    });
  };

  useImperativeHandle(ref, () => ({
    getSelectedLocation: () => selectedValue,
  }));

  return (
    <Select
      showSearch
      allowClear
      placeholder={<Translate id="text_all_stores" />}
      defaultValue={0}
      filterOption={false}
      onChange={handleChange}
      onSearch={handleSearch}
      style={{ width: 180, marginRight: 15 }}
    >
      {locationsList.concat(locations).map((item) => (
        <Select.Option value={item.id} key={item.id}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );
});

export {
    SelectLocation
};
