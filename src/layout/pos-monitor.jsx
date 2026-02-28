
// ============================================================
// POS Monitoring Dashboard — Production React + TypeScript
// All layers: types, services, hooks, components, pages
// Author: Senior Full-Stack Engineer
// ============================================================

import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";

// ─────────────────────────────────────────────
// MOCK DATA (replace with real API via Axios + React Query)
// ─────────────────────────────────────────────
const MOCK_CLIENTS = Array.from({ length: 48 }, (_, i) => ({
  id: `uuid-${i + 1}`,
  name: [
    "Lotus Bistro", "Golden Wok", "Mekong Grill", "Phnom Kitchen", "Bayon Café",
    "Angkor Spice", "River House", "Silk Road", "Kampot Pepper", "Riverside Dine",
    "Bamboo Garden", "Palace Grill", "Moon Kitchen", "Sunset BBQ", "Orchid House",
    "Dragon Bowl", "Crystal Lounge", "Heritage Eats", "Monsoon Diner", "Jade Palace",
  ][i % 20] + (i >= 20 ? ` ${Math.floor(i / 20) + 1}` : ""),
  code: `R${String(i + 1).padStart(3, "0")}`,
  province: ["Phnom Penh", "Siem Reap", "Battambang", "Kampot", "Sihanoukville"][i % 5],
  city: ["Chamkar Mon", "Daun Penh", "Toul Kork", "Boeung Keng Kang", "Por Sen Chey"][i % 5],
  planType: ["premium", "basic", "enterprise", "starter"][i % 4],
  version: ["1.2.3", "1.2.2", "1.1.9", "1.2.3", "1.0.5"][i % 5],
  cpuUsage: Math.floor(Math.random() * 95) + 5,
  ramUsage: Math.floor(Math.random() * 90) + 10,
  diskUsage: Math.floor(Math.random() * 85) + 15,
  isOnline: Math.random() > 0.25,
  lastSeenAt: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
  uptime: Math.floor(Math.random() * 864000),
  services: [
    { name: "POS Backend", status: Math.random() > 0.1 ? "running" : "stopped" },
    { name: "Local Database", status: Math.random() > 0.05 ? "running" : "stopped" },
    { name: "Monitoring Agent", status: Math.random() > 0.08 ? "running" : "stopped" },
    { name: "Print Service", status: Math.random() > 0.15 ? "running" : "stopped" },
    { name: "Sync Worker", status: Math.random() > 0.12 ? "running" : "stopped" },
  ],
}));

const LATEST_VERSION = "1.2.3";
const PAGE_SIZE = 10;

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────
function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatUptime(seconds) {
  if (!seconds) return "N/A";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ─────────────────────────────────────────────
// MOCK API SERVICE (simulates Axios + REST)
// ─────────────────────────────────────────────
async function fetchClients(filters) {
  await new Promise((r) => setTimeout(r, 600));
  let data = [...MOCK_CLIENTS];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    data = data.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }
  if (filters.province) data = data.filter((c) => c.province === filters.province);
  if (filters.city) data = data.filter((c) => c.city === filters.city);
  if (filters.planType) data = data.filter((c) => c.planType === filters.planType);
  if (filters.status === "online") data = data.filter((c) => c.isOnline);
  if (filters.status === "offline") data = data.filter((c) => !c.isOnline);
  if (filters.version) data = data.filter((c) => c.version === filters.version);
  if (filters.cpu_gt) data = data.filter((c) => c.cpuUsage > Number(filters.cpu_gt));
  if (filters.ram_gt) data = data.filter((c) => c.ramUsage > Number(filters.ram_gt));

  const total = data.length;
  const page = filters.page || 1;
  const limit = filters.limit || PAGE_SIZE;
  const paginated = data.slice((page - 1) * limit, page * limit);

  return { data: paginated, total };
}

async function fetchClientById(id) {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_CLIENTS.find((c) => c.id === id) || null;
}

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────
function useClients(filters) {
  const [state, setState] = useState({ data: [], total: 0, loading: true, error: null });
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const result = await fetchClients(filtersRef.current);
      setState({ data: result.data, total: result.total, loading: false, error: null });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: "Failed to load clients." }));
    }
  }, []);

  useEffect(() => { load(); }, [filters, load]);

  useEffect(() => {
    const interval = setInterval(() => load(), 30000);
    return () => clearInterval(interval);
  }, [load]);

  return { ...state, refetch: load };
}

