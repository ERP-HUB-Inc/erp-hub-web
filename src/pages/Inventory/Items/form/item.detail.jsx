import React from "react";
import {
  Menu,
  Dropdown,
  Icon,
  Spin,
  PageHeader
} from "antd";

import {Translate} from "@redux/index";
import history from "@router/index";
import ProductService from "@services/ItemService";
import ProductDetailOption from "./item.detail.option";
import ProductDetailStockInformation from "./item.stock.info";
import MovementLog from "./movement.log";
import PurchaseHistory from "./purchase.history";


export default function ProductDetail(props) {
  const [data, setData] = React.useState({});
  const params = new URLSearchParams(props.location.search);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    setLoading(true);
    ProductService.getById(props.match.params.id, params.get("productOption"), true)
    .then(response => {
      if (response.data) {
        setData(response.data.data);
      }
    })
    .finally(() => setLoading(false));

    // eslint-disable-next-line
  }, []);

  function handleButtonUpdate() {
    history.push(`/inventories/items/update/${props.match.params.id}?${params.get("productOption")}`);
  }
  
  function handleMenuClick(e) {
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
    <div
      className="content-list"
      style={{ paddingLeft: "40px", paddingRight: "40px", marginTop: "20px" }}
    >
      <PageHeader
        style={{
          // backgroundColor: "#fff",
          paddingLeft: 0,
          paddingRight: 0,
        }}
        onBack={() => history.goBack()}
        title={<Translate id="text_product" />}
        subTitle={data.name}
        extra={[
          <Dropdown.Button
            type="primary"
            onClick={handleButtonUpdate}
            overlay={menu}
          >
            Edit
          </Dropdown.Button>,
        ]}
      />

      {loading ? (
        <Spin
          spinning={loading}
          style={{ width: "100%", justifyContent: "center" }}
        />
      ) : (
        <React.Fragment>
          <ProductDetailOption
            option={params.get("productOption")}
            data={data}
          />
          <ProductDetailStockInformation
            option={params.get("productOption")}
            data={data}
            id={props.match.params.id}
          />
          <MovementLog id={props.match.params.id} />
          <PurchaseHistory id={props.match.params.id} />
        </React.Fragment>
      )}
    </div>
  );
}