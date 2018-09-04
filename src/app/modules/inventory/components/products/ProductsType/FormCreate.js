import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import ProductsTypeAction from "../../../actions/products/productsType";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_products_products_type_title" />;
    this.addingPropReducer = "productsTypeAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const productTypeDescriptions = [];

        values.productTypeName.forEach((productTypeName, index) => {
          productTypeDescriptions.push({
            languageId: values.language[index],
            name: productTypeName,
            description: values.productTypeDescription[index]
          });
        });

        this.Util.clearObjProperty(values, [
          "keys",
          "language",
          "productTypeName",
          "productTypeDescription"
        ]);

        values["productTypeDescriptions"] = productTypeDescriptions;

        this.dispatch(ProductsTypeAction.add(values)); 

      }
    });
  }
      
  handleCancel() {
    this.dispatch(ProductsTypeAction.reset());
  }

  render() {
    const {productsTypeAdd, form,locale, storeLanguage, dispatch} = this.props;
    
    this.submitLoading = productsTypeAdd.adding;

    if (productsTypeAdd.showForm) {
      this.content = <FormItem
        form={form}
        languages={storeLanguage}
        dispatch={dispatch}
        productsType={[]}
        locale={locale}/>;
      return super.render();
    } else {
      return <div/>;
    }
  }
}