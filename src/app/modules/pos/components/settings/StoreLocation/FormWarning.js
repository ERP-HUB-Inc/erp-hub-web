import React from "react";
import Enum from "../../../enums";
import LocationAction from "../../../action/settings/storeLocation";
import Modal from "../../../../common/components/shares/Modal";
import "./index.css";

export default class FormWarning extends Modal {
  constructor(props) {
    super(props);
    this.maskClosable = true;
    this.wrapClassName = "wrap-warning-create-location";
  }
  renderCrudAction() {}

  handleCancel() {
    this.dispatch(LocationAction.reset());
  }

  render() {
    const {storeLocationAdd} = this.props;

    if (storeLocationAdd.showForm) {
      let isLitePlan = false;
      let textPlan = "";
      if (this.props.errorCode === Enum.LITE_PLAN_NOT_ALLOW_CREAE_LOCATION) {
        isLitePlan = true;
        textPlan = "Business Lite";
      } else {
        textPlan = "Business Pro";
      }
      this.content = <div>
        <div className="text-center" style={{marginBottom: 10}}>
          <img style={{width: 80}} alt="" src={this.Util.getGeneralImage(`storeVein/${isLitePlan ? "business_lite.png" : "business_pro.png"}`).url} /> 
        </div>
        <h3 className="text-center">
          {textPlan}
        </h3>
        {
          isLitePlan ?
            <p className="text-center">
          Your currently subscription plan can not add more store location, please upgrade your <a href="http://www.storevein.com/#pricing" rel="noopener noreferrer" target="_blank">plan</a> from <span style={{fontWeight: 500}}>Business Lite</span> to <span style={{fontWeight: 500}}>Business Pro</span> to get additional location.
            </p>
            :
            <p className="text-center">
          Your plan is now reach limit store location, please contact <a href="http://www.storevein.com/#pricing" rel="noopener noreferrer" target="_blank">storeVein</a> team to request more location.
            </p>
        }
      </div>;
      return super.render();
    } else {
      return <div/>;
    }
  }
}