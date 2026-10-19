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

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cg transform='translate(50, 50)'%3E%3Crect x='10' y='15' width='80' height='70' fill='none' stroke='%23bfbfbf' stroke-width='3' rx='4'/%3E%3Cpolygon points='15,75 35,50 55,65 75,45 85,75' fill='%23d9d9d9'/%3E%3Ccircle cx='70' cy='30' r='8' fill='%23bfbfbf'/%3E%3C/g%3E%3Ctext x='100' y='130' font-family='Arial, sans-serif' font-size='12' fill='%23999' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

// BaseService expects the filter query parameter to contain serialized JSON.
export const PURCHASE_ORDER_ITEM_FILTER = JSON.stringify({
  enableStockTracking: true,
});

export function SelectPurchaseOrderItem(props) {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const requestRef = useRef(0);

  useEffect(() => () => {
    clearTimeout(timeoutRef.current);
    requestRef.current += 1;
  }, []);

  const onSearchItem = (search) => {
    clearTimeout(timeoutRef.current);
    const requestId = ++requestRef.current;
    setLoading(true);
    setItems([]);
    timeoutRef.current = setTimeout(() => {
      ItemService.get({ limit: 15, search, filter: PURCHASE_ORDER_ITEM_FILTER })
        .then((response) => {
          if (requestId !== requestRef.current) return;
          const results = response && response.data ? response.data.data || [] : [];
          setItems(results);
          if (props.callback) props.callback(results);
        })
        .catch(() => {
          if (requestId !== requestRef.current) return;
          setItems([]);
          message.error("Could not load items. Please try again.");
        })
        .finally(() => {
          if (requestId === requestRef.current) setLoading(false);
        });
    }, 1000);
  };

  const renderItems = items === null ? props.items || [] : items;
  // Keep historical PO items readable without offering them as new choices.
  const selectedItem = props.selectedItem;
  const showSelectedItem = selectedItem && selectedItem.id != null &&
    !renderItems.some((item) => item.id === selectedItem.id);

  return (
    <Select
      showSearch
      style={{ width: "100%" }}
      placeholder="Type to search or pick an item"
      onChange={props.onChange}
      onSearch={onSearchItem}
      defaultValue={props.defaultValue}
      value={props.value !== undefined ? props.value : props.defaultValue}
      filterOption={false}
      notFoundContent={loading ? <Icon type="loading" /> : "No items found"}
    >
      {showSelectedItem && (
        <Option key={selectedItem.id} value={selectedItem.id} disabled>
          {selectedItem.name}
        </Option>
      )}
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
