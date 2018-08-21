import React from "react";
import { Modal }  from "../../shares/Modal/modal";

export default class FormItem extends Modal {
  constructor(props){
    super(props);
    this.remove = this.remove.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  add(existContactIndex){
    this.contactIndex = existContactIndex; 
    const {form} = this.props;
    const keys = form.getFieldValue("keys");
    // keys.map((values) =>values.length);
    const nextContactKeys = keys !== null || keys !== " " ? keys.concat(this.contactIndex) : "";  
    this.contactIndex++;
    form.setFieldsValue({
      keys: nextContactKeys
    });
  }

  remove(contactIndex){
    const {form} = this.props;
    const contactKeys = form.getFieldValue("keys");
    if (contactKeys.length === 0) {
      return;
    }
    form.setFieldsValue({
      keys: contactKeys.filter((contact, index) => index !== contactIndex)
    });
  }


  render() {
    const {form,locale,formData,productsType} = this.props;
    const {getFieldDecorator,getFieldValue} = this.props.form;

    getFieldDecorator("keys", {initialValue: formData });

    let keys = getFieldValue("keys");
    if(keys == null || keys == ""){
      keys = [];
    }

    const keysLength = keys.length;
    const productsLength = productsType.length;
    let getKey = [];
    if (keysLength === productsLength) {
      keys = formData.map((values) => [] = values.productTypeDescriptions);
      console.log("keys",keys);
    }

    // console.log("product types",JSON.stringify(formData[0].status));
    // console.log("product",JSON.stringify(formData));
    console.log("keys",JSON.stringify(keys) );

    return (
      <div>
        <this.Tabs type="card">
          <this.TabPane tab="General" key="1">
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
          <this.TabPane tab="Language" key="2">
            { console.log("get keys",keys) }
            
            { 
              keys.map((products, index) =>
               
                <div key={index}>
                  <this.Row>
                    <this.Col md="12">
                      <h6>{<this.Translate id="title_products_products_type_language" />}  {`${index + 1}`} </h6>
                      <hr/>
                    </this.Col>
                    <this.InputText 
                      name={`cont_id[${index}]`} 
                      type="hidden"
                      data={ products.id !== null ? products.id : "" }
                      form={ form } />
                    <this.Col md="12">
                      <this.InputText 
                        name={`cont_name[${index}]`} 
                        data={ products.name }
                        label={<this.Translate id="input_products_products_type_language_name" />} 
                        placeholder={this.CATranslate("input_products_products_type_language_name", locale)}  
                        form={ form } />
                    </this.Col>
                    <this.Col md="12">    
                      <this.InputTextArea
                        name={`const_address[${index}]`}  
                        data={products.address}
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
          
            <div className="btn-addcontact">
              <this.Button onClick={() => this.add(keys.length)} style={{ width: "60%" }}>
                <span className="icon-add"></span> <this.Translate id="button_add_products_products_language" />
              </this.Button>
            </div>
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