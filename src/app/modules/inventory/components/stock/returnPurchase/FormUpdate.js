import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";
import ReturnPurchaseAction from "../../../actions/stock/returnPurchase";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };
    this.width = "65%";
    this.title = <this.Translate id="update_stock_return_purchase_title" />;
    this.confirmTitle = "Do you Want to return purchase ?";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

  }

  handleSubmit () {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) { 
        values["id"] = this.props.returnPurchaseDetail.data.id;

        // PREPARE RECEIVED ENTRIES
        const POEntries = [];

        if (values.receiveQty) {
          values.receiveQty.forEach((receiveQty, receiveQtyIndex) => {
            POEntries.push({
              id: values.receiveId[receiveQtyIndex],
              productId: values.productId[receiveQtyIndex],
              requestQuantity: parseInt(values.qty[receiveQtyIndex]),
              receiveQuantity: parseInt(values.receiveQty[receiveQtyIndex]),
              price: values.receivePrice[receiveQtyIndex],
              status: values.statusId[receiveQtyIndex],
            });

          });
        }

        this.Util.clearObjProperty(values, [
          "receiveId",
          "productId",
          "qty",
          "receiveQty",
          "receivePrice",
          "receiveDescription",
          "returnQty",
          "statusId",
          "totalAmount"
        ]);

       
        values["shippingFee"] = this.props.returnPurchaseDetail.data.shippingFee;
        values["requestTotal"] = this.props.returnPurchaseDetail.data.requestTotal;
        values["receiveTotal"] = this.props.returnPurchaseDetail.data.receiveTotal;
        values["returnTotal"] = parseFloat(values.requestTotalValue);
        values["step"] = Enum.PO_STEP.RETURN;
        values["type"] = this.props.returnPurchaseDetail.data.type;
        values["status"] = this.props.returnPurchaseDetail.data.status;

        values["POEntries"] = POEntries;

        console.log("Update Values:", values);

        this.dispatch(ReturnPurchaseAction.update(values));

        const filter = JSON.stringify({step: [Enum.PO_STEP.RECEIVED]});
        this.dispatch(ReturnPurchaseAction.fetch(this.pageSize, 0, "", "", filter));

      }
     
    });
  }

  handleReturn(){
    this.setState({modalVisible: true});
    this.renderModalConfirmAction();
  }

  handleSubmitConfirmAction() {
    this.setState({modalVisible: false});
    this.handleSubmit();
  }

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button onClick={this.handleCancel} className="danger btn-push-to-supplier">
          <span className="icon-save "></span> Cancel
        </this.Button>
        <this.Button onClick={this.handleReturn} className="info btn-push-to-supplier">
          <span className="icon-save "></span> Return
        </this.Button>
      </div>
    );
  }
    
  handleCancel() {
    this.dispatch(ReturnPurchaseAction.reset());
  }

  render() {
    const {
      returnPurchaseUpdate, 
      returnPurchaseDetail, 
      supplier,
      product,
      storeLocation,
      form, 
      locale,
      dispatch
    } = this.props;

    this.submitLoading = returnPurchaseUpdate.updating;

    if (returnPurchaseDetail.showForm) {
      this.content = (
        <div>
          <FormItem 
            formData={returnPurchaseDetail.data} 
            supplier={supplier}
            product={product}
            storeLocation={storeLocation}
            form={form} 
            dispatch={dispatch}
            locale={locale}
          />
          {this.renderModalConfirmAction()}
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}