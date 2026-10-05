import React from "react";
import {
    Drawer,
    Result,
    Button
} from "antd";
import { Link } from "react-router-dom";

function ExportFormLoader({ pdfLink, getData, exportExcel, exportPDF }) {
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState(null);
    const params = new URLSearchParams(document.location.search);
    const pdf = `${pdfLink}?${params.toString()}`;
    React.useEffect(() => {
        try {
            setLoading(true);
            if (typeof getData === "function") {
                getData()
                .then(response => {
                    if (response.data) {
                        setResult(response.data);
                    }
                });
            }
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line
    }, []);

    return <Result
        status="success"
        title="Successfully Exported Report"
        subTitle={loading ? "Please wait..." : ""}
        extra={[
            <div style={{marginBottom: 25, display: exportExcel ? "block" : "none"}}>
              <a key="1" className="ant-btn ant-btn-dashed" href={result ? result.link : "#"}>
                Download File(xlsx)
              </a>
            </div>,
            <div style={{display: exportPDF ? "block" : "none"}}>
              <Link key="2" className="ant-btn ant-btn-dashed" to={pdf} target="_blank">
                Preview PDF
              </Link>
            </div>
        ]}
    />;
}

ExportFormLoader.defaultProps = {
    exportExcel: true,
    exportPDF: true
};

export default class ExportForm extends React.PureComponent {
    state = {
      visible: false,
      childrenDrawer: false
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

    showChildrenDrawer = () => {
        this.setState({
            childrenDrawer: true,
        });
    };

    onChildrenDrawerClose = () => {
        this.setState({
        childrenDrawer: false,
        });
    };

    render() {
        return (
        <div>
            <Button type="info" style={{marginTop: 15, marginRight: 15, ...this.props.style}} onClick={this.showDrawer}>
                Export
            </Button>
            <Drawer
            title="Export Report"
            width={520}
            closable={true}
            onClose={this.onClose}
            visible={this.state.visible}
            >
                {
                    this.state.visible && <ExportFormLoader {...this.props} />
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