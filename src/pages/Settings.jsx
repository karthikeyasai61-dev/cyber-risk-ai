import { useState } from "react";
import { Link } from "react-router-dom";
import { useDemoState } from "../hooks/useDemoState";
import { useToast } from "../hooks/useToast";
import UploadDataModal from "../components/UploadDataModal";

function Settings() {
  const { demoEnterprise, resetDemo, loadEnterprise, autoSync, toggleAutoSync } = useDemoState();
  const { toasts, addToast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);

  function handleReset() {
    resetDemo();
    addToast("Data Refreshed", "Enterprise data has been refreshed to the baseline state.");
  }

  function handleLoadEnterprise() {
    loadEnterprise();
    addToast("Enterprise Loaded", "AegisBank Technologies enterprise profile loaded successfully.");
  }

  return (
    <div className="animate-in">
      {/* Enterprise Data Ingestion & Cloud Uploads */}
      <div className="settings-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h3 className="settings-section-title">Enterprise Data Ingestion & Uploads</h3>
            <p className="settings-section-desc">
              Ingest raw internal server logs, CVE vulnerability scans, and business asset inventories. The platform automatically normalizes incoming telemetry, computes quantitative FAIR loss exposure, and syncs findings to the cloud database.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              to="/upload"
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", fontSize: "0.875rem" }}
            >
              <span>🚀</span> Go to Data Ingestion Page
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => setShowUploadModal(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", fontSize: "0.875rem" }}
            >
              <span>📤</span> Quick Upload Modal
            </button>
          </div>
        </div>

        {/* Ingestion Pipeline Status Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              padding: 16,
              background: "var(--color-surface-muted)",
              borderRadius: "var(--radius-small)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success-text)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Cloud Database
              </span>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: "0.9375rem", fontWeight: 600 }}>
              Cloud Firestore Connected
            </p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              Synchronizing uploaded security scans, business assets, and audit logs.
            </p>
          </div>

          <div
            style={{
              padding: 16,
              background: "var(--color-surface-muted)",
              borderRadius: "var(--radius-small)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success-text)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Supported Formats
              </span>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: "0.9375rem", fontWeight: 600 }}>
              CSV & JSON Auto-Parser
            </p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              Accepts Nessus, Qualys, raw syslog lines, host vulnerability sheets, and asset catalogs.
            </p>
          </div>

          <div
            style={{
              padding: 16,
              background: "var(--color-surface-muted)",
              borderRadius: "var(--radius-small)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success-text)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Risk Recalculation
              </span>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: "0.9375rem", fontWeight: 600 }}>
              Live FAIR Engine
            </p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              Uploaded records dynamically trigger immediate Monte Carlo and financial exposure recalculations.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowUploadModal(true)}
            style={{ fontSize: "0.8125rem" }}
          >
            Import Internal Server Logs (CSV/JSON)
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowUploadModal(true)}
            style={{ fontSize: "0.8125rem" }}
          >
            Import Business Asset Inventory (CSV/JSON)
          </button>
        </div>
      </div>

      {/* Platform Controls & Background Telemetry */}
      <div className="settings-section">
        <h3 className="settings-section-title">Platform Controls & Polling</h3>
        <p className="settings-section-desc">
          Manage continuous risk monitoring and background telemetry synchronization.
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => toggleAutoSync(e.target.checked, 30)}
            />
            <span>Enable Automatic Background Ingestion Poller</span>
          </label>
        </div>

        <div className="settings-actions">
          <button className="btn btn-primary" onClick={handleLoadEnterprise}>
            Load Enterprise Profile
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Refresh Baseline Data
          </button>
        </div>
      </div>

      {/* Enterprise Info */}
      <div className="settings-section">
        <h3 className="settings-section-title">Enterprise Profile</h3>
        <p className="settings-section-desc">
          Current organization environment and posture baseline.
        </p>
        <div className="enterprise-info">
          <div>
            <p className="enterprise-field-label">Enterprise Name</p>
            <p className="enterprise-field-value">{demoEnterprise.name}</p>
          </div>
          <div>
            <p className="enterprise-field-label">Industry</p>
            <p className="enterprise-field-value">{demoEnterprise.industry}</p>
          </div>
          <div>
            <p className="enterprise-field-label">Environment</p>
            <p className="enterprise-field-value">{demoEnterprise.environment}</p>
          </div>
          <div>
            <p className="enterprise-field-label">Data Ingestion Type</p>
            <p className="enterprise-field-value">{demoEnterprise.dataType}</p>
          </div>
          <div>
            <p className="enterprise-field-label">Last Synchronized</p>
            <p className="enterprise-field-value">{demoEnterprise.lastSynchronized}</p>
          </div>
        </div>
      </div>

      {/* Security Architecture Assurance */}
      <div className="settings-section">
        <h3 className="settings-section-title">Security & Runtime Isolation</h3>
        <p className="settings-section-desc" style={{ maxWidth: "none" }}>
          All telemetry connectors, cloud credentials, cryptographic authenticators, and AI reasoning models operate inside an isolated runtime background layer. In compliance with enterprise security baselines, raw credentials, vendor infrastructure fingerprints, and proprietary endpoints are strictly shielded from client sessions.
        </p>
      </div>

      {/* About CyberRisk AI */}
      <div className="settings-section">
        <h3 className="settings-section-title">About CyberRisk AI</h3>
        <p className="settings-section-desc" style={{ maxWidth: "none" }}>
          AI-Powered Continuous Cyber Risk Quantification and Investment Optimization Platform.
          CyberRisk AI enables enterprises to continuously understand their cybersecurity posture,
          convert technical security findings into financial cyber-risk, identify major risk drivers,
          simulate security controls, and optimize a limited cybersecurity budget.
        </p>
        <div style={{ marginTop: 16 }}>
          <span className="status-badge status-badge--warning">SIH26105</span>
        </div>
      </div>

      {/* Upload Data Modal */}
      <UploadDataModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={() => {
          addToast("Data Ingested", "New records successfully parsed, calculated, and saved to Cloud!");
        }}
      />

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="toast-region">
          {toasts.map((t) => (
            <div key={t.id} className="toast animate-in">
              <p className="toast-title">{t.title}</p>
              <p className="toast-message">{t.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Settings;
