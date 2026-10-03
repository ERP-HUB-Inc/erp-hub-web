import React, {
  useState
} from "react";
import {
  Icon,
  Select,
  Tooltip
} from "antd";
import ItemService from "@services/ItemService";
import Util from "@helper/inventory";

const { Option } = Select;

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cg transform='translate(50, 50)'%3E%3Crect x='10' y='15' width='80' height='70' fill='none' stroke='%23bfbfbf' stroke-width='3' rx='4'/%3E%3Cpolygon points='15,75 35,50 55,65 75,45 85,75' fill='%23d9d9d9'/%3E%3Ccircle cx='70' cy='30' r='8' fill='%23bfbfbf'/%3E%3C/g%3E%3Ctext x='100' y='130' font-family='Arial, sans-serif' font-size='12' fill='%23999' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

export function SelectItem(props) {
     const [items, setItems] = useState([]);
     const [loading, setLoading] = useState(false);
     let timeout = null;

     const onSearchItem = (search) => {
          const limit = 15;
          clearTimeout(timeout);
          timeout = setTimeout(() => {
               setLoading(true);
               ItemService.get({ limit, search })
               .then((response) => {
                  if (response && response.data) {
                    setItems(response.data.data);
                    if (props.callback) {
                      props.callback(response.data.data);
                    }
                  }
               })
               .finally(() => {
                    setLoading(false);
               });
          }, 1000);
     };

     const renderItems = items.length > 0 ? items : props.items;

     return (
       <Select
         showSearch
         style={{ width: "100%" }}
         placeholder="Type to search or pick an item"
         onChange={props.onChange}
         onSearch={onSearchItem}
         defaultValue={props.defaultValue}
         filterOption={false}
         notFoundContent={loading ? <Icon type="loading" /> : "No items found"}
       >
         {renderItems.map((item) => (
           <Option key={item.id} value={item.id}>
             <Tooltip title={item.name} placement="right">
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
}
