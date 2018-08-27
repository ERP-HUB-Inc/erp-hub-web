import React from "react";
import FormItem from "./FormItem";
import { Modal } from "../../shares/Modal/modal";
import ProductsTypeAction from "../../../actions/products/productsType";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="update_products_products_type_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        delete values["keys"];
        const listLangage = {
          id: values.languageId,
          name: values.languageName,
          descripton : values.languageDescription
        };

        if(listLangage.name == null){
          listLangage.name = [];
        }

        const languge = [];

        listLangage.name.forEach((name, index) => {
          if (
            name != null
          ) {
            languge.push({
              languageId: "en",
              name: values.name,
              descripton: values.description
            });
          }
        });

        delete values["name"];
        delete values["description"];
        delete values["languageId"];
        delete values["languageName"];
        delete values["languageDescription"];

        values["productTypeDescriptions"] = languge;

        console.log("language values",values);
        this.dispatch(ProductsTypeAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(ProductsTypeAction.reset());
  }

  render() {
    const {productsTypeUpdate, form, locale,storeLanguage,dispatch} = this.props;

    this.submitLoading = productsTypeUpdate.updating;

    if (productsTypeUpdate.showForm) {
      this.content = (
        <div>
          {productsTypeUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={storeLanguage} dispatch={ dispatch } productsType={productsTypeUpdate} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}