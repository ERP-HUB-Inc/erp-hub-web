import React from "react";
import { connect } from "react-redux";
import { Form, Input, Select, Button, Alert, Modal, Tag, message, Progress, Switch, Upload } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, BriefcaseMedical, Check, CheckCircle2, ChevronRight, CloudUpload, CupSoda, IceCreamCone, Image as ImageIcon, ListOrdered, Milk, Monitor, MousePointer2, Package, RefreshCw, Settings, Shapes, ShoppingBag, Tag as TagIcon, Trash2, Zap } from "lucide-react";
import BaseComponent from "@components/BaseComponent";
import CategoryService from "@services/CategoryService";
import CategoryAction from "./redux/action";
import Constant from "./redux/constant";
import { buildCategoryCreatePayload } from "./create-payload";
import { resolveCategoryUploadUrl, readCategoryImageUpload, getStoredCategoryImageFilename } from "./image-url";
import "./form.create.css";

const { TextArea } = Input;
const CATEGORY_POS_COLORS = [
  { name: "Green", hex: "#059669" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Amber", hex: "#F59E0B" },
  { name: "Orange", hex: "#F97316" },
  { name: "Purple", hex: "#8B5CF6" },
  { name: "Pink", hex: "#F43F5E" },
  { name: "Teal", hex: "#14B8A6" },
  { name: "Slate", hex: "#64748B" }
];
// Local preview choices; backend icon identifiers have not been confirmed.
const CATEGORY_POS_ICONS = [
  { id: "frozen", label: "Frozen", Icon: IceCreamCone },
  { id: "bag", label: "Bag", Icon: ShoppingBag },
  { id: "beverage", label: "Beverage", Icon: CupSoda },
  { id: "dairy", label: "Dairy", Icon: Milk },
  { id: "packs", label: "Packs", Icon: Package },
  { id: "electric", label: "Electric", Icon: Zap },
  { id: "health", label: "Health", Icon: BriefcaseMedical },
  { id: "promo", label: "Promo", Icon: TagIcon }
];

export class CategoryCreatePage extends BaseComponent {
  state = {
    category: null,
    categoryLoading: false,
    categoryError: false,
    parentCategories: [],
    parentCategoriesLoading: true,
    parentCategoriesError: false,
    saveMode: "save",
    selectedPosColor: CATEGORY_POS_COLORS[0].hex,
    customPosColor: CATEGORY_POS_COLORS[0].hex,
    customPosColorError: "",
    selectedPosIcon: null,
    displayPriorityDraft: "",
    displayMode: "icon",
    mediaBusy: false
  };

  componentDidMount() {
    this.props.dispatch(CategoryAction.reset(Constant.RESET_CATEGORY));
    this.loadParentCategories();
    if (this.isUpdate()) this.loadCategory();
    window.addEventListener("keydown", this.handleKeyboardShortcut);
  }

  componentDidUpdate(previousProps) {
    const addState = this.getSaveState();
    const previousSaveState = this.isUpdate() ? previousProps.productsTypeUpdate || {} : previousProps.productsTypeAdd || {};
    const apiError = getCategoryApiError(addState.error);
    if (addState.error !== previousSaveState.error && apiError.code === "CATEGORY_NAME_EXISTS") {
      this.props.form.setFields({
        name: {
          value: this.props.form.getFieldValue("name"),
          errors: [new Error(apiError.message || "This category name is already in use.")]
        }
      });
    }
    if (this.isUpdate() ? addState.updated && !previousSaveState.updated : addState.added && !previousSaveState.added) {
      const addAnother = !this.isUpdate() && this.state.saveMode === "addAnother";
      this.props.dispatch(CategoryAction.reset(Constant.RESET_CATEGORY));
      if (addAnother) {
        this.props.form.resetFields();
        this.setState({ saveMode: "save" });
        return;
      }
      this.props.history.push("/settings/categories");
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    window.removeEventListener("keydown", this.handleKeyboardShortcut);
  }

  isUpdate = () => Boolean(this.props.match && this.props.match.params && this.props.match.params.id);

  getSaveState = () => (this.isUpdate() ? this.props.productsTypeUpdate : this.props.productsTypeAdd) || {};

  loadCategory = () => {
    this.setState({ categoryLoading: true, categoryError: false });
    return CategoryService.getById(this.props.match.params.id)
      .then(response => {
        if (this.isUnmounted) return;
        const body = response && response.data;
        const category = body && body.data !== undefined ? body.data : body;
        if (!category || category.id == null) throw new Error("Category not found");
        const color = category.posColor && category.posColor.hex;
        const selectedPosColor = /^#[0-9a-f]{6}$/i.test(color) ? color.toUpperCase() : CATEGORY_POS_COLORS[0].hex;
        this.setState({ category, categoryLoading: false, selectedPosColor, customPosColor: selectedPosColor });
      })
      .catch(() => {
        if (!this.isUnmounted) this.setState({ categoryLoading: false, categoryError: true });
      });
  };

  loadParentCategories = () => {
    CategoryService.get({ limit: 50, offset: 0 })
      .then(response => {
        const body = response && response.data;
        const parents = body && Array.isArray(body.data) ? body.data : [];
        if (this.isUnmounted) return;
        this.setState({ parentCategories: parents, parentCategoriesLoading: false, parentCategoriesError: false });
      })
      .catch(() => { if (!this.isUnmounted) this.setState({ parentCategoriesLoading: false, parentCategoriesError: true }); });
  };

  handleKeyboardShortcut = event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      this.submitCategory("save");
    }
  };

  handleSelectPosColor = color => {
    this.setState({ selectedPosColor: color, customPosColor: color, customPosColorError: "" });
  };

  handleCustomPosColorChange = event => {
    const color = event.target.value.trim().toUpperCase();
    const isValid = /^#[0-9A-F]{6}$/.test(color);
    this.setState({
      customPosColor: color,
      selectedPosColor: isValid ? color : this.state.selectedPosColor,
      customPosColorError: isValid ? "" : "Enter a 6-digit hex color, such as #059669."
    });
  };

  handleNativePosColorChange = event => {
    this.handleSelectPosColor(event.target.value.toUpperCase());
  };

  handleDisplayModeChange = displayMode => {
    this.setState({ displayMode });
  };

  handleSelectPosIcon = selectedPosIcon => {
    if (CATEGORY_POS_ICONS.some(icon => icon.id === selectedPosIcon)) this.setState({ selectedPosIcon });
  };

  handlePosIconKeyDown = (event, index) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let nextIndex;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = CATEGORY_POS_ICONS.length - 1;
    else if (Object.prototype.hasOwnProperty.call(keys, event.key)) nextIndex = (index + keys[event.key] + CATEGORY_POS_ICONS.length) % CATEGORY_POS_ICONS.length;
    else return;
    event.preventDefault();
    this.handleSelectPosIcon(CATEGORY_POS_ICONS[nextIndex].id);
    event.currentTarget.parentElement.querySelectorAll('[role="radio"]')[nextIndex].focus();
  };

  handleDisplayPriorityChange = event => {
    this.setState({ displayPriorityDraft: event.target.value });
  };

  renderDisplayModeControl = (label, iconLabel, photoLabel, className = "") => (
    <div className={`category-create-mode-control ${className}`} role="group" aria-label={label}>
      <button type="button" className={this.state.displayMode === "icon" ? "is-selected" : ""} aria-pressed={this.state.displayMode === "icon"} onClick={() => this.handleDisplayModeChange("icon")}>{iconLabel}</button>
      <button type="button" className={this.state.displayMode === "photo" ? "is-selected" : ""} aria-pressed={this.state.displayMode === "photo"} onClick={() => this.handleDisplayModeChange("photo")}>{photoLabel}</button>
    </div>
  );

  submitCategory = mode => {
    const saveState = this.getSaveState();
    if (saveState.adding || saveState.updating || (this.isUpdate() && (!this.state.category || this.state.categoryLoading || this.state.categoryError))) return;
    if (this.state.mediaBusy) {
      message.info("Please wait for the category photo to finish processing.");
      return;
    }
    if (this.state.customPosColorError) {
      message.error(this.state.customPosColorError);
      return;
    }
    this.setState({ saveMode: mode });
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (error) {
        this.setState({ saveMode: "save" });
        return;
      }
      const posColor = CATEGORY_POS_COLORS.find(color => color.hex === this.state.selectedPosColor)
        || { name: "Custom color", hex: this.state.selectedPosColor };
      const image = values.image ? this.getImageFromUpload(values, "image") : values.image;
      const payload = buildCategoryCreatePayload(values, posColor, image);
      return Promise.resolve(this.props.dispatch(this.isUpdate() ? CategoryAction.update({ ...payload, id: this.state.category.id }) : CategoryAction.add(payload))).catch(() => {
        // The rejected Redux action keeps the API error available to the banner and name field.
        this.setState({ saveMode: "save" });
      });
    });
  };

  handleSubmit = event => {
    if (event) event.preventDefault();
    this.submitCategory("save");
  };

  handleMediaBusyChange = mediaBusy => this.setState({ mediaBusy });

  handleNameChange = () => {
    if (getCategoryApiError(this.getSaveState().error).code === "CATEGORY_NAME_EXISTS") {
      this.props.dispatch(CategoryAction.reset(Constant.RESET_CATEGORY));
    }
  };

  handleCancel = () => {
    const leave = () => this.props.history.push("/settings/categories");
    if (!this.props.form.isFieldsTouched()) {
      leave();
      return;
    }
    Modal.confirm({
      title: "Discard this category?",
      content: "Your unsaved category details will be lost.",
      okText: "Discard",
      okType: "danger",
      cancelText: "Keep editing",
      onOk: leave
    });
  };

  render() {
    const { form } = this.props;
    const productsTypeAdd = this.getSaveState();
    const isUpdate = this.isUpdate();
    const category = this.state.category || {};
    const title = isUpdate ? "Edit Category" : "Add New Category";
    if (isUpdate && (this.state.categoryLoading || !this.state.category)) {
      return <main className="category-create-page">
        <Button onClick={this.handleCancel}>Back to categories</Button>
        {this.state.categoryError
          ? <Alert type="error" showIcon message="Unable to load this category." description={<Button onClick={this.loadCategory}>Retry</Button>} />
          : <p role="status">Loading category…</p>}
      </main>;
    }
    const { getFieldDecorator, getFieldValue } = form;
    const isSaving = isUpdate ? productsTypeAdd.updating : productsTypeAdd.adding;
    const name = getFieldValue("name") || "New category";
    const nameKhmer = getFieldValue("namekm") || "";
    const featureValue = getFieldValue("isFeature");
    const uploadImage = getFieldValue("image");
    const uploadedName = uploadImage && uploadImage.file && uploadImage.file.name;
    const imageUrl = uploadedName
      ? uploadImage.file.url || resolveCategoryUploadUrl(uploadedName) || this.Util.getProductImage(uploadedName, this.Enum.IMAGE_SPACE.CATEGORY).url
      : null;
    const storedImageFilename = getStoredCategoryImageFilename(uploadedName);
    const imageDimensions = uploadImage && uploadImage.dimensions;
    const parents = this.state.parentCategories.filter(parent => !isUpdate || String(parent.id) !== String(category.id));
    const selectedIcon = CATEGORY_POS_ICONS.find(icon => icon.id === this.state.selectedPosIcon);
    const PreviewCategoryIcon = selectedIcon ? selectedIcon.Icon : Shapes;
    const priority = parsePreviewPriority(this.state.displayPriorityDraft);
    const priorityError = this.state.displayPriorityDraft !== "" && priority === null;
    const priorityLabel = priority === null ? "#—" : `#${priority}`;
    const priorityDescription = priority === null ? "Display priority is not configured" : `Preview display priority: ${priority}`;

    return <main className="category-create-page">
      <nav className="category-create-breadcrumb" aria-label="Breadcrumb">
        <Link to="/settings?tab=modules"><Settings size={14} aria-hidden="true" />System Settings</Link><ChevronRight size={14} aria-hidden="true" />
        <Link to="/settings/categories">Categories</Link><ChevronRight size={14} aria-hidden="true" /><strong>{title}</strong>
      </nav>

      <header className="category-create-heading">
        <div className="category-create-heading-main">
          <Button className="category-create-back" aria-label="Back to categories" onClick={this.handleCancel}><ArrowLeft size={18} aria-hidden="true" /></Button>
          <div><div className="category-create-title"><h1>{title}</h1><Tag>{isUpdate ? "Editing" : "Draft · Unsaved"}</Tag></div><p>Configure taxonomy and POS register appearance.</p></div>
        </div>
        <div className="category-create-header-actions">
          <Button onClick={this.handleCancel}>Cancel</Button>
          <Button type="primary" icon="save" loading={isSaving} disabled={this.state.mediaBusy} onClick={() => this.submitCategory("save")}>{isUpdate ? "Update Category" : "Save Category"}</Button>
          <kbd aria-label="Save shortcut">⌘/Ctrl + S</kbd>
        </div>
      </header>

      {productsTypeAdd.error && <Alert className="category-create-api-error" type="error" showIcon message={getErrorMessage(productsTypeAdd.error)} />}

      <Form className="category-create-form" onSubmit={this.handleSubmit} autoComplete="off">
        {getFieldDecorator("image", { initialValue: { file: category.image ? { uid: "-1", name: category.image, status: "done" } : {} } })(<CategoryImageFormField />)}
        <div className="category-create-layout">
          <div className="category-create-main-column">
            <section className="category-create-card">
              <CardHeading icon={<Shapes size={19} />} title="Category Details" description="Identifiers, naming, and catalog availability" />
              <div className="category-create-fields">
                <Form.Item label="Category Name (English)" required>
                  {getFieldDecorator("name", { initialValue: category.name, rules: [{ required: true, message: "Enter a category name." }, { max: 100, message: "Category name must be 100 characters or fewer." }] })(<Input maxLength={100} placeholder="Enter category name" onChange={this.handleNameChange} />)}
                </Form.Item>
                <Form.Item label={<span className="category-create-field-label">Category Name (Khmer) <small>KM (ខ្មែរ)</small></span>}>
                  {getFieldDecorator("namekm", { initialValue: category.namekm, rules: [{ max: 100, message: "Khmer category name must be 100 characters or fewer." }] })(<Input maxLength={100} lang="km" placeholder="បញ្ចូលឈ្មោះប្រភេទ" />)}
                </Form.Item>
                <Form.Item label="Category Name (Burmese)">
                  {getFieldDecorator("namebm", { initialValue: category.namebm })(<Input lang="my" placeholder="Optional Burmese name" />)}
                </Form.Item>
                <Form.Item label="Category Code">
                  {getFieldDecorator("code", { initialValue: category.code })(<Input placeholder="Optional category code" />)}
                </Form.Item>
                <Form.Item label="Parent Category">
                  {getFieldDecorator("parentId", { initialValue: category.parentId })(<Select allowClear loading={this.state.parentCategoriesLoading} placeholder="Choose a parent category" showSearch optionFilterProp="children">{parents.map(parent => <Select.Option key={parent.id} value={parent.id}>{parent.name}</Select.Option>)}</Select>)}
                  {this.state.parentCategoriesError && <Button type="link" className="category-create-inline-retry" onClick={this.loadParentCategories}>Could not load categories. Retry</Button>}
                </Form.Item>
                <Form.Item label="Category Label">
                  {getFieldDecorator("label", { initialValue: category.label })(<Input placeholder="Optional label" />)}
                </Form.Item>
                <Form.Item label="Feature Category">
                  {getFieldDecorator("isFeature", { initialValue: category.isFeature == null ? false : category.isFeature, valuePropName: "checked" })(<Switch aria-label="Feature Category" />)}
                </Form.Item>
                <Form.Item label="Status">
                  {getFieldDecorator("status", { initialValue: category.status == null ? 1 : category.status })(<Select><Select.Option value={1}>Active</Select.Option><Select.Option value={0}>Inactive</Select.Option></Select>)}
                </Form.Item>
                <Form.Item label="Default Category">
                  {getFieldDecorator("isDefault", { initialValue: category.isDefault == null ? false : category.isDefault, valuePropName: "checked" })(<Switch aria-label="Default Category" />)}
                </Form.Item>
                <Form.Item label="Default Gross Margin (%)">
                  {getFieldDecorator("defaultMarginValue", { initialValue: category.defaultMarginRule && category.defaultMarginRule.value, rules: [{ validator: (_, value, callback) => {
                    const valid = value === undefined || value === null || value === "" || (String(value).trim() !== "" && Number.isFinite(Number(value)));
                    callback(valid ? undefined : "Enter a valid margin percentage.");
                  } }] })(<Input inputMode="decimal" placeholder="Optional gross margin percentage" />)}
                </Form.Item>
                <Form.Item className="category-create-description" label="Operational Notes & Description">
                  {getFieldDecorator("description", { initialValue: category.description })(<TextArea rows={3} placeholder="Add storage requirements, temperature limits, or cashier handling notes…" />)}
                </Form.Item>
              </div>
            </section>

            <section className="category-create-card category-create-appearance-card">
              <header className="category-create-appearance-header">
                <div className="category-create-appearance-heading">
                  <span className="category-create-card-icon"><Monitor size={20} aria-hidden="true" /></span>
                  <div><h2>POS Register &amp; Touch Tile Appearance</h2><p>Color theme, icon stamp, and cashier quick access placement</p></div>
                </div>
                <label className="category-create-quick-ribbon">
                  {getFieldDecorator("posQuickAccessEnabled", { initialValue: category.posQuickAccessEnabled == null ? false : category.posQuickAccessEnabled, valuePropName: "checked" })(<Switch aria-label="Pin to Quick Ribbon" />)}
                  <span>Pin to Quick Ribbon</span>
                </label>
              </header>
              <div className="category-create-color-section">
                <div className="category-create-color-label">
                  <strong>Tile Accent Color</strong>
                  <div className="category-create-custom-color">
                    <label className="category-create-native-color"><input type="color" value={this.state.selectedPosColor} aria-label="Choose custom POS tile color" onChange={this.handleNativePosColorChange} /></label>
                    <Input aria-label="Custom POS color hex" value={this.state.customPosColor} onChange={this.handleCustomPosColorChange} aria-invalid={Boolean(this.state.customPosColorError)} aria-describedby={this.state.customPosColorError ? "category-pos-color-error" : undefined} />
                  </div>
                </div>
                <div className="category-create-color-palette" role="group" aria-label="POS tile accent color">
                  {CATEGORY_POS_COLORS.map(color => <button key={color.hex} type="button" className={`category-create-color-swatch${this.state.selectedPosColor === color.hex ? " is-selected" : ""}`} style={{ backgroundColor: color.hex, "--category-swatch-color": color.hex }} aria-label={`Select ${color.name} ${color.hex}`} aria-pressed={this.state.selectedPosColor === color.hex} onClick={() => this.handleSelectPosColor(color.hex)}>{this.state.selectedPosColor === color.hex && <Check size={20} strokeWidth={3} aria-hidden="true" />}</button>)}
                </div>
                {this.state.customPosColorError && <div id="category-pos-color-error" className="category-create-color-error" role="alert">{this.state.customPosColorError}</div>}
              </div>
              <div className="category-create-icon-section">
                <strong id="category-pos-icon-label">Tile Icon</strong>
                <div className="category-create-icon-grid" role="radiogroup" aria-labelledby="category-pos-icon-label">
                  {CATEGORY_POS_ICONS.map(({ id, label, Icon }, index) => <button key={id} type="button" role="radio" aria-checked={this.state.selectedPosIcon === id} tabIndex={this.state.selectedPosIcon === id || (!this.state.selectedPosIcon && index === 0) ? 0 : -1} className={`category-create-icon-choice${this.state.selectedPosIcon === id ? " is-selected" : ""}`} onClick={() => this.handleSelectPosIcon(id)} onKeyDown={event => this.handlePosIconKeyDown(event, index)}><Icon size={28} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span></button>)}
                </div>
              </div>
              <div className="category-create-appearance-fields">
                <div className="category-create-appearance-field">
                  <label htmlFor="category-display-priority">Display Priority Sequence</label>
                  <Input id="category-display-priority" prefix={<ListOrdered size={16} aria-hidden="true" />} inputMode="numeric" value={this.state.displayPriorityDraft} onChange={this.handleDisplayPriorityChange} placeholder="Enter preview priority" aria-invalid={priorityError} aria-describedby={priorityError ? "category-display-priority-error" : "category-appearance-draft-note"} />
                  {priorityError && <span id="category-display-priority-error" className="category-create-color-error" role="alert">Enter a valid whole number.</span>}
                </div>
              </div>
              <p id="category-appearance-draft-note" className="category-create-appearance-note">Icon, priority, and display mode update the preview only.</p>
            </section>

            <section className="category-create-card category-create-media-card">
              <header className="category-create-media-header">
                <div className="category-create-media-heading">
                  <span className="category-create-media-icon"><ImageIcon size={30} strokeWidth={1.8} aria-hidden="true" /></span>
                  <div><h2>Category Image &amp; Media</h2><p>Display photography for customer-facing POS, web catalog, and digital menus</p></div>
                </div>
                {this.renderDisplayModeControl("Category display mode", "Icon + Color", "Category Photo", "category-create-media-mode")}
              </header>
              <div className={`category-create-upload${imageUrl && uploadedName ? "" : " is-empty"}`}>
                <CategoryImageMedia
                  form={form}
                  imageUrl={imageUrl}
                  imageName={uploadedName}
                  imageDimensions={imageDimensions}
                  endpoint={`${this.Util.getAPIURL()}/files/upload/image`}
                  deleteEndpoint={storedImageFilename
                    ? `${this.Util.getAPIURL()}/files/delete/image/${encodeURIComponent(storedImageFilename)}`
                    : `${this.Util.getAPIURL()}/file/v1/category/delete`}
                  storedImageFilename={storedImageFilename}
                  accessToken={this.Util.getAccessToken()}
                  onBusyChange={this.handleMediaBusyChange}
                />
              </div>
              <p id="category-photo-fit-guidance" className="category-create-image-fit-note">Square photos work best. Previews crop to fit; the original photo is kept.</p>
            </section>

          </div>

          <aside className="category-create-side-column">
            <section className="category-create-card category-create-preview-card">
              <header className="category-create-preview-header">
                <div className="category-create-preview-heading"><MousePointer2 size={30} aria-hidden="true" /><h2>POS Tile Live Preview</h2></div>
                <span className="category-create-preview-dimensions" aria-label="Logical POS tile size: 120 by 96 pixels">120×96 px</span>
              </header>
              <div className="category-create-preview-panel">
                <div className="category-create-preview-mode"><strong>Register Display Mode</strong>{this.renderDisplayModeControl("Register display mode", "Icon Mode", "Photo Mode")}</div>
                <div className="category-create-preview-stage">
                  <div className={`category-create-preview-tile is-${this.state.displayMode}`} style={{ "--category-preview-accent": this.state.selectedPosColor }} role="img" aria-label={`${name}${nameKhmer ? `, ${nameKhmer}` : ""} category tile preview; ${priorityDescription}`}>
                    {this.state.displayMode === "photo" && imageUrl && <img src={imageUrl} alt="" aria-hidden="true" />}
                    {this.state.displayMode === "icon" ? <>
                      <div className="category-create-preview-icon"><PreviewCategoryIcon size={40} strokeWidth={1.8} aria-hidden="true" /></div>
                      <span className="category-create-preview-priority is-icon" title={priorityDescription}>{priorityLabel}</span>
                    </> : <>
                      <span className="category-create-preview-priority is-photo" title={priorityDescription}>{priorityLabel}</span>
                      <span className="category-create-preview-photo-badge">Photo</span>
                      {!imageUrl && <div className="category-create-photo-placeholder"><ImageIcon size={20} aria-hidden="true" /><span>Upload a category photo to preview Photo Mode</span></div>}
                    </>}
                    <div className="category-create-preview-text" title={[name, nameKhmer].filter(Boolean).join(" · ")}>
                      <strong title={name}>{name}</strong>{nameKhmer && <span lang="km" title={nameKhmer}>{nameKhmer}</span>}
                    </div>
                  </div>
                </div>
                <div className="category-create-preview-caption"><span aria-hidden="true" />{this.state.displayMode === "photo" ? "Showing: Photo style" : "Showing: Icon & Accent Color style"}</div>
              </div>
            </section>

            <section className="category-create-card">
              <CardHeading icon={<CheckCircle2 size={19} />} title="Settings Summary" description="Current form values" />
              <SummaryRow label="Parent Category" value={parents.find(parent => parent.id === getFieldValue("parentId"))?.name || "Top-level category"} />
              <SummaryRow label="Feature Category" value={featureValue === true ? "Featured" : featureValue === false ? "Not featured" : "Not selected"} />
              <SummaryRow label="POS Quick Ribbon" value={getFieldValue("posQuickAccessEnabled") ? "Enabled" : "Disabled"} />
              <SummaryRow label="Margin Rule" value={getFieldValue("defaultMarginValue") !== undefined && getFieldValue("defaultMarginValue") !== "" ? `Gross margin: ${getFieldValue("defaultMarginValue")}%` : "Not configured"} />
            </section>
          </aside>
        </div>
      </Form>
    </main>;
  }
}

