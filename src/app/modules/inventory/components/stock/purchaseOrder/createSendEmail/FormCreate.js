import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../../common/components/shares/Modal";
import purchaseOrderSendEmailAction from "../../../../actions/stock/purchaseOrderSendEmail";
import SupplierAction from "../../../../actions/stock/supplier";
import "./index.css";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
    this.title = <this.Translate id="create_stock_purchase_order_send_mail_title" />;
    this.width = "30%";
    this.addingPropReducer = "purchaseOrderSendEmailAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePush = this.handlePush.bind(this);
    this.handlePushToSupplier = this.handlePushToSupplier.bind(this);
    this.Cancel = this.Cancel.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(purchaseOrderSendEmailAction.add(values));   
      }
    });
  }

  Cancel() {
    this.setState({modalVisible: false});
  }

  
  handlePush(e){
    this.setState({modalVisible: true});
    this.renderModalConfirmDelete();
  }

  //for send email
  handlePushToSupplier(){
    this.setState({modalVisible: false});
    this.handleCancel();
  }

  renderModalConfirmDelete() { 
    return(
      <this.Modal
        visible={this.state.modalVisible}
        wrapClassName="confirm-delete"
        footer={null}    
      >
        <div>
          <span className="icon-help icon-padding-right"></span>
          <span className="title">
            <this.Translate id="title_stock_purchase_order_send_mail_comfirm_email" />
          </span><br/>
          <span>
            <this.Translate id="text_stock_purchase_order_send_mail_comfirm_title" />
          </span>

        </div>
        <div className="ant-modal-footer">
          <this.Button className="danger" onClick={() => this.Cancel()}>
            <span className="icon-close icon-padding-right"></span> <this.Translate id="button_stock_purchase_order_send_mail_comfirm_cancel" />
          </this.Button>
          <this.Button onClick={() => this.handlePushToSupplier()} loading={this.state.deleting} className="info">
            <span className="icon-checked icon-padding-right"></span> <this.Translate id="button_stock_purchase_order_send_mail_comfirm_yes" />
          </this.Button>
        </div>
      </this.Modal>
    );
  }
      
  handleCancel() {
    this.setState({modalVisible: false});
    this.dispatch(purchaseOrderSendEmailAction.reset());
    this.dispatch(SupplierAction.reset());
  }

  renderCrudAction(){
    return(
      <div>
        <this.Button className="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="button_text_cancel" />
        </this.Button>  
        <this.Button loading={this.submitLoading} className="info" onClick={this.handlePush}>
          <span className="icon-cancel icon-padding-right"></span> <this.Translate id="button_stock_purchase_order_push" />
        </this.Button>  
        <this.Button htmlType="submit" loading={this.submitLoading} className="info btn-push-with-send-mail" onClick={this.handleSubmit}>
          <span className="icon-save icon-padding-right"></span> <this.Translate id="button_stock_purchase_order_push_with_send_email" />
        </this.Button>
      </div>
    );
  }


  render() {
    const {purchaseOrderSendEmailAdd,form,locale,dispatch,supplierDetail} = this.props;
    
    this.submitLoading = purchaseOrderSendEmailAdd.adding;

    if (purchaseOrderSendEmailAdd.showForm) {
      this.content = (
        <div>
          { purchaseOrderSendEmailAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" }
          <FormItem form={form} dispatch={dispatch} supplierDetail={supplierDetail} locale={locale}/>
          {this.renderModalConfirmDelete()}
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}