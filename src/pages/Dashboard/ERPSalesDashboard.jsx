import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Select } from "antd";
import moment from "moment";
import * as _ from "lodash";
import Util from "@common/util/index";
import InventoryService from "@services/report.inventory";
import DashboardService from "@services/dashboard";
import { SelectPeriodOption } from "@components/stateless/select-period-option"; // Will be used in ERPSalesDashboard
import { Translate } from "react-localize-redux"; // Will be used in ERPSalesDashboard


// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const T = {
  purple:       "#6C47FF",
  purpleDark:   "#4F2FD4",
  purpleLight:  "#EAE4FF",
  purpleFade:   "#F5F2FF",
  teal:         "#00C9A7",
  tealLight:    "#DFFAF5",
  tealDark:     "#009E84",
  bg:           "#F4F3FA",
  card:         "#FFFFFF",
  sidebar:      "#1C1638",
  sidebarHover: "#2D2550",
  text:         "#16112E",
  muted:        "#8B87A8",
  border:       "#ECEAF5",
  red:          "#FF5C7C",
  redLight:     "#FFF0F3",
  amber:        "#FFB547",
  amberLight:   "#FFF8EC",
  green:        "#00C9A7",
  greenLight:   "#E6FAF7",
  white:        "#FFFFFF",
};

const FONT = "'Plus Jakarta Sans', 'Nunito', 'Segoe UI', sans-serif";

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const revenueData = [
  { month: "Jan សួស្តី", revenue: 52400, costs: 31000, profit: 21400 },
  { month: "Feb", revenue: 57200, costs: 22000, profit: 35200 },
  { month: "Mar", revenue: 65800, costs: 36000, profit: 29800 },
  { month: "Apr", revenue: 63100, costs: 32000, profit: 31100 },
  { month: "May", revenue: 61000, costs: 12000, profit: 49000 },
  { month: "Jun", revenue: 72500, costs: 48000, profit: 24500 },
  { month: "Jul", revenue: 84200, costs: 56000, profit: 28200 },
  { month: "Aug", revenue: 95000, costs: 58000, profit: 37000 },
  { month: "Sep", revenue: 62000, costs: 21000, profit: 41000 },
  { month: "Oct", revenue: 96200, costs: 39000, profit: 57200 },
  { month: "Nov", revenue: 108000, costs: 49000, profit: 59000 },
  { month: "Dec", revenue: 109500, costs: 51000, profit: 58500 },
];

const weeklyTrend = [
  { day: "Mon", sales: 4200 }, { day: "Tue", sales: 6800 },
  { day: "Wed", sales: 5100 }, { day: "Thu", sales: 8900 },
  { day: "Fri", sales: 7400 }, { day: "Sat", sales: 3200 },
  { day: "Sun", sales: 2800 },
];

const categoryData = [
  { name: "Electronics",  value: 38, amount: 8692, color: T.purple },
  { name: "Apparel",      value: 24, amount: 5498, color: T.teal },
  { name: "Groceries",    value: 18, amount: 4120, color: T.amber },
  { name: "Home & Living",value: 12, amount: 2748, color: "#A78BFA" },
  { name: "Others",       value: 8,  amount: 1834, color: "#CBD5E1" },
];

const transactions = [
  { id: "#TXN-00481", customer: "Sophea Morn",   product: "MacBook Air M2",      category: "Electronics", amount: 1299, status: "completed", time: "2 min ago",  avatar: "SM" },
  { id: "#TXN-00480", customer: "Dara Pich",     product: "Nike Air Force 1",    category: "Apparel",     amount: 120,  status: "completed", time: "18 min ago", avatar: "DP" },
  { id: "#TXN-00479", customer: "Lin Vannak",    product: "Sony WH-1000XM5",     category: "Electronics", amount: 348,  status: "pending",   time: "34 min ago", avatar: "LV" },
  { id: "#TXN-00478", customer: "Chenda Kim",    product: "IKEA Desk Lamp",      category: "Home & Living",amount: 45,   status: "completed", time: "1 hr ago",   avatar: "CK" },
  { id: "#TXN-00477", customer: "Ratanak Heng",  product: "Organic Rice 10kg",   category: "Groceries",   amount: 28,   status: "refunded",  time: "2 hr ago",   avatar: "RH" },
  { id: "#TXN-00476", customer: "Bopha Srey",    product: "iPad Pro 11\"",       category: "Electronics", amount: 999,  status: "completed", time: "3 hr ago",   avatar: "BS" },
  { id: "#TXN-00475", customer: "Vibol Chan",    product: "Adidas Ultraboost",   category: "Apparel",     amount: 180,  status: "pending",   time: "4 hr ago",   avatar: "VC" },
  { id: "#TXN-00474", customer: "Sreymom Keo",   product: "Coffee Machine",      category: "Home & Living",amount: 220,  status: "completed", time: "5 hr ago",   avatar: "SK" },
];

