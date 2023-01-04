import React from "react";
import {
  Col,
  Row,
  Menu,
  Dropdown,
  Card,
  Icon,
  message,
  PageHeader
} from "antd";
import {Translate} from "react-localize-redux";
import history from "../../../../common/router/history";
import ProductService from "../../../services/products/ProductService";

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: "22px",
      marginBottom: 7,
      color: "rgba(0,0,0,0.65)",
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: "inline-block",
        color: "rgba(0,0,0,0.85)",
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

export default function ProductDetail(props) {
  const [data, setData] = React.useState({});
  // const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    ProductService.detail(props.match.params.id, params.get("productOption"), true)
    .then(response => {
      if (response.data) {
        setData(response.data.data);
      }
    });

    // eslint-disable-next-line
  }, []);

  function handleButtonClick(e) {
    message.info("Click on left button.");
    console.log("click left button", e);
  }
  
  function handleMenuClick(e) {
    message.info("Click on menu item.");
    console.log("click", e);
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">
        <Icon type="delete" />
        Delete
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="copy" />
        Clone
      </Menu.Item>
    </Menu>
  );

  return (
    <React.Fragment>
      <PageHeader
        style={{
            backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0
        }}
        onBack={() => history.goBack()}
        title={<Translate id="text_product" />}
        subTitle={data.name}
        extra={
          [
            <Dropdown.Button type="primary" onClick={handleButtonClick} overlay={menu}>
              Edit
            </Dropdown.Button>
          ]
        }
      />
      <Card bordered={false}>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Manage Stock" content="yes" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Barcode" content="AntDesign@example.com" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Cost" content="$12.00" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Retail Price" content="$20.00" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Category" content="Drink" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Brand" content="Apple" />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Message"
              content="Make things as simple as possible but no simpler."
            />
          </Col>
        </Row>
      </Card>

      <Card title="Stock Information" bordered={false} style={{marginTop: 25}}>
        <Row>
          <Col span={8}>
            <DescriptionItem title="ទំនិញក្នុងស្តុក" content="Lily" />
          </Col>
          <Col span={8}>
            <DescriptionItem title="នៅឃ្លាំងផ្សេង" content="AntDesign@example.com" />
          </Col>
          <Col span={8}>
            <DescriptionItem title="ឯកតា" content="កេះ" />
          </Col>
        </Row>
      </Card>
    </React.Fragment>
  );
}