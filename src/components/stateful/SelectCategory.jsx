import React from "react";
import { Select } from "antd";
import { 
  useState, 
  useEffect, 
  useImperativeHandle, 
  forwardRef,
  useRef
} from "react";
import CategoryService from "@services/CategoryService";
import { Translate } from "@redux/index";

const SelectCategory = forwardRef((props, ref) => {
  const categoriesList = [{ name: <Translate id="text_all_categories"/>, id: 0 }];
  const [categories, setCategories] = useState([]);
  const [pageSize, setPageSize] = useState(50);
  const debounceRef = useRef(null);
  const loadingRef = useRef(true);

  useEffect(() => {
    CategoryService.get({ limit: pageSize })
    .then(response => {
        if (response && response.data) {
            setCategories(response.data.data);
        }
    })
    .finally(() => {
      loadingRef.current = false;
    });
  }, []);

  const handleChange = (value) => {
    if (!value) {
      loadingRef.current = true;

      CategoryService.get()
      .then((response) => {
        if (response?.data) {
          setCategories(response.data.data);
        }
      })
      .finally(() => {
        loadingRef.current = false;
      });
    }

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

      CategoryService.get({ search }).then((response) => {
        if (response?.data) {
          setCategories(response.data.data);
        }
      })
      .finally(() => {
        loadingRef.current = false;
      });
    }, 400); // delay in ms (e.g. 400ms)
  };

  useImperativeHandle(ref, () => ({
    getSelectedCategory: () => selectedValue,
  }));

  return (
    <Select
      showSearch
      allowClear
      placeholder={<Translate id="text_all_categories"/>}
      defaultValue={0}
      filterOption={false}
      onChange={handleChange}
      onSearch={handleSearch}
      loading={loadingRef.current}
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
