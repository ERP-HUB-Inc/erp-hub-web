import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../../common/components/shares/Modal";
import purchaseOrderSendEmailAction from "../../../../actions/stock/purchaseOrderSendEmail";
import "./index.css";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_stock_purchase_order_send_mail_title" />;
    this.confirmTextDelete = "Are You Want to Send Email?";
    this.width = "30%";
    this.addingPropReducer = "purchaseOrderSendEmailAdd";
    this.dispatch = this.props.dispatch;
    this.handlePush = this.handlePush.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(purchaseOrderSendEmailAction.add(values));   
      }
    });
  }

  
  handlePush(e){
    this.setState({modalVisible: true});
    this.modalVisible = true;
    this.renderModalConfirmDelete();
  }

  handleCancel() {
    this.dispatch(purchaseOrderSendEmailAction.reset());    
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