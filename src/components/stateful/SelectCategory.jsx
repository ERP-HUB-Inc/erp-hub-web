import React from "react";
import { Select } from "antd";
import { 
    useState, 
    useEffect, 
    useImperativeHandle, 
    forwardRef
} from "react";
import CategoryService from "@services/CategoryService";
import { Translate } from "@redux/index";

const SelectCategory = forwardRef((props, ref) => {
  const categoriesList = [{ name: <Translate id="text_all_categories"/>, id: 0 }];
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    CategoryService.get()
    .then(response => {
        if (response && response.data) {
            setCategories(response.data.data);
        }
    });
  }, []);

  const handleChange = (value) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const handleSearch = (search) => {
    CategoryService.get({ search })
    .then(response => {
       if (response && response.data) {
        setCategories(response.data.data);
       }
    });
  };

  useImperativeHandle(ref, () => ({
    getSelectedCategory: () => selectedValue,
  }));

  return (
    <Select
      showSearch
      allowClear
      placeholder={<Translate id="text_all_categories" />}
      defaultValue={0}
      filterOption={false}
      onChange={handleChange}
      onSearch={handleSearch}
      style={{ width: 180, marginRight: 15, marginLeft: 15 }}
    >
      {categoriesList.concat(categories).map((item) => (
        <Select.Option value={item.id} key={item.id}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );
});

export {
    SelectCategory
};
