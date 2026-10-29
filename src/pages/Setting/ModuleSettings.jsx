import React from 'react';
import { Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import {
  Bell, BellRing, Building2, Calculator, ChartNoAxesCombined, ChevronRight,
  CircleDollarSign, CircleGauge, ClipboardList, CreditCard, FileText,
  Globe2, Grid2X2, Hash, Landmark, MapPin, MessagesSquare, Monitor, Package,
  ReceiptText, RefreshCw, Ruler, SearchX, Shapes, ShoppingCart, SlidersHorizontal,
  Tags, TicketPercent, TrendingUp, TriangleAlert, Warehouse, Zap
} from 'lucide-react';
import LocationService from '@services/LocationService';
import TaxService from '@services/TaxService';
import PrivilegeService from '../../app/modules/pos/services/settings/PrivilegeService';
import OnboardingService, { getResponseData } from '../Onboarding/OnboardingService';
import { filterSettingsModules, responseCount } from './module-settings-model';

const icons = {
  Bell, BellRing, Building2, Calculator, ChartNoAxesCombined, CircleDollarSign,
  CircleGauge, ClipboardList, CreditCard, FileText, Globe2, Grid2X2, Hash,
  Landmark, MapPin, MessagesSquare, Monitor, Package, ReceiptText, RefreshCw,
  Ruler, Shapes, ShoppingCart, SlidersHorizontal, Tags, TicketPercent, TrendingUp,
  TriangleAlert, Warehouse, Zap
};
const loadLocations = () => LocationService.get({ limit: 1, offset: 0 }).then(responseCount);
const loadTaxes = () => TaxService.get({ limit: 1, offset: 0 }).then(responseCount);
const loadWorkspace = () => OnboardingService.getStatus().then(getResponseData);
const loadCatalogAccess = () => PrivilegeService.checkPermission('product', 'edit')
  .then(response => response.data === true)
  .catch(error => {
    if (error && error.response && error.response.status === 403) return false;
    throw error;
  });

function useSettingsResource(loader) {
  const [attempt, setAttempt] = React.useState(0);
  const [state, setState] = React.useState({ loading: true, data: null, error: false });
  React.useEffect(() => {
    let active = true;
    setState({ loading: true, data: null, error: false });
    Promise.resolve().then(loader)
      .then(data => { if (active) setState({ loading: false, data, error: false }); })
      .catch(() => { if (active) setState({ loading: false, data: null, error: true }); });
    return () => { active = false; };
  }, [loader, attempt]);
  return { ...state, retry: () => setAttempt(value => value + 1) };
}

function CountBadge({ resource, label }) {
  if (resource.loading) return <Skeleton active title={false} paragraph={{ rows: 1, width: 58 }} />;
  return <span className="settings-entry-badge">{resource.data === null ? '—' : `${resource.data.toLocaleString()} ${label}`}</span>;
}

function ResourceError({ label, resource }) {
  if (!resource.error) return null;
  return <div className="settings-module-error" role="alert">
    <span>Unable to load {label.toLowerCase()}.</span>
    <button type="button" onClick={resource.retry} aria-label={`Retry ${label.toLowerCase()}`}><RefreshCw size={12} aria-hidden="true" />Retry</button>
  </div>;
}

export function ModuleSettingsCards({ search, onClearSearch, resources }) {
  const modules = filterSettingsModules(search);
  const { locations, taxes, workspace, catalogAccess } = resources;
  const details = workspace.data || {};
  const costMethods = { FIFO: 'FIFO', AVERAGE: 'Average cost', LIFO: 'LIFO' };
  const metric = key => {
    const counts = { locations: [locations, 'locations'], taxes: [taxes, 'tax rates'] };
    if (counts[key]) return <CountBadge resource={counts[key][0]} label={counts[key][1]} />;
    if (workspace.loading) return <Skeleton active title={false} paragraph={{ rows: 1, width: 58 }} />;
    if (key === 'costing') return <span className="settings-entry-badge">{costMethods[details.costCalculation] || '—'}</span>;
    if (key === 'currency') return <span className="settings-entry-badge">{details.currency && details.currency.code || '—'}</span>;
    return null;
  };
  const failures = {
    items: [['Catalog access', catalogAccess]],
    inventory: [['Location count', locations], ['Workspace details', workspace]],
    finance: [['Tax count', taxes], ['Workspace details', workspace]]
  };

  return <section aria-label="Module configuration">
    {modules.length ? <div className="settings-module-grid">
      {modules.map(module => {
        const ModuleIcon = icons[module.icon];
        const canConfigure = module.permission === 'catalog' && catalogAccess.data === true;
        return <article className={`settings-module-card settings-module-${module.tone}`} key={module.key} aria-labelledby={`module-${module.key}-title`} hidden={module.key === 'finance'}>
          <div className="settings-module-body">
            <div className="settings-module-top">
              <div className="settings-module-icon"><ModuleIcon size={25} strokeWidth={1.8} aria-hidden="true" /></div>
              <div className="settings-module-title">
                <h3 id={`module-${module.key}-title`}>{module.title}</h3>
                <span className="settings-module-category">{module.category}</span>
              </div>
            </div>
            <p className="settings-module-description">{module.description}</p>
            <ul className="settings-module-entries">
              {module.entries.map(entry => {
                const EntryIcon = icons[entry.icon];
                const available = entry.to && canConfigure;
                const content = <><EntryIcon size={18} strokeWidth={1.7} aria-hidden="true" /><span>{entry.title}</span></>;
                return <li key={entry.key}>
                  {available ? <Link className="settings-entry-label" to={entry.to}>{content}</Link> : <span className="settings-entry-label settings-entry-readonly" title={entry.to ? 'Editing access is required.' : 'This configuration screen is not available here.'}>{content}</span>}
                  <div className="settings-entry-meta">{entry.metric ? metric(entry.metric) : null}</div>
                </li>;
              })}
            </ul>
            {(failures[module.key] || []).map(([label, resource]) => <ResourceError key={label} label={label} resource={resource} />)}
          </div>
          <footer className="settings-module-footer">
            {module.footer && <span>{module.footer}</span>}
            {module.to && canConfigure
              ? <Link to={module.to} aria-label={`${module.action} ${module.title}`}>{module.action}<ChevronRight size={16} aria-hidden="true" /></Link>
              : <button type="button" disabled aria-label={`${module.action} ${module.title}`}>{module.action}<ChevronRight size={16} aria-hidden="true" /></button>}
          </footer>
        </article>;
      })}
    </div> : <div className="settings-modules-empty" role="status">
      <SearchX size={32} aria-hidden="true" />
      <h3>No settings found</h3>
      <p>Try a module name, setting, or keyword such as barcode, currency, or stock.</p>
      <button type="button" onClick={onClearSearch}>Clear search</button>
    </div>}
  </section>;
}

export default function ModuleSettings(props) {
  const locations = useSettingsResource(loadLocations);
  const taxes = useSettingsResource(loadTaxes);
  const workspace = useSettingsResource(loadWorkspace);
  const catalogAccess = useSettingsResource(loadCatalogAccess);
  return <ModuleSettingsCards {...props} resources={{ locations, taxes, workspace, catalogAccess }} />;
}
