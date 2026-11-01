import React from "react";
import { Alert, Button, Divider, Dropdown, Icon, Menu, Table } from "antd";
import VariantService from "@services/VariantService";
import Enum from "../../../../enums";
import { QuantityValue } from "../../../../components/stateless/quantity.value";
import IncomingStock from "./incoming-stock";
import { itemListColumnWidths } from "./item-list-columns";
import ItemSellingPrice from "./item-selling-price";

export function hasItemVariants(item) {
  return Number(item.productOption) === Enum.PRODUCT_VARIANT || (item.productVariants || []).length > 1;
}

const defaultColumns = [
  { key: "name" },
  ...Object.keys(itemListColumnWidths).map(key => ({ key, width: itemListColumnWidths[key] }))
];

export default function ItemVariants({ itemId, formatCurrency, stockUnit, itemType, enableInventoryTracking, onView, onEdit, onDelete, onEditStock, deletingVariantId, parentColumns = defaultColumns }) {
  const [page, setPage] = React.useState(1);
  const [attempt, setAttempt] = React.useState(0);
  const [result, setResult] = React.useState({ rows: [], total: 0, loading: true, error: "" });
  const pageSize = 10;

  React.useEffect(() => {
    let current = true;
    setResult({ rows: [], total: 0, loading: true, error: "" });
    const load = async () => {
      try {
        const response = await VariantService.getVariantsByItemId({ itemId, limit: pageSize, offset: (page - 1) * pageSize });
        const body = response && response.data;
        const total = Number(body && body.pagination && body.pagination.total);
        if (!body || !Array.isArray(body.data) || !Number.isSafeInteger(total) || total < 0 || body.data.some(row => !row || !row.id)) {
          throw new Error("Invalid variant response.");
        }
        if (current) setResult({ rows: body.data, total, loading: false, error: "" });
      } catch (_) {
        if (current) setResult({ rows: [], total: 0, loading: false, error: "Unable to load variants. Please try again." });
      }
    };
    load();
    return () => { current = false; };
  }, [itemId, page, attempt]);

  const variantColumns = {
    name: { title: "Variant", dataIndex: "name", render: (name, row) => <div className="item-variant-identity">
      <strong>{name || "Unnamed variant"}</strong>
      <small>Barcode: {row.barcode || "—"}</small>
    </div> },
    itemType: { title: "Type", render: () => itemType?.name?.trim() ? itemType.name : "Not set" },
    incomingStock: { title: "Incoming Stock", dataIndex: "incomingStock", align: "right",
      render: value => <IncomingStock quantity={value} unit={stockUnit} /> },
    quantity: { title: "Stock on Hand", dataIndex: "quantity", align: "right", render: value =>
      value == null || String(value).trim() === "" || !Number.isFinite(Number(value))
        ? "—" : <QuantityValue quantity={value} unit={stockUnit} decimals={2} /> },
    price: { title: "Selling Price & Margin", dataIndex: "price", align: "right", render: (price, row) =>
      <ItemSellingPrice price={price} cost={row.cost} formatCurrency={formatCurrency} enableInventoryTracking={enableInventoryTracking} /> },
    action: { title: "Actions", align: "center", render: (_, row) => <Dropdown placement="bottomLeft" overlay={
      <Menu>
        <Menu.Item key="view" disabled={!onView} onClick={() => onView(row)}><Icon type="eye" /> View</Menu.Item>
        <Menu.Item key="edit" disabled={!onEdit} onClick={() => onEdit(row)}><Icon type="edit" /> Edit</Menu.Item>
        <Divider style={{ marginTop: 4, marginBottom: 4 }} />
        <Menu.Item key="delete" disabled={!onDelete || Boolean(deletingVariantId)} onClick={() => onDelete(row)}><Icon type="delete" /> Delete</Menu.Item>
        <Menu.Item key="stock" disabled={!onEditStock || enableInventoryTracking !== true} onClick={() => onEditStock(row)}><Icon type="edit" /> Edit Stock</Menu.Item>
      </Menu>
    }><Button icon="more" aria-label={`Options for ${row.name || "variant"}`} loading={deletingVariantId === row.id} /></Dropdown> }
  };

  return <div className="item-variants" aria-label="Item variants">
    {result.error && <Alert type="error" showIcon role="alert" message={result.error}
      description={<Button size="small" onClick={() => setAttempt(value => value + 1)}>Retry variants</Button>} />}
    <Table className="item-variants-table" rowKey="id" size="middle" tableLayout="fixed" loading={result.loading} dataSource={result.rows}
      columns={parentColumns.map(({ key, width }) => ({ ...variantColumns[key], key, width }))}
      pagination={result.error ? false : { current: page, pageSize, total: result.total, hideOnSinglePage: true, onChange: setPage }}
      locale={{ emptyText: result.error ? "Variants could not be loaded." : "No active variants found." }} />
  </div>;
}
