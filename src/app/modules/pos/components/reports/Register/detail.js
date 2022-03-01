import React from "react";
import {
    Statistic,
    Row,
    Col,
    Icon
} from "antd";
import moment from "moment";
import { Translate } from "react-localize-redux";
import "./index.css";
import {
    CTable as Table
} from "../../../../common/elements/ant-ui";
import SaleService from "../../../services/report/SaleService";
import Enum from "../../../enums";
import Util from "../../../../common/util";

export default function Detail(props) {
    const [records, setRecords] = React.useState([]),
        [loading, setLoading] = React.useState(false),
        {registerDetail} = props;

    React.useState(() => {
        try {
            setLoading(true);
            SaleService.registerDetail(registerDetail.date, registerDetail.userId)
            .then(response => {
                if (response.data) {
                    setRecords(response.data.data);
                }
            });
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, []);
    let cashInDrawer = registerDetail.open,
        expectedCasInDrawer = registerDetail.open;
    return <Row gutter={16}>
        <Col span={4}>
            <Statistic title="Cashier" value={registerDetail.cashier} />
        </Col>
        <Col span={4}>
            <Statistic title={`Date(${moment(registerDetail.openedTime).format("h:mm A")}~${registerDetail.status === Enum.OPEN_SALE_REGISTRATION_STATUS.CLOSED ? moment(registerDetail.closedTime).format("h:mm A") : "N/A"})`} value={moment(registerDetail.date).format("DD MMM YYYY")} />
        </Col>
        <Col span={4}>
            <Statistic title="Open Cash" value={registerDetail.open} precision={2} prefix="$" />
        </Col>
        <Col span={4}>
            <Statistic title="Expected Amount" value={registerDetail.expected} precision={2} prefix="$" />
        </Col>
        <Col span={4}>
            <Statistic title="Actault Amount" value={registerDetail.count} precision={2}  prefix="$" />
        </Col>
        <Col span={4}>
            {/* eslint-disable-next-line */}
            <Statistic title="Difference(Actault - Expected)" value={registerDetail.count - registerDetail.expected} precision={2} prefix="$" valueStyle={{ color: registerDetail.count == registerDetail.expected ? "green" : (registerDetail.count > registerDetail.expected ? "#f0ad4e" : "#cf1322") }} />
        </Col>
        <Col span={24}>
            <Table
                dataSource={records}
                columns={[
                    {
                        title: <Translate id="text_no" />,
                        dataIndex: "no",
                        key: "no",
                        render: (no, record, index) => index + 1
                    },
                    {
                        title: <Translate id="text_date" />,
                        dataIndex: "date",
                        key: "date",
                        render: date => (new Util()).formatDateTime(date, "DD/MM/YYYY h:mm A")
                    },
                    {
                        title: <Translate id="text_receipt" />,
                        dataIndex: "number",
                        key: "number"
                    },
                    {
                        title: <Translate id="text_sub_total" />,
                        dataIndex: "subTotal",
                        key: "subTotal",
                        align: "right",
                        render: total => (new Util()).formatCurrency(total)
                    },
                    {
                        title: <Translate id="text_discount" />,
                        dataIndex: "discount",
                        key: "discount",
                        align: "right",
                        render: discount => (new Util()).formatCurrency(discount)
                    },
                    {
                        title: <Translate id="text_sale_total" />,
                        dataIndex: "grandTotal",
                        key: "grandTotal",
                        align: "right",
                        render: grandTotal => (new Util()).formatCurrency(grandTotal)
                    },
                    {
                        title: <Translate id="text_payment_method" />,
                        dataIndex: "paymentMethod",
                        key: "paymentMethod"
                    },
                    {
                        title: <Translate id="text_received" />,
                        dataIndex: "tender",
                        key: "tender",
                        align: "right",
                        render: tender => (new Util()).formatCurrency(tender)
                    },
                    {
                        title: <Translate id="text_pay_amount" />,
                        dataIndex: "balance",
                        key: "balance",
                        align: "right",
                        render: balance => (new Util()).formatCurrency(balance)
                    },
                    {
                        title: <Translate id="text_change" />,
                        dataIndex: "changeAmount",
                        key: "changeAmount",
                        align: "right",
                        render: changeAmount => (new Util()).formatCurrency(changeAmount)
                    },
                    {
                        title: "Cash In Drawer",
                        dataIndex: "balance",
                        key: "inDrawer",
                        align: "right",
                        render: (balance, record) => {
                            cashInDrawer += balance;
                            cashInDrawer = parseFloat(cashInDrawer.toFixed(2));
                            expectedCasInDrawer += record.grandTotal;
                            expectedCasInDrawer = parseFloat(expectedCasInDrawer.toFixed(2));

                            return <div style={{display: "flex", justifyContent: "flex-end"}}>
                                <span>{(new Util()).formatCurrency(cashInDrawer)}</span>
                                {
                                    record.tender < record.grandTotal ?
                                    <Icon type="close" style={{color: "red", fontSize: "12pt", marginLeft: 10}} />
                                    :
                                    <Icon type="check" style={{color: "green", fontSize: "12pt", marginLeft: 10}} />
                                }
                            </div>;
                        }
                    }
                ]}
                loading={loading}
            />
        </Col>
    </Row>;
}