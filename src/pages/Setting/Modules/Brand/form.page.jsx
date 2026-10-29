import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Button, Form, Input, Modal, Select, message } from "antd";
import { ArrowLeft, ChevronRight } from "lucide-react";
import BaseComponent from "@components/BaseComponent";
import BrandService from "@services/BrandService";
import BrandAction from "./redux/action";
import { CategoryImageMedia } from "../Category/form.create";
import { resolveCategoryUploadUrl, getStoredCategoryImageFilename } from "../Category/image-url";
import "../Category/form.create.css";
import "./brand.css";

function ImageField() { return null; }

export class BrandFormPage extends BaseComponent {
  state = { brand: null, loading: false, loadError: false, mediaBusy: false };

  isUpdate = () => Boolean(this.props.match && this.props.match.params.id);
  getSaveState = () => (this.isUpdate() ? this.props.brandUpdate : this.props.brandAdd) || {};

  componentDidMount() {
    this.props.dispatch(BrandAction.reset());
    if (this.isUpdate()) this.loadBrand();
  }

  componentDidUpdate(previousProps) {
    const previous = (this.isUpdate() ? previousProps.brandUpdate : previousProps.brandAdd) || {};
    const current = this.getSaveState();
    if (this.isUpdate() ? current.updated && !previous.updated : current.added && !previous.added) {
      this.props.dispatch(BrandAction.reset());
      this.props.history.push("/settings/brands");
    }
  }

  componentWillUnmount() { this.unmounted = true; }

  loadBrand = () => {
    this.setState({ loading: true, loadError: false });
    return BrandService.getById(this.props.match.params.id)
      .then(response => {
        const body = response && response.data;
        const brand = body && body.data !== undefined ? body.data : body;
        if (!brand || brand.id == null) throw new Error("Brand not found");
        if (!this.unmounted) this.setState({ brand, loading: false });
      })
      .catch(() => { if (!this.unmounted) this.setState({ loading: false, loadError: true }); });
  };

