import React, {
  useState,
  useEffect,
  useRef
} from "react";
import {
  Icon,
  Select,
  Tooltip,
  message
} from "antd";
import ItemService from "@services/ItemService";
import Util from "@helper/inventory";

const { Option } = Select;

const itemOptions = (items, selectVariants) => (items || []).reduce((options, item) => {
  if (!selectVariants) return [...options, { value: item.id, item, label: item.name }];
  return [...options, ...(item.productVariants || []).filter(variant => variant.id != null).map(variant => ({
    value: variant.id,
    item: { ...item, productVariants: [variant] },
    label: [item.name, variant.name].filter(Boolean).join(" - "),
    variantName: variant.name,
  }))];
}, []);

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cg transform='translate(50, 50)'%3E%3Crect x='10' y='15' width='80' height='70' fill='none' stroke='%23bfbfbf' stroke-width='3' rx='4'/%3E%3Cpolygon points='15,75 35,50 55,65 75,45 85,75' fill='%23d9d9d9'/%3E%3Ccircle cx='70' cy='30' r='8' fill='%23bfbfbf'/%3E%3C/g%3E%3Ctext x='100' y='130' font-family='Arial, sans-serif' font-size='12' fill='%23999' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

export const SelectItem = React.forwardRef(function SelectItem(props, ref) {
     const [items, setItems] = useState(null);
     const [loading, setLoading] = useState(false);
     const timeout = useRef(null);
     const request = useRef(0);

     useEffect(() => () => {
       clearTimeout(timeout.current);
       request.current += 1;
     }, []);

     const onSearchItem = (search) => {
          const limit = 15;
          clearTimeout(timeout.current);
          const requestId = ++request.current;
          setLoading(true);
          timeout.current = setTimeout(() => {
               ItemService.get({ limit, search, ...(props.locationId ? { locationId: props.locationId } : {}) })
               .then((response) => {
                  if (requestId !== request.current) return;
                  if (response && response.data) {
                    setItems(response.data.data || []);
                    if (props.callback) {
                      props.callback(response.data.data);
                    }
                  }
               })
               .catch(() => {
                    if (requestId !== request.current) return;
                    setItems([]);
                    message.error("Could not load items. Please try again.");
               })
               .finally(() => {
                    if (requestId === request.current) setLoading(false);
               });
          }, 1000);
     };

     useEffect(() => {
       clearTimeout(timeout.current);
       request.current += 1;
       setItems(null);
       setLoading(false);
     }, [props.locationId]);

     const options = itemOptions(items === null ? props.items : items, props.selectVariants);
     const selectedOption = itemOptions(props.selectedItem ? [props.selectedItem] : [], props.selectVariants)[0];
     if (selectedOption && !options.some(option => option.value === selectedOption.value)) {
       options.push({ ...selectedOption, disabled: true });
     }

     return (
       <Select
         ref={ref}
         showSearch
         style={{ width: "100%" }}
         placeholder="Type to search or pick an item"
         onChange={(value, option) => {
           if (props.selectVariants) {
             const selected = options.find(item => item.value === value);
             props.onChange(value, selected && selected.item);
           } else {
             props.onChange(value, option);
           }
         }}
         onSearch={onSearchItem}
         defaultValue={props.defaultValue}
         value={props.value !== undefined ? props.value : props.defaultValue}
         filterOption={false}
         notFoundContent={loading ? <Icon type="loading" /> : "No items found"}
       >
         {options.map(({ value, item, label, variantName, disabled }) => (
           <Option key={value} value={value} disabled={disabled}>
             <Tooltip title={label} placement="right">
               <div
                 style={{ display: "flex", alignItems: "center", gap: "10px" }}
               >
                 <img
                   src={
                     item.thumbnail || item.image || "/placeholder-image.png"
                   }
                   alt={item.name}
                   style={{
                     width: "40px",
                     height: "40px",
                     objectFit: "cover",
                     borderRadius: "4px",
                     flexShrink: 0,
                   }}
                   onError={(e) => {
                     e.target.src = FALLBACK_IMAGE;
                   }}
                 />
                 <div style={{ flex: 1, minWidth: 0 }}>
                   <div
                     style={{
                       fontWeight: 500,
                       overflow: "hidden",
                       textOverflow: "ellipsis",
                       whiteSpace: "nowrap",
                     }}
                   >
                     {item.name}
                   </div>
                   {variantName && <small style={{ display: "block", color: "#666" }}>{variantName}</small>}
                   <small style={{ color: "#999" }}>
                     SKU: {Util.getItemSku(item)} | Stock:{" "}
                     {Util.getQuantityOnHand(item)} {item.stockUnit ? item.stockUnit.name : "Pcs"}
                   </small>
                 </div>
               </div>
             </Tooltip>
           </Option>
         ))}
       </Select>
     );
});
