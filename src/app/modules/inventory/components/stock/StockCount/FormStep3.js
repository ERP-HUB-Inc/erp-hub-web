import React from "react";
import {Translate} from "react-localize-redux";
import {
  PageHeader,
  Table,
  Tabs
} from "antd";
import Util from "../../../../common/util";
import Enum from "../../../enums";
import history from "../../../../common/router/history";
import {Button} from "../../../../common/elements/ant-ui";
import { stringTranslate } from "../../../../common/helper/stringTranslate";

const {TabPane} = Tabs;
const util = new Util();

export default function FormStep3(props) {

  const handelDiscard = () => {
    util.sweetAlertConfirm(
      stringTranslate("text_warning", props.locale),
      stringTranslate("text_are_you_sure", props.locale),
      [stringTranslate("text_cancel", props.locale), stringTranslate("text_discard", props.locale)]
    )
    .then(willDiscard => {
      if (willDiscard) {
        history.push("/stock/stock-count/list");
      }
    });
  };

  function renderTable(formData) {
    const countType = formData.countType;
    return <Table
      rowKey={((row, index) => index)}
      loading={props.loading}
      bordered={true}
      style={{marginTop: -10}}
      columns={[
        {
          title: "Count List",
          children: [
            {
              title: <Translate id="text_product_name" />,
              dataIndex: "name",
              key: "name",
              render: (name, record) => {
                if (countType === Enum.STOCK_COUNT_TYPE.FULL_COUNT) {
                  name = record.product && record.product.name;
                  record.variantName = record.name;
                }
  
                return <div style={{display: "flex"}}>
                  {name} {record.variantName ? <div className="variant-name" style={{marginLeft: 15}}>{record.variantName}</div> : ""}
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
              dataIndex: "quantity",
              key: "quantity"
            },
            {
              title: <Translate id="text_total" />,
              dataIndex: "count",
              key: "total"
            }
          ]
        }
      ]}
      dataSource={props.products}
    />;
  }

  const {formData} = props;
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
        extra={[
          <div key={1}>
            <Button type="danger" htmlType="button" style={{width: 90}} onClick={handelDiscard}>
              <Translate id="text_discard" />
            </Button>
            <Button htmlType="button" style={{width: 90, margin: "0 15px"}} onClick={props.handleContinue}>
              <Translate id="text_continue" />
            </Button>
            <Button htmlType="submit" type="info" style={{width: 90}}>
              <Translate id="text_complete" />
            </Button>
          </div>
        ]}
      />

      <Tabs type="card">
        <TabPane tab={<Translate id="text_uncounted" />} key="1">
          {renderTable(formData)}
        </TabPane>
        <TabPane tab={<Translate id="text_unmatched" />} key="2">
          {renderTable(formData)}
        </TabPane>
        <TabPane tab={<Translate id="text_matched" />} key="3">
          {renderTable(formData)}
        </TabPane>
        <TabPane tab={<Translate id="text_all" />} key="4">
          {renderTable(formData)}
        </TabPane>
      </Tabs>
    </React.Fragment>
  );
}