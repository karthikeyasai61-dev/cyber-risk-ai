import React, { useState } from "react";
import { useDemoState } from "../hooks/useDemoState";
import { formatCurrency } from "../utils/formatters";

function Assets() {
  const { assets } = useDemoState();
  const [expandedId, setExpandedId] = useState(null);
  const [critFilter, setCritFilter] = useState("All");

  const filtered = critFilter === "All"
    ? assets
    : assets.filter((a) => a.businessCriticality === critFilter);

  return (
    <div className="animate-in">
      <div className="filter-bar">
        {["All", "Critical", "High", "Medium"].map((f) => (
          <button
            key={f}
            className={`filter-chip ${critFilter === f ? "is-active" : ""}`}
            onClick={() => setCritFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="dashboard-card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Criticality</th>
                <th>Sensitivity</th>
                <th>Exposure</th>
                <th>Vulns</th>
                <th>Critical</th>
                <th>Controls</th>
                <th>Risk</th>
                <th>Financial</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <React.Fragment key={a.id}>
                  <tr
                    onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td style={{ fontWeight: 600 }}>
                      <span style={{ marginRight: 8, color: "var(--color-text-muted)" }}>
                        {expandedId === a.id ? "▾" : "▸"}
                      </span>
                      {a.name}
                    </td>
                    <td>{a.type}</td>
                    <td>
                      <span className={`status-badge status-badge--${a.businessCriticality === "Critical" ? "danger" : "warning"}`}>
                        {a.businessCriticality}
                      </span>
                    </td>
                    <td>{a.dataSensitivity}</td>
                    <td>
                      <span className={`status-badge status-badge--${a.internetExposure === "Internet" ? "danger" : "neutral"}`}>
                        {a.internetExposure}
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
                  {expandedId === a.id && (
                    <tr key={`${a.id}-detail`}>
                      <td colSpan={10} style={{ background: "var(--color-surface-muted)", padding: "20px 24px" }}>
                        <div style={{ maxWidth: 600 }}>
                          <h4 style={{ margin: "0 0 12px", fontSize: "0.9375rem" }}>
                            Asset-Business Context: {a.name}
                          </h4>
                          <div className="correlation-card">
                            <div className="correlation-field">
                              <span className="correlation-field-label">Business Criticality</span>
                              <strong>{a.businessCriticality}</strong>
                            </div>
                            <div className="correlation-field">
                              <span className="correlation-field-label">Data Sensitivity</span>
                              <strong>{a.dataSensitivity}</strong>
                            </div>
                            <div className="correlation-field">
                              <span className="correlation-field-label">Internet Exposure</span>
                              <strong>{a.internetExposure}</strong>
                            </div>
                            <div className="correlation-field">
                              <span className="correlation-field-label">Security Controls</span>
                              <strong>{a.securityControlStatus}</strong>
                            </div>
                            <div className="correlation-field">
                              <span className="correlation-field-label">Vulnerability Count</span>
                              <strong>{a.vulnerabilityCount} ({a.criticalVulnerabilityCount} critical)</strong>
                            </div>
                            <div className="correlation-field">
                              <span className="correlation-field-label">Financial Exposure</span>
                              <strong>{formatCurrency(a.financialExposure)}</strong>
                            </div>
                          </div>
                          <div className="correlation-insight" style={{ marginTop: 12 }}>
                            Technical Finding + Business Context = Meaningful Cyber Risk
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Assets;
