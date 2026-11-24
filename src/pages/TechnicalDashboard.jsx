import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { useDemoState } from "../hooks/useDemoState";
import { formatCurrency, formatNumber } from "../utils/formatters";

const SEVERITY_COLORS = { Critical: "#9f2f2d", High: "#d4652a", Medium: "#956400", Low: "#346538" };

function TechnicalDashboard() {
  const { demoSummary, assets, vulnerabilities } = useDemoState();
  const [riskFilter, setRiskFilter] = useState("All");

  const filteredAssets = riskFilter === "All"
    ? assets
    : assets.filter((a) => a.currentRisk === riskFilter);

  const riskByAsset = assets.map((a) => ({
    name: a.name,
    exposure: a.financialExposure / 100000,
  }));

  const severityCounts = vulnerabilities.reduce((acc, v) => {
    acc[v.severity] = (acc[v.severity] || 0) + 1;
    return acc;
  }, {});
  const severityData = Object.entries(severityCounts).map(([name, value]) => ({ name, value }));

  const patchData = [
    { name: "Unpatched", value: vulnerabilities.filter((v) => v.status === "Unpatched").length },
    { name: "Open", value: vulnerabilities.filter((v) => v.status === "Open").length },
    { name: "Monitoring", value: vulnerabilities.filter((v) => v.status === "Monitoring").length },
  ];

  return (
    <div className="animate-in">
      {/* Summary Cards */}
      <div className="stat-cards stagger">
        <div className="stat-card">
          <div className="stat-card-accent stat-card-accent--info" />
          <p className="stat-card-label">Total Assets</p>
          <p className="stat-card-value">{formatNumber(demoSummary.totalAssets)}</p>
          <p className="stat-card-sub">Servers, databases, endpoints, cloud</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-accent stat-card-accent--warning" />
          <p className="stat-card-label">Vulnerabilities</p>
          <p className="stat-card-value stat-card-value--warning">{demoSummary.vulnerabilities}</p>
          <p className="stat-card-sub">Across all assets</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-accent stat-card-accent--danger" />
          <p className="stat-card-label">Critical Vulnerabilities</p>
          <p className="stat-card-value stat-card-value--danger">{demoSummary.criticalVulnerabilities}</p>
          <p className="stat-card-sub">Requiring immediate attention</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-accent stat-card-accent--success" />
          <p className="stat-card-label">Security Controls</p>
          <p className="stat-card-value">{demoSummary.securityControls}</p>
          <p className="stat-card-sub">Available controls</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Risk by Asset */}
        <div className="dashboard-card dashboard-card--full">
          <div className="card-header">
            <div>
              <h3 className="card-title">Risk by Asset</h3>
              <p className="card-subtitle">Financial exposure in ₹ Lakhs</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskByAsset} margin={{ bottom: 40 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v) => `₹${v.toFixed(1)}L`}
                contentStyle={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: "6px", fontSize: "12px" }}
              />
              <Bar dataKey="exposure" fill="#111" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk by Severity */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Risk by Severity</h3>
              <p className="card-subtitle">Vulnerability distribution</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {severityData.map((entry) => (
                  <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name] || "#999"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: "6px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            {severityData.map((s) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: SEVERITY_COLORS[s.name] || "#999" }} />
                {s.name}: {s.value}
              </div>
            ))}
          </div>
        </div>

        {/* Patch Status */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Patch Status</h3>
              <p className="card-subtitle">Vulnerability remediation state</p>
            </div>
          </div>
          {patchData.map((p) => (
            <div key={p.name} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.8125rem" }}>
                <span>{p.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{p.value}</span>
              </div>
              <div className="pct-bar-track">
                <div
                  className={`pct-bar-fill pct-bar-fill--${p.name === "Unpatched" ? "danger" : p.name === "Open" ? "warning" : "info"}`}
                  style={{ width: `${(p.value / vulnerabilities.length) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Table */}
      <div className="dashboard-card dashboard-card--full" style={{ marginTop: 0 }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Assets by Risk Level</h3>
            <p className="card-subtitle">Filter and drill down</p>
          </div>
        </div>

        <div className="filter-bar">
          {["All", "Very High", "High", "Medium", "Low"].map((f) => (
            <button
              key={f}
              className={`filter-chip ${riskFilter === f ? "is-active" : ""}`}
              onClick={() => setRiskFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Criticality</th>
                <th>Vulns</th>
                <th>Critical</th>
                <th>Controls</th>
                <th>Risk</th>
                <th>Exposure</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.name}</td>
                  <td>{a.type}</td>
                  <td>
                    <span className={`status-badge status-badge--${a.businessCriticality === "Critical" ? "danger" : "warning"}`}>
                      {a.businessCriticality}
                    </span>
                  </td>
                  <td className="numeric">{a.vulnerabilityCount}</td>
                  <td className="numeric">{a.criticalVulnerabilityCount}</td>
                  <td>
                    <span className={`status-badge status-badge--${a.securityControlStatus === "Good" ? "success" : a.securityControlStatus === "Partial" ? "warning" : "danger"}`}>
                      {a.securityControlStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${a.currentRisk === "Very High" || a.currentRisk === "High" ? "danger" : "warning"}`}>
                      {a.currentRisk}
                    </span>
                  </td>
                  <td className="numeric">{formatCurrency(a.financialExposure)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TechnicalDashboard;
