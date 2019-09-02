import React from "react";
import Retail from "../../../../pos/components/transactions/RetailSale";
import "./index.css";

export default class Form extends Retail {
    constructor(props){
        super(props);
        this.handleCreateQuotation = this.handleCreateQuotation.bind(this);
    }

    handleCreateQuotation(){
        alert("handleCreateQuotation");
    }
    
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