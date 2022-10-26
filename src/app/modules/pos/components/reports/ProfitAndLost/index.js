import React from "react";
import moment from "moment";
import {
    PageHeader,
    DatePicker,
    Button,
    Icon
} from "antd";
import "./index.css";
import ProfitAndLossContext from "./ProfitAndLossContext";
import ExportForm from "./ExportForm";
import ProfitAndLostService from "../../../services/report/ProfitAndLostService";
import Util from "../../../../common/util";
import PrivilegeAction from "../../../action/settings/privilege";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";

const permission_module_code    = "report";
const permission_code           = "profit_and_loss_report";
const util                      = new Util();

export default function ProfitAndLossReport(props) {
    
    const [data, setData] = React.useState(null);
    const [fromValue, setFromValue] = React.useState(moment().startOf("month"));
    const [toValue, setToValue] = React.useState(moment().endOf("month"));

    const onFromChange = value => {
        setFromValue(value);
        setToValue(value);
        fetchReport(value, value);
    };

    const onToChange = value => {
        setToValue(value);
        fetchReport(fromValue, value);
    };

    const fetchReport = (from, to) => {
        ProfitAndLostService.summaries(from.format("YYYY-MM-DD"), to.format("YYYY-MM-DD"))
            .then(response => {
                if (response.data) {
                    setData(response.data.data);
                }
            });
    };

    React.useEffect(() => {
        try {
            fetchReport(fromValue, toValue);
            if (!props.checkPermission.checked){
                props.dispatch(PrivilegeAction.checkPermission());
            }
        } catch (error) {
            
        } finally {

        }

    }, [props, fromValue, toValue]);

    return (
        <React.Fragment>
            { !util.isCheckingPermission(props) &&
                (util.checkIfHasAccessPermission( permission_module_code, permission_code, props.checkPermission.response) ?
                    <ProfitAndLossContext.Provider value={{startDate: fromValue.format("YYYY-MM-DD"), endDate: toValue.format("YYYY-MM-DD")}}>
                        <div style={{width: "100%", backgroundColor: "#fff"}}>
                            <PageHeader
                                style={{
                                    backgroundColor: "#f7f7f7",
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }}
                                backIcon=""
                                title="Report"
                                subTitle="Profit&Loss Report"
                                extra={[
                                    <div style={{display: "flex"}}>
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            value={fromValue}
                                            placeholder="From"
                                            onChange={onFromChange}
                                        />
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            value={toValue}
                                            placeholder="To"
                                            onChange={onToChange}
                                            style={{marginLeft: 15}}
                                        />
                                        <Button style={{marginLeft: 15, marginRight: 15}}onClick={() => window.print()}>
                                            <Icon type="printer" style={{fontSize: 14}} /> Print
                                        </Button>
                                        <ExportForm startDate={fromValue.format("YYYY-MM-DD")} endDate={toValue.format("YYYY-MM-DD")} />
                                    </div>
                                ]}
                            />
                            <div id="profit-loss-report">
                                <div style={{textAlign: "center"}}>
                                    <h4>{(new Util()).getSetting().businessName}</h4>
                                    <h4 style={{fontWeight: "bold", marginBottom: 0}}>Profit & Loss</h4>
                                    <div>Date: {fromValue.format("DD/MM/YYYY")} ~ {toValue.format("DD/MM/YYYY")}</div>
                                </div>
                                <table className="table">
                                    <tbody>
                                    <tr className="title">
                                        <td colSpan="2">Revenue</td>
                                    </tr>
                                    {
                                        data && data.incomes.map((income, index) =>
                                            <tr key={index} className="income-row">
                                                <td>
                                                    {income.name}
                                                </td>
                                                <td>
                                                    {(new Util()).formatCurrency(income.amount, "")}
                                                </td>
                                            </tr>
                                        )
                                    }
                                    <tr className="summary-row">
                                        <td>Total Revenue</td>
                                        <td>{(new Util()).formatCurrency(data ? data.totalIncome : 0, "")}</td>
                                    </tr>
                                    {
                                        data && data.cogs.map((value, index) =>
                                            <tr key={index} className="income-row">
                                                <td>
                                                    {value.name}
                                                </td>
                                                <td>
                                                    {(new Util()).formatCurrency(Math.abs(value.amount), "")}
                                                </td>
                                            </tr>
                                        )
                                    }
                                    <tr className="summary-row">
                                        <td>Gross Profit</td>
                                        <td>{(new Util()).formatCurrency(data ? data.grossProfit : 0, "")}</td>
                                    </tr>
                                    <tr className="title">
                                        <td colSpan="2">Expense</td>
                                    </tr>
                                    {
                                        data && data.expenses.map((expense, index) =>
                                            <tr key={index} className="expense-row">
                                                <td>
                                                    {expense.name ? expense.name : "N/A"}
                                                </td>
                                                <td>
                                                    {expense.amount ? (new Util()).formatCurrency(expense.amount, "") : "N/A"}
                                                </td>
                                            </tr>
                                        )
                                    }
                                    <tr className="summary-row">
                                        <td>Total Expense</td>
                                        <td>{(new Util()).formatCurrency(data ? data.totalExpense : 0, "")}</td>
                                    </tr>
                                    <tr className="summary-row">
                                        <td>Net Profit{data && data.netIncome < 0 ? "(Loss)" : ""}</td>
                                        <td>{(new Util()).formatCurrency(data ? data.netIncome : 0, "")}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </ProfitAndLossContext.Provider>
                    :
                    <NoPermissionV2/>
                )
            }
        </React.Fragment>
    );


}