import React from "react";
import {PaperSize} from "./PaperSize";
import CurrencyService from "../../../services/settings/CurrencyService";
import Modal from "../../../../common/components/shares/Modal";
import Enum from "../../../enums";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      subCurrencies: [],
      isHasSubCurrency: false
    };

    this.handleOnChangeIsHasSubCurrency = this.handleOnChangeIsHasSubCurrency.bind(this);
  }

  componentDidMount() {
    new Promise(() => {
      CurrencyService.listsAllSubCurrency()
        .then(response => {
          if (response && response.data && response.data.data) {
            this.setState({subCurrencies: response.data.data});
          }
        });
    });

    this.setState({isHasSubCurrency: this.props.formData.isHasSubCurrency});
  }

  handleOnChangeIsHasSubCurrency(event) {
    if (event.target.checked) {
      this.setState({isHasSubCurrency: true});
    } else {
      this.setState({isHasSubCurrency: false});
    }
  }

  render() {
    const {formData, form, locale} = this.props;
    const image = {
      uid: "-1",
      name: formData.logo,
      status: "done",
      url: this.Util.getProductImage(formData.logo, this.Enum.IMAGE_SPACE.GENERAL).url
    };
    return (
      <this.Row style={{maxHeight: 500, overflow: "auto"}}>
        <this.Col md="12">
          <this.InputText
            name="name"
            label={<this.Translate id="text_name" />}
            placeholder={this.CATranslate("text_name", locale)}
            errorRequired={<this.Translate id="error_require_name" />}
            errorLenght={<this.Translate id="error_name_length" />}
            max={100}
            data={formData.name}
            required={true}
            isAutoFocus={true}
            form={form}/>
        </this.Col>
        <this.Col md="12">
          <this.Checkboxs
            name="isHasSubCurrency"
            defaultValue={formData.isHasSubCurrency}
            label={<this.Translate id="text_has_sub_currency"/>}
            onChange={this.handleOnChangeIsHasSubCurrency}
            form={this.props.form} />
        </this.Col>
        <this.Col md="12">
          <this.UploadImg 
            name="logo" 
            label={<this.Translate id="receipt_logo" />}
            data={{file: image}}
            fileList={[image]}
            endPoint={`${this.Util.getAPIURL()}/file/v1/upload/general`}
            endPointDelete={`${this.Util.getAPIURL()}/file/v1/general/delete`}
            accessToken={this.Util.getAccessToken()}
            form={form} />
        </this.Col>
        <this.Col md="12">
          <this.Select
            name="paperSize"
            label={<this.Translate id="text_paper_size" />}
            dataSource={PaperSize}
            valueKey="code"
            defaultValue={formData.paperSize}
            form={form}/>
        </this.Col>
        {
          this.state.isHasSubCurrency ?
            <this.Col md="12">
              <this.Select
                name="subCurrencyId"
                placeholder={this.CATranslate("text_sub_currency", this.props.locale)}
                label={<this.Translate id="text_sub_currency" />}
                dataSource={this.state.subCurrencies}
                valueKey="id"
                nameKey="name"
                required={true}
                defaultValue={formData.subCurrencyId}
                form={form} />
            </this.Col>
            :
            <div />
        }
        <this.Col md="12">
          <this.Switchs
            name="isShowStoreName"
            label={<this.Translate id="text_show_store_name" />}
            checked={formData.isShowStoreName}
            form={form}/>
        </this.Col>
        {/* <this.Col md="12">
          <this.Switchs
            name="isShowCustomerInfo"
            label={<this.Translate id="text_show_customer_info" />}
            checked={formData.isShowCustomerInfo}
            form={form}/>
        </this.Col> */}
        <this.Col md="12">
          <this.Switchs
            name="isShowDevelopBy"
            label={<this.Translate id="text_develop_by" />}
            checked={formData.isShowDevelopBy}
            form={form}/>
        </this.Col>
        <this.Col md="12">
          <this.Switchs
            name="isDefault"
            label={<this.Translate id="text_is_default" />}
            checked={formData.isDefault}
            form={form}/>
        </this.Col>
        <this.Col md="12">
          <this.Select
            name="status"
            label={<this.Translate id="text_status" />}
            dataSource={this.statusDataSource}
            defaultValue={formData.status}
            form={form}/>
        </this.Col>
      </this.Row>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    paperSize: Enum.PAPER_SIZE.THERMAL,
    isShowStoreName: 0,
    isShowCustomerInfo: 0,
    isShowDevelopBy: 0,
    isDefault: 0,
    status: 1
  }
};