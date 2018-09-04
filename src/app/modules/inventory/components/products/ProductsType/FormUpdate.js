import React from "react";
import FormItem from "./FormItem";
import ProductsTypeAction from "../../../actions/products/productsType";
import Constant from "../../../constants/products/productsType";
import Modal from "../../../../common/components/shares/Modal";

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
        const productTypeDescriptions = [];

        values.productTypeName.forEach((productTypeName, index) => {
          productTypeDescriptions.push({
            id: values.id[index],
            languageId: values.language[index],
            name: productTypeName,
            description: values.productTypeDescription[index]
          });
        });

        delete values["keys"];
        delete values["language"];
        delete values["productTypeName"];
        delete values["productTypeDescription"];

        values["id"] = this.props.productsTypeDetail.data.id;
        values["productTypeDescriptions"] = productTypeDescriptions;
        console.log("ProductTypeDescriptions:", values);

        this.dispatch(ProductsTypeAction.update(values));

      }
    });
  }
    
  handleCancel() {
    this.dispatch(ProductsTypeAction.reset(Constant.RESET_DETAIL_PRODUCTS_TYPE));
  }

  render() {
    const {
      productsTypeUpdate,
      productsTypeDetail,
      form,
      locale,
      storeLanguage,
      dispatch
    } = this.props;

    this.submitLoading = productsTypeUpdate.updating;

    if (productsTypeDetail.showForm) {
      this.content = <FormItem
        formData={productsTypeDetail.data}
        languages={storeLanguage}
        dispatch={dispatch}
        productsType={productsTypeUpdate}
        form={form}
        locale={locale}/>;

      return super.render();
    } else {
      return <div/>;
    }
  }
}