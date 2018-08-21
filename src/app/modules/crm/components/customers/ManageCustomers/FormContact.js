import React from "react";
import Modal from "../../shares/Modal";

export default class FormContact extends Modal {
  render() {
    const {
      contact,
      index,
      form,
      locale,
    } = this.props;

    let className = "wrap-contact";
    if (contact.status === this.Enum.ARCHIVE) {
      className = className + " hidden";
    }

    return (
      <div className={className}>
        <this.Row key={index}>
          <this.Col md="12">
            <h6>{<this.Translate id="input_management_contact_number" />} </h6>
            <hr className="line-contact"/>
          </this.Col>
          <this.InputText 
            name={`contactId[${index}]`} 
            type="hidden"
            data={contact.id != null ? contact.id : "" }
            form={form}/>
          <this.InputNumber 
            name={`status[${index}]`}
            className="hidden"
            data={contact.status}
            form={form}/>
          <this.Col md="6">
            <this.InputText 
              name={`contactName[${index}]`} 
              data={contact.name}
              label={<this.Translate id="input_management_contact_name" />} 
              placeholder={this.CATranslate("input_management_contact_name", locale)}
              required={true}
              form={form}/>
          </this.Col>
    
          <this.Col md="6">
            <this.InputText
              name={`contactNumber[${index}]`}     
              data={contact.phoneNumber}
              label={<this.Translate id="input_management_contact_phone_number" />} 
              placeholder={this.CATranslate("input_management_contact_phone_number", locale)}  
              max={100}
              required={true}
              form={form}/> 
          </this.Col> 
    
          <this.Col md="12">    
            <this.InputTextArea
              name={`contactAddress[${index}]`}
              data={contact.address}
              label={<this.Translate id="input_management_contact_address" />} 
              placeholder={this.CATranslate("input_management_contact_address", locale)}  
              max={100}  
              form={form}/>
          </this.Col>
        </this.Row>
        <div className="btn-removecontact">
          <this.Button onClick={() => this.props.remove(index)} style={{ width: "60%" }}>
            <span className="icon-delete"></span> <span>Remove</span>
          </this.Button>
        </div>
      </div>
    );
  };
}