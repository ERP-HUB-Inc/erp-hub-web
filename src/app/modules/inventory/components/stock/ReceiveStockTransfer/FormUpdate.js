import React from "react";
import FormItem from "./FormItem";
import Constant from "../../../constants/stock/stockTransfer";
import Modal from "../../../../common/components/shares/Modal";
import StockTransferAction from "../../../actions/stock/stockTransfer";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_receive_stock_transfer" />;
    this.wrapClassName = `${this.wrapClassName} wrap-modal-po modal-po-full-screen`;
    this.width = window.innerWidth < 1400 ? window.innerWidth : 1400;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) { 
        values["id"] = this.props.detail.data.id;
        const transferEntries = [];
        if ("transferEntryId" in values) {
          values.transferEntryId.forEach((transferEntryId, index) => {
            transferEntries.push({
              id: transferEntryId,
              unitId: values.unitId[index],
              receiveQuantity: parseInt(values.receiveQuantity[index], 10)
            });
          });
        } else {
          return;
        }

        this.Util.clearObjProperty(values, [
          "transferEntryId",
          "receiveQuantity",
          "productName",
          "variantName",
          "unitId"
        ]);

        values["deliveryDueDate"] = this.Util.formatDateForMYSQL(values.deliveryDueDate);

        values["transferEntries"] = transferEntries;

        this.dispatch(StockTransferAction.approve(values));
      }
    });
  }
  
  handleCancel() {
    this.dispatch(StockTransferAction.reset(Constant.REQUEST_STOCK_TRANSFER_DETAIL_FULL_RESET));
  }

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button className="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel" />
        </this.Button>
        <this.Button htmlType="submit" loading={this.submitLoading} className="info">
          <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />
        </this.Button>
      </div>
    );
  }
  render() {
    this.submitLoading = this.props.approve.updating;

    if (this.props.detail.showForm) {
      this.content = <FormItem
        formData={this.props.detail.data}
        location={this.props.location}
        unit={this.props.unit}
        form={this.props.form}
        dispatch={this.props.dispatch}
        locale={this.props.locale}/>;
      return super.render();
    } else {
      return <div/>;
    }
  }
}