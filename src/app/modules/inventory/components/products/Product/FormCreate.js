import React from "react";
import FormItem from "./FormItem";
import ProductAction from "../../../actions/products/product";
import BrandAction from "../../../actions/products/brand";
import FormCreateBrand from "../../../containers/products/Brand/FormCreate";
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
    this.handleAddUnit = this.handleAddUnit.bind(this);
    this.handleAddTax = this.handleAddTax.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(ProductAction.add(values));   
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
      tags
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
          tags={tags}/>
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}