export class CategoryImageMedia extends React.Component {
  state = { uploading: false, uploadProgress: 0, deleting: false, imageDimensions: null };
  requestVersion = 0;
  pickerRef = React.createRef();

  notifyBusy = busy => {
    if (this.props.onBusyChange) this.props.onBusyChange(busy);
  };

  componentWillUnmount() {
    this.requestVersion += 1;
  }

  handlePickerChange = info => {
    const selectedFile = info.file && (info.file.originFileObj || info.file);
    this.resetFilePicker();
    if (selectedFile) this.uploadFile(selectedFile);
  };

  resetFilePicker = () => {
    window.setTimeout(() => {
      const input = this.pickerRef.current && this.pickerRef.current.querySelector("input[type='file']");
      if (input) input.value = "";
    }, 0);
  };

  openFilePicker = () => {
    const input = this.pickerRef.current && this.pickerRef.current.querySelector("input[type='file']");
    if (input && !this.state.deleting) input.click();
  };

  uploadFile = async file => {
    if (this.state.deleting) return;
    const requestVersion = ++this.requestVersion;
    this.setState({ uploading: false, uploadProgress: 0 });
    this.notifyBusy(false);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const allowedExtensions = /\.(jpe?g|png|gif)$/i;
    if (file.type ? !allowedTypes.includes(file.type) : !allowedExtensions.test(file.name || "")) {
      message.error("Choose a JPG, PNG, or GIF image.");
      return;
    }

    this.setState({ uploading: true, uploadProgress: 0 });
    this.notifyBusy(true);
    let dimensions;
    try {
      dimensions = await readImageDimensions(file);
    } catch (error) {
      if (requestVersion === this.requestVersion) {
        this.setState({ uploading: false });
        this.notifyBusy(false);
        message.error("This image could not be opened. Choose another image.");
      }
      return;
    }
    if (requestVersion !== this.requestVersion) return;

    const data = new FormData();
    data.append("file", file);
    try {
      const response = await axios.post(this.props.endpoint, data, {
        headers: { Authorization: `Bearer ${this.props.accessToken}` },
        onUploadProgress: event => {
          if (requestVersion !== this.requestVersion || !event.total) return;
          this.setState({ uploadProgress: Math.round((event.loaded / event.total) * 100) });
        }
      });
      if (requestVersion !== this.requestVersion) return;
      const uploadedImage = readCategoryImageUpload(response.data);
      const uploadedFile = { uid: file.uid || `${Date.now()}`, ...uploadedImage, type: file.type, size: file.size, status: "done" };
      this.props.form.setFieldsValue({ image: { file: uploadedFile, fileList: [uploadedFile], dimensions } });
      this.setState({ uploading: false, uploadProgress: 100, imageDimensions: null });
      this.notifyBusy(false);
    } catch (error) {
      if (requestVersion === this.requestVersion) {
        this.setState({ uploading: false, uploadProgress: 0 });
        this.notifyBusy(false);
        message.error(getImageUploadError(error));
      }
    }
  };

