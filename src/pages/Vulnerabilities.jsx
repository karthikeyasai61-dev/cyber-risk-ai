import { useState } from "react";
import { useDemoState } from "../hooks/useDemoState";

function Vulnerabilities() {
  const { vulnerabilities } = useDemoState();
  const [sevFilter, setSevFilter] = useState("All");

  const filtered = sevFilter === "All"
    ? vulnerabilities
    : vulnerabilities.filter((v) => v.severity === sevFilter);

  return (
    <div className="animate-in">
      {/* Asset-Business Correlation Demo */}
      <div className="section-heading">
        <h2>Asset-Business Correlation</h2>
        <p>Technical severity alone is not enough. Business context determines meaningful cyber risk.</p>
      </div>

      <div className="correlation-demo" style={{ marginBottom: 32 }}>
        <div className="correlation-card">
          <h4 style={{ margin: "0 0 12px", fontSize: "0.875rem" }}>Vulnerability A</h4>
          <div className="correlation-field">
            <span className="correlation-field-label">CVSS Score</span>
            <strong style={{ color: "var(--color-danger-text)" }}>9.8 — Critical</strong>
          </div>
          <div className="correlation-field">
            <span className="correlation-field-label">Asset</span>
            <strong>Test Server</strong>
          </div>
          <div className="correlation-field">
            <span className="correlation-field-label">Business Criticality</span>
            <span className="status-badge status-badge--success">Low</span>
          </div>
          <div className="correlation-field">
            <span className="correlation-field-label">Modeled Financial Risk</span>
            <strong>₹2.1L</strong>
          </div>
        </div>

        <div className="correlation-card correlation-card--highlight">
          <h4 style={{ margin: "0 0 12px", fontSize: "0.875rem" }}>Vulnerability B</h4>
          <div className="correlation-field">
            <span className="correlation-field-label">CVSS Score</span>
            <strong>8.8 — High</strong>
          </div>
          <div className="correlation-field">
            <span className="correlation-field-label">Asset</span>
            <strong>Payment Database</strong>
          </div>
          <div className="correlation-field">
            <span className="correlation-field-label">Business Criticality</span>
            <span className="status-badge status-badge--danger">Critical</span>
          </div>
          <div className="correlation-field">
            <span className="correlation-field-label">Modeled Financial Risk</span>
            <strong style={{ color: "var(--color-danger-text)" }}>₹16.4L</strong>
          </div>
        </div>
      </div>

      <div className="correlation-insight" style={{ marginBottom: 32, maxWidth: 600 }}>
        ↑ Vulnerability B has a lower CVSS score but <strong>8× the financial risk</strong> because of the Payment Database's business criticality. This demonstrates: <em>Technical Finding + Business Context = Meaningful Cyber Risk</em>
      </div>

      {/* Vulnerability Table */}
      <div className="section-heading">
        <h2>Vulnerability Findings</h2>
        <p>Vulnerability findings with severity classification and remediation status.</p>
      </div>

      <div className="filter-bar">
        {["All", "Critical", "High"].map((f) => (
          <button
            key={f}
            className={`filter-chip ${sevFilter === f ? "is-active" : ""}`}
            onClick={() => setSevFilter(f)}
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
                <th>CVE ID</th>
                <th>Asset</th>
                <th>CVSS</th>
                <th>Status</th>
                <th>Exposure</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem" }}>{v.cve}</td>
                  <td style={{ fontWeight: 600 }}>{v.asset}</td>
                  <td className="numeric">
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      color: v.cvss >= 9 ? "var(--color-danger-text)" : v.cvss >= 7 ? "var(--color-warning-text)" : "var(--color-text)",
                    }}>
                      {v.cvss}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${v.status === "Unpatched" ? "danger" : v.status === "Open" ? "warning" : "info"}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${v.exposure === "Internet" ? "danger" : "neutral"}`}>
                      {v.exposure}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${v.severity === "Critical" ? "danger" : "warning"}`}>
                      {v.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Vulnerabilities;
