import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Constant from "../../../constants/stock/stockTransfer";
import Modal from "../../../../common/components/shares/Modal";
import StockTransferAction from "../../../actions/stock/stockTransfer";
import "./index.css";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_stock_transfer" />;
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
          // HAVE NO PURCHASE ENTRY INCLUDE
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

        if (this.props.isAcceptRequest) {
          this.dispatch(StockTransferAction.approve(values));
        } else {
          this.dispatch(StockTransferAction.update(values));
        }

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
        {
          this.props.isAcceptRequest ?
            <this.Button htmlType="submit" loading={this.submitLoading} className="info">
              <span className="icon-arrow-down icon-padding-right"></span><this.Translate id="text_receive" />
            </this.Button>
            :
            <this.Button htmlType="submit" loading={this.submitLoading} className="info">
              <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />
            </this.Button>
        }
      </div>
    );
  }
  render() {
    const {
      detail,
      update
    } = this.props;

    this.submitLoading = update.updating || this.props.approve.updating;

    if (detail.showForm) {
      this.content = <FormItem
        formData={detail.data}
        storeLocation={this.props.storeLocation} 
        accessLocation={this.props.accessLocation}
        productSearch={this.props.productSearch}
        productVariant={this.props.productVariant}
        form={this.props.form}
        dispatch={this.props.dispatch}
        locale={this.props.locale}
        isAcceptRequest={this.props.isAcceptRequest}/>;
      return super.render();
    } else {
      return <div/>;
    }
  }
}