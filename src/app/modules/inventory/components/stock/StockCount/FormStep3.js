import React from "react";
import {Translate} from "react-localize-redux";
import {
  Badge,
  message,
  PageHeader,
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
  const [loading, setLoading] = React.useState(false);

  const ST_COUNT_STR = {
    [Enum.STOCK_COUNT_STATUS.IN_PROGRESS]: {title: stringTranslate("text_in_progress", props.locale), color: "#ffa940"},
    [Enum.STOCK_COUNT_STATUS.PAUSE]: {title: stringTranslate("text_pause", props.locale), color: "#f50"},
    [Enum.STOCK_COUNT_STATUS.COMPLETED]: {title: stringTranslate("text_completed", props.locale), color: "#87d068"}
  };

  function fetchEntries(id, status) {
    setLoading(true);
    StockCountService.getStockCountEntriesByStatus(id, status)
    .then(response => {
      setProductList(response.data);
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
        "Please count all product",
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
    let status = "";
    if (key === TABS_LIST.UNCOUNTED) {
      status = "uncounted";
    } else if (key === TABS_LIST.UNMATCHED) {
      status = "unmatched";
    } else if (key === TABS_LIST.MATCHED) {
      status = "matched";
    }
    fetchEntries(props.id, status);
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
              title: <Translate id="text_product_name" />,
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
    />;
  }

  React.useEffect(() => {
    StockCountService.detail(props.id)
    .then(response => {
      setFormData(response.data.data);
    });

    fetchEntries(props.id, "");
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
    </React.Fragment>
  );
}