  handleSubmit = event => {
    if (event) event.preventDefault();
    const save = this.getSaveState();
    if (save.adding || save.updating || (this.isUpdate() && (!this.state.brand || this.state.loading || this.state.loadError))) return;
    if (this.state.mediaBusy) { message.info("Please wait for the brand photo to finish processing."); return; }
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (error) return;
      const data = { name: values.name.trim(), description: values.description || "", status: values.status,
        image: values.image ? this.getImageFromUpload(values, "image") : "" };
      const action = this.isUpdate() ? BrandAction.update({ ...data, id: this.state.brand.id }) : BrandAction.add(data);
      // Redux keeps API errors available for the form banner.
      return Promise.resolve(this.props.dispatch(action)).catch(() => {});
    });
  };

  handleCancel = () => {
    const leave = () => this.props.history.push("/settings/brands");
    const image = this.props.form.getFieldValue("image");
    const imageChanged = (image && image.file && image.file.name || "") !== (this.state.brand && this.state.brand.image || "");
    if (!this.props.form.isFieldsTouched() && !imageChanged) { leave(); return; }
    Modal.confirm({ title: "Discard brand changes?", content: "Your unsaved brand details will be lost.", okText: "Discard", okType: "danger", cancelText: "Keep editing", onOk: leave });
  };

  render() {
    const isUpdate = this.isUpdate();
    if (isUpdate && (this.state.loading || !this.state.brand)) return <main className="category-create-page">
      <Button onClick={() => this.props.history.push("/settings/brands")}>Back to brands</Button>
      {this.state.loadError ? <Alert type="error" showIcon message="Unable to load this brand." description={<Button onClick={this.loadBrand}>Retry</Button>} /> : <p role="status">Loading brand…</p>}
    </main>;
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const brand = this.state.brand || {};
    const save = this.getSaveState();
    const title = isUpdate ? "Edit Brand" : "Add New Brand";
    const image = getFieldValue("image");
    const imageName = image && image.file && image.file.name;
    const imageUrl = imageName && (image.file.url || resolveCategoryUploadUrl(imageName) || this.Util.getProductImage(imageName, this.Enum.IMAGE_SPACE.BRAND).url);
    const storedFilename = getStoredCategoryImageFilename(imageName);
    const body = save.error && (save.error.data || save.error.response && save.error.response.data || save.error);
    const error = body && (body.message || body.error && body.error.message) || "Unable to save the brand. Please try again.";
    return <main className="category-create-page">
      <nav className="category-create-breadcrumb" aria-label="Breadcrumb"><Link to="/settings?tab=modules">System Settings</Link><ChevronRight size={14} aria-hidden="true" /><Link to="/settings/brands">Brands</Link><ChevronRight size={14} aria-hidden="true" /><strong>{title}</strong></nav>
      <header className="category-create-heading">
        <div className="category-create-heading-main"><Button className="category-create-back" aria-label="Back to brands" onClick={this.handleCancel}><ArrowLeft size={18} aria-hidden="true" /></Button><div className="category-create-title"><h1>{title}</h1></div></div>
        <div className="category-create-header-actions"><Button onClick={this.handleCancel}>Cancel</Button><Button type="primary" icon="save" loading={save.adding || save.updating} disabled={this.state.mediaBusy} onClick={this.handleSubmit}>{isUpdate ? "Update Brand" : "Save Brand"}</Button></div>
      </header>
      {save.error && <Alert className="category-create-api-error" type="error" showIcon message={error} />}
      <Form className="brand-form" onSubmit={this.handleSubmit} autoComplete="off">
        {getFieldDecorator("image", { initialValue: { file: brand.image ? { name: brand.image, uid: "-1", status: "done" } : {} } })(<ImageField />)}
        <section className="category-create-card brand-form-details">
          <div className="brand-form-fields">
            <Form.Item label="Brand Name" required>{getFieldDecorator("name", { initialValue: brand.name, rules: [{ required: true, whitespace: true, message: "Enter a brand name." }, { max: 100, message: "Brand name must be 100 characters or fewer." }] })(<Input maxLength={100} placeholder="Enter brand name" />)}</Form.Item>
            <Form.Item label="Status">{getFieldDecorator("status", { initialValue: brand.status == null ? 1 : brand.status })(<Select><Select.Option value={1}>Active</Select.Option><Select.Option value={0}>Inactive</Select.Option></Select>)}</Form.Item>
            <Form.Item label="Description" className="brand-form-description">{getFieldDecorator("description", { initialValue: brand.description })(<Input.TextArea rows={3} placeholder="Optional brand description" />)}</Form.Item>
          </div>
        </section>
        <section className="category-create-card brand-form-media">
          <div className={`category-create-upload${imageUrl ? "" : " is-empty"}`}>
            <CategoryImageMedia entityLabel="Brand" form={form} imageUrl={imageUrl} imageName={imageName} imageDimensions={image && image.dimensions}
              endpoint={`${this.Util.getAPIURL()}/files/upload/image`}
              deleteEndpoint={storedFilename ? `${this.Util.getAPIURL()}/files/delete/image/${encodeURIComponent(storedFilename)}` : `${this.Util.getAPIURL()}/file/v1/brand/delete`}
              storedImageFilename={storedFilename} accessToken={this.Util.getAccessToken()} onBusyChange={mediaBusy => this.setState({ mediaBusy })} />
          </div>
          <p id="category-photo-fit-guidance" className="category-create-image-fit-note">Square photos work best. Previews crop to fit; the original photo is kept.</p>
        </section>
      </Form>
    </main>;
  }
}

const mapStateToProps = state => ({ brandAdd: state.reducer.brand.add, brandUpdate: state.reducer.brand.update, locale: state.locale });
export default connect(mapStateToProps)(Form.create()(BrandFormPage));
