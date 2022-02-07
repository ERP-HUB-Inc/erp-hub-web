import React from "react";
import {
    Drawer,
    Result,
    Icon,
    Button
} from "antd";
import ProfitAndLossContext from "./ProfitAndLossContext";
import ProfitAndLostService from "../../../services/report/ProfitAndLostService";

function ExportFormLoader() {
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState(null);
    const {
        startDate,
        endDate
    } = React.useContext(ProfitAndLossContext);

    React.useEffect(() => {
        try {
            setLoading(true);
            ProfitAndLostService.exportSummaries(startDate, endDate)
            .then(response => {
                if (response.data) {
                    setResult(response.data);
                }
            });
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    return <Result
        status="success"
        title="Successfully Exported Profit&Loss Report"
        subTitle={loading ? "Please wait..." : ""}
        extra={[
            <a href={result ? result.link : "#"}>
                Download File(xlsx)
            </a>
        ]}
    />;
}

export default class ExportForm extends React.PureComponent {
    state = {
      visible: false
    };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
        <div>
            <Button onClick={this.showDrawer}>
                <Icon type="export" style={{fontSize: 14}} /> Export
            </Button>
            <Drawer
            title="Export Profit&Loss"
            width={520}
            closable={true}
            onClose={this.onClose}
            visible={this.state.visible}
            >
                {
                    this.state.visible && <ExportFormLoader />
                }
                <div
                    style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    borderTop: "1px solid #e8e8e8",
                    padding: "10px 16px",
                    textAlign: "right",
                    left: 0,
                    background: "#fff",
                    borderRadius: "0 0 4px 4px",
                    }}
                >
                    <Button
                    style={{
                        marginRight: 8,
                    }}
                    onClick={this.onClose}
                    >
                    Close
                    </Button>
                </div>
            </Drawer>
        </div>
        );
    }
}