import React from "react";
import {
  Form,
  PageHeader,
  Badge,
  Spin
} from "antd";
import sweetalert from "sweetalert";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Component from "../../../../common/components/Component";
import StockTransferAction from "../../../actions/stock/stockTransfer";
import history from "../../../../common/router/history";
import "./index.css";

export default class FormUpdate extends Component {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_stock_transfer" />;
    this.dispatch = this.props.dispatch;
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch(StockTransferAction.detail({id})); 
  }

  componentDidUpdate(nextProps) {
    if (this.props.update.updated && nextProps.update.updating) {
      sweetalert({
        icon: "success",
        title: "Success!",
        text: "You have saved stock transfer!",
        buttons: false,
        timer: 1500
      })
      .then(() => {
        history.goBack();
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        sweetalert({
          title: "Are you sure?",
          text: values["step"] === Enum.STOCK_STRANSFER_STEP.RECEIVED ? "Once saved, you will not be able to rollback this transfer" : "",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willSubmit) => {
          if (willSubmit) {
            values["id"] = this.props.detail.data.id;

            if (this.props.detail.data.step !== Enum.STOCK_STRANSFER_STEP.PROCESS) {
              this.Message.error(this.CATranslate("error_invalid_step_for_update_stock_transfer", this.props.locale));
              return;
            }

            const transferEntries = [];
            if ("productVariantId" in values) {
              values.productVariantId.forEach((productVariantId, index) => {
                transferEntries.push({
                  id: values.transferEntryId[index],
                  productVariantId,
                  unitId: values.unitId[index],
                  transferQuantity: parseInt(values.transferQuantity[index], 10),
                  status: values.transferEntryStatus[index]
                });
              });
            } else {
              this.Message.warning(this.CATranslate("error_purchase_order_no_entry", this.props.locale), 3);
              return;
            }

            this.Util.clearObjProperty(values, [
              "productVariantId",
              "transferEntryId",
              "transferEntryStatus",
              "transferQuantity",
              "searchProduct",
              "productName",
              "variantName",
              "isFocusOnSearchCompositeProduct",
              "unitId"
            ]);

            values["deliveryDueDate"] = this.Util.formatDateForMYSQL(values.deliveryDueDate);

            values["transferEntries"] = transferEntries;

            this.dispatch(StockTransferAction.update(values));
          }
        });
      }
    });
  }
  
  handleCancel() {
    history.goBack();
  }

  render() {
    const isReceived = this.props.detail.data && this.props.detail.data.step === Enum.STOCK_STRANSFER_STEP.RECEIVED;
    return <div style={{marginBottom: 25, height: "100%"}}>
      <PageHeader
        style={{
            backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0
        }}
        onBack={() => history.goBack()}
        title={<this.Translate id="text_stock_transfer" />}
        subTitle={<div><this.Translate id="text_stock_transfer" /><Badge count={isReceived ? "Received" : "Process"} style={{ backgroundColor: isReceived ? "#52c41a" : "rgb(45, 183, 245)" }} /></div>}
        extra={[]}
      />{
        this.props.detail.fetched ?
        <Form autoComplete="off" onSubmit={this.handleSubmit} style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
          <FormItem
            formData={this.props.detail.data}
            location={this.props.location}
            productSearch={this.props.productSearch}
            productVariant={this.props.productVariant}
            form={this.props.form}
            dispatch={this.props.dispatch}
            locale={this.props.locale}
          />

          {
            !isReceived && 
            <this.Row style={{justifyContent: "center", marginTop: 25, marginBottom: 25}}>
              <this.Button className="danger" onClick={this.handleCancel}>
                <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_back" />
              </this.Button>  
              <this.Button htmlType="submit" loading={this.props.update.updating} className="info" style={{marginLeft: 15}} id="btnSubmit">
                <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />(Ctrl+s)
              </this.Button>
            </this.Row>
          }
        </Form>
        :
        <div style={{width: 30, margin: "0 auto"}}>
          <Spin />
        </div>
      }
    </div>;
  }
}