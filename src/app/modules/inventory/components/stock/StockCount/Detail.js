import React, {useState} from "react";
import moment from "moment";
import {connect} from "react-redux";
import {Translate} from "react-localize-redux";
import {
  Badge,
  Button,
  Form,
  Icon,
  PageHeader,
  Pagination,
  Spin,
  Table,
  Tabs,
  Tag
} from "antd";
import history from "../../../../common/router/history";
import StockCountService from "../../../services/stock/StockCountService";
import Util from "../../../../common/util";
import Enum from "../../../enums";
import { stringTranslate } from "../../../../common/helper/stringTranslate";

const {TabPane} = Tabs;

const util = new Util();
const TABS_LIST = {
  ALL: 1,
  UNCOUNTED: 2,
  UNMATCHED: 3,
  MATCHED: 4
};

function DetailStockCount(props) {
  const [detail, setDetail] = useState({});
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState({});
  const [current, setCurrent] = useState(1);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loading, setLoading] = useState({});
  const ST_COUNT_STR = {
    [Enum.STOCK_COUNT_STATUS.IN_PROGRESS]: {title: stringTranslate("text_in_progress", props.locale), color: "#ffa940"},
    [Enum.STOCK_COUNT_STATUS.PAUSE]: {title: stringTranslate("text_pause", props.locale), color: "#f50"},
    [Enum.STOCK_COUNT_STATUS.COMPLETED]: {title: stringTranslate("text_completed", props.locale), color: "#87d068"}
  };
  let pageSize = 10;
  let activeTab = "all";

  function fetchEntries(id, status, limit, offset, type, locationId) {
    offset = (offset - 1) * limit;
    setLoadingTable(true);
    StockCountService.getStockCountEntriesByStatus(id, status, limit, offset, type, locationId)
    .then(response => {
      setEntries(response.data.data);
      setPagination(response.data.pagination);
    })
    .finally(() => setLoadingTable(false));
  }

  const onTableChange = (current, size) => {
    pageSize = size;
    setCurrent(current);
    fetchEntries(detail.id, activeTab, pageSize, current, detail.type, detail.locationId);
  };

  const onChangeTabs = (key) => {
    key = parseInt(key);
    let status = "all";
    if (key === TABS_LIST.UNCOUNTED) {
      status = "uncounted";
    } else if (key === TABS_LIST.UNMATCHED) {
      status = "unmatched";
    } else if (key === TABS_LIST.MATCHED) {
      status = "matched";
    }
    activeTab = status;
    setCurrent(1);
    fetchEntries(detail.id, activeTab, pageSize, 1, detail.type, detail.locationId);
  };

  const handleShowEditForm = () => {
    if (detail.status === Enum.STOCK_COUNT_STATUS.COMPLETED) {
      return util.sweetAlertMessageV2(
        stringTranslate("text_warning", props.locale),
        stringTranslate("text_stock_count_is_completed", props.locale),
        "warning"
      );
    }
    history.push(`/stock/stock-count/update/${detail.id}`);
  };

  function renderTable() {
    return (
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
        loading={loadingTable}
        dataSource={entries}
        pagination={false}
        style={{marginTop: -15}}
      />
    );
  }

  React.useEffect(() => {
    const id = props.match.params.id;
    setLoading(true);
    StockCountService.detail(id)
    .then(response => {
      const detail = response.data.data;
      setDetail(detail);
      fetchEntries(id, activeTab, pageSize, current, detail.type, detail.locationId);
    })
    .finally(() => setLoading(false));
    //eslint-disable-next-line
  }, []);

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
        extra={[
          <Button key={1} onClick={handleShowEditForm}>
            <Icon type="edit" /> <Translate id="text_update_stock_count" />
          </Button>
        ]}
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

          <Tabs type="card" onChange={onChangeTabs} style={{marginTop: 20}}>
            <TabPane tab={<Translate id="text_all" />} key="1">
              {renderTable()}
            </TabPane>
            <TabPane tab={<Translate id="text_uncounted" />} key="2">
              {renderTable()}
            </TabPane>
            <TabPane tab={<Translate id="text_unmatched" />} key="3">
              {renderTable()}
            </TabPane>
            <TabPane tab={<Translate id="text_matched" />} key="4">
              {renderTable()}
            </TabPane>
          </Tabs>
          {
            pagination.total ?
            <div className="float-right" style={{margin: "20px -8px"}}>
              <Pagination
                total={pagination.total}
                showTotal={(total) => `${stringTranslate("text_total", props.locale)} ${total} ${stringTranslate("text_records", props.locale)}`}
                pageSize={pagination.limit}
                current={current}
                size="small"
                showSizeChanger
                onShowSizeChange={onTableChange}
                onChange={onTableChange}
              />
            </div>
            :
            null
          }

          <div className="clearFloat"></div>
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