  handleRemoveImage = async () => {
    const { imageName, deleteEndpoint, accessToken, form } = this.props;
    if (!imageName || this.state.uploading || this.state.deleting) return;
    const requestVersion = ++this.requestVersion;
    this.setState({ deleting: true });
    this.notifyBusy(true);
    try {
      await axios({
        method: "DELETE",
        url: deleteEndpoint,
        ...(this.props.storedImageFilename ? {} : { data: { fileName: imageName } }),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }
      });
      if (requestVersion !== this.requestVersion) return;
      form.setFieldsValue({ image: null });
      this.setState({ deleting: false, imageDimensions: null, uploadProgress: 0 });
      this.notifyBusy(false);
    } catch (error) {
      if (requestVersion !== this.requestVersion) return;
      this.setState({ deleting: false });
      this.notifyBusy(false);
      message.error(getImageUploadError(error, "Unable to remove this image. Please try again."));
    }
  };

  handleImageLoad = (event, imageName) => {
    if (imageName !== this.props.imageName) return;
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (naturalWidth && naturalHeight) this.setState({ imageDimensions: { imageName, width: naturalWidth, height: naturalHeight } });
  };

  render() {
    const { imageUrl, imageName, imageDimensions, entityLabel = "Category" } = this.props;
    const photoLabel = `${entityLabel.toLowerCase()} photo`;
    const measuredDimensions = this.state.imageDimensions;
    const dimensions = measuredDimensions && measuredDimensions.imageName === imageName ? measuredDimensions : imageDimensions;
    const dimensionLabel = dimensions ? `${dimensions.width}×${dimensions.height}` : "";
    const { uploading, uploadProgress, deleting } = this.state;

    return <>
      <div className="category-create-upload-column" ref={this.pickerRef}>
        <strong className="category-create-upload-title">{entityLabel} Photo Upload</strong>
        <Upload.Dragger
          className="category-create-dropzone"
          accept="image/jpeg,image/png,image/gif,.jpg,.jpeg,.png,.gif"
          fileList={[]}
          showUploadList={false}
          beforeUpload={() => false}
          onChange={this.handlePickerChange}
          disabled={deleting}
          aria-label={`Browse for or drop a ${photoLabel}`}
        >
          <div className="category-create-dropzone-content">
            <span className="category-create-upload-cloud"><CloudUpload size={38} strokeWidth={1.7} aria-hidden="true" /></span>
            <span className="category-create-upload-instruction"><strong>Click to browse</strong> or drag &amp; drop {photoLabel}</span>
            <span className="category-create-upload-guidance">JPG, PNG, or GIF (recommended 400×400px)</span>
            <span className="category-create-upload-chips">
              <span><CheckCircle2 size={17} aria-hidden="true" />1:1 Aspect ratio</span>
              <span>Transparent or solid BG</span>
            </span>
          </div>
          {uploading && <div className="category-create-upload-progress" aria-live="polite"><span>Uploading photo…</span><Progress percent={uploadProgress} showInfo={false} size="small" /></div>}
        </Upload.Dragger>
      </div>
      {imageUrl && imageName && <div className="category-create-thumbnail">
        <strong className="category-create-upload-title">Uploaded Thumbnail</strong>
        <div className="category-create-thumbnail-panel">
          <div className="category-create-thumbnail-image-wrap">
            <img src={imageUrl} alt={`Selected ${photoLabel}`} aria-describedby="category-photo-fit-guidance" onLoad={event => this.handleImageLoad(event, imageName)} />
            {dimensionLabel && <span className="category-create-thumbnail-dimensions">{dimensionLabel}</span>}
          </div>
          <div className="category-create-thumbnail-actions">
            <Button className="category-create-replace-button" onClick={this.openFilePicker} disabled={deleting}>
              <RefreshCw size={16} aria-hidden="true" />Replace
            </Button>
            <Button className="category-create-remove-button" aria-label={`Delete selected ${photoLabel}`} title={`Delete selected ${photoLabel}`} onClick={this.handleRemoveImage} disabled={!imageName || uploading || deleting} loading={deleting}>
              {!deleting && <Trash2 size={17} aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>}
    </>;
  }
}

