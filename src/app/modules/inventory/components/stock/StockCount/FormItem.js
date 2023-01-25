import React from "react";
import {connect} from "react-redux";
import {
  Form,
  Spin
} from "antd";
import Util from "../../../../common/util";
import history from "../../../../common/router/history";
import EnumStock from "../../../enums";
import {stringTranslate} from "../../../../common/helper/stringTranslate";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";

class FormItem extends React.Component {
  state = {
    step: 1
  };
  util = new Util();

  handleStartCount = (formData, entries) => {
    console.log("formData", formData);
    if (!formData.name) {
      return this.util.sweetAlertMessageV2("", "Please input name", "warning");
    }

    if (formData.type === EnumStock.STOCK_COUNT_TYPE.PARTIAL && !entries.length) {
      return this.util.sweetAlertMessageV2(
        stringTranslate("text_warning", this.props.locale),
        stringTranslate("text_please_input_product", this.props.locale),
        "error"
      );
    }

    this.setState({step: 2});
  }

  handleGoToPreview = () => {
    this.setState({
      step: 3
    });
  }

  handleGoBackToList = () => {
    history.goBack();
  }

  renderFormItem(formData) {
    const {form, locale} = this.props;
    let formItem = <div />;
    if (this.state.step === 1) {
      formItem = <FormStep1
        locale={locale}
        match={this.props.match}
        productVariant={this.props.productVariant}
        dispatch={this.props.dispatch}
        handleStartCount={this.handleStartCount}
        goBack={this.handleGoBackToList}
        form={form} 
      />;
    } else if (this.state.step === 2) {
      formItem = <FormStep2
        formData={formData}
        locale={locale}
        id={this.props.match.params.id}
        products={this.state.products}
        productVariant={this.props.productVariant}
        dispatch={this.props.dispatch}
        goBack={() => this.setState({step: 1})}
        handleStartCount={this.handleStartCount}
        handleReview={this.handleGoToPreview}
        form={form} />;
    } else if (this.state.step === 3) {
      formItem = <FormStep3
        id={this.props.match.params.id}
        locale={locale}
        products={this.state.products}
        goBack={() => this.setState({step: 2})}
        handleContinue={() => this.setState({step: 2})}
        form={form} />;
    }

    return formItem;
  }

  render() {
    const {formData} = this.state;
    return (
      !this.state.loading ?
      <div>
        {this.renderFormItem(formData)}
      </div>
      :
      <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
        <Spin />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale,
    productVariant: state.reducer.productVariant.request
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formItem = Form.create(mapPropsToFields)(FormItem);
export default connect(mapStateToProps)(formItem);