import React from "react";
import {Translate} from "react-localize-redux";
import {
  Badge,
  message,
  PageHeader,
  Pagination,
  Table,
  Tabs
} from "antd";
import Util from "../../../../common/util";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import {Button} from "../../../../common/elements/ant-ui";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import StockCountService from "../../../services/stock/StockCountService";

const {TabPane} = Tabs;
const util = new Util();

const TABS_LIST = {
  UNCOUNTED: 1,
  UNMATCHED: 2,
  MATCHED: 3,
  ALL: 4
};

export default function FormStep3(props) {
  const [formData, setFormData] = React.useState({});
  const [productList, setProductList] = React.useState([]);
  const [pagination, setPagination] = React.useState({});
  const [current, setCurrent] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const ST_COUNT_STR = {
    [Enum.STOCK_COUNT_STATUS.IN_PROGRESS]: {title: stringTranslate("text_in_progress", props.locale), color: "#ffa940"},
    [Enum.STOCK_COUNT_STATUS.PAUSE]: {title: stringTranslate("text_pause", props.locale), color: "#f50"},
    [Enum.STOCK_COUNT_STATUS.COMPLETED]: {title: stringTranslate("text_completed", props.locale), color: "#87d068"}
  };
  let activeTab = "uncounted";
  let pageSize = 10;

  async function fetchEntries(id, status, limit, offset, type, locationId) {
    offset = (offset - 1) * limit;
    setLoading(true);
    StockCountService.getStockCountEntriesByStatus(id, status, limit, offset, type, locationId)
    .then(response => {
      setProductList(response.data.data);
      setPagination(response.data.pagination);
    })
    .finally(() => setLoading(false));
  }

  const handelDiscard = () => {
    util.sweetAlertConfirm(
      stringTranslate("text_warning", props.locale),
      stringTranslate("text_are_you_sure", props.locale),
      [stringTranslate("text_cancel", props.locale), stringTranslate("text_discard", props.locale)]
    )
    .then(willDiscard => {
      if (willDiscard) {
        StockCountService.delete(props.id)
        .then(() => {
          message.success("This stock count has discarded");
          history.push("/stock/stock-count/list");
        });
      }
    });
  };

  const handleComplete = () => {
    const uncountedProduct = productList.find(p => p.expected && !p.count);
    if (uncountedProduct) {
      return util.sweetAlertMessageV2(
        stringTranslate("text_warning", props.locale),
        stringTranslate("text_please_count_all_product", props.locale),
        "warning"
      );
    }

    if (formData.status === Enum.STOCK_COUNT_STATUS.COMPLETED) {
      return util.sweetAlertMessageV2(
        stringTranslate("text_warning", props.locale),
        stringTranslate("text_stock_count_is_completed", props.locale),
        "warning"
      );
    }

    util.sweetAlertConfirm(
      stringTranslate("text_warning", props.locale),
      stringTranslate("text_are_you_sure", props.locale),
      [stringTranslate("text_cancel", props.locale), stringTranslate("text_yes", props.locale)]
    )
    .then(willComplete => {
      if (willComplete) {
        StockCountService.markAsCompleted(props.id)
        .then(() => {
          message.success("Mark completed success........");
          history.push("/stock/stock-count/list");
        });
      }
    });
  };

  const onChangeTab = (key) => {
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
    fetchEntries(props.id, status, pageSize, 1, formData.type, formData.locationId);
  };

  const onTableChange = (current, size) => {
    pageSize = size;
    setCurrent(current);
    fetchEntries(formData.id, activeTab, size, current, formData.type, formData.locationId);
  };

  function renderTable() {
    return <Table
      rowKey={((row, index) => index)}
      loading={loading}
      bordered={true}
      style={{marginTop: -10}}
      columns={[
        {
          title: "Count List",
          children: [
            {
              title: <Translate id="text_item_name" />,
              dataIndex: "productName",
              key: "name",
              render: (productName, record) => {
                return <div style={{display: "flex"}}>
                  {productName} {record.variantName ? <div className="variant-name" style={{marginLeft: 15}}>{record.variantName}</div> : ""}
                </div>;
              }
            },
            {
              title: <Translate id="text_barcode" />,
              dataIndex: "barcode",
              key: "barcode"
            }
          ]
        },
        {
          title: "Inventory Count",
          children: [
            {
              title: <Translate id="text_expected" />,
              dataIndex: "expected",
              key: "expected",
              align: "right"
            },
            {
              title: <Translate id="text_total" />,
              dataIndex: "count",
              key: "total",
              align: "right",
              render: (count) => count ? count : 0
            }
          ]
        }
      ]}
      dataSource={productList}
      pagination={false}
    />;
  }

  React.useEffect(() => {
    StockCountService.detail(props.id)
    .then(response => {
      const detail = response.data.data;
      setFormData(detail);
      fetchEntries(detail.id, activeTab, pageSize, current, detail.type, detail.locationId);
    });
    // eslint-disable-next-line
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
        onBack={props.goBack}
        title={formData && formData.name}
        subTitle={formData.status ? <Badge count={ST_COUNT_STR[formData.status].title} style={{background: ST_COUNT_STR[formData.status].color}} /> : ""}
        extra={[
          <div key={1}>
            <Button type="danger" htmlType="button" style={{width: 90}} onClick={handelDiscard}>
              <Translate id="text_discard" />
            </Button>
            <Button htmlType="button" style={{width: 90, margin: "0 15px"}} onClick={props.handleContinue}>
              <Translate id="text_continue" />
            </Button>
            <Button htmlType="button" type="info" style={{width: 90}} onClick={handleComplete}>
              <Translate id="text_complete" />
            </Button>
          </div>
        ]}
      />

      <Tabs type="card" onChange={onChangeTab}>
        <TabPane tab={<Translate id="text_uncounted" />} key="1">
          {renderTable()}
        </TabPane>
        <TabPane tab={<Translate id="text_unmatched" />} key="2">
          {renderTable()}
        </TabPane>
        <TabPane tab={<Translate id="text_matched" />} key="3">
          {renderTable()}
        </TabPane>
        <TabPane tab={<Translate id="text_all" />} key="4">
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
        : null
      }

      <div className="clearFloat"></div>
    </React.Fragment>
  );
}