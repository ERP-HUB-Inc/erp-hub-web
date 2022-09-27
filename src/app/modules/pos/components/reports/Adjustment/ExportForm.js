import React from "react";
import { Drawer, Result, Button } from "antd";
import moment from "moment";
import AdjustmentService from "../../../services/report/AdjustmentService";

function ExportFormLoader({ locationId, endDate, startDate, searchValue }) {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  React.useEffect(() => {
    let option = {};
    if (searchValue) {
      option["search"] = searchValue;
    }
    option["locationId"] = locationId;
    option["startDate"] = moment(startDate).format("YYYY-MM-DD");
    option["endDate"] = moment(endDate).format("YYYY-MM-DD");
    option["isExport"] = true;
    try {
      setLoading(true);
      AdjustmentService.getAdjustmentReport(option).then((response) => {
        if (response.data) {
          setResult(response.data);
        }
      });
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Result
      status="success"
      title="Successfully Exported Adjustment Report"
      subTitle={loading ? "Please wait..." : ""}
      extra={[<a href={result ? result.link : "#"}>Download File(xlsx)</a>]}
    />
  );
}

export default class ExportForm extends React.PureComponent {
  state = {
    visible: false,
    childrenDrawer: false,
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
        <Button type="info" style={{ marginTop: 15 }} onClick={this.showDrawer}>
          Export
        </Button>
        <Drawer
          title="Export Adjustment"
          width={520}
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          {this.state.visible && (
            <ExportFormLoader
              locationId={this.props.locationId}
              endDate={this.props.endDate}
              startDate={this.props.startDate}
              searchValue={this.props.searchValue}
            />
          )}
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
