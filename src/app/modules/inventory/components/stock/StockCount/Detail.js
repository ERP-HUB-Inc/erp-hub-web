import React from "react";
import moment from "moment";
import {connect} from "react-redux";
import {Translate} from "react-localize-redux";
import {
  Badge,
  Form,
  PageHeader,
  Spin,
  Table,
  Tag
} from "antd";
import history from "../../../../common/router/history";
import StockCountService from "../../../services/stock/StockCountService";
import Util from "../../../../common/util";
import Enum from "../../../enums";
import { stringTranslate } from "../../../../common/helper/stringTranslate";

const util = new Util();

function DetailStockCount(props) {
  const [detail, setDetail] = React.useState({});
  const [loading, setLoading] = React.useState({});
  const ST_COUNT_STR = {
    [Enum.STOCK_COUNT_STATUS.IN_PROGRESS]: {title: stringTranslate("text_in_progress", props.locale), color: "#ffa940"},
    [Enum.STOCK_COUNT_STATUS.PAUSE]: {title: stringTranslate("text_pause", props.locale), color: "#f50"},
    [Enum.STOCK_COUNT_STATUS.COMPLETED]: {title: stringTranslate("text_completed", props.locale), color: "#87d068"}
  };

  React.useEffect(() => {
    const id = props.match.params.id;
    setLoading(true);
    StockCountService.detail(id)
    .then(response => {
      setDetail(response.data.data);
    })
    .finally(() => setLoading(false));
  }, [props.match.params.id]);

  return (
    <React.Fragment>
      <PageHeader 
        style={{
          // backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0,
          position: "relative"
        }}
        onBack={() => history.goBack()}
        title={detail.name}
        subTitle={detail.status ? <Badge count={ST_COUNT_STR[detail.status].title} style={{background: ST_COUNT_STR[detail.status].color}} /> : ""}
      />

      {
        loading ?
        <div style={{padding: 50, textAlign: "center"}}><Spin /></div>
        :
        <div>
          <table>
            <tbody>
              <tr>
                <td style={{width: 130}}><Translate id="text_start_date" /></td>
                <td>: {util.formatDate(detail.startDate)} - {moment(`${moment(detail.startDate).format("YYYY-MM-DD")} ${detail.startTime}`).format("hh:mm A")}</td>
              </tr>
              <tr>
                <td style={{width: 130}}><Translate id="text_end_date" /></td>
                <td>
                  : 
                  {detail.endDate ? `${util.formatDate(detail.endDate)} - ${moment(`${moment(detail.endDate).format("YYYY-MM-DD")} ${detail.endTime}`)}` : ""}
                </td>
              </tr>
              <tr>
                <td style={{width: 130}}><Translate id="text_location" /></td>
                <td>: {detail.location && detail.location.name}</td>
              </tr>
              <tr>
                <td style={{width: 130}}><Translate id="text_type" /></td>
                <td>
                  : {detail.type === Enum.STOCK_COUNT_TYPE.PARTIAL ? <Translate id="text_partial" /> : <Translate id="text_full_count" />}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{display: "flex", marginTop: 16, marginBottom: -6}}>
            <div style={{marginRight: 30, color: "#108ee9"}}><Translate id="text_counted" />: {detail.counted}</div>
            <div style={{marginRight: 30, color: "#ffa940"}}><Translate id="text_uncounted" />: {detail.uncounted}</div>
            <div style={{marginRight: 30, color: "#87d068"}}><Translate id="text_matched" />: {detail.matched}</div>
            <div style={{color: "#f50"}}><Translate id="text_unmatched" />: {detail.unmatched}</div>
          </div>
          <Table
            rowKey="id"
            bordered={true}
            columns={[
              {
                title: <Translate id="text_no" />,
                dataIndex: "id",
                key: "no",
                align: "center",
                width: 80,
                render: (id, record, index) => index + 1
              },
              {
                title: <Translate id="text_product_name" />,
                dataIndex: "productName",
                key: "productName",
                render: (productName, record) => {
                  return <div style={{display: "flex"}}>
                    <div>{productName}</div>
                    {record.variantName ? <div className="variant-name" style={{marginLeft: 15}}>{record.variantName}</div> : ""}
                  </div>;
                }
              },
              {
                title: <Translate id="text_barcode" />,
                dataIndex: "barcode",
                key: "barcode"
              },
              {
                title: <Translate id="text_expected" />,
                dataIndex: "expected",
                key: "expected",
                align: "right"
              },
              {
                title: <Translate id="text_count" />,
                dataIndex: "count",
                key: "count",
                align: "right",
                render: (count) => count ? count : "-"
              },
              {
                title: <Translate id="text_status" />,
                dataIndex: "status",
                key: "status",
                render: (status, record) => {
                  const statusObj = {
                    title: <Translate id="text_matched" />,
                    color: "#87d068"
                  };
                  if (status === Enum.STOCK_COUNT_ENTRY_STATUS.UNCOUNTED) {
                    statusObj.title = <Translate id="text_uncounted" />;
                    statusObj.color = "#ffa940";
                  } else if (record.count && record.expected !== record.count) {
                    statusObj.title = <Translate id="text_unmatched" />;
                    statusObj.color = "#f50";
                  }

                  return <Tag color={statusObj.color} style={{textAlign: "center", width: 100}}>{statusObj.title}</Tag>;
                }
              }
            ]}
            dataSource={detail.stockCountEntries}
          />
        </div>
      }
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const detailStockCount = Form.create(mapPropsToFields)(DetailStockCount);
export default connect(mapStateToProps)(detailStockCount);