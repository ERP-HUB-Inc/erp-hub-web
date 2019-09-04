import React from "react";
import Constant from "../../../constants/transactions/quotation";
import Enum from "../../../enums";
import history from "../../../../../modules/common/router/history";
import Retail from "../../../../pos/components/transactions/RetailSale";
import QuotationAction from "../../../action/transaction/quotation";
import POSUtil from "../../../../pos/utils";
import Util from "../../../../inventory/utils";
import "./index.css";

export default class Form extends Retail {
    constructor(props){
        super(props);
        this.state = {
          ...this.state,
          quotationId: "",
          productStatus: 0,
          isNotYetLoadComponentDidUpdated: true
        }
        this.handleCreateQuotation = this.handleCreateQuotation.bind(this);
        this.handleCancelQuotation = this.handleCancelQuotation.bind(this);
        this.handleProcessQuotation = this.handleProcessQuotation.bind(this);
    }

    componentDidUpdate(){
        super.componentDidUpdate();
        let quotaionValues = this.props.quotationDetail.data;
        let quotationColletion = [];
        if(this.props.quotationDetail.data){
            if(this.state.isNotYetLoadComponentDidUpdated){

                quotaionValues.quotationEntries.forEach((values, index) => {
                    quotationColletion.push({
                        id: values.id,
                        productVariantId: values.productVariant.id,
                        name: values.productVariant ? Util.getProductName(values.productVariant.product) : "",
                        barcode: values.productVariant.barcode,
                        quantity: values.quantity,
                        tax: values.tax,
                        price: values.price,
                        wholePrice: values.productVariant.wholePrice,
                        taxDescription: {
                            id: 0,
                            taxRate: 0,
                            taxName: "No Tax"
                        }
                    });
                });
              
                this.getSelectedCustomer(quotaionValues.customer);
                this.setState({
                    productOrderList: quotationColletion,
                    isNotYetLoadComponentDidUpdated: false,
                    quotationId: this.props.quotationDetail.data.id
                });
                this.props.dispatch(QuotationAction.reset(Constant.RESET_DETAIL_QUOTATION));
            }
        }
    }

    handleCancelQuotation(){
        this.saveQuotation(Enum.QUOTATION_STEP.CANCEL);
    }

    handleProcessQuotation(){
        this.saveQuotation(Enum.QUOTATION_STEP.PROCESS);
    }

    
    handleCreateQuotation(){
        this.saveQuotation(Enum.QUOTATION_STEP.DRAFT);
    }

    saveQuotation(status){
      
        let productList = [];
        let productOrderList = this.state.productOrderList;
        const summaryTotal = POSUtil.getSummaryTotalInOrder(this.state.productOrderList, this.state.customerFieldPrice);

        if (productOrderList.length > 0) {
            this.props.form.validateFieldsAndScroll((err, values) => {
                productOrderList.forEach((values, index) => {
                    productList.push({
                        id: values.id,
                        productVariantId: values.productVariantId,
                        quantity: values.quantity,
                        price: values.price
                    });
                });

                this.Util.clearObjProperty(values, [
                    "description",
                    "discount",
                    "isFocusOnSearchCompositeProduct",
                    "price",
                    "quantity",
                    "searchProduct",
                    "searchRecord"
                ]);

                values["total"] = summaryTotal.subTotal;
                values["status"] = status;
                values["name"] = "Create Quotation";
                values["customerId"] = this.state.selectedCustomer.id;
                values["Entries"] = productList;

                if(this.state.selectedCustomer){
                    values["id"] = this.state.quotationId;
                    this.props.dispatch(QuotationAction.update(values,this.state.quotationId)); 
                    history.push("/transactions/quotation");
                }else{
                    this.Message.warning(this.CATranslate("text_error_create_quotation", this.props.locale));
                }
                
            });
        }else{
            this.Message.warning(this.CATranslate("text_error_not_create_quotation", this.props.locale));
        }
    }



    renderSaveAndPayButton(){
        return(
            <this.Row  className="create-quotation-action" >
                <this.Button type="info" className="mg-right" onClick={this.handleCreateQuotation}>
                    <span className="icon-add icon-padding-right"></span><this.Translate id="text_create_quotation" />
                </this.Button>
                <this.Button type="info" onClick={this.handleCancelQuotation}>
                    <span className="icon-checked icon-padding-right"></span><this.Translate id="text_cancel" />
                </this.Button>
                <this.Button type="info" onClick={this.handleProcessQuotation}>
                    <span className="icon-checked icon-padding-right"></span><this.Translate id="text_process" />
                </this.Button>
          </this.Row>
        );
    }
}