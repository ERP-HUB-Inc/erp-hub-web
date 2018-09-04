import React from "react";
import LanguageAction from "../../../../pos/action/settings/storeLanguage";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.renderDescription = this.renderDescription.bind(this);
  }
 
  componentDidMount(){
    const {dispatch} = this.props;
    dispatch(LanguageAction.fetch(100));
  }

  renderDescription(language, languagesIndex) {
    const {locale, form, formData} = this.props;
    let productTypeId = "",
      productTypeName = "",
      productTypeDescription = "";
    
    formData.productTypeDescriptions.forEach(productType => {
      if (language.code === productType.languageId) {
        productTypeId = productType.id;
        productTypeName = productType.name;
        productTypeDescription = productType.description;
      }
    });

    return (
      <this.TabPane tab={this.getLanguageIcon(language.code)} key={languagesIndex}>
        <this.Row>
          <this.InputText 
            name={`language[${languagesIndex}]`} 
            type="hidden"
            data={language.code}
            form={form} />
          <this.InputText 
            name={`id[${languagesIndex}]`} 
            type="hidden"
            data={productTypeId}
            form={form} />
          <this.Col md="12">
            <this.InputText
              name={`productTypeName[${languagesIndex}]`}
              data={productTypeName}
              label={<this.Translate id="input_product_name" />}
              placeholder={this.CATranslate("input_product_name", locale)}
              max={100}
              form={form}/>
          </this.Col>
          <this.Col md="12">
            <this.InputTextArea
              name={`productTypeDescription[${languagesIndex}]`}
              data={productTypeDescription}
              label={<this.Translate id="input_product_description" />}
              placeholder={this.CATranslate("input_product_description", locale)}
              max={255}
              form={form}/>
          </this.Col>
        </this.Row>
      </this.TabPane>
    );
  }

  render() {
    const {languages} = this.props;

    return (  
      <this.Tabs type="card">
        {
          languages.map((language, languagesIndex) => this.renderDescription(language, languagesIndex))
        }
      </this.Tabs>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    description:"",
    productTypeDescriptions:[]
  }
};