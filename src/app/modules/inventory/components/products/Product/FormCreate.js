import React from "react";
import FormItem from "./FormItem";
import ProductAction from "../../../actions/products/product";
import BrandAction from "../../../actions/products/brand";
import FormCreateBrand from "../../../containers/products/Brand/FormCreate";
import VariantAttributeAction from "../../../actions/products/variantAttribute";
import FormCreateVariantAttribute from "../../../containers/products/VariantAttribute/FormCreate";
import UnitAction from "../../../actions/products/productsUnit";
import FormCreateUnit from "../../../containers/products/ProductsUnit/FormCreate";
import TaxAction from "../../../../pos/action/settings/tax";
import FormCreateTax from "../../../../pos/containers/settings/Tax/FormCreate";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_products_title" />;
    this.width = "90%";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddBrand = this.handleAddBrand.bind(this);
    this.handleAddVariantAttribute = this.handleAddVariantAttribute.bind(this);
    this.handleAddUnit = this.handleAddUnit.bind(this);
    this.handleAddTax = this.handleAddTax.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Product Submit Value:", values);
        // this.dispatch(ProductAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(ProductAction.reset());
  }

  handleAddBrand() {
    this.dispatch(BrandAction.showForm());
    this.modal1 = <FormCreateBrand />;
  }

  handleAddVariantAttribute() {
    this.dispatch(VariantAttributeAction.showForm());
    this.modal1 = <FormCreateVariantAttribute />;
  }

  handleAddUnit() {
    this.dispatch(UnitAction.showForm());
    this.modal1 = <FormCreateUnit />;
  }

  handleAddTax() {
    this.dispatch(TaxAction.showForm());
    this.modal1 = <FormCreateTax />;
  }

  render() {
    const {
      form,
      locale,
      dispatch,
      productAdd,
      units,
      unitAdd,
      taxs,
      taxAdd,
      brands,
      brandAdd,
      tags,
      variantAttributes,
      variantAttributeAdd
    } = this.props;
    
    this.submitLoading = productAdd.adding;

    if (productAdd.showForm) {
      this.content = (
        <FormItem
          form={form}
          locale={locale}
          dispatch={dispatch}
          units={units}
          unitAdd={unitAdd}
          handleAddUnit={this.handleAddUnit}
          taxs={taxs}
          taxAdd={taxAdd}
          handleAddTax={this.handleAddTax}
          brands={brands}
          brandAdd={brandAdd}
          handleAddBrand={this.handleAddBrand}
          tags={tags}
          variantAttributes={variantAttributes}
          variantAttributeAdd={variantAttributeAdd}
          handleAddVariantAttribute={this.handleAddVariantAttribute}/>
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}

