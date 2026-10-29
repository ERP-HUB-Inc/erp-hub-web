export const SETTINGS_MODULES = [
  {
    key: 'items', title: 'Items Management', category: 'Core catalog', tone: 'blue', icon: 'Grid2X2',
    description: 'Configure product categories, multi-level variants, barcode rules, and measurement standards.',
    action: 'Configure', to: '/settings/categories', permission: 'catalog',
    entries: [
      { key: 'types', title: 'Item Type', icon: 'Shapes', to: '/settings/item-types', keywords: 'product service physical digital type' },
      { key: 'categories', title: 'Categories', icon: 'Tags', to: '/settings/categories', keywords: 'catalog classification nested product' },
      { key: 'brands', title: 'Brands & Makers', icon: 'Building2', to: '/settings/brands', keywords: 'manufacturer brand maker' },
      { key: 'units', title: 'Units of Measurement (UOM)', icon: 'Ruler', to: '/settings/units', keywords: 'unit measurement conversion piece kilogram' },
      { key: 'options', title: 'Item Option', icon: 'SlidersHorizontal', to: '/settings/options', keywords: 'attribute variant size color' }
    ]
  },
  {
    key: 'inventory', title: 'Inventory Settings', category: 'Stock policies', tone: 'green', icon: 'Package',
    description: 'Configure warehouses, stock levels, valuation logic, and multi-location inventory policies.',
    action: 'Manage', to: '/settings/locations', permission: 'catalog',
    entries: [
      { key: 'locations', title: 'Warehouse & Bins Setup', icon: 'Warehouse', to: '/settings/locations', keywords: 'branch location storage node', metric: 'locations' },
      { key: 'stock-alerts', title: 'Automated Stock Alerts', icon: 'Bell', keywords: 'reorder threshold notification out of stock' },
      { key: 'tracking', title: 'Lot, Batch & Serial Tracking', icon: 'ClipboardList', keywords: 'traceability lot batch serial' },
      { key: 'reconciliation', title: 'Reconciliation Cycles', icon: 'RefreshCw', keywords: 'stock count cycle audit inventory' },
      { key: 'costing', title: 'Costing Method (FIFO/Avg)', icon: 'Calculator', keywords: 'valuation first in first out average', metric: 'costing' }
    ]
  },
  {
    key: 'sales', title: 'Sales Configuration', category: 'Commerce', tone: 'amber', icon: 'ShoppingCart',
    description: 'Configure pricing, promotional discount schemes, territories, and point-of-sale registers.',
    action: 'Edit',
    entries: [
      { key: 'price-lists', title: 'Price Lists & Tiers', icon: 'CircleDollarSign', keywords: 'retail wholesale distribution pricing' },
      { key: 'discounts', title: 'Discount Rules & Bundles', icon: 'TicketPercent', keywords: 'promotion discount bundle offer' },
      { key: 'territories', title: 'Sales Territories & Zones', icon: 'MapPin', keywords: 'sales area region territory zone' },
      { key: 'social', title: 'Social Commerce Integration', icon: 'MessagesSquare', keywords: 'channel social online integration' },
      { key: 'registers', title: 'POS Terminal Registers', icon: 'Monitor', keywords: 'point of sale cashier device terminal register' }
    ]
  },
  {
    key: 'finance', title: 'Finance Setup', category: 'General ledger', tone: 'purple', icon: 'Landmark',
    description: 'Configure chart of accounts, tax rates, currencies, fiscal years, and payment accounts.',
    action: 'Review',
    entries: [
      { key: 'accounts', title: 'Chart of Accounts (COA)', icon: 'FileText', keywords: 'general ledger accounting financial' },
      { key: 'taxes', title: 'Tax & VAT Configuration', icon: 'ReceiptText', keywords: 'tax value added vat rate', metric: 'taxes' },
      { key: 'currencies', title: 'Multi-Currency Rates', icon: 'Globe2', keywords: 'currency exchange rate usd khr', metric: 'currency' },
      { key: 'payments', title: 'Payment Gateways & Cashiers', icon: 'CreditCard', keywords: 'bank payment wallet cashier gateway' },
      { key: 'numbering', title: 'Invoice Numbering Sequences', icon: 'Hash', keywords: 'invoice number sequence prefix receipt' }
    ]
  },
  {
    key: 'insights', title: 'Business Insights & Health', category: 'Strategy & AI', tone: 'teal', icon: 'ChartNoAxesCombined',
    description: 'Configure revenue targets, minimum profit margin thresholds, stock risk alert rules, and automated executive forecast models.',
    action: 'Configure',
    entries: [
      { key: 'targets', title: 'Sales Targets & Revenue Goals', icon: 'TrendingUp', keywords: 'target quota branch revenue goal' },
      { key: 'margins', title: 'Margin Health & Profit Floors', icon: 'CircleGauge', keywords: 'margin minimum profit floor threshold' },
      { key: 'stock-risk', title: 'Stock Risk & Buffer Policies', icon: 'TriangleAlert', keywords: 'stock risk buffer days policy inventory' },
      { key: 'executive-alerts', title: 'Executive Alert Triggers', icon: 'BellRing', keywords: 'executive alert notification trigger' },
      { key: 'forecast', title: 'Forecast & AI Run-Rate Model', icon: 'Zap', keywords: 'forecast artificial intelligence ai run rate prediction' }
    ]
  }
];

export function filterSettingsModules(query, modules = SETTINGS_MODULES) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return modules;
  return modules.reduce((result, module) => {
    const context = `${module.title} ${module.category} ${module.description}`.toLocaleLowerCase();
    const entries = module.entries.filter(entry => {
      const text = `${context} ${entry.title} ${entry.keywords || ''}`.toLocaleLowerCase();
      return words.every(word => text.includes(word));
    });
    if (entries.length) result.push({ ...module, entries });
    return result;
  }, []);
}

export function responseCount(response) {
  const body = response && response.data;
  const total = body && (body.pagination ? body.pagination.total : body.total);
  if (typeof total !== 'number' || !Number.isSafeInteger(total) || total < 0) {
    throw new Error('Count unavailable');
  }
  return total;
}
