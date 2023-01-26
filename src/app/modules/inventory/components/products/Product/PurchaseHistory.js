import React,{useState,useEffect} from "react";
import {
    Col,
    Row,
    Card,
    Table,
} from "antd";
import {Translate} from "react-localize-redux";
import ProductService from "../../../services/products/ProductService";
import Util from "../../../../common/util";

const util = new Util();
export default function PurchaseHistory({id}) {
    const [purchaseHistorys,setPurchaseHistorys] = useState([]);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        ProductService.getPurchaseHistoryByProductID(id).then((response) => {
            if(response.data){
              setPurchaseHistorys(response.data.data);
            }
        })
        .finally(() => setLoading(false));
    }
        // eslint-disable-next-line
    ,[]);

    const columns = [
        {
          title: "Product Name",
          dataIndex: "productName",
          key: "productName",
        },
        {
          title: "Barcode",
          dataIndex: "barcode",
          key: "barcode",
        },
        {
          title: "Option",
          dataIndex: "variantName",
          key: "variantName",
        },
        {
          title: "Purchase Date",
          dataIndex: "date",
          key: "date",
          render: (date) => date ? util.formatDate(date, "DD/MM/YYYY") : null
        },  
        {
            title: "Supplier",
            dataIndex: "supplierName",
            key: "supplierName",
        },
        {
            title: "Quantity Buy In",
            dataIndex: "quantity",
            key: "quantity",
            render: (quantity, record) => `${quantity} ${record.unitName}`
        },
        {
            title: "Unit Cost",
            dataIndex: "cost",
            key: "cost",
            render: (cost) => cost ? util.formatCurrency(cost) : null
        },
        {
          title: "Total",
          dataIndex: "total",
          key: "total",
          render: (total) => total ? util.formatCurrency(total) : null
      }
      ];
    return <Card title={<Translate id="text_purchase_history" />} bordered={false} style={{marginTop: 25}}>
    <Row>
      <Col span={24}>
         <Table
          dataSource={purchaseHistorys}
          bordered={true}
          loading={loading}
          columns={columns}
          pagination={false}
         />
      </Col>
    </Row>
  </Card>;
}
