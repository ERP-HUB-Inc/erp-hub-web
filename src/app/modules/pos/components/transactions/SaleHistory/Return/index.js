import React from "react";
import Constant from "../../../../constants/transactions/transaction";
import Enum from "../../../../enums";
import Retail from "../../../../../pos/components/transactions/RetailSale";
import QuotationAction from "../../../../action/transaction/quotation";
import POSUtil from "../../../../../pos/utils";
import Util from "../../../../../inventory/utils";
import history from "../../../../../common/router/history";
import "./index.css";

export default class Form extends Retail {
    constructor(props){
        super(props);
        this.state = {
          ...this.state,
          disabledCustomer: true,
          isCloseDiscountMoney: false,
          isOutOfStock: false,
          quotationId: "",
          isNotYetLoadComponentDidUpdated: true
        }
        this.handleReturn = this.handleReturn.bind(this);
    }

    componentDidUpdate(){
        super.componentDidUpdate();
        let returnValues = this.props.transactionDetail.data;
        let returnColletion = [];


        if(this.state.isNotYetLoadComponentDidUpdated){
            if(returnValues){
                returnValues.transactionEntries.forEach((values, index) => {
                    returnColletion.push({
                        id: values.id,
                        productVariantId: values.productVariant.id,
                        name: values.productVariant ? Util.getProductName(values.productVariant.product) : "",
                        variantName: values.productVariant.name ? values.productVariant.name : "",
                        barcode: values.productVariant.barcode,
                        quantity: values.quantity,
                        tax: values.tax,
                        price: values.price,
                        wholePrice: values.productVariant.wholePrice,
                        discount: values.discount,
                        taxDescription: {
                            id: 0,
                            taxRate: 0,
                            taxName: "No Tax"
                        },
                        quotationStatus: "",
                        description: values.description,
                    });
                    
                });
            
                this.props.form.setFieldsValue({ searchRecord: `${returnValues.customer.firstName ? returnValues.customer.firstName : "" } ${returnValues.customer.lastName ? returnValues.customer.lastName : ""}`});
                this.getSelectedCustomer(this.props.transactionDetail.data.customer);
               
                this.setState({
                    productOrderList: returnColletion,
                    isNotYetLoadComponentDidUpdated: false,
                    quotationId: this.props.transactionDetail.data.id,
                    isDiscountHasAdded: this.props.transactionDetail.data.discount > 0,
                    discountValue: {type: Enum.DISCOUNT_TYPE.PERCENTAGE, value: returnValues.terms ? returnValues.terms : 0 }
                });

                this.props.dispatch(QuotationAction.reset(Constant.RESET_DETAIL_TRANSACTION));
            }
        }

        //is redirect to saleHistory list if refresh page
        let { transactionDetail } = this.props;
        if(this.state.productOrderList.length === 0 && transactionDetail.fetched === false && transactionDetail.fetching === false){
            history.push("/transactions/salehistory");
        }
    }

    
    handleReturn(){
        history.push("/transactions/salehistory");
    }

    handleOnRemoveProductFromOrderList(values,index){
        let productOrderList = this.state.productOrderList;
        productOrderList[index]["quotationStatus"] = this.Enum.ARCHIVE;
        productOrderList[index]["quantity"] = 0;
        this.setState({
            productOrderList: productOrderList
        });
    }

    // For calculate summary total when status remove Enum = 3 
    getSummaryTotalInQuotation(orderList, priceFeild = "price") {
        let summaryTotal = {
          subTotal: 0,
          totalQuantity: 0,
          subTotalAfterDiscount: 0,
          discount: 0,
          tax: 0
        };
    
        if (orderList === null || !Array.isArray(orderList)) 
          return summaryTotal;
            orderList.forEach(value => {
                let totalAmount = "";
                if(value.quotationStatus !== this.Enum.ARCHIVE){
                    totalAmount = POSUtil.getTotalAmount(value.quantity, value[priceFeild]);
                    summaryTotal.totalQuantity += value.quantity;
                    summaryTotal.subTotal += totalAmount;
                    summaryTotal.subTotalAfterDiscount += POSUtil.getTotalAmountAfterDiscount(value.quantity, value[priceFeild], value.discount);
                    summaryTotal.discount += POSUtil.getDiscountByRate(totalAmount, value.discount);
                }
            });
        return summaryTotal;
    }

    // ..............................

    FieldNotation(index,values){
        return(
            <this.InputTextArea
                name={`description[${index}]`}
                label={<this.Translate id="text_notation"/>}
                data={values.description}
                className="ca-input-v1"
                handleKeyUp={(event) => this.handleOnChangOrderField(event, index, "description")}
                placeholder={this.CATranslate("text_add_notation", this.props.locale)}
                rows={7}
                form={this.props.form} />
        )
    }

    renderSaveAndPayButton(){
        return(
            <this.Row className="return-action">
                <this.Button type="info" className="mg-right" onClick={this.handleReturn}>
                   <span className="icon-sale-return icon-padding-right"></span>
                   <this.Translate id="text_return" />
                </this.Button>
            </this.Row>
        );
    }
}