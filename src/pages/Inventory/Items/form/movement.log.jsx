import React, {useState, useEffect} from "react";
import {
	Col,
	Row,
	Card,
	Table,
} from "antd";
import {Translate} from "@redux/index";
import MovementLogService from "@services/MovementLogService";
import Util from "@common/util";

const util = new Util();
export default function ProductDetailHistory({id}) {
	const [movementLogs,setMovementLogs] = useState([]);
	const [loading,setLoading] = useState(false);

	const movementLog = {
		PURCHASE: "Purchesed",
		EDIT_COST: "Edit Cost",
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
			if (response.data) {
				setMovementLogs(response.data);
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
			key: "locationName"
		},
		{
			title: <Translate id="text_activity" />,
			dataIndex: "type",
			key: "type",
			render: (type) => movementLog[type]
		},
		{
			title: <Translate id="text_option" />,
			dataIndex: "productVariant",
			key: "productVariant",
		},
		{
			title: <Translate id="text_previous_quantity" />,
			dataIndex: "oldQuantity",
			key: "oldQuantity",
		},
		{
			title: <Translate id="text_current_quantity" />,
			dataIndex: "currentQuantity",
			key: "currentQuantity",
		},
		{
			title: <Translate id="text_previous_cost" />,
			dataIndex: "oldCost",
			key: "oldCost",
			render: oldCost => oldCost ? util.formatCurrency(oldCost) : ""
		},
		{
			title: <Translate id="text_current_cost" />,
			dataIndex: "currentCost",
			key: "currentCost",
			render: currentCost => currentCost ? util.formatCurrency(currentCost) : ""
		},
		{
			title: <Translate id="text_last_modified" />,
			dataIndex: "date",
			key: "date",
			render: (date) => util.formatDate(date, "DD/MM/YYYY")
		}
		];
	return <Card title={<Translate id="text_movement_log" />} bordered={false} style={{marginTop: 25}} bodyStyle={{paddingTop: 15}}>
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
