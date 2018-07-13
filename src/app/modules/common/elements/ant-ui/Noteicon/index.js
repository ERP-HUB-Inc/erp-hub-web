import React, { Component } from "react";
import NoticeIcon from "ant-design-pro/lib/NoticeIcon";
import moment from "moment";
import groupBy from "lodash/groupBy";
import { Tag } from "antd";

const data = [{
  id: "000000001",
  avatar: "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
  title: "dd",
  datetime: "2017-08-09",
  type: "test1",
}, {
  id: "000000002",
  avatar: "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
  title: "dd",
  datetime: "2017-08-09",
  type: "test1",
},];

function onItemClick(item, tabProps) {
  console.log(item, tabProps);
}

function onClear(tabTitle) {
  console.log(tabTitle);
}

function getNoticeData(notices) {
  if (notices.length === 0) {
    return {};
  }
  const newNotices = notices.map((notice) => {
    const newNotice = { ...notice };
    if (newNotice.datetime) {
      newNotice.datetime = moment(notice.datetime).fromNow();
    }
    // transform id to item key
    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }
    if (newNotice.extra && newNotice.status) {
      const color = ({
        todo: "",
        processing: "blue",
        urgent: "red",
        doing: "gold",
      })[newNotice.status];
      newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
    }
    return newNotice;
  });
  return groupBy(newNotices, "type");
}

const noticeData = getNoticeData(data);

export class Noteicon extends Component {
  render(){
    return(
      <NoticeIcon
        className="notice-icon"
        count={5}
        onItemClick={onItemClick}
        onClear={onClear}
        popupAlign={{ offset: [20, -16] }}
      >
        <NoticeIcon.Tab
          list={noticeData["test1"]}
          title="test1"
          emptyText="test1"
          emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
        />
        <NoticeIcon.Tab
          list={noticeData["test2"]}
          title="Test2"
          emptyText="Test2"
          emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
        />
        <NoticeIcon.Tab
          list={noticeData["test3"]}
          title="Test3"
          emptyText="Test3"
          emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
        />
      </NoticeIcon>
    );
  }
}