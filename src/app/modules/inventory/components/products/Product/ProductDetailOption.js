import React from "react";
import {
    Col,
    Row,
    Card,
    Table,
} from "antd";
import Util from "../../../../common/util";


const util = new Util();

export default function ProductDetailOption(props) {
  return parseInt(props.option) ? <OptionOne data={props.data}/> : <OptionZero data={props.data}/>;
};

const OptionZero = ({data}) => {
    
    return  <Card bordered={false}>
        <Row>
          <Col span={12}>
              <DescriptionItem title="Manage Stock" content={data.serialType === 2 ? "Yes" : "No"} />
          </Col>
          <Col span={12}>
              <DescriptionItem title="Barcode" content={data.productVariants ? data.productVariants[0]["barcode"] : null} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
              <DescriptionItem title="Cost" content={data.productVariants ? util.formatCurrency(data.productVariants[0]["cost"]) : null} />
          </Col>
          <Col span={12}>
              <DescriptionItem title="Retail Price" content={data.productVariants ? util.formatCurrency(data.productVariants[0]["price"]): null} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
              <DescriptionItem title="Category" content={data.productType?.name} />
          </Col>
          <Col span={12}>
              <DescriptionItem title="Brand" content={data.brand?.name} />
          </Col>
        </Row>
    </Card>;

};

const OptionOne = ({data}) => {
  const columns = [
    {
      title: "Option",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (cost) =>  util.formatCurrency(cost) 
    },
    {
      title: "Retail Price",
      dataIndex: "price",
      key: "price",
      render: (price) =>  util.formatCurrency(price) 
    },
    {
      title: "Whole Price",
      dataIndex: "wholePrice",
      key: "wholePrice",
      render: (wholePrice) =>  util.formatCurrency(wholePrice) 
    },
    {
      title: "Distribute Price",
      dataIndex: "distributePrice",
      key: "distributePrice",
      render: (distributePrice) =>  util.formatCurrency(distributePrice) 
    },
  ];
  
  return <Card bordered={false}>
      <Row>
        <Col span={12}>
            <DescriptionItem title="Manage Stock" content={data.serialType === 2 ? "Yes" : "No"} />
        </Col>
        <Col span={12}>
            <DescriptionItem title="Category" content={data.productType?.name} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
            <DescriptionItem title="Brand" content={data.brand?.name} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <p style={{marginRight: 8,display: "inline-block",color: "rgba(0, 0, 0, 0.85)"}}>Options</p>
           <Table
            dataSource={data.productVariants ? data.productVariants : []}
            columns={columns}
            pagination={false}
            bordered={true}
            loading={data.productVariants ? false: true}
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
  