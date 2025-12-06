import React from "react";
import { Select } from "antd";
import { 
    useState, 
    useEffect, 
    useImperativeHandle, 
    forwardRef,
    useRef
} from "react";
import LocationService from "@services/LocationService";
import { Translate } from "@redux/index";

const SelectLocation = forwardRef((props, ref) => {
  const locationsList = [{ name: <Translate id="text_all_location"/>, id: 0 }];
  const [locations, setLocations] = useState([]);
  const [pageSize, setPageSize] = useState(50);

  const debounceRef = useRef(null);
  const loadingRef = useRef(true);

  useEffect(() => {
    LocationService.get({ limit: pageSize })
    .then(response => {
        if (response && response.data) {
            setLocations(response.data.data);
        }
    })
    .finally(() => {
      loadingRef.current = false;
    });
  }, []);

  const handleChange = (value) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const handleSearch = (search) => {
    // Clear existing timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce timer
    debounceRef.current = setTimeout(() => {
      loadingRef.current = true;

      LocationService.get({ search, limit: pageSize })
      .then(response => {
        if (response && response.data) {
          setLocations(response.data.data);
        }
      })
      .finally(() => {
        loadingRef.current = false;
      });

    }, 400); // delay in ms (e.g. 400ms)
  };

  useImperativeHandle(ref, () => ({
    getSelectedLocation: () => selectedValue,
  }));

  return (
    <Select
      showSearch
      allowClear
      placeholder={<Translate id="text_all_location" />}
      defaultValue={0}
      filterOption={false}
      onChange={handleChange}
      onSearch={handleSearch}
      loading={loadingRef.current}
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
