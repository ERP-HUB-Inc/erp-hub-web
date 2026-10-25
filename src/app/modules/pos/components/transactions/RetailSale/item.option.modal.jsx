import React from "react";
import { Alert, Button, Input, Modal, Spin } from "antd";
import { Check, Minus, Plus, X } from "lucide-react";
import CommonUtil from "@common/util/index";
import ItemPOSService from "@services/ItemPOSService";
import Util from "../../../../inventory/utils";
import { ItemImage } from "./item.image";
import { getLocationId } from "@helper/user";

const DEVELOPMENT_ADD_ONS = process.env.NODE_ENV === "development" ? [
  { id: "demo-extra-napkins", name: "Extra Napkins", price: 0, quantity: 1 },
  { id: "demo-gift-carrier", name: "Gift Carrier Bag", price: 0.25, quantity: 1 },
  { id: "demo-plastic-cutlery", name: "Plastic Cutlery", price: 0.1, quantity: 1 }
] : [];

const attributeValueIds = variant => String(variant && variant.productAttributeValueId || "")
  .split(",").map(value => value.trim()).filter(Boolean);

export default class ItemOptionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      selected: {},
      modifiers: [],
      quantity: Number(props.defaultQuantity) > 0 ? Number(props.defaultQuantity) : 1,
      note: "",
      showNote: false,
      loading: true,
      error: null,
      submitting: false,
      resolvingVariant: false,
      resolvedVariant: null
    };
    this.isUnmounted = false;
    this.submitLock = false;
    this.variantRequestId = 0;
    this.dialogRef = React.createRef();
    this.previousFocus = typeof document !== "undefined" ? document.activeElement : null;
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    this.focusTimer = window.setTimeout(() => {
      if (this.dialogRef.current) this.dialogRef.current.focus();
    }, 0);
    this.loadOptions();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    document.removeEventListener("keydown", this.handleKeyDown);
    window.clearTimeout(this.focusTimer);
  }

  loadOptions = async () => {
    this.setState({ loading: true, error: null });
    try {
      const response = await ItemPOSService.getOptions(this.props.product.id);
      const options = response && response.data && Array.isArray(response.data.data) ? response.data.data : [];
      if (!options.length) throw new Error("This item has no available option groups.");
      const selected = this.getInitialSelection(options);
      if (!this.isUnmounted) this.setState({ options, selected, loading: false }, () => this.resolveVariant(selected));
    } catch (error) {
      if (!this.isUnmounted) this.setState({ loading: false, error: error.message || "Unable to load item options." });
    }
  };

  getUnambiguousDefault(options) {
    const variants = this.getOptionVariants(options);
    if (variants.length !== 1) return {};
    const ids = attributeValueIds(variants[0]);
    const selected = {};
    options.forEach(group => {
      const value = (group.attributeValues || []).find(option => ids.includes(String(option.id)));
      if (value) selected[group.id] = value.id;
    });
    return Object.keys(selected).length === options.length ? selected : {};
  }

  getInitialSelection(options) {
    const unambiguousSelection = this.getUnambiguousDefault(options);
    if (Object.keys(unambiguousSelection).length) return unambiguousSelection;

    const variants = this.getOptionVariants(options);
    const firstAvailableVariant = variants.find(variant => {
      const ids = attributeValueIds(variant);
      const containsEveryGroup = options.every(group => (group.attributeValues || []).some(value => ids.includes(String(value.id))));
      if (!containsEveryGroup || !this.isTrackingEnabled() || !this.hasLocationStockData(variant)) return containsEveryGroup;
      return this.getVariantStock(variant) > 0;
    });

    if (firstAvailableVariant) {
      const ids = attributeValueIds(firstAvailableVariant);
      return options.reduce((selection, group) => {
        const value = (group.attributeValues || []).find(option => ids.includes(String(option.id)));
        if (value) selection[group.id] = value.id;
        return selection;
      }, {});
    }

    // If the item endpoint omits variants, try the first configured value in each group.
    const hasCompleteVariant = variants.some(variant => options.every(group => (group.attributeValues || []).some(value => attributeValueIds(variant).includes(String(value.id)))));
    if (!hasCompleteVariant && options.every(group => (group.attributeValues || []).length > 0)) {
      return options.reduce((selection, group) => ({ ...selection, [group.id]: group.attributeValues[0].id }), {});
    }
    return {};
  }

  getOptionVariants(options = this.state.options) {
    const variants = [];
    options.forEach(group => {
      (group.attributeValues || []).forEach(value => {
        if (value.variant && value.variant.id && !variants.some(variant => String(variant.id) === String(value.variant.id))) {
          variants.push(value.variant);
        }
      });
    });
    return variants;
  }

  getKnownVariants() {
    return this.getOptionVariants();
  }

  getVariantStock(variant) {
    const locationId = String(getLocationId() || "");
    const locations = variant && Array.isArray(variant.productLocations) ? variant.productLocations : [];
    const currentLocationStocks = locations.filter(location => String(location.locationId) === locationId);
    if (currentLocationStocks.length) return currentLocationStocks.reduce((total, location) => total + (Number(location.quantity) || 0), 0);
    return variant && variant.quantity != null && Number.isFinite(Number(variant.quantity)) ? Number(variant.quantity) : 0;
  }

  hasLocationStockData(variant) {
    const locationId = String(getLocationId() || "");
    const hasLocationEntry = Boolean(locationId) && Array.isArray(variant && variant.productLocations) &&
      variant.productLocations.some(location => String(location.locationId) === locationId);
    return hasLocationEntry || Boolean(variant && variant.quantity != null && Number.isFinite(Number(variant.quantity)));
  }

  isTrackingEnabled() {
    return this.props.product && this.props.product.enableInventoryTracking !== false;
  }

  findVariant(selected = this.state.selected) {
    if (!this.state.options.length || this.state.options.some(group => !selected[group.id])) return null;
    const chosenIds = this.state.options.map(group => String(selected[group.id]));
    const resolvedIds = attributeValueIds(this.state.resolvedVariant);
    return this.state.resolvedVariant && resolvedIds.length === chosenIds.length && chosenIds.every(id => resolvedIds.includes(id)) ? this.state.resolvedVariant : null;
  }

  resolveVariant = async selected => {
    const requestId = ++this.variantRequestId;
    if (!this.state.options.length || this.state.options.some(group => !selected[group.id])) {
      this.setState({ resolvedVariant: null, resolvingVariant: false, error: null });
      return;
    }
    const ids = this.state.options.map(group => String(selected[group.id]));
    this.setState({ resolvedVariant: null, resolvingVariant: true, error: null });
    try {
      const response = await ItemPOSService.getVariantByOptionValueId(ids.join(","));
      const result = response && response.data && response.data.data;
      const variant = Array.isArray(result) ? result.find(candidate => candidate && candidate.id && ids.every(id => attributeValueIds(candidate).includes(id))) : result;
      if (!this.isUnmounted && requestId === this.variantRequestId) this.setState({
        resolvedVariant: variant && variant.id ? variant : null,
        resolvingVariant: false,
        error: variant && variant.id ? null : "No sellable variant matches the selected options."
      });
    } catch (error) {
      if (!this.isUnmounted && requestId === this.variantRequestId) this.setState({ resolvedVariant: null, resolvingVariant: false, error: "Unable to resolve this option combination. Please choose again." });
    }
  };

  getQuantityStep() {
    const variant = this.findVariant();
    return Number(variant && (variant.quantityIncrement || variant.quantityStep) || this.props.product && (this.props.product.quantityIncrement || this.props.product.quantityStep)) || 1;
  }

  getQuantityPrecision() {
    const variant = this.findVariant();
    const configured = variant && variant.quantityDecimalPlaces != null ? variant.quantityDecimalPlaces : this.props.product && this.props.product.quantityDecimalPlaces;
    if (configured != null && Number.isFinite(Number(configured))) return Math.max(0, Math.min(6, Number(configured)));
    const step = String(this.getQuantityStep());
    return step.includes(".") ? step.split(".")[1].length : 0;
  }

  optionAvailability(group, value) {
    const variants = this.getKnownVariants();
    if (!variants.length) return true;
    const groupIndex = this.state.options.findIndex(option => option.id === group.id);
    const selectedIds = this.state.options.slice(0, groupIndex).map(option => this.state.selected[option.id]).filter(Boolean).map(String);
    selectedIds.push(String(value.id));
    const matches = variants.filter(variant => selectedIds.every(id => attributeValueIds(variant).includes(id)));
    const hasCompleteVariantData = variants.some(variant => attributeValueIds(variant).length === this.state.options.length);
    if (!matches.length) return !hasCompleteVariantData;
    if (!this.isTrackingEnabled()) return true;
    const locationStockKnown = matches.every(variant => this.hasLocationStockData(variant));
    return !locationStockKnown || matches.some(variant => this.getVariantStock(variant) > 0);
  }

  selectOption = (group, value) => {
    this.setState(current => {
      const selected = { ...current.selected, [group.id]: value.id };
      return { selected, quantity: Number(this.props.defaultQuantity) > 0 ? Number(this.props.defaultQuantity) : 1, resolvedVariant: null, error: null };
    }, () => this.resolveVariant(this.state.selected));
  };

  getInvalidSelectionGroup() {
    const variants = this.getKnownVariants();
    if (!variants.length || !variants.some(variant => attributeValueIds(variant).length === this.state.options.length)) return null;
    const selectedIds = [];
    for (const group of this.state.options) {
      const valueId = this.state.selected[group.id];
      if (!valueId) continue;
      selectedIds.push(String(valueId));
      const hasCompatibleVariant = variants.some(variant => selectedIds.every(id => attributeValueIds(variant).includes(id)));
      if (!hasCompatibleVariant) return group;
    }
    return null;
  }

  toggleModifier = modifier => {
    this.setState(current => {
      const exists = current.modifiers.some(selected => selected.id === modifier.id);
      return { modifiers: exists ? current.modifiers.filter(selected => selected.id !== modifier.id) : [...current.modifiers, modifier], error: null };
    });
  };

  changeQuantity = amount => {
    const variant = this.findVariant();
    const available = variant ? this.getVariantStock(variant) : 0;
    const step = this.getQuantityStep();
    this.setState(current => {
      const quantity = Math.max(step, Number(current.quantity) + amount * step);
      return { quantity: this.isTrackingEnabled() && variant ? Math.min(quantity, available) : quantity, error: null };
    });
  };

  setQuantity = event => {
    const raw = event.target.value;
    const precision = this.getQuantityPrecision();
    const quantityPattern = precision ? new RegExp(`^\\d*(\\.\\d{0,${precision}})?$`) : /^\d*$/;
    if (!quantityPattern.test(raw)) return;
    const variant = this.findVariant();
    const available = variant ? this.getVariantStock(variant) : 0;
    const entered = raw === "" ? raw : Math.max(this.getQuantityStep(), Number(raw));
    this.setState({ quantity: this.isTrackingEnabled() && variant && entered !== "" ? Math.min(entered, available) : entered, error: null });
  };

  handleCancel = () => {
    if (this.props.handleCancel) this.props.handleCancel();
    if (this.previousFocus && typeof this.previousFocus.focus === "function") this.previousFocus.focus();
  };

  handleAdd = async () => {
    if (this.submitLock) return;
    const variant = this.findVariant();
    if (!variant) {
      this.setState({ error: "Choose an available combination before adding this item." });
      return;
    }
    const available = this.getVariantStock(variant);
    const step = this.getQuantityStep();
    const quantity = Number(this.state.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0 || quantity / step % 1 !== 0 || this.isTrackingEnabled() && quantity > available) {
      this.setState({ error: `Enter a quantity greater than 0${this.isTrackingEnabled() ? ` and no more than ${available}` : ""}.` });
      return;
    }
    this.submitLock = true;
    this.setState({ submitting: true, error: null });
    try {
      const modifiers = this.state.modifiers.map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
      const selectedOptions = this.state.options.map(group => {
        const value = (group.attributeValues || []).find(option => String(option.id) === String(this.state.selected[group.id]));
        return { groupId: group.id, groupName: Util.getProductAttributeName(group) || group.attribute && group.attribute.name || "", valueId: value && value.id, valueName: value && value.name };
      }).filter(option => option.valueId != null);
      const result = this.props.handleAddVariant ? await this.props.handleAddVariant(variant, {
        quantity: Number(this.state.quantity), note: this.state.note.trim(), modifiers, selectedOptions
      }) : false;
      if (result !== false) this.handleCancel();
      else this.setState({ submitting: false, error: "This variant is no longer available at the current location." });
    } catch (error) {
      this.setState({ submitting: false, error: error.message || "Unable to add this item. Please try again." });
    } finally {
      this.submitLock = false;
    }
  };

  handleKeyDown = event => {
    if (event.key !== "Enter" || event.repeat || event.isComposing || event.nativeEvent && event.nativeEvent.isComposing || this.state.loading || this.state.resolvingVariant || this.state.submitting) return;
    const target = event.target;
    const tagName = target && target.tagName && target.tagName.toLowerCase();
    if (tagName === "textarea" || tagName === "input" || tagName === "button" || target && target.isContentEditable) return;
    if (target && target.closest && !target.closest(".item-option-modal")) return;
    event.preventDefault();
    this.handleAdd();
  };

  formatPrice(value) {
    return this.props.formatPrice ? this.props.formatPrice(value) : `$${Number(value || 0).toFixed(2)}`;
  }

  getImageSource(image) {
    const source = typeof image === "string" ? image : image && (image.url || image.filename || image.path);
    if (!source) return "";
    if (/^(https?:|data:|blob:)/i.test(source)) return source;
    if (source.startsWith("/")) return `${process.env.BASE_URL || "http://localhost:3080"}${source}`;
    return new CommonUtil().getImageUrl(source);
  }

  renderOptionGroup(group, index) {
    const selectedValueId = this.state.selected[group.id];
    const attributeName = Util.getProductAttributeName(group) || group.attribute && group.attribute.name || `Option ${index + 1}`;
    const isRequired = group.required === true || group.isRequired === true || group.attribute && (group.attribute.required === true || group.attribute.isRequired === true);
    const invalidSelection = this.getInvalidSelectionGroup();
    const hasSingleOptionGroup = this.state.options.length === 1;
    return <section className="item-option-section" key={group.id}>
      {!hasSingleOptionGroup && <div className="item-option-section-heading"><div><span className="item-option-step">{index + 1}</span><h3>{attributeName}</h3></div><span className="item-option-required">{isRequired ? "Required" : "Select one"}</span></div>}
      <div className="item-option-tiles" role="radiogroup" aria-label={attributeName}>
        {(group.attributeValues || []).map(value => {
          const selected = String(selectedValueId) === String(value.id);
          const available = this.optionAvailability(group, value);
          const details = this.getOptionDetails(group, value);
          const color = value.colorCode || value.hexCode || value.color || value.hex;
          const popular = value.isPopular === true || value.popular === true;
          return <button type="button" role="radio" aria-checked={selected} aria-disabled={!available} disabled={!available}
            data-option-value-id={value.id} className={`item-option-tile ${selected ? "selected" : ""} ${!available ? "unavailable" : ""}`} key={value.id} onClick={() => this.selectOption(group, value)} onKeyDown={event => this.handleOptionKeyDown(event, group)}>
            <span className="item-option-card-copy">
              <span className="item-option-card-row item-option-card-top">
                <span className="item-option-card-name">{color && <span className="item-option-color-swatch" aria-hidden="true" style={{ backgroundColor: color }} />}<strong>{hasSingleOptionGroup ? `${attributeName}: ${value.name}` : value.name}</strong>{popular && <span className="item-option-popular">Popular</span>}</span>
                {(details.size || value.description) && <span className="item-option-card-size">{details.size || value.description}</span>}
              </span>
              <span className="item-option-card-row item-option-card-bottom">
                {details.price != null ? <strong className="item-option-card-price">{this.formatPrice(details.price)}</strong> : <span className="item-option-card-description" />}
                {details.stockLabel && <span className={`item-option-card-stock ${details.lowStock ? "low" : ""} ${details.outOfStock ? "out" : ""}`}>{details.stockLabel}</span>}
              </span>
              {!available && !details.outOfStock && <small className="item-option-unavailable-label">Unavailable combination</small>}
            </span>
          </button>;
        })}
      </div>
      {invalidSelection && invalidSelection.id === group.id && <p className="item-option-selection-error" role="alert">This {attributeName} is incompatible with the other selected options. Choose another value.</p>}
    </section>;
  }

  handleOptionKeyDown(event, group) {
    const keyToDirection = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const direction = keyToDirection[event.key];
    if (!direction) return;
    const groupElement = event.currentTarget.closest('[role="radiogroup"]');
    const cards = groupElement ? Array.from(groupElement.querySelectorAll('[role="radio"]:not(:disabled)')) : [];
    const currentIndex = cards.indexOf(event.currentTarget);
    if (!cards.length || currentIndex < 0) return;
    event.preventDefault();
    const nextCard = cards[(currentIndex + direction + cards.length) % cards.length];
    const nextValue = (group.attributeValues || []).find(value => String(value.id) === String(nextCard.getAttribute("data-option-value-id")));
    nextCard.focus();
    if (nextValue) this.selectOption(group, nextValue);
  }

  getOptionDetails(group, value) {
    const selection = { ...this.state.selected, [group.id]: value.id };
    const sizeValue = value.sizeLabel || value.weightLabel || value.netWeightLabel || value.size || value.weight || value.netWeight;
    const unit = value.sizeUnit || value.weightUnit || value.unitName || value.unit && (value.unit.name || value.unit.symbol) || value.uom;
    const size = sizeValue == null ? "" : `${sizeValue}${unit ? `${typeof sizeValue === "number" ? " " : ""}${unit}` : ""}`;
    if (this.state.options.some(optionGroup => !selection[optionGroup.id])) return { size, price: null, stockLabel: "", lowStock: false, outOfStock: false };
    const selectedIds = this.state.options.map(optionGroup => String(selection[optionGroup.id]));
    const resolvedVariant = this.state.resolvedVariant;
    const resolvedIds = attributeValueIds(resolvedVariant);
    const resolvedMatches = resolvedVariant && resolvedIds.length === selectedIds.length && selectedIds.every(id => resolvedIds.includes(id));
    const matches = resolvedMatches ? [resolvedVariant] : [];
    this.getKnownVariants().filter(variant => {
      const ids = attributeValueIds(variant);
      return ids.length === selectedIds.length && selectedIds.every(id => ids.includes(id));
    }).forEach(variant => {
      if (!matches.some(match => String(match.id) === String(variant.id))) matches.push(variant);
    });
    const configuredVariant = value && value.variant;
    if (configuredVariant && configuredVariant.id && attributeValueIds(configuredVariant).length === selectedIds.length &&
      selectedIds.every(id => attributeValueIds(configuredVariant).includes(id)) && !matches.some(variant => String(variant.id) === String(configuredVariant.id))) {
      matches.push(configuredVariant);
    }
    const uniqueMatches = matches.filter((variant, index, list) => list.findIndex(candidate => String(candidate.id) === String(variant.id)) === index);
    if (uniqueMatches.length !== 1) return { size, price: null, stockLabel: "", lowStock: false, outOfStock: false };
    const variant = uniqueMatches[0];
    const hasStock = this.isTrackingEnabled() && this.hasLocationStockData(variant);
    const stock = hasStock ? this.getVariantStock(variant) : null;
    const threshold = Number(variant.reorderPoint != null ? variant.reorderPoint : this.props.product && this.props.product.reorderPoint || 0);
    const lowStock = stock != null && stock > 0 && stock <= threshold;
    return {
      size,
      price: variant.price != null && Number.isFinite(Number(variant.price)) ? Number(variant.price) : null,
      stockLabel: stock == null ? "" : stock <= 0 ? "Out of stock" : lowStock ? `Low: ${stock}` : `Qty: ${stock}`,
      lowStock,
      outOfStock: stock != null && stock <= 0
    };
  }

  render() {
    const product = this.props.product || {};
    const variant = this.findVariant();
    const tracking = this.isTrackingEnabled();
    const available = variant ? this.getVariantStock(variant) : 0;
    const threshold = Number(variant && variant.reorderPoint || product.reorderPoint || 0);
    const status = this.state.resolvingVariant ? "Checking availability" : !variant ? "Choose options" : !tracking ? "Not tracked" : available <= 0 ? "Out of stock" : available <= threshold ? "Low stock" : "In stock";
    const modifierTotal = this.state.modifiers.reduce((sum, modifier) => sum + Number(modifier.price || 0) * (Number(modifier.quantity) || 1), 0);
    const unitPrice = Number(variant && variant.price || 0) + modifierTotal;
    const quantity = Number(this.state.quantity) || 0;
    const total = unitPrice * quantity;
    const category = product.category && (product.category.name || product.category.namekm) || product.categoryName || "";
    const itemGroup = product.productType && (product.productType.name || product.productType.namekm) || product.brand && product.brand.name || "";
    const image = this.getImageSource(variant && variant.image) || this.getImageSource(product.image) || this.getImageSource(product.imageUrl) || this.getImageSource(product.productImage);
    const showOptionalAddOns = false;
    const showOptionalNote = false;

    return <Modal visible centered width={760} footer={null} title={null} closable={false} keyboard maskClosable={false}
      className="item-option-modal" onCancel={this.handleCancel} afterClose={() => { if (this.previousFocus && this.previousFocus.focus) this.previousFocus.focus(); }}>
      <div className="item-option-dialog" ref={this.dialogRef} tabIndex={-1}>
        <header className="item-option-header">
          <ItemImage key={image} src={image} name={Util.getProductNameV2(product)} height={64} />
          <div className="item-option-product-copy"><div className="item-option-name-row"><h2 title={Util.getProductNameV2(product)}>{Util.getProductNameV2(product)}</h2><span className={`item-option-stock ${status.toLowerCase().replace(/\s/g, "-")}`}>{status}</span></div>
            <p>{[category, itemGroup, variant && variant.sku ? `SKU ${variant.sku}` : ""].filter(Boolean).join(" · ")}</p>
          </div>
          <button type="button" className="item-option-close" aria-label="Close item options" onClick={this.handleCancel}><X size={19} /></button>
        </header>

        {this.state.error && <Alert type="error" showIcon message={this.state.error} />}
        {this.state.loading ? <div className="item-option-loading"><Spin /> <span>Loading item options…</span></div> : this.state.error && !this.state.options.length ? <div className="item-option-load-error"><Button onClick={this.loadOptions}>Retry</Button></div> : <>
          <div className="item-option-scroll">
            {this.state.options.map((group, index) => this.renderOptionGroup(group, index))}

            {showOptionalAddOns && DEVELOPMENT_ADD_ONS.length > 0 && <section className="item-option-section">
              <div className="item-option-section-heading"><div><span className="item-option-step">{this.state.options.length + 1}</span><h3>Optional add-ons</h3></div><span className="item-option-demo-label">Development demo data</span></div>
              <div className="item-option-addon-list">{DEVELOPMENT_ADD_ONS.map(addon => {
                const selected = this.state.modifiers.some(modifier => modifier.id === addon.id);
                return <button type="button" key={addon.id} className={`item-option-addon ${selected ? "selected" : ""}`} aria-pressed={selected} onClick={() => this.toggleModifier(addon)}>
                  <span className="item-option-addon-symbol">{selected ? <Check size={14} /> : <Plus size={14} />}</span><span>{addon.name}</span>{addon.price > 0 && <small>+{this.formatPrice(addon.price)}</small>}
                </button>;
              })}</div>
            </section>}

            {showOptionalNote && <section className="item-option-section item-option-note-section">
              <div className="item-option-section-heading"><div><span className="item-option-step">{this.state.options.length + (showOptionalAddOns ? 2 : 1)}</span><h3>Optional note</h3></div><button type="button" className="item-option-note-toggle" aria-expanded={this.state.showNote} onClick={() => this.setState(state => ({ showNote: !state.showNote }))}>{this.state.showNote ? "Hide" : "Add note"}</button></div>
              {this.state.showNote && <label className="item-option-note-label">Note for this item<Input.TextArea rows={2} maxLength={255} value={this.state.note} onChange={event => this.setState({ note: event.target.value, error: null })} placeholder="Add a preparation or order note" /></label>}
            </section>}
          </div>

          <div className="item-option-summary">
            <div className="item-option-quantity"><span>Quantity</span><div className="item-option-stepper"><button type="button" aria-label="Decrease quantity" disabled={quantity <= this.getQuantityStep() || !variant} onClick={() => this.changeQuantity(-1)}><Minus size={15} /></button><input aria-label="Quantity" inputMode={this.getQuantityPrecision() ? "decimal" : "numeric"} value={this.state.quantity} onChange={this.setQuantity} onBlur={() => this.state.quantity === "" && this.setState({ quantity: Number(this.props.defaultQuantity) > 0 ? Number(this.props.defaultQuantity) : 1 })} /><button type="button" aria-label="Increase quantity" disabled={!variant || tracking && quantity >= available} onClick={() => this.changeQuantity(1)}><Plus size={15} /></button></div></div>
            <div className="item-option-price-summary"><span>Unit Price: {variant ? this.formatPrice(unitPrice) : "—"}</span><strong>Total: {variant ? this.formatPrice(total) : "—"}</strong></div>
          </div>
          <footer className="item-option-footer"><Button className="item-option-cancel" onClick={this.handleCancel}>Cancel <kbd>Esc</kbd></Button><Button type="primary" className="item-option-submit" disabled={!variant || this.state.resolvingVariant || tracking && (available < 1 || quantity > available) || !quantity} loading={this.state.submitting || this.state.resolvingVariant} onClick={this.handleAdd}>＋ Add to Order · {variant ? this.formatPrice(total) : this.state.resolvingVariant ? "Checking variant" : "Choose options"} <kbd>Enter</kbd></Button></footer>
        </>}
      </div>
    </Modal>;
  }
}
