import React,{useState,useEffect} from "react";
import {
    Col,
    Row,
    Card,
    Table,
} from "antd";
import {Link} from "react-router-dom";
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
         title: <Translate id="text_location" />,
         dataIndex: "locationName",
         key: "locationName",
      },
      {
         title: <Translate id="text_product_name" />,
         dataIndex: "productName",
         key: "productName",
      },
      {
         title: <Translate id="text_barcode" />,
         dataIndex: "barcode",
         key: "barcode",
      },
      {
         title: <Translate id="text_option" />,
         dataIndex: "variantName",
         key: "variantName",
      },
      {
         title: <Translate id="text_purchase_date" />,
         dataIndex: "date",
         key: "date",
         render: (date, record) => <Link to={`/stocks/purchase/update/${record.purchaseOrderId}`}>{util.formatDate(date, "DD/MM/YYYY")}</Link>
      },  
      {
         title: <Translate id="text_supplier" />,
         dataIndex: "supplierName",
         key: "supplierName",
      },
      {
         title: <Translate id="text_quantity_buy_in" />,
         dataIndex: "quantity",
         key: "quantity",
         render: (quantity, record) => `${quantity} ${record.unitName}`
      },
      {
         title: <Translate id="text_unit_cost" />,
         dataIndex: "cost",
         key: "cost",
         render: (cost) => cost ? util.formatCurrency(cost) : null
      },
      {
         title: <Translate id="text_total" />,
         dataIndex: "total",
         key: "total",
         render: (total) => util.formatCurrency(total)
      }
   ];
   return <Card title={<Translate id="text_purchase_history" />} bordered={false} style={{marginTop: 25}} bodyStyle={{paddingTop: 15}}>
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
