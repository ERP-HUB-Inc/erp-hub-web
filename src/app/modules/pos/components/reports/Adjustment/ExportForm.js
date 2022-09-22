import React from "react";
import { Drawer, Result, Button } from "antd";
import ProductService from "../../../services/report/ProductService";

function ExportFormLoader({ locationId, viewStock }) {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  React.useEffect(() => {
    try {
      setLoading(true);
      ProductService.exportProducts({ locationId, viewStock }).then(
        (response) => {
          if (response.data) {
            setResult(response.data);
          }
        }
      );
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
              viewStock={this.props.viewStock}
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
