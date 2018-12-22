import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Modal from "../../../../common/components/shares/Modal";
import ReceivePurchaseAction from "../../../actions/stock/receivePurchase";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isReceivePartial: false,
      selectedReceiveType: 0
    };
    this.width = window.innerWidth < 1200 ? window.innerWidth : 1200;
    this.height = window.innerHeight < 800 ? window.innerHeight : 800;
    this.wrapClassName = "wrap-modal-po";
    this.confirmTextAction = <this.Translate id="text_confirm_receive"/>;
    this.confirmTitle = <this.Translate id="text_confirm_receive_title"/>;
    this.dispatch = this.props.dispatch;
    this.title = <this.Translate id="text_receive_order" />;
    this.handleOnChangeReceiveType = this.handleOnChangeReceiveType.bind(this);
    this.handleGetCallBackIsPartialReceive = this.handleGetCallBackIsPartialReceive.bind(this);
  }


  componentWillUpdate(nextProps) {
    if (nextProps.receivePurchaseUpdate.updated) {
      this.setState({modalVisible: false});
      this.props.dispatch(ReceivePurchaseAction.reset());
    }
  }

  handleGetCallBackIsPartialReceive(isReceivePartial) {
    this.setState({isReceivePartial});
  }

  handleOnChangeReceiveType(event) {
    this.setState({selectedReceiveType: event.target.value});
  }

  renderModalConfirmAction() {
    if (this.state.isReceivePartial) {
      const arr = [
        {description: <this.Translate id="text_receive_whole_po" />, value: 0},
        {description: <this.Translate id="text_receive_partial_po" />, value: 1}
      ];
  
      return (
        <this.Modal
          visible={this.state.modalVisible}
          wrapClassName={`confirm-delete ${this.state.isReceivePartial ? "confirm-receive-po-partial" : ""}`}
          footer={null}>
          <div>
            <span className="icon-help icon-padding-right"></span>
            <span className="title text-uppercase">{this.confirmTitle}</span><br/>
            <span>
              {this.state.isReceivePartial ? <this.Translate id="text_confirm_receive_partial"/> : this.confirmTextAction}
            </span>
            <this.RadioBox 
              className="main-radio-acc confirm-receive-po"
              label=""
              name="typeOfReceive" 
              type="radio"
              defaultValue={this.state.selectedReceiveType}
              form={this.props.form}
              onChange={this.handleOnChangeReceiveType}>
              {
                arr.map( (typeOfReceive, key) => 
                  <this.RadioChildBox
                    key={key}
                    language={typeOfReceive.description}
                    value={typeOfReceive.value} /> 
                ) 
              }
            </this.RadioBox> 
          </div>
          <div className="ant-modal-footer">
            <this.Button className="danger text-uppercase" onClick={() => this.handleCancelConfirmAction()}>
              <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_no" />
            </this.Button>
            <this.Button onClick={() => this.handleSubmitConfirmAction()} loading={this.submitConfirmActionLoading} className="info text-uppercase">
              <span className="icon-checked icon-padding-right"></span><this.Translate id="text_yes" />
            </this.Button>
          </div>
        </this.Modal>
      );
    } else {
      return super.renderModalConfirmAction();
    }
  }

  handleSubmitConfirmAction() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) { 
        values["id"] = this.props.receivePurchaseDetail.data.id;

        // PREPARE RECEIVED ENTRIES
        const POEntries = [];

        if (values.receiveQuantity) {
          values.receiveQuantity.forEach((receiveQuantity, index) => {
            POEntries.push({
              id: values.purchaseOrderEntryId[index],
              productVariantId: values.productVariantId[index],
              receiveQuantity: parseInt(receiveQuantity, 10)
            });
          });
        }

        this.Util.clearObjProperty(values, [
          "purchaseOrderEntryId",
          "productVariantId",
          "receiveQuantity",
          "price"
        ]);
        
        values["isReceivePartial"] = this.state.selectedReceiveType;
        values["referenceId"] = this.props.receivePurchaseDetail.data.referenceId;
        values["requestTotal"] = this.props.receivePurchaseDetail.data.requestTotal;
        values["receiveTotal"] = parseFloat(values.receiveTotalValue);
        values["returnTotal"] = this.props.receivePurchaseDetail.data.returnTotal;
        values["step"] = Enum.PO_STEP.RECEIVED;
        values["type"] = this.props.receivePurchaseDetail.data.type;
        values["status"] = this.props.receivePurchaseDetail.data.status;
        values["POEntries"] = POEntries;

        this.dispatch(ReceivePurchaseAction.update(values));
      }
    });
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({modalVisible: true});
        this.renderModalConfirmAction();
      }
    });
  }

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button onClick={this.handleCancel} className="danger btn-push-to-supplier">
          <span className="icon-save "></span> <this.Translate id="text_cancel"/>
        </this.Button>
        <this.Button htmlType="submit" className="info btn-push-to-supplier">
          <span className="icon-save "></span> <this.Translate id="text_receive"/>
        </this.Button>
      </div>
    );
  }

  handleCancel() {
    this.setState({modalVisible: false});
    this.dispatch(ReceivePurchaseAction.reset());
  }

  render() {
    const {
      receivePurchaseUpdate,
      receivePurchaseDetail,
      storeLocation,
      receivePurchase,
      supplier,
      dispatch, 
      form, 
      locale
    } = this.props;
    
    this.submitConfirmActionLoading = receivePurchaseUpdate.updating;

    if (receivePurchaseDetail.showForm) {
      this.content = (
        <div>
          <FormItem 
            formData={receivePurchaseDetail.data} 
            storeLocation={storeLocation} 
            receivePurchase={receivePurchase}
            handleGetCallBackIsPartialReceive={this.handleGetCallBackIsPartialReceive}
            supplier={supplier} 
            dispatch={dispatch} 
            form={form} 
            locale={locale}/>
          {this.renderModalConfirmAction()}
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}