import React,{useState,useEffect} from "react";
import {
    Col,
    Row,
    Card,
    Table,
} from "antd";
import MovementLogService from "../../../services/stock/MovementLogService";
import Util from "../../../../common/util";

const util = new Util();
export default function ProductDetailHistory({id}) {
    const [movementLogs,setMovementLogs] = useState([]);
    const [loading,setLoading] = useState(false);

    const movementLog = {
        PURCHASE: "Purchesed",
        SALE: "Sold",
        ADJUSTMENT: "Adjustmented",
        TRANSFER_OUT: "Transfered Out",
        TRANSFER_IN: "Received Transfer",
        CONSIGNMENT_RECEIVED: "Received Cosignment",
        CONSIGNMENT_RETURN: "Returned Consignment",
    };

    useEffect(() => {
        setLoading(true);
        MovementLogService.getMovementLogs(id).then((response) => {
            if(response.data){
                setMovementLogs(response.data);
            }
        })
        .finally(() => setLoading(false));
    }
// eslint-disable-next-line
    ,[]);

    const columns = [
        {
          title: "Option",
          dataIndex: "productVariant",
          key: "productVariant",
        },
        {
          title: "Activity",
          dataIndex: "type",
          key: "type",
          render: (type) => movementLog[type]
        },  
        {
            title: "Previous Quantity",
            dataIndex: "oldQuantity",
            key: "oldQuantity",
        },
        {
            title: "Current Quantity",
            dataIndex: "currentQuantity",
            key: "currentQuantity",
        },
        {
            title: "Last Modified",
            dataIndex: "date",
            key: "date",
            render: (date) => date ? util.formatDate(date, "DD/MM/YYYY") : null
        }
      ];
    return <Card title="History Information" bordered={false} style={{marginTop: 25}}>
      
    <Row>
      <Col span={24}>
        <Table
          dataSource={movementLogs}
          bordered={true}
          loading={loading}
          columns={columns}
          pagination={false}
         />
      </Col>
    </Row>
  </Card>;
}
