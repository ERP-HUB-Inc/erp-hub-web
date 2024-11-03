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
import ProductService from "@services/ProductService";
import ProductDetailOption from "./ProductDetailOption";
import ProductDetailStockInformation from "./ProductDetailStockInformation";
import MovementLog from "./MovementLog";
import PurchaseHistory from "./PurchaseHistory";


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
            <Dropdown.Button type="primary" onClick={handleButtonUpdate} overlay={menu}>
              Edit
            </Dropdown.Button>
          ]
        }
      />

      {
        loading ? <Spin spinning={loading} style={{width: "100%",justifyContent: "center"}}/> :
        <React.Fragment> 
           <ProductDetailOption option={params.get("productOption")} data={data}/>
           <ProductDetailStockInformation option={params.get("productOption")} data={data} id={props.match.params.id}/>
           <MovementLog id={props.match.params.id}/>
           <PurchaseHistory id={props.match.params.id}/>
        </React.Fragment>
      
      }
    
    </React.Fragment>
  );
}