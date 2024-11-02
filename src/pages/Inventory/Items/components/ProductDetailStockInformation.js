import React,{useEffect,useState} from "react";
import {
    Col,
    Row,
    Card,
    Table,
} from "antd";
import {Translate} from "@redux/index";
import ProductService from "@services//ProductService";
import Util from "@common/util";

const util = new Util();

export default function ProductDetailStockInformation(props) {
    return parseInt(props.option) ? <OptionOne id={props.id}/> : <OptionZero data={props.data} id={props.id}/>;
}

const OptionZero = ({data,id}) => {
    const [stockOnHead,setStockOnHead] = useState(0);
    const [otherStock,setOtherStock] = useState(0);
    const [detailStock,setDetailStock] = useState([]);
    const [loading, setLoading] = useState(false);
    const locationId = util.getLocationId();

    const columns = [
        {
          title: <Translate id="text_location" />,
          dataIndex: "location",
          key: "location",
        },
        {
          title: <Translate id="text_quantity" />,
          dataIndex: "quantity",
          key: "quantity",
        },
    ];

    useEffect(() => {
        const productLocations = data.productLocations;
        setLoading(true);
        ProductService.getDetailStock(id)
        .then(response => {
        if (response.data) {
          if(response.data.data.length > 0) setDetailStock( response.data.data[0]["productLocations"]);
        }
        })
        .finally(() => setLoading(false));

        if(productLocations) {
            const foundQty = productLocations.find((value) => value.locationId === locationId); 
            const allQty = productLocations.reduce((preValue, currentValue) => preValue + currentValue.quantity,0);
            if(foundQty) {
                setStockOnHead(foundQty.quantity);
                setOtherStock(allQty - foundQty.quantity);
            }else{
                setStockOnHead(0);
                setOtherStock(0);
            }
        } 
    // eslint-disable-next-line
    },[]);

    return  <Card title={<Translate id="text_stock_information" />} bordered={false} style={{marginTop: 25}}>
            <Row>
                <Col span={8}>
                    <DescriptionItem title="ទំនិញក្នុងស្តុក" content={stockOnHead} />
                </Col>
                <Col span={8}>
                    <DescriptionItem title="នៅឃ្លាំងផ្សេង" content={otherStock} />
                </Col>
                <Col span={8}>
                    <DescriptionItem title="ឯកតា" content={data.unit ? data.unit.name : ""} />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                  <p style={{margin: 0}}><Translate id="text_stock_detail" /></p>
                  <Table
                     dataSource={detailStock}
                     columns={columns}
                     pagination={false}
                     bordered={true}
                     loading={loading}
                  />
                </Col>
            </Row>
  </Card>;

};

const OptionOne = ({id}) => {
  const [detailStock,setDetailStock] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    ProductService.getDetailStock(id)
    .then(response => {
   
    if (response.data) {
      setDetailStock(response.data.data.map((value) => ({
        location: value.name,
        quantity: value.quantity,
        children: value.productLocations
      })));
    }
    })
    .finally(() => setLoading(false));
// eslint-disable-next-line
},[]);

  const columns = [
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  return <Card title="Stock Information" bordered={false} style={{marginTop: 25}}>
      
      <Row>
        <Col span={24}>
          <p style={{marginRight: 8,display: "inline-block",color: "rgba(0, 0, 0, 0.85)"}}>Detail Stock</p>
           <Table
            dataSource={detailStock}
            bordered={true}
            loading={loading}
            columns={columns}
            pagination={false}
           />
        </Col>
      </Row>
    </Card>;
};

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