const navItems = [
  { icon: "⊞", label: "Dashboard",    active: true  },
  { icon: "📦", label: "Products",     active: false },
  { icon: "🛒", label: "Orders",       active: false },
  { icon: "👥", label: "Customers",    active: false },
  { icon: "📊", label: "Analytics",    active: false },
  { icon: "💳", label: "Payments",     active: false },
  { icon: "⚙️", label: "Settings",    active: false },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const usd = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 0 });
const fmtK = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

const statusConfig = {
  completed: { color: T.teal,  bg: T.tealLight,  label: "Completed" },
  pending:   { color: T.amber, bg: T.amberLight, label: "Pending"   },
  refunded:  { color: T.red,   bg: T.redLight,   label: "Refunded"  },
};

const avatarColors = [
  ["#EAE4FF","#6C47FF"], ["#DFFAF5","#009E84"], ["#FFF8EC","#CC8800"],
  ["#FFE4EC","#CC2244"], ["#E0F2FE","#0369A1"],
];
const getAvatarColor = (i) => avatarColors[i % avatarColors.length];

// ─────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────
function AnimatedNumber({ target, prefix = "", suffix = "", duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ─────────────────────────────────────────────
// SPARKLINE (mini trend inside stat card)
// ─────────────────────────────────────────────
function Sparkline({ data, color, up }) {
  const vals = data.map((d) => d.sales || d.revenue || d.profit || 0);
  const min = Math.min(...vals), max = Math.max(...vals);
  const norm = vals.map((v) => ((v - min) / (max - min || 1)) * 36);
  const pts = norm.map((v, i) => `${(i / (norm.length - 1)) * 80},${40 - v}`).join(" ");
  return (
    <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
      <polyline points={pts} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={80} cy={40 - norm[norm.length - 1]} r="3" fill={color} />
    </svg>
  );
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
function StatCard({ label, value, prefix, delta, up, sublabel, sparkData, sparkColor, delay = 0 }) {
  return (
    <div style={{ ...s.card, animationDelay: `${delay}ms`, animation: "fadeUp 0.5s ease both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={s.cardLabel}>{label}</div>
          <div style={s.cardValue}>
            <AnimatedNumber target={value} prefix={prefix} duration={1000 + delay} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <span style={{ color: up ? T.teal : T.red, fontSize: 12, fontWeight: 700, background: up ? T.tealLight : T.redLight, padding: "2px 8px", borderRadius: 20 }}>
              {up ? "▲" : "▼"} {delta}
            </span>
            <span style={{ fontSize: 12, color: T.muted }}>{sublabel}</span>
          </div>
        </div>
        <Sparkline data={sparkData} color={sparkColor} up={up} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CUSTOM TOOLTIP
// ─────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={s.tooltip}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: T.text, fontSize: 13 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, padding: "2px 0" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ color: T.muted, flex: 1 }}>{p.name}</span>
          <span style={{ fontWeight: 700, color: T.text }}>{fmtK(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// CATEGORY DONUT + LIST
// ─────────────────────────────────────────────
function CategorySection() {
  const [categoryDateRange, setCategoryDateRange] = useState("This Month"); // Add state for this select
  const total = categoryData.reduce((s, d) => s + d.amount, 0);
  return (
    <div style={s.card}>
      <div style={s.sectionHeader}>
        <span style={s.sectionTitle}>Sales by Category</span>
        <Select value={categoryDateRange} onChange={value => setCategoryDateRange(value)} style={{ width: 120 }}>
          <Select.Option value="This Month">This Month</Select.Option>
          <Select.Option value="Last Month">Last Month</Select.Option>
          <Select.Option value="This Year">This Year</Select.Option>
        </Select>
      </div>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ flexShrink: 0 }}>
          <PieChart width={160} height={160}>
            <Pie data={categoryData} cx={75} cy={75} innerRadius={48} outerRadius={72}
              startAngle={90} endAngle={-270} paddingAngle={2} dataKey="value" strokeWidth={0}>
              {categoryData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {categoryData.map((cat, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{cat.name}</span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 12, color: T.muted }}>{usd(cat.amount)}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: cat.color, minWidth: 32, textAlign: "right" }}>{cat.value}%</span>
                </div>
              </div>
              <div style={{ height: 4, borderRadius: 4, background: T.border }}>
                <div style={{ height: 4, borderRadius: 4, background: cat.color, width: `${cat.value}%`, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
function Sidebar() {
  return (
    <div style={s.sidebar}>
      <div style={s.logo}>
        <div style={s.logoMark}>M</div>
        <div>
          <div style={{ color: T.white, fontSize: 14, fontWeight: 800, letterSpacing: "-0.3px" }}>MarketChain</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 500 }}>ERP v2.0</div>
        </div>
      </div>

      <div style={{ padding: "8px 0", flex: 1 }}>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", padding: "0 20px", marginBottom: 6 }}>MAIN MENU</div>
        {navItems.map((item) => (
          <div key={item.label} style={{ ...s.navItem, ...(item.active ? s.navItemActive : {}) }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ fontSize: 13, fontWeight: item.active ? 700 : 500 }}>{item.label}</span>
            {item.active && <div style={s.navIndicator} />}
          </div>
        ))}
      </div>

      <div style={s.sidebarUser}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.purple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: T.white, flexShrink: 0 }}>D</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: T.white, fontSize: 13, fontWeight: 700 }}>Dibbendo</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>admin@marketchain.kh</div>
        </div>
        <span style={{ color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>↗</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function ERPSalesDashboard() {
  const [option, setOption] = React.useState("today");
  const [dateRange, setDateRange] = useState("This Year");
  const [dashboardSummaries, setDashboardSummaries] = React.useState([]);

  React.useEffect(() => {
    DashboardService.getTodayTotal(option)
        .then(response => {
          if (response.data) {
            setDashboardSummaries(response.data);
          }
        });
  }, []);

  const getDashboardValue = (index, key) => {
    return dashboardSummaries.length > 0 ? dashboardSummaries[index][key] : 0;
  };
  console.log("dashboardSummaries", dashboardSummaries);
  const grossSales = getDashboardValue(0, "value") || 0;
  const revenue = getDashboardValue(0, "value") || 0;
  const totalItemCost = getDashboardValue(1, "value") || 0;
  const salesDiscount = getDashboardValue(2, "value") || 0;
  const grossProfit = getDashboardValue(3, "value") || 0;
  const grossProfitGrowth = getDashboardValue(3, "growthPercentage") || 0;
  const totalSales = getDashboardValue(4, "value") || 0;
  const totalSalesGrowth = getDashboardValue(4, "growthPercentage") || 0;
  const expense = getDashboardValue(5, "value") || 0;
  const revenueRisePercentage = getDashboardValue(0, "diffRevenueFromLLastAsPercentage") || 0;

  const diffSaleAsPercentage = getDashboardValue(0, "diffSaleFromLastAsPercentage") || 0;

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; }
        tr:hover td { background: ${T.bg}; }
        select:focus, button:focus { outline: 2px solid ${T.purple}; outline-offset: 2px; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      `}</style>

      {/* <Sidebar /> */}

      <div style={s.main}>
        {/* Top bar */}
        <div style={s.topbar}>
          <div>
            <div style={s.pageTitle}>Sales Dashboard</div>
            <div style={s.pageSub}>Monday, 30 May 2026 · Real-time data</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={s.searchBox}>
              <span style={{ color: T.muted }}>🔍</span>
              <input placeholder="Search transactions..." style={s.searchInput} />
            </div>
            <Select value={dateRange} onChange={value => setDateRange(value)} style={{ width: 120 }}>
              <Select.Option value="Today">Today</Select.Option>
              <Select.Option value="This Week">This Week</Select.Option>
              <Select.Option value="This Month">This Month</Select.Option>
              <Select.Option value="This Year">This Year</Select.Option>
            </Select>
            <button style={s.exportBtnPrimary}>↓ Export</button>
            <div style={s.notifBell}>🔔<span style={s.notifDot} /></div>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={s.statsGrid}>
          <StatCard label="Gross Sales" value={grossSales} prefix="$" delta="26% vs last year" up={true}  sublabel="vs last year" sparkData={revenueData} sparkColor={T.purple} delay={0}   />
          <StatCard label="Gross Profit" value={grossProfit} prefix="$" delta={`${grossProfitGrowth}%`} up={grossProfitGrowth > 0}  sublabel="vs last year" sparkData={revenueData} sparkColor={T.teal}   delay={80}  />
          <StatCard label="Total Orders" value={totalSales}  prefix=""  delta={`${totalSalesGrowth}%`} up={totalSalesGrowth > 0}  sublabel="new orders"   sparkData={weeklyTrend} sparkColor={T.purple} delay={160} />
          <StatCard label="Avg Order Value" value={8283} prefix="$" delta="2.4%" up={false} sublabel="this period"  sparkData={weeklyTrend} sparkColor={T.red}    delay={240} />
        </div>

        {/* Charts Row 1: Area + Weekly Bar */}
        <div style={s.chartsRow}>
          <div style={{ ...s.card, flex: 2 }}>
            <div style={s.sectionHeader}>
              <span style={s.sectionTitle}>Revenue vs Costs vs Profit</span>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                {[["Revenue", T.purple], ["Costs", T.teal], ["Profit", T.amber]].map(([n, c]) => (
                  <span key={n} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: T.muted }}>
                    <span style={{ width: 24, height: 3, borderRadius: 2, background: c, display: "inline-block" }} />{n}
                  </span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={revenueData} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={T.purple} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={T.purple} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={T.teal} stopOpacity={0.14} />
                    <stop offset="95%" stopColor={T.teal} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={T.amber} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={T.amber} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: T.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtK} tick={{ fill: T.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={T.purple} strokeWidth={2.5} fill="url(#gPurple)" dot={false} activeDot={{ r: 5, fill: T.purple }} />
                <Area type="monotone" dataKey="costs"   name="Costs"   stroke={T.teal}   strokeWidth={2}   fill="url(#gTeal)"   dot={false} activeDot={{ r: 5, fill: T.teal   }} />
                <Area type="monotone" dataKey="profit"  name="Profit"  stroke={T.amber}  strokeWidth={2}   fill="url(#gAmber)"  dot={false} activeDot={{ r: 5, fill: T.amber  }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...s.card, flex: 1 }}>
            <div style={s.sectionHeader}>
              <span style={s.sectionTitle}>Weekly Sales</span>
              <span style={{ fontSize: 12, color: T.teal, fontWeight: 700 }}>This Week</span>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={weeklyTrend} margin={{ top: 8, right: 4, left: -16, bottom: 0 }} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: T.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtK} tick={{ fill: T.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: T.purpleFade, radius: 4 }} />
                <Bar dataKey="sales" name="Sales" radius={[6, 6, 0, 0]}>
                  {weeklyTrend.map((_, i) => (
                    <Cell key={i} fill={i === 3 ? T.purple : T.purpleLight} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2: Category + Goal Cards */}
        <div style={s.chartsRow}>
          <div style={{ flex: 1.4 }}>
            <CategorySection />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Monthly Goal Card */}
            <div style={s.card}>
              <div style={s.sectionHeader}>
                <span style={s.sectionTitle}>Monthly Goal</span>
                <span style={{ fontSize: 12, color: T.muted }}>May 2026</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: T.text }}>$72,500</span>
                <span style={{ fontSize: 13, color: T.muted }}>/ $100,000</span>
              </div>
              <div style={{ height: 8, background: T.border, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "72.5%", background: `linear-gradient(90deg, ${T.purple}, ${T.teal})`, borderRadius: 8, transition: "width 1.2s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 12, color: T.teal, fontWeight: 700 }}>72.5% achieved</span>
                <span style={{ fontSize: 12, color: T.muted }}>$27,500 remaining</span>
              </div>
            </div>

            
          </div>
        </div>

        
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const s = {
  root: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: FONT,
    background: T.bg,
  },
  sidebar: {
    width: 220,
    background: T.sidebar,
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    position: "sticky",
    top: 0,
    height: "100vh",
    overflow: "hidden",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "24px 20px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: T.purple,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: T.white,
    fontWeight: 900,
    fontSize: 18,
    flexShrink: 0,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 20px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.45)",
    position: "relative",
    transition: "all 0.15s",
  },
  navItemActive: {
    color: T.white,
    background: "rgba(255,255,255,0.07)",
    borderRadius: 0,
  },
  navIndicator: {
    position: "absolute",
    right: 0,
    top: "20%",
    height: "60%",
    width: 3,
    background: T.purple,
    borderRadius: "3px 0 0 3px",
  },
  sidebarUser: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "16px 18px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  main: {
    flex: 1,
    padding: "24px 28px",
    overflowX: "hidden",
    minWidth: 0,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
    flexWrap: "wrap",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: T.text,
    letterSpacing: "-0.5px",
  },
  pageSub: {
    fontSize: 13,
    color: T.muted,
    marginTop: 3,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: "7px 14px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: 13,
    color: T.text,
    background: "transparent",
    width: 180,
    fontFamily: FONT,
  },
  select: {
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: "7px 12px",
    fontSize: 13,
    color: T.text,
    background: T.card,
    cursor: "pointer",
    fontFamily: FONT,
    fontWeight: 500,
  },
  exportBtnPrimary: {
    background: T.purple,
    color: T.white,
    border: "none",
    borderRadius: 10,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: FONT,
  },
  notifBell: {
    position: "relative",
    width: 38,
    height: 38,
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 16,
  },
  notifDot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    background: T.red,
    borderRadius: "50%",
    border: `2px solid ${T.card}`,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
    marginBottom: 16,
  },
  card: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: "20px 22px",
  },
  cardLabel: {
    fontSize: 12,
    color: T.muted,
    fontWeight: 600,
    letterSpacing: "0.03em",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  cardValue: {
    fontSize: 26,
    fontWeight: 800,
    color: T.text,
    letterSpacing: "-0.5px",
    lineHeight: 1.1,
  },
  chartsRow: {
    display: "flex",
    gap: 14,
    marginBottom: 16,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: T.text,
  },
  tooltip: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "12px 16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    minWidth: 160,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    padding: "0 14px 12px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: T.muted,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px 14px",
    color: T.text,
    borderBottom: `1px solid ${T.border}`,
    whiteSpace: "nowrap",
    transition: "background 0.1s",
  },
  tr: {
    cursor: "pointer",
  },
  filterBtn: {
    border: `1px solid ${T.border}`,
    background: T.card,
    borderRadius: 8,
    padding: "5px 12px",
    fontSize: 12,
    color: T.muted,
    cursor: "pointer",
    fontFamily: FONT,
    fontWeight: 500,
  },
  filterBtnActive: {
    background: T.purpleFade,
    color: T.purple,
    borderColor: T.purpleLight,
    fontWeight: 700,
  },
  exportBtn: {
    border: `1px solid ${T.border}`,
    background: T.card,
    borderRadius: 8,
    padding: "5px 14px",
    fontSize: 12,
    color: T.muted,
    cursor: "pointer",
    fontFamily: FONT,
    marginLeft: 4,
  },
};
