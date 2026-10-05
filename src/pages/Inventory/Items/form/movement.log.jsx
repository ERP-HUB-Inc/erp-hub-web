import Util from "@common/util";
import MovementLogService from "@services/MovementLogService";
import { Card, Col, DatePicker, Row, Select, Table, Tag } from "antd";
import { ClipboardList } from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";

const util = new Util();
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function ProductDetailHistory({ id }) {
  const [movementLogs, setMovementLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState(null);

  const movementLog = {
    PURCHASE: "Purchase Receipt",
    EDIT_COST: "Edit Cost",
    SALE: "Sales Dispatch",
    ADJUSTMENT: "Stock Adjustment",
    TRANSFER_OUT: "Transfer Out",
    TRANSFER_IN: "Transfer In",
    CONSIGNMENT_RECEIVED: "Received Consignment",
    CONSIGNMENT_RETURN: "Returned Consignment",
  };

  const filters = [
    { key: "ALL", label: "All Logs", types: [] },
    { key: "RECEIPTS", label: "Receipts", types: ["PURCHASE", "CONSIGNMENT_RECEIVED"] },
    { key: "TRANSFERS", label: "Transfers", types: ["TRANSFER_IN", "TRANSFER_OUT"] },
    { key: "ADJUSTMENTS", label: "Adjustments", types: ["ADJUSTMENT", "EDIT_COST"] },
  ];

  useEffect(
    () => {
      setLoading(true);
      MovementLogService.getMovementLogs(id)
        .then((response) => {
          if (response.data) {
            setMovementLogs(response.data);
          }
        })
        .finally(() => setLoading(false));
    },
    // eslint-disable-next-line
    [],
  );

  const filteredLogs = movementLogs.filter(log => {
    let matchesType = true;
    if (activeFilter !== "ALL") {
      const filter = filters.find(item => item.key === activeFilter);
      matchesType = Boolean(filter && filter.types.includes(log.type));
    }

    if (!matchesType) return false;
    if (!dateRange || dateRange.length !== 2) return true;

    const logDate = moment(log.date);
    if (!logDate.isValid()) return false;

    return logDate.isBetween(
      moment(dateRange[0]).startOf("day"),
      moment(dateRange[1]).endOf("day"),
      null,
      "[]"
    );
  });

  const getQuantityChange = record => {
    const currentQuantity = Number(record.currentQuantity || 0);
    const oldQuantity = Number(record.oldQuantity || 0);
    return currentQuantity - oldQuantity;
  };

  const renderQuantityChange = record => {
    const quantityChange = getQuantityChange(record);
    const sign = quantityChange > 0 ? "+" : "";
    const className = quantityChange > 0 ? "is-positive" : quantityChange < 0 ? "is-negative" : "";
    return <span className={`item-detail-quantity-change ${className}`}>{sign}{quantityChange} {record?.unitName || "Pcs"}</span>;
  };

  const columns = [
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      width: 160,
      render: (date) => util.formatDate(date, "DD/MM/YYYY HH:mm"),
    },
    {
      title: "Activity Type",
      dataIndex: "type",
      key: "type",
      width: 160,
      render: (type) => <Tag color="blue">{movementLog[type] || type || "-"}</Tag>,
    },
    {
      title: "Location / Destination",
      dataIndex: "locationName",
      key: "locationName",
      render: value => value || "-",
    },
    {
      title: "Qty Change",
      key: "quantityChange",
      align: "right",
      width: 120,
      render: (_, record) => renderQuantityChange(record),
    },
    {
      title: "Reference / Doc #",
      dataIndex: "referenceNo",
      key: "referenceNo",
      render: (value, record) => value || record.reference || record.documentNo || record.productVariant || "-",
    },
    {
      title: "Staff / Performed By",
      dataIndex: "staffName",
      key: "staffName",
      render: (value, record) => value || record.userName || record.createdBy || "-",
    },
  ];
  return (
    <Card
      title={(
        <div className="item-detail-card-title">
          <i><ClipboardList size={16} /></i>
          <div>
            <strong>Movement Log</strong>
            <span>Real-time ledger of transfers, dispatches, and inventory revaluations</span>
          </div>
        </div>
      )}
      bordered={false}
      bodyStyle={{ paddingTop: 15 }}
    >
      <Row>
        <Col span={24}>
          <div className="item-detail-log-filters">
            <Select value={activeFilter} onChange={setActiveFilter} className="item-detail-log-type-filter">
              {filters.map(filter => <Option key={filter.key} value={filter.key}>{filter.label}</Option>)}
            </Select>
            <RangePicker
              allowClear
              className="item-detail-log-date-filter"
              format="DD/MM/YYYY"
              value={dateRange}
              onChange={values => setDateRange(values || null)}
            />
          </div>
          <Table
            size="small"
            rowKey={(record, index) => record.id || `${record.type}-${record.date}-${index}`}
            dataSource={filteredLogs}
            bordered={true}
            loading={loading}
            columns={columns}
            pagination={false}
            scroll={{ x: 900 }}
          />
        </Col>
      </Row>
    </Card>
  );
}
