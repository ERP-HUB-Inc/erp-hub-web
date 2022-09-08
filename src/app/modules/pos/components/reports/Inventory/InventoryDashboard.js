import React from "react";
import {
  Statistic,
  PageHeader,
  Card,
  Row,
  Col,
  Table,
  Radio,
  Select,
  Tabs
} from "antd";
import ExportForm from "./ExportForm";
import history from "../../../../common/router/history";
import InventoryService from "../../../services/report/InventoryService";
import Util from "../../../../common/util";
import "./index.css";

const { TabPane } = Tabs;
const { Option } = Select;

export default function InventoryReport() {
  const [loading, setLoading] = React.useState(false);
  const [alertProducts, setAlertProducts] = React.useState([]);
  const [popularProducts, setPopularProducts] = React.useState([]);
  const [topSellingSize, setTopSellingSize] = React.useState(25);
  const [todayPurchases, setTodayPurchases] = React.useState([]);
  const [topSellType, setTopSellType] = React.useState("quantity");

  const fetchPopularProducts = (limit, popularBy) => {
    setLoading(true);
    InventoryService.getPopularProduct(limit, popularBy)
    .then(response => {
      if (response.data) {
        setPopularProducts(response.data);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };
  
  const onChangeTopSellingType = (e) => {
    setTopSellType(e.target.value);
    fetchPopularProducts(topSellingSize, e.target.value);
  };

  const onChangeTopSellingSize = (value) => {
    setTopSellingSize(value);
    fetchPopularProducts(value, topSellType);
  };

  React.useEffect(() => {
    InventoryService.getInventoryDashboard()
    .then(response => {
      if (response.data) {
        setAlertProducts(response.data);
      }
    });

    fetchPopularProducts(topSellingSize);

    InventoryService.getTodayPurchase()
    .then(response => {
      if (response.data) {
        setTodayPurchases(response.data);
      }
    });

    //eslint-disable-next-line
  }, []);

  const reorderProduct = alertProducts.find(alertProduct => alertProduct.type === "reorder"),
    zeroStock = alertProducts.find(alertProduct => alertProduct.type === "stockZero"),
    errorStock = alertProducts.find(alertProduct => alertProduct.type === "stockError"),
    stockValue = alertProducts.find(alertProduct => alertProduct.type === "stockValue");
  
  let stockOk = 100;
  let zeroStockInPercentage = 0;
  let errorStockInPercentage = 0;
  let reorderStockInPercentage = 0;

  if (stockValue) stockValue.value = parseInt(stockValue.value); 

  if (zeroStock && stockValue) {
    zeroStockInPercentage = (zeroStock.value * 100 / stockValue.value);
  }

  if (errorStock) {
    errorStock.value = parseInt(errorStock.value);
    errorStockInPercentage = (errorStock.value * 100 / stockValue.value);
  }

  if (reorderProduct && stockValue) {
    reorderStockInPercentage = (reorderProduct.value * 100 / stockValue.value);
  }

  stockOk -= (zeroStockInPercentage + errorStockInPercentage + reorderStockInPercentage); 

  return <div id="inventory-dashboard">
      <PageHeader
        style={{
            backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0
        }}
        onBack={() => history.goBack()}
        title="Inventory Dashboard"
        subTitle=""
        />
      <Row gutter={16}>
        <Col span={5}>
          <Card onClick={() => history.push("/reports/product?viewStock=reorder")} style={{cursor: "pointer"}}>
            <Statistic
              title="Products to Reorder"
              value={reorderProduct ? reorderProduct.value : 0}
              valueStyle={{ color: "rgb(240, 173, 78)" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Row>
            <Col span={12}>
              <Card onClick={() => history.push("/reports/product?viewStock=zeroStock")} style={{cursor: "pointer", borderBottomRightRadius: 0, borderTopRightRadius: 0}}>
                <Statistic
                  title="Zero Stock Products"
                  value={zeroStock ? zeroStock.value : 0}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card onClick={() => history.push("/reports/product?viewStock=errorStock")} style={{cursor: "pointer", borderBottomLeftRadius: 0, borderTopLeftRadius: 0}}>
                <Statistic
                  title="Stock Error"
                  value={errorStock ? errorStock.value : 0}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={5}>
          <Card onClick={() => history.push("/products/list")} style={{cursor: "pointer"}}>
            <Statistic
              title="Products"
              value={stockValue ? stockValue.value : 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Stock Ok"
              value={stockOk}
              precision={2}
              valueStyle={{ color: stockOk > 50 ? "#3f8600" : "#cf1322" }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
      
      <Tabs type="card" style={{marginTop: 25}}>
        <TabPane tab="Top Selling Products" key="1">
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <div>
              <Radio.Group value={topSellType} onChange={onChangeTopSellingType} style={{ marginBottom: 16 }}>
                <Radio.Button value="quantity">By Quantity</Radio.Button>
                <Radio.Button value="totalSale">By Total Sales</Radio.Button>
              </Radio.Group>
              <Select defaultValue={25} style={{ width: "fit-content", marginLeft: 15 }} onChange={onChangeTopSellingSize}>
                <Option value={25}>Top 25 Selling Products</Option>
                <Option value={50}>Top 50 Selling Products</Option>
                <Option value={100}>Top 100 Selling Products</Option>
              </Select>
            </div>
            <ExportForm limit={topSellingSize} popularBy={topSellType} />
          </div>
          <Table
            rowKey="id"
            bordered={true}
            dataSource={popularProducts}
            columns={[
              {
                title: "#",
                dataIndex: "id",
                key: "id",
                width: 60,
                render: (text, record, index) => index + 1
              },
              {
                title: "Product Name",
                dataIndex: "name",
                key: "name"
              },
              {
                title: "Barcode",
                dataIndex: "barcode",
                key: "barcode"
              },
              {
                title: "Quantity",
                dataIndex: "soldQuantity",
                key: "soldQuantity",
                render: (soldQuantity, record) => `${soldQuantity} ${record.unit}`
              },
              {
                title: "Unit Price",
                dataIndex: "price",
                key: "price",
                align: "right",
                render: price => (new Util()).formatCurrency(price)
              },
              {
                title: "Total",
                dataIndex: "total",
                key: "total",
                align: "right",
                render: total => (new Util()).formatCurrency(total)
              }
            ]}
            pagination={false}
            loading={loading} />
        </TabPane>
        <TabPane tab="Today Purchase" key="2">
          <Table
            rowKey="id"
            dataSource={todayPurchases}
            columns={[
              {
                title: "#",
                dataIndex: "id",
                key: "id",
                width: 60,
                render: (text, record, index) => index + 1
              },
              {
                title: "Product Name",
                dataIndex: "name",
                key: "name"
              },
              {
                title: "Barcode",
                dataIndex: "barcode",
                key: "barcode"
              },
              {
                title: "Supplier",
                dataIndex: "supplier",
                key: "supplier"
              },
              {
                title: "Quantity",
                dataIndex: "purchaseQuantity",
                key: "purchaseQuantity",
                render: (purchaseQuantity, record) => `${purchaseQuantity} ${record.unit}`
              },
              {
                title: "Unit Cost",
                dataIndex: "cost",
                key: "cost",
                align: "right",
                render: cost => (new Util()).formatCurrency(cost)
              },
              {
                title: "Total Cost",
                dataIndex: "purchaseTotal",
                key: "purchaseTotal",
                align: "right",
                render: purchaseTotal => (new Util()).formatCurrency(purchaseTotal)
              }
            ]}
            pagination={false}
            loading={loading} />
        </TabPane>
      </Tabs>
  </div>;
}