function CategoryImageFormField() {
  return null;
}

function parsePreviewPriority(value) {
  if (!/^-?\d+$/.test(value.trim())) return null;
  const priority = Number(value);
  return Number.isSafeInteger(priority) ? priority : null;
}

function readImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (image.naturalWidth && image.naturalHeight) resolve({ width: image.naturalWidth, height: image.naturalHeight });
      else reject(new Error("Invalid image dimensions"));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image decode failed"));
    };
    image.src = objectUrl;
  });
}

function getImageUploadError(error, fallback = "Unable to upload the image. Please try again.") {
  const responseData = error && error.response && error.response.data;
  return responseData && (responseData.message || responseData.error && responseData.error.message) || error && error.message || fallback;
}

function CardHeading({ icon, title, description, rightContent }) {
  return <div className="category-create-card-heading"><span className="category-create-card-icon" aria-hidden="true">{icon}</span><div className="category-create-card-heading-text"><h2>{title}</h2><p>{description}</p></div>{rightContent && <div className="category-create-card-heading-extra">{rightContent}</div>}</div>;
}

function SummaryRow({ label, value }) {
  return <div className="category-create-summary-row"><span>{label}</span><strong>{value}</strong></div>;
}

function getCategoryApiError(error) {
  const responseData = error && (error.data || error.response && error.response.data || error);
  return responseData && (responseData.error || responseData) || {};
}

function getErrorMessage(error) {
  const apiError = getCategoryApiError(error);
  return apiError.message || (apiError.code === "CATEGORY_NAME_EXISTS" && "This category name is already in use.")
    || "Unable to save the category. Review your details and try again.";
}

function mapStateToProps(state) {
  return { productsTypeAdd: state.reducer.productsType.add, productsTypeUpdate: state.reducer.productsType.update, locale: state.locale };
}

const ConnectedCategoryCreatePage = connect(mapStateToProps)(CategoryCreatePage);
export default Form.create()(ConnectedCategoryCreatePage);
