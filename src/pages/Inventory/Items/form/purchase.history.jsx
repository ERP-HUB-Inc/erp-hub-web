import React, { useState, useEffect } from "react";
import { Col, Row, Card, Table } from "antd";
import { Link } from "react-router-dom";
import { Translate } from "@redux/index";
import ProductService from "@services/ItemService";
import Util from "@helper/util";

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
    // {
    //   title: <Translate id="text_item_name" />,
    //   dataIndex: "productName",
    //   key: "productName",
    // },
    // {
    //   title: <Translate id="text_barcode" />,
    //   dataIndex: "barcode",
    //   key: "barcode",
    // },
    // {
    //   title: <Translate id="text_option" />,
    //   dataIndex: "variantName",
    //   key: "variantName",
    // },
    {
      title: <Translate id="text_purchase_date" />,
      dataIndex: "date",
      key: "date",
      render: (date, record) => (
        <Link to={`/stocks/purchase/update/${record.purchaseOrderId}`}>
          {util.formatDate(date, "DD/MM/YYYY")}
        </Link>
      ),
    },
    {
      title: "Stock Location",
      dataIndex: "locationName",
      key: "locationName",
    },
    {
      title: "Vendor/Seller",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "Shipping Fee",
      dataIndex: "shippingFee",
      key: "shippingFee",
      render: (shippingFee) => util.formatCurrency(shippingFee ?? 0),
    },
    {
      title: <Translate id="text_quantity_buy_in" />,
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => `${quantity} ${record?.unitName || "Pcs"}`,
    },
    {
      title: <Translate id="text_unit_cost" />,
      dataIndex: "cost",
      key: "cost",
      render: (cost) => util.formatCurrency(cost ?? 0),
    },
    {
      title: <Translate id="text_discount" />,
      dataIndex: "discount",
      key: "discount",
      render: (discount) => util.formatCurrency(discount ?? 0),
    },
    {
      title: <Translate id="text_total" />,
      dataIndex: "total",
      key: "total",
      render: (total) => util.formatCurrency(total ?? 0),
    },
  ];
  return (
    <Card
      title={<Translate id="text_purchase_history" />}
      bordered={false}
      style={{ marginTop: 25 }}
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
          />
        </Col>
      </Row>
    </Card>
  );
}
