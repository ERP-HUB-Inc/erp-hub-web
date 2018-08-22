import React from "react";
import LanguageAction from "../../../../pos/action/settings/storeLanguage";
import { Modal }  from "../../shares/Modal/modal";

export default class FormItem extends Modal {
 
  componentDidMount(){
    const {dispatch} = this.props;
    dispatch(LanguageAction.fetch());
  }

  render() {
    const {form,locale,formData} = this.props;
    const {getFieldDecorator,getFieldValue} = this.props.form;

    getFieldDecorator("keys", {initialValue: formData });

    let keys = getFieldValue("keys");
    if(keys === null || keys === ""){
      keys = [];
    }
    keys = formData;

    // console.log("get values",keys);

    return (  
      <div>
        <this.Tabs type="card">
          <this.TabPane tab={ <this.Translate id="tab_products_products_type_general" /> } key="1">
            <this.Row>
              <this.Col md="12">
                <this.InputText
                  name="name"
                  label={<this.Translate id="input_products_products_type_name" />}
                  data={formData.name}
                  placeholder={this.CATranslate("input_products_products_type_name", locale)}
                  required={true}
                  errorRequired={<this.Translate id="input_error_products_products_type_name" />}
                  max={100}
                  min={3}
                  form={form}/> 
              </this.Col> 
              <this.Col md="12">
                <this.InputTextArea
                  name="description"
                  label={<this.Translate id="input_products_products_type_description" />}
                  data={formData.description}
                  placeholder={this.CATranslate("input_products_products_type_description", locale)}
                  required={true}
                  errorRequired={<this.Translate id="input_error_products_products_type_description" />}
                  max={100}
                  form={form}/>
              </this.Col>
            </this.Row>
          </this.TabPane>
          <this.TabPane tab={ <this.Translate id="tab_products_products_type_language" /> } key="2">
            { console.log("get keys",keys) }
            
            { 
              keys.map((language, index) =>
                <div key={index}>
                  <this.Row>
                    <this.Col md="12">
                      <h6>{<this.Translate id="title_products_products_type_language" />}  {`${index + 1}`} </h6>
                      <hr/>
                    </this.Col>
                    <this.InputText 
                      name={`languageId[${index}]`} 
                      type="hidden"
                      data={ language.id !== null ? language.id : "" }
                      form={ form } />
                    <this.Col md="12">
                      <this.InputText 
                        name={`languageName[${index}]`} 
                        data={ language.name }
                        label={<this.Translate id="input_products_products_type_language_name" />} 
                        placeholder={this.CATranslate("input_products_products_type_language_name", locale)}  
                        form={ form } />
                    </this.Col>
                    <this.Col md="12">    
                      <this.InputTextArea
                        name={`languageDescription[${index}]`}  
                        data={language.description}
                        label={<this.Translate id="input_products_products_type_language_description" />} 
                        placeholder={this.CATranslate("input_products_products_type_language_description", locale)}  
                        max={100}  
                        form={form}/>
                    </this.Col>
                  </this.Row>
                  {
                    keys.length > 1 ?
                      (<this.Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={keys.length === 0 }
                        onClick={() => this.remove(index)} />
                      )
                      :
                      null
                  }
                </div>  
              )
              
            }  
          
          </this.TabPane>

        </this.Tabs>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    description:"",
    status: 1,
    productsType:[],
    formData:[]
  }
};