function useClientDetail(id) {
  const [state, setState] = useState({ client: null, loading: false, error: null });

  useEffect(() => {
    if (!id) { setState({ client: null, loading: false, error: null }); return; }
    setState({ client: null, loading: true, error: null });
    fetchClientById(id)
      .then((client) => setState({ client, loading: false, error: null }))
      .catch(() => setState({ client: null, loading: false, error: "Failed to load details." }));
  }, [id]);

  return state;
}

// ─────────────────────────────────────────────
// STYLE HELPERS
// ─────────────────────────────────────────────
const usageColor = (val) => {
  if (val > 80) return "#ef4444";
  if (val > 60) return "#f59e0b";
  return "#10b981";
};

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

// ── Skeleton
const Skeleton = memo(({ w = "100%", h = "16px", radius = "6px", style = {} }) => (
  <div style={{
    width: w, height: h, borderRadius: radius, background: "linear-gradient(90deg, #1e293b 25%, #263548 50%, #1e293b 75%)",
    backgroundSize: "200% 100%", animation: "shimmer 1.4s ease infinite", ...style
  }} />
));

// ── Stat Card
const StatCard = memo(({ label, value, icon, accent, sub }) => (
  <div style={{
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    border: `1px solid ${accent}22`,
    borderRadius: 16, padding: "24px 28px", position: "relative", overflow: "hidden",
    boxShadow: `0 0 0 1px ${accent}11, 0 8px 32px #00000040`,
    transition: "transform 0.2s",
  }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
  >
    <div style={{
      position: "absolute", right: -16, top: -16, width: 80, height: 80,
      borderRadius: "50%", background: `${accent}15`, filter: "blur(20px)"
    }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 13, color: "#64748b", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 38, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: accent, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 28, opacity: 0.7 }}>{icon}</div>
    </div>
    <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, transparent)`, borderRadius: 3, marginTop: 20 }} />
  </div>
));

// ── Progress Bar
const ProgressBar = memo(({ value, size = "md" }) => {
  const color = usageColor(value);
  const h = size === "sm" ? 5 : 8;
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color, fontFamily: "'DM Mono', monospace" }}>{value}%</span>
      </div>
      <div style={{ height: h, background: "#1e293b", borderRadius: 100, overflow: "hidden", border: "1px solid #334155" }}>
        <div style={{
          height: "100%", width: `${value}%`, borderRadius: 100,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          transition: "width 0.6s ease",
          boxShadow: value > 80 ? `0 0 8px ${color}88` : "none",
        }} />
      </div>
    </div>
  );
});

// ── Badge
const Badge = ({ children, variant = "default" }) => {
  const colors = {
    online: { bg: "#10b98120", color: "#10b981", border: "#10b98140" },
    offline: { bg: "#ef444420", color: "#ef4444", border: "#ef444440" },
    premium: { bg: "#a855f720", color: "#a855f7", border: "#a855f740" },
    enterprise: { bg: "#3b82f620", color: "#60a5fa", border: "#3b82f640" },
    basic: { bg: "#64748b20", color: "#94a3b8", border: "#64748b40" },
    starter: { bg: "#f59e0b20", color: "#fbbf24", border: "#f59e0b40" },
    outdated: { bg: "#f59e0b20", color: "#f59e0b", border: "#f59e0b40" },
    default: { bg: "#1e293b", color: "#94a3b8", border: "#334155" },
    running: { bg: "#10b98115", color: "#10b981", border: "#10b98130" },
    stopped: { bg: "#ef444415", color: "#ef4444", border: "#ef444430" },
  };
  const c = colors[variant] || colors.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 10px", borderRadius: 100, fontSize: 11,
      fontWeight: 600, letterSpacing: "0.04em",
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      fontFamily: "'DM Sans', sans-serif",
    }}>{children}</span>
  );
};

// ── Filter Panel
const FilterPanel = memo(({ filters, onChange, onReset }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => { onChange({ search: debouncedSearch }); }, [debouncedSearch]);

  const select = (key, value) => onChange({ [key]: value, page: 1 });

  const inputStyle = {
    background: "#0f172a", border: "1px solid #334155", borderRadius: 10,
    color: "#f1f5f9", padding: "10px 14px", fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", width: "100%", outline: "none",
    transition: "border-color 0.2s",
  };

  const provinces = [...new Set(MOCK_CLIENTS.map(c => c.province))];
  const cities = [...new Set(MOCK_CLIENTS.map(c => c.city))];
  const versions = [...new Set(MOCK_CLIENTS.map(c => c.version))];
  const plans = ["premium", "enterprise", "basic", "starter"];

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      border: "1px solid #1e3a5f", borderRadius: 16, padding: 24,
      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: 12, alignItems: "end",
    }}>
      <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {/* Search */}
        <div>
          <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans', sans-serif" }}>Search</label>
          <input
            style={inputStyle} placeholder="Name or code..."
            value={localSearch} onChange={e => setLocalSearch(e.target.value)}
            onFocus={e => e.target.style.borderColor = "#3b82f6"}
            onBlur={e => e.target.style.borderColor = "#334155"}
          />
        </div>

        {/* Province */}
        <div>
          <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans', sans-serif" }}>Province</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={filters.province || ""} onChange={e => select("province", e.target.value)}>
            <option value="">All Provinces</option>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* City */}
        <div>
          <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans', sans-serif" }}>City</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={filters.city || ""} onChange={e => select("city", e.target.value)}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Plan */}
        <div>
          <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans', sans-serif" }}>Plan</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={filters.planType || ""} onChange={e => select("planType", e.target.value)}>
            <option value="">All Plans</option>
            {plans.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Status */}
        <div>
          <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans', sans-serif" }}>Status</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={filters.status || ""} onChange={e => select("status", e.target.value)}>
            <option value="">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Version */}
        <div>
          <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans', sans-serif" }}>Version</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={filters.version || ""} onChange={e => select("version", e.target.value)}>
            <option value="">All Versions</option>
            {versions.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        {/* CPU gt */}
        <div>
          <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans', sans-serif" }}>CPU &gt;</label>
          <input
            style={inputStyle} type="number" placeholder="e.g. 80"
            value={filters.cpu_gt || ""} onChange={e => select("cpu_gt", e.target.value)}
            onFocus={e => e.target.style.borderColor = "#3b82f6"}
            onBlur={e => e.target.style.borderColor = "#334155"}
          />
        </div>

        {/* RAM gt */}
        <div>
          <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'DM Sans', sans-serif" }}>RAM &gt;</label>
          <input
            style={inputStyle} type="number" placeholder="e.g. 70"
            value={filters.ram_gt || ""} onChange={e => select("ram_gt", e.target.value)}
            onFocus={e => e.target.style.borderColor = "#3b82f6"}
            onBlur={e => e.target.style.borderColor = "#334155"}
          />
        </div>

        {/* Reset */}
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={onReset}
            style={{
              background: "transparent", border: "1px solid #334155", borderRadius: 10,
              color: "#94a3b8", padding: "10px 20px", fontSize: 13, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", width: "100%", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.target.style.borderColor = "#ef4444"; e.target.style.color = "#ef4444"; }}
            onMouseLeave={e => { e.target.style.borderColor = "#334155"; e.target.style.color = "#94a3b8"; }}
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  );
});

// ── Client Detail Modal
const ClientDetailModal = ({ clientId, onClose }) => {
  const { client, loading, error } = useClientDetail(clientId);

  if (!clientId) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#00000090", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 24, animation: "fadeIn 0.2s ease",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "linear-gradient(135deg, #0d1929 0%, #1e293b 100%)",
        border: "1px solid #1e3a5f", borderRadius: 20, width: "100%", maxWidth: 680,
        maxHeight: "90vh", overflow: "auto", boxShadow: "0 32px 80px #00000080",
        animation: "slideUp 0.3s ease",
      }}>
        {/* Header */}
        <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <Skeleton w="200px" h="24px" />
              <Skeleton w="120px" h="16px" />
            </div>
          ) : client ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: "50%",
                  background: client.isOnline ? "#10b981" : "#ef4444",
                  boxShadow: client.isOnline ? "0 0 10px #10b98180" : "0 0 10px #ef444480",
                }} />
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Syne', sans-serif", margin: 0 }}>{client.name}</h2>
                <Badge variant={client.planType}>{client.planType}</Badge>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'DM Mono', monospace" }}>{client.code}</span>
                <span style={{ fontSize: 13, color: "#64748b" }}>{client.province} · {client.city}</span>
              </div>
            </div>
          ) : null}
          <button onClick={onClose} style={{
            background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
            color: "#64748b", width: 36, height: 36, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = "#ef444420"; e.target.style.color = "#ef4444"; }}
            onMouseLeave={e => { e.target.style.background = "#1e293b"; e.target.style.color = "#64748b"; }}
          >×</button>
        </div>

        {loading ? (
          <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
            {[1, 2, 3].map(i => <Skeleton key={i} h="60px" radius="12px" />)}
          </div>
        ) : error ? (
          <div style={{ padding: 48, textAlign: "center", color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>{error}</div>
        ) : client ? (
          <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Resource Usage */}
            <section>
              <h3 style={{ fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>Resource Usage</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { label: "CPU", value: client.cpuUsage },
                  { label: "RAM", value: client.ramUsage },
                  { label: "Disk", value: client.diskUsage },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "16px 20px" }}>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                    <ProgressBar value={value} size="sm" />
                  </div>
                ))}
              </div>
            </section>

            {/* Info Grid */}
            <section>
              <h3 style={{ fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Version", value: <span style={{ display: "flex", alignItems: "center", gap: 8 }}>{client.version} {client.version !== LATEST_VERSION && <Badge variant="outdated">Outdated</Badge>}</span> },
                  { label: "Plan", value: <Badge variant={client.planType}>{client.planType}</Badge> },
                  { label: "Last Heartbeat", value: timeAgo(client.lastSeenAt) },
                  { label: "Uptime", value: formatUptime(client.uptime) },
                  { label: "Status", value: <Badge variant={client.isOnline ? "online" : "offline"}>{client.isOnline ? "Online" : "Offline"}</Badge> },
                  { label: "Location", value: `${client.province}, ${client.city}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "12px 16px" }}>
                    <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                    <div style={{ fontSize: 14, color: "#e2e8f0", fontFamily: client.version === value ? "'DM Mono', monospace" : "'DM Sans', sans-serif" }}>{value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Services */}
            <section>
              <h3 style={{ fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>Services</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {client.services.map((svc) => (
                  <div key={svc.name} style={{
                    background: "#0f172a", border: "1px solid #1e293b",
                    borderRadius: 10, padding: "12px 16px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontSize: 14, color: "#cbd5e1", fontFamily: "'DM Sans', sans-serif" }}>{svc.name}</span>
                    <Badge variant={svc.status}>{svc.status}</Badge>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ── Table Skeleton Rows
const TableSkeletonRows = ({ count = 5 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <tr key={i}>
        {[36, 70, 140, 100, 80, 80, 120, 120, 90, 80].map((w, j) => (
          <td key={j} style={{ padding: "16px 14px", borderBottom: "1px solid #1e293b" }}>
            <Skeleton w={`${w}px`} h="16px" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

// ── Clients Table
const ClientsTable = memo(({ data, loading, error, total, page, onPageChange, onViewDetail }) => {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const thStyle = {
    padding: "12px 14px", textAlign: "left", fontSize: 11, color: "#475569",
    textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif",
    borderBottom: "1px solid #1e293b", background: "#0a1628", whiteSpace: "nowrap",
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", border: "1px solid #1e3a5f", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr>
              {["Status", "Code", "Name", "Province", "Plan", "Version", "CPU", "RAM", "Last Seen", ""].map((h, i) => (
                <th key={i} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeletonRows />
            ) : error ? (
              <tr>
                <td colSpan={10} style={{ padding: 64, textAlign: "center" }}>
                  <div style={{ color: "#ef4444", fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>⚠ {error}</div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: 64, textAlign: "center" }}>
                  <div style={{ color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                    <div style={{ fontSize: 16, color: "#64748b" }}>No clients found</div>
                    <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>Try adjusting your filters</div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((client) => {
                const offline = !client.isOnline;
                const outdated = client.version !== LATEST_VERSION;
                return (
                  <tr key={client.id} style={{
                    background: offline ? "#ef444408" : "transparent",
                    borderLeft: offline ? "3px solid #ef444440" : "3px solid transparent",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = offline ? "#ef444415" : "#ffffff08"}
                    onMouseLeave={e => e.currentTarget.style.background = offline ? "#ef444408" : "transparent"}
                  >
                    <td style={{ padding: "14px 14px", borderBottom: "1px solid #1e293b10" }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: "50%", margin: "0 auto",
                        background: client.isOnline ? "#10b981" : "#ef4444",
                        boxShadow: client.isOnline ? "0 0 8px #10b98180" : "none",
                        animation: client.isOnline ? "pulse 2s ease infinite" : "none",
                      }} />
                    </td>
                    <td style={{ padding: "14px 14px", borderBottom: "1px solid #1e293b10" }}>
                      <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'DM Mono', monospace" }}>{client.code}</span>
                    </td>
                    <td style={{ padding: "14px 14px", borderBottom: "1px solid #1e293b10" }}>
                      <span style={{ fontSize: 14, color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{client.name}</span>
                    </td>
                    <td style={{ padding: "14px 14px", borderBottom: "1px solid #1e293b10" }}>
                      <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>{client.province}</span>
                    </td>
                    <td style={{ padding: "14px 14px", borderBottom: "1px solid #1e293b10" }}>
                      <Badge variant={client.planType}>{client.planType}</Badge>
                    </td>
                    <td style={{ padding: "14px 14px", borderBottom: "1px solid #1e293b10" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>{client.version}</span>
                        {outdated && <Badge variant="outdated">!</Badge>}
                      </div>
                    </td>
                    <td style={{ padding: "14px 14px", borderBottom: "1px solid #1e293b10", minWidth: 120 }}>
                      <ProgressBar value={client.cpuUsage} size="sm" />
                    </td>
                    <td style={{ padding: "14px 14px", borderBottom: "1px solid #1e293b10", minWidth: 120 }}>
                      <ProgressBar value={client.ramUsage} size="sm" />
                    </td>
                    <td style={{ padding: "14px 14px", borderBottom: "1px solid #1e293b10" }}>
                      <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>{timeAgo(client.lastSeenAt)}</span>
                    </td>
                    <td style={{ padding: "14px 14px", borderBottom: "1px solid #1e293b10" }}>
                      <button
                        onClick={() => onViewDetail(client.id)}
                        style={{
                          background: "#1e3a5f", border: "1px solid #2563eb40", borderRadius: 8,
                          color: "#60a5fa", fontSize: 12, padding: "6px 14px", cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", whiteSpace: "nowrap",
                        }}
                        onMouseEnter={e => { e.target.style.background = "#2563eb"; e.target.style.color = "#fff"; }}
                        onMouseLeave={e => { e.target.style.background = "#1e3a5f"; e.target.style.color = "#60a5fa"; }}
                      >View →</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 24px", borderTop: "1px solid #1e293b",
        }}>
          <span style={{ fontSize: 13, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
            Page {page} of {totalPages} · {total} total
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p;
              if (totalPages <= 7) p = i + 1;
              else if (page <= 4) p = i + 1;
              else if (page >= totalPages - 3) p = totalPages - 6 + i;
              else p = page - 3 + i;

              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  style={{
                    width: 34, height: 34, borderRadius: 8, border: "1px solid",
                    borderColor: p === page ? "#3b82f6" : "#1e293b",
                    background: p === page ? "#3b82f6" : "transparent",
                    color: p === page ? "#fff" : "#64748b",
                    fontSize: 13, cursor: "pointer", transition: "all 0.15s",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >{p}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
const DEFAULT_FILTERS = { search: "", province: "", city: "", planType: "", status: "", version: "", cpu_gt: "", ram_gt: "", page: 1, limit: PAGE_SIZE };

export default function POSMonitor() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const { data, total, loading, error, refetch } = useClients(filters);

  // Stats derived from ALL clients (not paginated)
  const stats = useMemo(() => ({
    total: MOCK_CLIENTS.length,
    online: MOCK_CLIENTS.filter(c => c.isOnline).length,
    offline: MOCK_CLIENTS.filter(c => !c.isOnline).length,
    highCpu: MOCK_CLIENTS.filter(c => c.cpuUsage > 80).length,
  }), []);

  const handleFilterChange = useCallback((changes) => {
    setFilters(prev => ({ ...prev, ...changes, page: changes.page ?? 1 }));
  }, []);

  const handleReset = useCallback(() => { setFilters(DEFAULT_FILTERS); }, []);

  useEffect(() => {
    const interval = setInterval(() => setLastRefreshed(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#060d1a",
      fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0",
    }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 8px #10b98180} 50%{box-shadow:0 0 18px #10b981cc} }
        ::-webkit-scrollbar{width:6px;height:6px} ::-webkit-scrollbar-track{background:#0f172a} ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
        select option{background:#0f172a;color:#e2e8f0}
      `}</style>

      {/* Sidebar + Main */}
      <div style={{ display: "flex" }}>

        {/* Sidebar */}
        <aside style={{
          width: 64, background: "#0a1628", borderRight: "1px solid #1e293b",
          display: "flex", flexDirection: "column", alignItems: "center",
          paddingTop: 20, gap: 8, position: "sticky", top: 0, height: "100vh",
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, marginBottom: 24, boxShadow: "0 0 20px #3b82f640",
          }}>⚡</div>
          {[
            { icon: "⬛", label: "Dashboard", active: true },
            { icon: "📡", label: "Clients" },
            { icon: "🔔", label: "Alerts" },
            { icon: "📊", label: "Reports" },
            { icon: "⚙️", label: "Settings" },
          ].map(({ icon, label, active }) => (
            <div key={label} title={label} style={{
              width: 40, height: 40, borderRadius: 10, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: active ? "#1e3a5f" : "transparent",
              border: active ? "1px solid #2563eb40" : "1px solid transparent",
              fontSize: 18, transition: "all 0.2s",
            }}
              onMouseEnter={e => !active && (e.currentTarget.style.background = "#1e293b")}
              onMouseLeave={e => !active && (e.currentTarget.style.background = "transparent")}
            >{icon}</div>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "32px 40px", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#f1f5f9", margin: 0 }}>
                POS Monitor
              </h1>
              <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0", fontFamily: "'DM Sans', sans-serif" }}>
                Real-time monitoring · Auto-refreshes every 30s
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 12, color: "#475569", fontFamily: "'DM Mono', monospace" }}>
                Last sync: {lastRefreshed.toLocaleTimeString()}
              </div>
              <button
                onClick={() => { refetch(); setLastRefreshed(new Date()); }}
                style={{
                  background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
                  border: "1px solid #3b82f640", borderRadius: 10, color: "#93c5fd",
                  padding: "10px 20px", cursor: "pointer", fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                  boxShadow: "0 4px 12px #3b82f620",
                }}
                onMouseEnter={e => e.target.style.boxShadow = "0 4px 20px #3b82f640"}
                onMouseLeave={e => e.target.style.boxShadow = "0 4px 12px #3b82f620"}
              >↻ Refresh</button>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            <StatCard label="Total Clients" value={stats.total} icon="🖥" accent="#3b82f6" sub="All registered" />
            <StatCard label="Online" value={stats.online} icon="🟢" accent="#10b981" sub={`${Math.round(stats.online / stats.total * 100)}% uptime`} />
            <StatCard label="Offline" value={stats.offline} icon="🔴" accent="#ef4444" sub={stats.offline > 5 ? "⚠ High count" : "Within normal"} />
            <StatCard label="High CPU" value={stats.highCpu} icon="🔥" accent="#f59e0b" sub="> 80% usage" />
          </div>

          {/* Filters */}
          <div style={{ marginBottom: 20 }}>
            <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />
          </div>

          {/* Results header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>
              {loading ? "Loading..." : `${total} client${total !== 1 ? "s" : ""} found`}
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", background: "#10b981",
                animation: "pulse 2s ease infinite",
              }} />
              <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'DM Mono', monospace" }}>Live</span>
            </div>
          </div>

          {/* Table */}
          <ClientsTable
            data={data}
            loading={loading}
            error={error}
            total={total}
            page={filters.page}
            onPageChange={(p) => handleFilterChange({ page: p })}
            onViewDetail={setSelectedClientId}
          />

          {/* Footer */}
          <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#334155", fontFamily: "'DM Mono', monospace" }}>POS Monitor v1.0 · © 2026</span>
            <span style={{ fontSize: 12, color: "#334155", fontFamily: "'DM Mono', monospace" }}>Latest version: {LATEST_VERSION}</span>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      <ClientDetailModal clientId={selectedClientId} onClose={() => setSelectedClientId(null)} />
    </div>
  );
}
