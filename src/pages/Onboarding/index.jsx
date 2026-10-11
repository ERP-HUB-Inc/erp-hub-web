import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Boxes, Check, MapPin, Moon, Package, RefreshCw, Sun, Truck } from "lucide-react";
import Util from "../../app/modules/common/util";
import OnboardingService, { getResponseData } from "./OnboardingService";
import "./onboarding.css";

const setupLinks = [
  { code: "PRODUCT", title: "Products", description: "Add the items or services you offer.", path: "/inventories/items/create", icon: Package },
  { code: "OPENING_STOCK", title: "Opening stock", description: "Enter stock you already have.", path: "/inventories/stock-io/create", icon: Boxes },
  { code: "SUPPLIER", title: "Suppliers", description: "Add the businesses you purchase from.", path: "/vendors/create", icon: Truck }
];

const journeySteps = ["Account", "Business", "Type", "Experience", "Setup"];
const themeStorageKey = "marketchain:theme";
const fallbackCurrencyOptions = [
  { code: "KHR", name: "Cambodian riel" },
  { code: "USD", name: "US dollar" }
];

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    if (stored === "light" || stored === "dark") return stored;
  } catch (error) {
    // A browser may block storage; system preference still works.
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function OnboardingHeader({ theme, onToggleTheme }) {
  const nextTheme = theme === "dark" ? "light" : "dark";
  const ThemeIcon = theme === "dark" ? Sun : Moon;
  return (
    <header className="mc-onboarding-header">
      <Link to="/" className="mc-onboarding-brand" aria-label="MarketChain ERP dashboard">
        <span>MarketChain</span><small>ERP</small>
      </Link>
      <div className="mc-onboarding-header-actions">
        <span className="mc-onboarding-header-label">Workspace setup</span>
        <button type="button" className="mc-onboarding-theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${nextTheme} mode`} title={`Switch to ${nextTheme} mode`}>
          <ThemeIcon size={17} strokeWidth={1.9} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function getErrorMessage(error, fallback) {
  const responseError = error && error.response && error.response.data && error.response.data.error;
  return (responseError && responseError.message) || fallback;
}

function OnboardingPage({ history }) {
  const currentUser = (new Util()).getCurrentUser() || {};
  const [locationId, setLocationId] = useState(currentUser.locationId || "");
  const [theme, setTheme] = useState(getInitialTheme);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);
  const [costCalculation, setCostCalculation] = useState("AVERAGE");
  const [savedCostCalculation, setSavedCostCalculation] = useState("AVERAGE");
  const [savingCostCalculation, setSavingCostCalculation] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("KHR");
  const [savedCurrencyCode, setSavedCurrencyCode] = useState("KHR");
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [preset, setPreset] = useState(null);
  const [presetWarning, setPresetWarning] = useState("");
  const [checklist, setChecklist] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [savedName, setSavedName] = useState("");
  const [savedAddress, setSavedAddress] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    setStatus(null);
    setChecklist(null);
    setPreset(null);
    setPresetWarning("");
    try {
      const statusResponse = await OnboardingService.getStatus();
      const nextStatus = getResponseData(statusResponse);
      if (!nextStatus) throw new Error("Incomplete onboarding response");
      const nextLocationId = (nextStatus.location && nextStatus.location.id) || currentUser.locationId || "";
      setLocationId(nextLocationId);
      const [checklistResponse, locationResponse] = await Promise.all([
        OnboardingService.getChecklist(),
        nextLocationId ? OnboardingService.getLocation(nextLocationId) : Promise.resolve(null)
      ]);
      const nextChecklist = getResponseData(checklistResponse);
      if (!nextChecklist || !Array.isArray(nextChecklist.items)) throw new Error("Incomplete onboarding checklist");
      const storedCostCalculation = String(nextStatus.costCalculation || "AVERAGE").toUpperCase();
      const nextCostCalculation = storedCostCalculation === "FIFO" ? "FIFO" : "AVERAGE";
      const storedCurrencyCode = String((nextStatus.currency && nextStatus.currency.code) || nextStatus.currencyCode || "KHR").toUpperCase();
      const nextCurrencyCode = storedCurrencyCode === "USD" ? "USD" : "KHR";
      setCostCalculation(nextCostCalculation);
      setSavedCostCalculation(storedCostCalculation === "FIFO" || storedCostCalculation === "AVERAGE" ? storedCostCalculation : "");
      setCurrencyCode(nextCurrencyCode);
      setSavedCurrencyCode(storedCurrencyCode === "KHR" || storedCurrencyCode === "USD" ? storedCurrencyCode : "");
      if (nextLocationId) {
        const currentLocation = getResponseData(locationResponse);
        if (!currentLocation || typeof currentLocation.name !== "string") throw new Error("Location not found");
        setLocationName(currentLocation.name || "");
        setAddress(currentLocation.address || "");
        setSavedName(currentLocation.name || "");
        setSavedAddress(currentLocation.address || "");
      }
      if (nextStatus.businessType) {
        try {
          const presetResponse = await OnboardingService.getPreset(nextStatus.businessType);
          setPreset(getResponseData(presetResponse));
        } catch (presetError) {
          setPresetWarning("Business type suggestions are unavailable. You can continue with setup.");
        }
      }
      setStatus(nextStatus);
      setChecklist(nextChecklist);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load onboarding. Please retry."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
      // Keep the selected theme for this visit when storage is unavailable.
    }
  }, [theme]);

  async function saveLocation(event) {
    event.preventDefault();
    if (saving || completing) return;
    const name = locationName.trim();
    const trimmedAddress = address.trim();
    if (!name || name.length > 100) {
      setError("Enter a location name of up to 100 characters.");
      return;
    }
    if (trimmedAddress.length > 100) {
      setError("Address must be 100 characters or fewer.");
      return;
    }
    if (!locationId) {
      setError("Your session has no location. Please sign in again or contact support.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await OnboardingService.updateLocation(locationId, { name, address: trimmedAddress });
      setSavedName(name);
      setSavedAddress(trimmedAddress);
      setLocationName(name);
      setAddress(trimmedAddress);
      message.success("Location saved.");
      try {
        const response = await OnboardingService.getChecklist();
        setChecklist(getResponseData(response));
      } catch (refreshError) {
        setError("Location was saved, but progress could not be refreshed. Please refresh progress and try again.");
      }
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save location. Please retry."));
    } finally {
      setSaving(false);
    }
  }

  async function saveCostCalculation() {
    if (savingCostCalculation || costCalculation === savedCostCalculation) return;
    setSavingCostCalculation(true);
    setError("");
    try {
      const response = await OnboardingService.updateCostCalculation(costCalculation);
      const result = getResponseData(response);
      if (!result || result.costCalculation !== costCalculation) throw new Error("Cost method was not confirmed");
      setSavedCostCalculation(costCalculation);
      message.success("Inventory costing method saved.");
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save inventory costing method. Please retry."));
    } finally {
      setSavingCostCalculation(false);
    }
  }

  async function saveCurrency() {
    if (savingCurrency || currencyCode === savedCurrencyCode) return;
    setSavingCurrency(true);
    setError("");
    try {
      const response = await OnboardingService.updateCurrency(currencyCode);
      const result = getResponseData(response);
      if (!result || result.code !== currencyCode) throw new Error("Currency was not confirmed");
      setSavedCurrencyCode(currencyCode);
      message.success("Workspace currency saved.");
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save workspace currency. Please retry."));
    } finally {
      setSavingCurrency(false);
    }
  }

  async function complete() {
    if (completing || saving || savingCostCalculation || savingCurrency || costCalculation !== savedCostCalculation || currencyCode !== savedCurrencyCode) return;
    setCompleting(true);
    setError("");
    try {
      const response = await OnboardingService.complete();
      const result = getResponseData(response);
      if (!result || result.status !== "COMPLETED") throw new Error("Completion was not confirmed");
      message.success("Workspace ready.");
      history.push("/");
    } catch (completeError) {
      setError(getErrorMessage(completeError, "Unable to complete onboarding. Please retry."));
    } finally {
      setCompleting(false);
    }
  }

  if (loading) return (
    <main className="mc-onboarding-page" data-theme={theme}>
      <OnboardingHeader theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
      <div className="mc-onboarding-loading" role="status">Loading your workspace setup...</div>
    </main>
  );

  const completed = checklist && checklist.items ? checklist.items.reduce((map, item) => ({ ...map, [item.code]: item.completed }), {}) : {};
  const locationChanged = locationName.trim() !== savedName || address.trim() !== savedAddress;
  const canComplete = Boolean(locationId && checklist && completed.LOCATION && !locationChanged && !saving && !savingCostCalculation && !savingCurrency && costCalculation === savedCostCalculation && currencyCode === savedCurrencyCode);
  const features = preset && Array.isArray(preset.recommendedFeatures) ? preset.recommendedFeatures : null;
  const recipeRecommended = Boolean(features && features.indexOf("RECIPE") >= 0);
  const currencyOptions = preset && Array.isArray(preset.currencies) && preset.currencies.length
    ? preset.currencies
    : fallbackCurrencyOptions;
  const relevantLinks = setupLinks.filter(item => !features ||
    (item.code !== "OPENING_STOCK" || features.indexOf("INVENTORY") >= 0) &&
    (item.code !== "SUPPLIER" || features.indexOf("PURCHASING") >= 0));
  const steps = recipeRecommended
    ? [relevantLinks[0], { code: "RECIPE", title: "Recipes", description: "Add ingredients and recipes to the products that need them.", path: "/inventories/items", icon: BookOpen }, ...relevantLinks.slice(1)]
    : relevantLinks;

  return (
    <main className="mc-onboarding-page" data-theme={theme}>
      <OnboardingHeader theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />

      <div className="mc-onboarding-container">
        <ol className="mc-onboarding-journey" aria-label="Onboarding progress">
          {journeySteps.map((step, index) => (
            <li key={step} className={index === journeySteps.length - 1 ? "mc-onboarding-current" : "mc-onboarding-done"} aria-current={index === journeySteps.length - 1 ? "step" : undefined}>
              {step}
            </li>
          ))}
        </ol>

        <section className="mc-onboarding-panel">
          <p className="mc-onboarding-eyebrow">MarketChain onboarding</p>
          <h1>Set up your workspace</h1>
          <p className="mc-onboarding-intro">Your business details are ready. Review your location, then add the products and stock you need to get started.</p>
          {status && status.businessType && <span className="mc-onboarding-business-type">{status.businessType.replace(/_/g, " ")} workspace</span>}
          {error && <div className="mc-onboarding-alert mc-onboarding-alert-error" role="alert">{error}</div>}
          {presetWarning && <div className="mc-onboarding-alert mc-onboarding-alert-warning" role="alert">{presetWarning}</div>}

          <section className="mc-onboarding-section" aria-labelledby="currency-heading">
            <p className="mc-onboarding-section-kicker">Workspace</p>
            <h2 id="currency-heading">Choose your currency</h2>
            <p className="mc-onboarding-section-description">This is the default currency used for prices and reports.</p>
            <div className="mc-onboarding-field mc-onboarding-currency-field">
              <label htmlFor="onboarding-currency">Default currency</label>
              <select id="onboarding-currency" value={currencyCode} onChange={event => setCurrencyCode(event.target.value)} disabled={savingCurrency}>
                {currencyOptions.map(currency => (
                  <option key={currency.code} value={currency.code}>{currency.code} — {currency.name}</option>
                ))}
              </select>
            </div>
            <button type="button" className="mc-onboarding-button mc-onboarding-button-secondary" onClick={saveCurrency} disabled={savingCurrency || currencyCode === savedCurrencyCode}>
              {savingCurrency ? "Saving..." : "Save currency"}
            </button>
          </section>

          <section className="mc-onboarding-section" aria-labelledby="cost-calculation-heading">
            <p className="mc-onboarding-section-kicker">Inventory</p>
            <h2 id="cost-calculation-heading">Choose how item cost is calculated</h2>
            <p className="mc-onboarding-section-description">This method determines inventory value and cost of goods sold. You can change it before adding stock.</p>
            <div className="mc-onboarding-cost-methods" role="group" aria-label="Inventory costing method">
              <button type="button" className={costCalculation === "AVERAGE" ? "mc-onboarding-cost-method mc-onboarding-cost-method-selected" : "mc-onboarding-cost-method"} aria-pressed={costCalculation === "AVERAGE"} onClick={() => setCostCalculation("AVERAGE")} disabled={savingCostCalculation}>
                <strong>Moving average</strong>
                <span>Recalculates the unit cost as new stock is received.</span>
                <small>Recommended</small>
              </button>
              <button type="button" className={costCalculation === "FIFO" ? "mc-onboarding-cost-method mc-onboarding-cost-method-selected" : "mc-onboarding-cost-method"} aria-pressed={costCalculation === "FIFO"} onClick={() => setCostCalculation("FIFO")} disabled={savingCostCalculation}>
                <strong>FIFO</strong>
                <span>Uses the earliest received stock cost first when items are sold.</span>
              </button>
            </div>
            <button type="button" className="mc-onboarding-button mc-onboarding-button-secondary" onClick={saveCostCalculation} disabled={savingCostCalculation || costCalculation === savedCostCalculation}>
              {savingCostCalculation ? "Saving..." : "Save costing method"}
            </button>
          </section>

          <section className="mc-onboarding-section" aria-labelledby="location-setup-heading">
            <div className="mc-onboarding-section-heading">
              <span className="mc-onboarding-section-icon"><MapPin size={21} strokeWidth={1.75} /></span>
              <div>
                <p className="mc-onboarding-section-kicker">Step 1</p>
                <h2 id="location-setup-heading">Your first location</h2>
              </div>
            </div>
            <p className="mc-onboarding-section-description">We created a default location for your workspace. Update its name and address if needed.</p>
            {!locationId ? (
              <div className="mc-onboarding-alert mc-onboarding-alert-warning" role="alert">Your session has no location. Please sign in again or contact support.</div>
            ) : (
              <form className="mc-onboarding-form" onSubmit={saveLocation}>
                <div className="mc-onboarding-field">
                  <label htmlFor="onboarding-location-name">Location name <span aria-hidden="true">*</span></label>
                  <input id="onboarding-location-name" value={locationName} onChange={event => setLocationName(event.target.value)} maxLength={100} required placeholder="Main Store" />
                </div>
                <div className="mc-onboarding-field">
                  <label htmlFor="onboarding-location-address">Address <span className="mc-onboarding-optional">Optional</span></label>
                  <input id="onboarding-location-address" value={address} onChange={event => setAddress(event.target.value)} maxLength={100} placeholder="Street, city, and area" />
                </div>
                <button type="submit" className="mc-onboarding-button mc-onboarding-button-primary" disabled={saving || completing || !locationName.trim()}>
                  {saving ? "Saving..." : "Save location"}
                </button>
              </form>
            )}
          </section>

          <section className="mc-onboarding-section mc-onboarding-section-divided" aria-labelledby="next-steps-heading">
            <p className="mc-onboarding-section-kicker">Step 2</p>
            <h2 id="next-steps-heading">Continue setting up</h2>
            <p className="mc-onboarding-section-description">Open a step, save your changes there, then return here to refresh your progress.</p>
            <ul className="mc-onboarding-next-steps">
              {steps.map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.code}>
                    <Link to={item.path} className="mc-onboarding-step-card">
                      <span className="mc-onboarding-step-icon"><Icon size={21} strokeWidth={1.75} /></span>
                      <span className="mc-onboarding-step-copy"><strong>{item.title}</strong><span>{item.description}</span></span>
                      {item.code !== "RECIPE" && <span className={completed[item.code] ? "mc-onboarding-step-status mc-onboarding-step-status-done" : "mc-onboarding-step-status"}>{completed[item.code] ? "Added" : "To do"}</span>}
                      <ArrowRight size={17} className="mc-onboarding-step-arrow" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mc-onboarding-section mc-onboarding-section-divided" aria-labelledby="progress-heading">
            <h2 id="progress-heading">Setup progress</h2>
            <ul className="mc-onboarding-checklist">
              {(checklist ? checklist.items : []).map(item => (
                <li key={item.code} className={item.completed ? "mc-onboarding-checklist-done" : ""}>
                  <span className="mc-onboarding-check"><Check size={13} strokeWidth={2.5} aria-hidden="true" /></span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mc-onboarding-actions">
            <button type="button" className="mc-onboarding-button mc-onboarding-button-secondary" onClick={load} disabled={locationChanged || saving || completing}>
              <RefreshCw size={16} aria-hidden="true" /> Refresh progress
            </button>
            <button type="button" className="mc-onboarding-button mc-onboarding-button-primary" onClick={complete} disabled={!canComplete || completing}>
              {completing ? "Working..." : "Continue to dashboard"} {!completing && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </div>
          {!canComplete && <p className="mc-onboarding-action-help">{currencyCode !== savedCurrencyCode ? "Save the currency before continuing." : costCalculation !== savedCostCalculation ? "Save the costing method before continuing." : "A location must be saved before continuing."}</p>}
        </section>
      </div>
    </main>
  );
}

export default OnboardingPage;
