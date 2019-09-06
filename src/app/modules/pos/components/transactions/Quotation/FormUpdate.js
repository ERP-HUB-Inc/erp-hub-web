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
          handleRemove: false,
          isNotYetLoadComponentDidUpdated: true,
          listQuotationWhenRemove: []
        }
        this.handleCreateQuotation = this.handleCreateQuotation.bind(this);
    }

    componentDidUpdate(){
        super.componentDidUpdate();
        let quotaionValues = this.props.quotationDetail.data;
        let quotationColletion = [];

        if(this.state.isNotYetLoadComponentDidUpdated){

            if(quotaionValues){
            
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
                        },
                        quotationStatus: ""
                    });
                });
            
                this.props.form.setFieldsValue({ searchRecord: `${quotaionValues.customer.firstName} ${quotaionValues.customer.lastName}` });

                this.setState({
                    productOrderList: quotationColletion,
                    isNotYetLoadComponentDidUpdated: false,
                    quotationId: this.props.quotationDetail.data.id
                });
                this.props.dispatch(QuotationAction.reset(Constant.RESET_DETAIL_QUOTATION));
            }
        }
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
                    if(values.quotationStatus === this.Enum.ARCHIVE){
                        productList.push({
                            id: values.id,
                            productVariantId: values.productVariantId,
                            quantity: values.quantity,
                            price: values.price,
                            status: values.quotationStatus
                        });
                    }else{
                        productList.push({
                            id: values.id,
                            productVariantId: values.productVariantId,
                            quantity: values.quantity,
                            price: values.price
                        });
                    }
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
                values["Entries"] = productList;

                if(this.state.selectedCustomer && this.state.quotationId){
                    values["customerId"] = this.state.selectedCustomer.id;
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



    handleOnRemoveProductFromOrderList(values,index){
        let productOrderList = this.state.productOrderList;
        productOrderList[index]["quotationStatus"] = this.Enum.ARCHIVE;
        this.setState({
            productOrderList: productOrderList
        });
    }

    handleSetFullScreen(){}

    renderSaveAndPayButton(){
        return(
            <this.Row className="create-quotation-action" onClick={this.handleCreateQuotation}>
                <this.Button type="info" className="mg-right">
                    <span className="icon-add icon-padding-right"></span><this.Translate id="text_create_quotation" />
                </this.Button>
            </this.Row>
        );
    }
}