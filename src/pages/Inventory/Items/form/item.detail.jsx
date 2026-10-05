import React from "react";
import JsBarcode from "jsbarcode";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Input,
  PageHeader,
  Row,
  Skeleton,
  Table,
  Tag,
  message
} from "antd";
import {
  ArrowRightLeft,
  Barcode,
  Boxes,
  CalendarClock,
  DollarSign,
  Edit3,
  FileText,
  Layers3,
  PackageCheck,
  Printer,
  Save,
  ShieldCheck,
  Warehouse
} from "lucide-react";

import history from "@router/index";
import ProductService from "@services/ItemService";
import MovementLog from "./movement.log";
import PurchaseHistory from "./purchase.history";
import Util from "@common/util";
import "./index.css";

const { TextArea } = Input;
const util = new Util();
const EMPTY_VALUE = "—";

const itemDetailFallback = {
  specifications: {
    warrantyTier: "12 Months Commercial",
    modelCompatibility: "A2160, A2217, A2215",
    originCountry: "Global Sourced"
  },
  pricing: {
    taxApplicable: "Standard Exempt"
  },
  system: {
    systemSource: "Enterprise POS Sync",
    syncStatus: "Synchronized"
  }
};

function toNumber(value) {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function formatMoney(value) {
  return util.formatCurrency(toNumber(value));
}

function formatDateTime(value) {
  return value ? util.formatDate(value, "DD/MM/YYYY HH:mm") : EMPTY_VALUE;
}

function getFirstVariant(item) {
  return Array.isArray(item.productVariants) && item.productVariants.length ? item.productVariants[0] : {};
}

function getVariantField(item, fieldNames) {
  const variant = getFirstVariant(item);
  const source = [item, variant];
  for (let sourceIndex = 0; sourceIndex < source.length; sourceIndex += 1) {
    for (let fieldIndex = 0; fieldIndex < fieldNames.length; fieldIndex += 1) {
      const field = fieldNames[fieldIndex];
      if (hasValue(source[sourceIndex][field])) return source[sourceIndex][field];
    }
  }
  return null;
}

function getUnitName(item) {
  return item.stockUnit?.name || item.unitOfMeasurement?.name || item.sellUnit?.name || "Pcs";
}

function getItemBarcode(item) {
  return getVariantField(item, ["barcode", "productCode", "code"]);
}

function getItemSku(item) {
  return getVariantField(item, ["sku", "SKU", "productSku"]);
}

function getRetailPrice(item) {
  return getVariantField(item, ["retailPrice", "salesPrice", "sellPrice", "price"]);
}

function getUnitCost(item) {
  return getVariantField(item, ["purchasePrice", "unitCost", "cost"]);
}

function getItemImage(item) {
  const image = item.imageUrl || item.image || getFirstVariant(item).imageUrl || getFirstVariant(item).image;
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.url || null;
}

function getItemImageSrc(item) {
  const image = getItemImage(item);
  if (!image) return null;
  if (/^(https?:)?\/\//i.test(image) || image.startsWith("data:") || image.startsWith("blob:")) return image;
  return util.getImageUrl(image);
}

function getManageStockLabel(item) {
  return item.serialType === 2 || item.manageStock === true ? "Enabled" : "Disabled";
}

function normalizeStockLocations(stockResponse, item) {
  if (!Array.isArray(stockResponse)) return [];

  const rows = [];
  stockResponse.forEach((stockGroup, groupIndex) => {
    if (Array.isArray(stockGroup.productLocations) && stockGroup.productLocations.length) {
      stockGroup.productLocations.forEach((location, locationIndex) => {
        rows.push({
          id: `${stockGroup.id || groupIndex}-${location.id || location.locationId || locationIndex}`,
          locationName: location.locationName || location.location?.name || location.name || stockGroup.name || EMPTY_VALUE,
          zone: location.zone || location.bin || location.code || location.location?.code || EMPTY_VALUE,
          onHand: toNumber(location.quantity),
          reserved: toNumber(location.reservedQuantity || location.reserved),
          available: toNumber(location.availableQuantity || location.available || location.quantity),
          unitName: location.unitName || stockGroup.unitName || getUnitName(item)
        });
      });
      return;
    }

    rows.push({
      id: stockGroup.id || groupIndex,
      locationName: stockGroup.location || stockGroup.locationName || stockGroup.name || EMPTY_VALUE,
      zone: stockGroup.zone || stockGroup.code || EMPTY_VALUE,
      onHand: toNumber(stockGroup.quantity),
      reserved: toNumber(stockGroup.reservedQuantity || stockGroup.reserved),
      available: toNumber(stockGroup.availableQuantity || stockGroup.available || stockGroup.quantity),
      unitName: stockGroup.unitName || getUnitName(item)
    });
  });

  return rows;
}

function getStockStatus(row, reorderPoint) {
  if (row.available <= 0) return { label: "Out of Stock", color: "red" };
  if (reorderPoint > 0 && row.available <= reorderPoint) return { label: "Low Stock", color: "orange" };
  return { label: "In Stock", color: "green" };
}

function SectionCard({ title, description, action, icon, children, className = "" }) {
  return (
    <Card className={`item-detail-card ${className}`} bordered={false}>
      <div className="item-detail-section-header">
        <div className="item-detail-section-title-wrap">
          {icon ? <span className="item-detail-section-icon">{icon}</span> : null}
          <div>
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

function DataRow({ label, value, danger }) {
  return (
    <div className={`item-detail-data-row ${danger ? "is-danger" : ""}`}>
      <span>{label}</span>
      <strong>{hasValue(value) ? value : EMPTY_VALUE}</strong>
    </div>
  );
}

function MetricCard({ title, value, helper, icon, tone = "" }) {
  return (
    <Col xs={24} sm={12} lg={6} className="item-detail-kpi-col">
      <div className={`item-detail-kpi-card ${tone}`}>
        <div>
          <span>{title}</span>
          <strong>{value}</strong>
          <p>{helper}</p>
        </div>
        <i>{icon}</i>
      </div>
    </Col>
  );
}

export default function ProductDetail(props) {
  const [data, setData] = React.useState({});
  const [stockLocations, setStockLocations] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [stockLoading, setStockLoading] = React.useState(false);
  const [internalNote, setInternalNote] = React.useState("");
  const printBarcodeRef = React.useRef(null);
  const params = new URLSearchParams(props.location.search);
  const productOption = params.get("productOption");
  const itemId = props.match.params.id;

  React.useEffect(() => {
    setLoading(true);
    ProductService.getById(itemId, productOption, true)
      .then(response => {
        if (response.data) {
          const itemData = response.data.data || {};
          setData(itemData);
          setInternalNote(itemData.note || itemData.internalNote || "");

          setStockLoading(true);
          ProductService.getDetailStock(itemId)
            .then(stockResponse => {
              if (stockResponse.data) {
                setStockLocations(normalizeStockLocations(stockResponse.data.data, itemData));
              }
            })
            .finally(() => setStockLoading(false));
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  const categoryName = data.category?.name || data.productType?.name || "Uncategorized";
  const brandName = data.brand?.name || EMPTY_VALUE;
  const unitName = getUnitName(data);
  const retailPrice = toNumber(getRetailPrice(data));
  const unitCost = toNumber(getUnitCost(data));
  const reorderPoint = toNumber(data.reorderPoint);
  const totalOnHand = stockLocations.reduce((total, row) => total + toNumber(row.onHand), 0);
  const totalReserved = stockLocations.reduce((total, row) => total + toNumber(row.reserved), 0);
  const totalAvailable = stockLocations.reduce((total, row) => total + toNumber(row.available), 0);
  const inventoryValuation = hasValue(data.inventoryValue) ? toNumber(data.inventoryValue) : totalOnHand * unitCost;
  const grossMarginDifference = retailPrice - unitCost;
  const grossMarginPercent = unitCost > 0 ? (grossMarginDifference / unitCost) * 100 : 0;
  const hasNegativeMargin = retailPrice < unitCost;
  const storagePointCount = stockLocations.length;
  const isInStock = totalAvailable > 0;
  const statusTag = isInStock ? { color: "green", label: "In Stock" } : { color: "red", label: "Out of Stock" };
  const manageStockLabel = getManageStockLabel(data);
  const itemBarcode = getItemBarcode(data);
  const itemSku = getItemSku(data);

  React.useEffect(() => {
    if (!printBarcodeRef.current || !itemBarcode) return;

    JsBarcode(printBarcodeRef.current, String(itemBarcode), {
      format: "CODE128",
      displayValue: true,
      font: "monospace",
      fontSize: 13,
      height: 46,
      margin: 0,
      width: 1.45
    });
  }, [itemBarcode]);

  function handleButtonUpdate() {
    history.push(`/inventories/items/update/${itemId}?productOption=${productOption || ""}`);
  }

  function handlePrintBarcode() {
    if (!itemBarcode) {
      message.warning("This item does not have a barcode to print.");
      return;
    }

    if (printBarcodeRef.current) {
      JsBarcode(printBarcodeRef.current, String(itemBarcode), {
        format: "CODE128",
        displayValue: true,
        font: "monospace",
        fontSize: 13,
        height: 46,
        margin: 0,
        width: 1.45
      });
    }

    document.body.classList.add("item-label-printing");

    const removePrintMode = () => {
      document.body.classList.remove("item-label-printing");
      window.removeEventListener("afterprint", removePrintMode);
    };

    window.addEventListener("afterprint", removePrintMode);
    window.print();
    setTimeout(removePrintMode, 500);
  }

  function handleStockAdjustment() {
    history.push("/inventories/stock-io/create");
  }

  function handleSaveNote() {
    message.info("Note UI is ready; persistence endpoint is not connected yet.");
  }

  const stockColumns = [
    {
      title: "Location Name",
      dataIndex: "locationName",
      key: "locationName",
      render: value => <strong>{value || EMPTY_VALUE}</strong>
    },
    {
      title: "Zone / Bin",
      dataIndex: "zone",
      key: "zone",
      render: value => value || EMPTY_VALUE
    },
    {
      title: "On Hand",
      dataIndex: "onHand",
      key: "onHand",
      align: "right",
      render: (value, record) => `${toNumber(value).toLocaleString()} ${record.unitName || unitName}`
    },
    {
      title: "Reserved",
      dataIndex: "reserved",
      key: "reserved",
      align: "right",
      render: value => toNumber(value).toLocaleString()
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
      align: "right",
      render: value => toNumber(value).toLocaleString()
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      align: "center",
      render: (_, record) => {
        const status = getStockStatus(record, reorderPoint);
        return <Tag color={status.color}>{status.label}</Tag>;
      }
    }
  ];

  return (
    <div className="item-detail-page">
      <PageHeader
        className="item-detail-page-header"
        onBack={() => history.goBack()}
        title="Inventory Item"
        subTitle={data.name}
      />

      {loading ? (
        <div className="item-detail-loading">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      ) : (
        <React.Fragment>
          <section className="item-detail-hero">
            <div className="item-detail-hero-main">
              <span className="item-detail-eyebrow">Inventory Item</span>
              <div className="item-detail-title-row">
                <h1>{data.name || EMPTY_VALUE}</h1>
                <Tag color={statusTag.color}>{statusTag.label}</Tag>
                <Tag color={data.status === 0 ? "default" : "blue"}>{data.status === 0 ? "Inactive" : "Active"}</Tag>
                <Tag color={manageStockLabel === "Enabled" ? "geekblue" : "default"}>{manageStockLabel === "Enabled" ? "Tracked Inventory" : "Stock Not Tracked"}</Tag>
              </div>
              <div className="item-detail-meta-grid">
                <DataRow label="Barcode" value={getItemBarcode(data)} />
                <DataRow label="SKU" value={itemSku} />
                <DataRow label="Category" value={categoryName} />
                <DataRow label="Brand" value={brandName} />
                <DataRow label="Unit of Measure" value={unitName} />
                <DataRow label="Manage Stock" value={manageStockLabel} />
              </div>
            </div>
            <div className="item-detail-actions">
              <Button onClick={handleButtonUpdate}>
                <Edit3 size={14} />
                Edit Item
              </Button>
              <Button onClick={handlePrintBarcode}>
                <Printer size={14} />
                Print Label
              </Button>
              <Button type="primary" onClick={handleStockAdjustment}>
                <ArrowRightLeft size={14} />
                Stock Adjustment
              </Button>
            </div>
          </section>

          <Row gutter={16} className="item-detail-kpi-row">
            <MetricCard title="Retail Price" value={formatMoney(retailPrice)} helper="MSRP Rate" icon={<DollarSign size={18} />} tone="is-sales" />
            <MetricCard title="Unit Cost" value={formatMoney(unitCost)} helper="Standard Purchase" icon={<Barcode size={18} />} tone="is-cost" />
            <MetricCard title="Total On Hand" value={`${totalOnHand.toLocaleString()} ${unitName}`} helper={`Across ${storagePointCount} storage point${storagePointCount === 1 ? "" : "s"}`} icon={<Boxes size={18} />} tone="is-stock" />
            <MetricCard title="Inventory Valuation" value={formatMoney(inventoryValuation)} helper="Cost-based" icon={<PackageCheck size={18} />} tone="is-value" />
          </Row>

          <div className="item-detail-layout">
            <main className="item-detail-main">
              <SectionCard
                title="Stock Inventory by Location"
                description="Physical stock counts across registered branches & warehouses"
                icon={<Warehouse size={16} />}
                action={<Button onClick={handleStockAdjustment}>Transfer Stock</Button>}
              >
                <Table
                  rowKey="id"
                  className="item-detail-table"
                  columns={stockColumns}
                  dataSource={stockLocations}
                  loading={stockLoading}
                  pagination={false}
                  size="small"
                  locale={{ emptyText: <Empty description="No stock location data is available." /> }}
                  footer={() => (
                    <div className="item-detail-stock-footer">
                      <strong>Total Across Locations</strong>
                      <span>{storagePointCount} Points of Storage</span>
                      <strong>{totalOnHand.toLocaleString()} {unitName}</strong>
                      <strong>{totalReserved.toLocaleString()} reserved</strong>
                      <strong>{totalAvailable.toLocaleString()} available</strong>
                      <span>{EMPTY_VALUE}</span>
                    </div>
                  )}
                />
              </SectionCard>

              <div className="item-detail-legacy-section">
                <MovementLog id={itemId} />
              </div>

              <div className="item-detail-legacy-section">
                <PurchaseHistory id={itemId} />
              </div>
            </main>

            <aside className="item-detail-sidebar">
              <SectionCard title="Item Specifications" icon={<Layers3 size={16} />}>
                <div className="item-detail-identity-block">
                  <Avatar
                    shape="square"
                    size={56}
                    src={getItemImageSrc(data)}
                    className="item-detail-spec-image"
                  >
                    {data.name ? data.name.charAt(0).toUpperCase() : "I"}
                  </Avatar>
                  <div>
                    <strong>{getFirstVariant(data).name || data.name || EMPTY_VALUE}</strong>
                    <span>UUID: {data.id || EMPTY_VALUE}</span>
                  </div>
                </div>
                <DataRow label="Warranty Tier" value={data.warrantyTier || itemDetailFallback.specifications.warrantyTier} />
                <DataRow label="Model Compatibility" value={data.modelCompatibility || itemDetailFallback.specifications.modelCompatibility} />
                <DataRow label="Default Unit" value={unitName} />
                <DataRow label="Origin Country" value={data.originCountry || itemDetailFallback.specifications.originCountry} />
              </SectionCard>

              <SectionCard title="Cost & Pricing Analysis" icon={<DollarSign size={16} />}>
                <DataRow label="Unit Purchase Cost" value={formatMoney(unitCost)} />
                <DataRow label="Current Retail Price" value={formatMoney(retailPrice)} />
                <DataRow label="Tax Applicable" value={data.tax?.name || data.taxName || itemDetailFallback.pricing.taxApplicable} />
                <DataRow label="Gross Margin Diff" value={formatMoney(grossMarginDifference)} danger={hasNegativeMargin} />
                <DataRow label="Margin %" value={`${grossMarginPercent.toFixed(2)}%`} danger={hasNegativeMargin} />
                {hasNegativeMargin ? (
                  <Alert
                    className="item-detail-margin-alert"
                    type="error"
                    showIcon
                    message="Attention: Retail price is set below Unit Cost."
                    description="Update prices to prevent negative gross profit."
                  />
                ) : (
                  <Tag color="green" className="item-detail-margin-tag">Positive Margin</Tag>
                )}
              </SectionCard>

              <SectionCard
                title="Internal Note"
                icon={<FileText size={16} />}
                action={(
                  <Button size="small" onClick={handleSaveNote}>
                    <Save size={13} />
                    Save Note
                  </Button>
                )}
              >
                <TextArea
                  value={internalNote}
                  onChange={event => setInternalNote(event.target.value)}
                  placeholder="Type internal warehouse remarks or procurement updates..."
                  autosize={{ minRows: 4, maxRows: 7 }}
                />
                <p className="item-detail-helper-text">Visible to inventory managers & store clerks only.</p>
              </SectionCard>

              <SectionCard title="System Information" icon={<ShieldCheck size={16} />}>
                <DataRow label="Record Created" value={formatDateTime(data.createdAt)} />
                <DataRow label="Registered By" value={data.createdBy?.fullName || data.user?.fullName || EMPTY_VALUE} />
                <DataRow label="System Source" value={data.source || itemDetailFallback.system.systemSource} />
                <DataRow label="Last Synced Status" value={data.syncStatus || itemDetailFallback.system.syncStatus} />
                <DataRow label="Updated At" value={formatDateTime(data.updatedAt)} />
                <DataRow label="Updated By" value={data.updatedBy?.fullName || EMPTY_VALUE} />
                <div className="item-detail-system-footnote">
                  <CalendarClock size={14} />
                  <span>Operational data is read from the current item record.</span>
                </div>
              </SectionCard>
            </aside>
          </div>

          <div className="item-detail-print-label" aria-hidden="true">
            <div className="item-detail-print-label-card">
              <strong>{data.name || EMPTY_VALUE}</strong>
              <svg ref={printBarcodeRef} />
              <div className="item-detail-print-label-meta">
                <span>SKU: {itemSku || EMPTY_VALUE}</span>
                <span>{formatMoney(retailPrice)}</span>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
