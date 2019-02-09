import React from "react";
import * as Ably from "ably/browser/static/ably-commonjs.js";
import List from "../List";
import FormCreate from "../../../containers/settings/PaymentMethod/FormCreate";
import FormUpdate from "../../../containers/settings/PaymentMethod/FormUpdate";
import Constant from "../../../constants/settings/paymentMethod";
import PaymentMethodAction from "../../../action/settings/paymentMethod";
import PaymentMethodService from "../../../services/settings/PaymentMethodService";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.service = PaymentMethodService;
    this.action = PaymentMethodAction;
    this.columnFilterWithKey = ["name"];
    this.RESET_CONSTANT = Constant.RESET_PAYMENT_METHOD;
    this.handleSumitMessage = this.handleSumitMessage.bind(this);
  }

  handleSumitMessage() {
    const client = new Ably.Realtime({key: "keC0MQ.3Aw0TQ:5I9_irvlIoGdpws9"});

    client.connection.on("connected", () => {
      console.log("HHHHHHHHHHH:", "Connected");
    });

    client.connection.on("failed", () => {
      console.log("HHHHHHHHHHH:", "Failed");
    });

    const channel = client.channels.get("ca.setting.paymentmethod");

    channel.subscribe("action", function(message) {
      console.log("Response Message", message);
    });
    channel.publish("action", "boom!");
  }

  // buttonActionCollection() {
  //   return [
  //     <this.Button
  //       type="info"
  //       id="btnAdd"
  //       className="mg-right text-uppercase"
  //       disabled={this.state.loadingPopup}
  //       onClick={this.handleSumitMessage}>
  //       <span className="icon-add icon-padding-right"></span>
  //       PUSH MESSAGE
  //     </this.Button>
  //   ];
  // }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      this.columnNo,
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true,
        render: (text, record, index) => {
          return <div>
            <span>{record.name}</span>{ record.isDefault === this.Enum.IS_DEFAULT  ? <this.TagLabel color="blue" style={{marginLeft: 10}}><this.Translate id="text_is_default" /></this.TagLabel> : "" }
          </div>;
        },
      },
      {
        title: <this.Translate id="text_description" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      this.columnStatus
    ];
  }
}
