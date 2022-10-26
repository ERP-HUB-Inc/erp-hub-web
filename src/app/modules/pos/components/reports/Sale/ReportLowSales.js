import React, {useEffect} from "react";
import { connect } from "react-redux";
import {
    Button,
    InputNumber,
    PageHeader,
    Table,
    DatePicker,
    Row,
    Col
} from "antd";
import moment from "moment";
import { Translate } from "react-localize-redux";
import ExportLowSaleForm from "./ExportLowSaleForm";
import Util from "../../../../common/util";
import ReportSaleService from "../../../services/report/SaleService";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";
import PrivilegeAction from "../../../action/settings/privilege";

const permission_module_code    = "report";
const permission_code           = "low_sales_report";
const util                      = new Util();

function ReportLowSales(props) {

  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [fromValue, setFromValue] = React.useState(moment());
  const [toValue, setToValue] = React.useState(moment());
  const [criticalLevel, setCriticalLevel] = React.useState(0);
  const [checkPermissionDataIsNotLoaded, setCheckPermissionDataIsNotLoaded] = React.useState(true);

    useEffect(()=>{
        if (checkPermissionDataIsNotLoaded){
            props.dispatch(PrivilegeAction.checkPermission());
            setCheckPermissionDataIsNotLoaded(false);
        }
    }, [props]);

  const onFromChange = value => {
      setFromValue(value);
  };

  const onToChange = value => {
      setToValue(value);
  };

  const onChangeCriticalLevel = (value) => {
    setCriticalLevel(value);
  };

  const onGetData = () => {
    fetchReport(fromValue, toValue, criticalLevel);
  };

  const fetchReport = (from, to, criticalLevel) => {
    setLoading(true);
    ReportSaleService.getReportLowSales({startDate: from.format("YYYY-MM-DD"), endDate: to.format("YYYY-MM-DD"), criticalLevel})
    .then(response => {
      if (response.data) {
        setData(response.data);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };

    return (
        <React.Fragment>
            { !util.isCheckingPermission(props) &&
                (util.checkIfHasAccessPermission( permission_module_code, permission_code, props.checkPermission.response) ?
                    <div id="report-sale">
                        <PageHeader
                            style={{
                                backgroundColor: "#f7f7f7",
                                paddingLeft: 0,
                                paddingRight: 0
                            }}
                            title={<Translate id="text_low_sales_report" />}
                            subTitle=""
                            extra={[
                                <div style={{display: "flex"}} key="1">
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        value={fromValue}
                                        placeholder="From"
                                        onChange={onFromChange}
                                    />
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        value={toValue}
                                        placeholder="To"
                                        onChange={onToChange}
                                        style={{marginLeft: 15}}
                                    />
                                    <InputNumber
                                        placeholder="Critical Level(Sold QTY)"
                                        min={0}
                                        onChange={onChangeCriticalLevel}
                                        style={{marginLeft: 15}} />
                                    <Button type="primary" onClick={onGetData} style={{marginLeft: 15}}>Analye</Button>
                                    <ExportLowSaleForm startDate={fromValue.format("YYYY-MM-DD")} endDate={toValue.format("YYYY-MM-DD")} criticalLevel={criticalLevel} style={{marginTop: 0, marginLeft: 15}} />
                                </div>
                            ]}
                        />
                        <Row gutter={16}>
                            <Col span={24}>
                                <Table
                                    bordered={true}
                                    rowKey="id"
                                    dataSource={data ? data : []}
                                    columns={[
                                        {
                                            title: "#",
                                            dataIndex: "id",
                                            key: "id",
                                            width: 80,
                                            render: (id, record, index) => index + 1
                                        },
                                        {
                                            title: <Translate id="text_product" />,
                                            dataIndex: "productName",
                                            key: "productName"
                                        },
                                        {
                                            title: <Translate id="text_barcode" />,
                                            dataIndex: "barcode",
                                            key: "barcode"
                                        },
                                        {
                                            title: <Translate id="text_category" />,
                                            dataIndex: "categoryName",
                                            key: "categoryName"
                                        },
                                        {
                                            title: <Translate id="text_sold_quantity" />,
                                            dataIndex: "soldQuantity",
                                            key: "soldQuantity",
                                            render: (soldQuantity, record) => {
                                                return `${soldQuantity} ${record.unitName ? record.unitName : ""}`;
                                            }
                                        },
                                        {
                                            title: <Translate id="text_revenue" />,
                                            dataIndex: "revenue",
                                            key: "revenue",
                                            render: revenue => (new Util()).formatCurrency(revenue)
                                        },
                                        {
                                            title: <Translate id="text_last_sold_date" />,
                                            dataIndex: "lastSoldDate",
                                            key: "lastSoldDate",
                                            render: lastSoldDate => (new Util()).formatDate(lastSoldDate, "DD/MM/YYYY")
                                        },
                                        {
                                            title: <Translate id="text_current_stock" />,
                                            dataIndex: "inStock",
                                            key: "inStock"
                                        },
                                        {
                                            title: <Translate id="text_cost" />,
                                            dataIndex: "cost",
                                            key: "cost",
                                            render: cost => (new Util()).formatCurrency(cost)
                                        },
                                        {
                                            title: <Translate id="text_total_cost" />,
                                            dataIndex: "cost",
                                            key: "totalCost",
                                            render: (cost, record) => (new Util()).formatCurrency(cost * record.inStock)
                                        },
                                        {
                                            title: <Translate id="text_retail_price" />,
                                            dataIndex: "currentPrice",
                                            key: "currentPrice",
                                            render: currentPrice => (new Util()).formatCurrency(currentPrice)
                                        }
                                    ]}
                                    pagination={false}
                                    loading={loading}
                                />
                            </Col>
                        </Row>
                    </div>
                    :
                    <NoPermissionV2/>
                )
            }
        </React.Fragment>
    );
    }

function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

export default connect(mapStateToProps)(ReportLowSales);