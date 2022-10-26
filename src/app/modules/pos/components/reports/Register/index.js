import React, {useEffect} from "react";
import {
    PageHeader,
    DatePicker,
    Button,
    Icon,
    Tag
} from "antd";
import { Translate } from "react-localize-redux";
import moment from "moment";
import Detail from "./detail";
import "./index.css";
import {
    CTable as Table
} from "../../../../common/elements/ant-ui";
import SaleService from "../../../services/report/SaleService";
import Enum from "../../../enums";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";
import PrivilegeAction from "../../../action/settings/privilege";

const permission_module_code    = "report";
const permission_code           = "low_sales_report";
const util                      = new Util();

export default function RegiserReport(props) {
    const [records, setRecords] = React.useState([]),
        [loading, setLoading] = React.useState(false),
        [fromValue, setFromValue] = React.useState(moment().startOf("month")),
        [toValue, setToValue] = React.useState(moment().endOf("month")),
        [registerDetail, setRegisterDetail] = React.useState(null);

    useEffect(()=>{
        if (!props.checkPermission.checked){
            props.dispatch(PrivilegeAction.checkPermission());
        }
    }, [props]);

    const onFromChange = value => {
        setFromValue(value);
        setToValue(value);
    };

    const onToChange = value => {
        setToValue(value);
    };

    React.useState(() => {
        try {
            setLoading(true);
            SaleService.registers()
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

    return (
        <React.Fragment>
            { !util.isCheckingPermission(props) &&
                (util.checkIfHasAccessPermission( permission_module_code, permission_code, props.checkPermission.response) ?
                    <div className="content-list">
                        <PageHeader
                            style={{
                                backgroundColor: "#f7f7f7",
                                paddingLeft: 0,
                                paddingRight: 0
                            }}
                            onBack={() => {
                                if (registerDetail) {
                                    setRegisterDetail(null);
                                } else {
                                    history.goBack();
                                }
                            }}
                            title="Report"
                            subTitle="Shift Report"
                            extra={[
                                <div style={{display: "flex"}}>
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        value={fromValue}
                                        placeholder="From"
                                        onChange={onFromChange}
                                        className="hidden"
                                    />
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        value={toValue}
                                        placeholder="To"
                                        onChange={onToChange}
                                        style={{marginLeft: 15}}
                                        className="hidden"
                                    />
                                    <Button style={{marginLeft: 15, marginRight: 15}}onClick={() => window.print()}>
                                        <Icon type="printer" style={{fontSize: 14}} /> Print
                                    </Button>
                                </div>
                            ]}
                        />
                        {
                            registerDetail ?
                                <Detail registerDetail={registerDetail}/>
                                :
                                <Table
                                    dataSource={records}
                                    columns={[
                                        {
                                            title: <Translate id="text_date" />,
                                            dataIndex: "date",
                                            key: "date",
                                            render: date => (new Util()).formatDate(date, "DD/MM/YYYY")
                                        },
                                        {
                                            title: <Translate id="text_location" />,
                                            dataIndex: "location",
                                            key: "location"
                                        },
                                        {
                                            title: <Translate id="text_cashier" />,
                                            dataIndex: "cashier",
                                            key: "cashier"
                                        },
                                        {
                                            title: <Translate id="text_open_time" />,
                                            dataIndex: "openedTime",
                                            key: "openedTime",
                                            render: openedTime => moment(openedTime).format("h:mm A")
                                        },
                                        {
                                            title: <Translate id="text_open_cash" />,
                                            dataIndex: "open",
                                            key: "openCash",
                                            render: openCash => (new Util()).formatCurrency(openCash)
                                        },
                                        {
                                            title: <Translate id="text_close_time" />,
                                            dataIndex: "closedTime",
                                            key: "closedTime",
                                            render: (closedTime, record) => record.status === Enum.OPEN_SALE_REGISTRATION_STATUS.CLOSED ? moment(closedTime).format("h:mm A") : <Tag color="#87d068">Pending</Tag>
                                        },
                                        {
                                            title: <Translate id="text_expected" />,
                                            dataIndex: "expected",
                                            key: "expected",
                                            align: "right",
                                            width: 120,
                                            render: expected => (new Util()).formatCurrency(expected)
                                        },
                                        {
                                            title: <Translate id="text_count" />,
                                            dataIndex: "count",
                                            key: "count",
                                            align: "right",
                                            width: 120,
                                            render: count => (new Util()).formatCurrency(count)
                                        },
                                        {
                                            title: <Translate id="text_difference" />,
                                            dataIndex: "different",
                                            key: "different",
                                            align: "right",
                                            width: 120,
                                            render: (different, record) => <span onClick={() => setRegisterDetail(record)} style={{color: different === 0 ? "green" : (different < 0 ? "red" : "#f0ad4e")}}>{(new Util()).formatCurrency(different)}</span>
                                        }
                                    ]}
                                    loading={loading}
                                />
                        }
                    </div>
                    :
                    <NoPermissionV2/>
                )
            }
        </React.Fragment>
    );
}