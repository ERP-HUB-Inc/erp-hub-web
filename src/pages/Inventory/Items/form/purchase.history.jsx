import React, { useState, useEffect } from "react";
import { Button, Col, Row, Card, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import ProductService from "@services/ItemService";
import Util from "@helper/util";
import history from "@router/index";
import { FileText } from "lucide-react";

const util = new Util();
export default function PurchaseHistory({ id }) {
  const [purchaseHistorys, setPurchaseHistorys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(
    () => {
      setLoading(true);
      ProductService.getPurchaseHistoryByProductID(id)
        .then((response) => {
          if (response.data) {
            setPurchaseHistorys(response.data.data);
          }
        })
        .finally(() => setLoading(false));
    },
    // eslint-disable-next-line
    [],
  );

  const columns = [
    {
      title: "PO Number",
      dataIndex: "number",
      key: "number",
      width: 140,
      render: (value, record) => (
        <Link to={`/stocks/purchase/update/${record.purchaseOrderId}`}>
          {value || record.purchaseOrderNumber || record.purchaseNumber || "-"}
        </Link>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "date",
      key: "date",
      width: 130,
      render: (date) => util.formatDate(date, "DD/MM/YYYY"),
    },
    {
      title: "Supplier / Vendor",
      dataIndex: "supplierName",
      key: "supplierName",
      render: value => value || "-",
    },
    {
      title: "Ordered Qty",
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
      width: 120,
      render: (quantity, record) => `${quantity} ${record?.unitName || "Pcs"}`,
    },
    {
      title: "Unit Cost",
      dataIndex: "cost",
      key: "cost",
      width: 130,
      align: "right",
      render: (cost) => util.formatCurrency(cost ?? 0),
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      key: "total",
      width: 140,
      align: "right",
      render: (total) => util.formatCurrency(total ?? 0),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: value => <Tag color="green">{value || "Received"}</Tag>,
    },
  ];
  return (
    <Card
      title={(
        <div className="item-detail-card-title">
          <i><FileText size={16} /></i>
          <div>
            <strong>Purchase History & Supplier Procurement</strong>
            <span>Historical PO records, vendor acquisitions, and landing costs</span>
          </div>
        </div>
      )}
      extra={<Button type="primary" icon="plus" onClick={() => history.push("/purchase-orders/create")}>Create PO</Button>}
      bordered={false}
      bodyStyle={{ paddingTop: 15 }}
    >
      <Row>
        <Col span={24}>
          <Table
            size="small"
            dataSource={purchaseHistorys}
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
