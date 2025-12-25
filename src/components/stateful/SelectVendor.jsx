import React from "react";
import { Select } from "antd";
import { 
    useState, 
    useEffect, 
    useImperativeHandle, 
    forwardRef,
    useRef
} from "react";
import VendorService from "@services/VendorService";
import { Translate } from "@redux/index";

const SelectVendor = forwardRef((props, ref) => {
  const vendors = [{ name: <Translate id="text_all_vendors" />, id: 0 }];
  const [data, setData] = useState([]);
  const [pageSize] = useState(20);

  const debounceRef = useRef(null);
  const loadingRef = useRef(true);

  useEffect(() => {
    VendorService.get({ limit: pageSize })
      .then((response) => {
        if (response && response.data) {
          let responseVendors = response.data.data;

          if (props.selectedItem) {
            const exists = responseVendors.some(
              (v) => v.id === props.selectedItem.id
            );

            if (!exists) {
              responseVendors = [props.selectedItem, ...responseVendors];
            }
          }

          setData(responseVendors);
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
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      loadingRef.current = true;

      VendorService.get({ search, limit: pageSize })
        .then((response) => {
          if (response && response.data) {
            setData(response.data.data);
          }
        })
        .finally(() => {
          loadingRef.current = false;
        });
    }, 400);
  };

  useImperativeHandle(ref, () => ({
    getSelectedLocation: () => selectedValue,
  }));

  return (
    <Select
      showSearch
      allowClear
      placeholder={<Translate id="text_all_vendors" />}
      defaultValue={props.defaultValue}
      size={props.size ? props.size : "large"}
      filterOption={false}
      onChange={handleChange}
      onSearch={handleSearch}
      loading={loadingRef.current}
      style={{ width: props.width ? props.width : 180, marginRight: 15 }}
    >
      {vendors.concat(data).map((item) => (
        <Select.Option value={item.id} key={item.id}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );
});

export { SelectVendor };
