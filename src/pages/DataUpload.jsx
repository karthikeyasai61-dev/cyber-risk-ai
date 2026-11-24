import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDemoState } from "../hooks/useDemoState";
import { formatNumber, formatCurrency } from "../utils/formatters";
import {
  parseUploadedData,
  normalizeVulnerabilityFindings,
  normalizeBusinessAssets,
  SAMPLE_INTERNAL_LOGS_CSV,
  SAMPLE_BUSINESS_ASSETS_CSV,
} from "../services/dataIngestion";

function DataUpload() {
  const {
    vulnerabilities,
    assets,
    demoSummary,
    importCustomLogs,
    importCustomAssets,
    liveAuditEvents,
  } = useDemoState();

  const [activeTab, setActiveTab] = useState("logs"); // "logs" | "assets"
  const [rawText, setRawText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [ingestHistory, setIngestHistory] = useState([]);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  // ── Drag & Drop handlers ──────────────────────────────────────────────────
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    readFile(file);
  }, []);

  function readFile(file) {
    const allowed = ["text/csv", "application/json", "text/plain", "text/tab-separated-values", ""];
    const ext = file.name.split(".").pop().toLowerCase();
    const allowedExt = ["csv", "json", "log", "txt", "tsv"];

    if (!allowedExt.includes(ext)) {
      setStatus({ type: "error", message: `Unsupported file type ".${ext}". Please use CSV, JSON, LOG, or TXT.` });
      return;
    }

    setFileName(file.name);
    setStatus(null);

    // Auto-detect tab type from filename
    if (ext === "csv" || ext === "log" || ext === "txt") {
      const lowerName = file.name.toLowerCase();
      if (lowerName.includes("asset") || lowerName.includes("inventory") || lowerName.includes("business")) {
        setActiveTab("assets");
      } else {
        setActiveTab("logs");
      }
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawText(event.target.result);
    };
    reader.readAsText(file);
  }

  function handleFileInputChange(e) {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  }

  function handleLoadTemplate(type) {
    if (type === "logs") {
      setRawText(SAMPLE_INTERNAL_LOGS_CSV);
      setFileName("internal_server_findings.csv");
    } else {
      setRawText(SAMPLE_BUSINESS_ASSETS_CSV);
      setFileName("enterprise_business_assets.csv");
    }
    setStatus(null);
  }

  async function handleIngest(e) {
    e.preventDefault();
    if (!rawText.trim()) {
      setStatus({ type: "error", message: "Please drop a file, paste data, or load a sample template." });
      return;
    }

    setIsProcessing(true);
    setStatus(null);

    try {
      const parsedRecords = parseUploadedData(rawText);
      if (parsedRecords.length === 0) {
        throw new Error("No valid data records found. Verify the CSV headers or JSON structure.");
      }

      let count = 0;
      let type = "";

      if (activeTab === "logs") {
        const normalized = normalizeVulnerabilityFindings(parsedRecords);
        await importCustomLogs(normalized, { fileName: fileName || "Internal Server Logs" });
        count = normalized.length;
        type = "vulnerability findings";
        setStatus({
          type: "success",
          message: `✓ Ingested ${count} ${type} from "${fileName || "pasted data"}". Risk scores recalculated across all dashboards and synced to Cloud Firestore.`,
        });
      } else {
        const normalized = normalizeBusinessAssets(parsedRecords);
        await importCustomAssets(normalized, { fileName: fileName || "Business Assets Inventory" });
        count = normalized.length;
        type = "enterprise assets";
        setStatus({
          type: "success",
          message: `✓ Ingested ${count} ${type} from "${fileName || "pasted data"}". Asset catalog, financial exposure, and ML models updated across all pages.`,
        });
      }

      // Track history
      setIngestHistory((prev) => [
        {
          id: Date.now(),
          fileName: fileName || "Pasted data",
          tab: activeTab,
          count,
          type,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 9),
      ]);

      // Clear after 3 s so user sees feedback
      setTimeout(() => {
        setRawText("");
        setFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 3000);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to process file." });
    } finally {
      setIsProcessing(false);
    }
  }

  const recentFindings = vulnerabilities.slice(0, 8);
  const recentAssets = assets.slice(0, 8);

  // Derived live stats
  const criticalCount = vulnerabilities.filter((v) => v.severity === "Critical").length;
  const highCount = vulnerabilities.filter((v) => v.severity === "High").length;
  const totalExposure = assets.reduce((s, a) => s + (a.financialExposure || 0), 0);

  return (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Live Metrics Row ─────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="metric-card">
          <p className="metric-label">Total Vulnerabilities</p>
          <p className="metric-value">{formatNumber(vulnerabilities.length)}</p>
          <p className="metric-subtext" style={{ color: "var(--color-danger-text)" }}>
            {criticalCount} Critical · {highCount} High
          </p>
        </div>

        <div className="metric-card">
          <p className="metric-label">Enterprise Assets</p>
          <p className="metric-value">{formatNumber(assets.length)}</p>
          <p className="metric-subtext">Total inventory tracked</p>
        </div>

        <div className="metric-card">
          <p className="metric-label">Financial Exposure (EAL)</p>
          <p className="metric-value" style={{ fontSize: "1.5rem", color: "var(--color-danger-text)" }}>
            {formatCurrency(demoSummary.currentEAL)}
          </p>
          <p className="metric-subtext">Expected Annual Loss — recalculated live</p>
        </div>

        <div className="metric-card">
          <p className="metric-label">Cloud Sync Status</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span
              style={{
                width: 9, height: 9, borderRadius: "50%",
                background: "var(--color-success-text)",
                boxShadow: "0 0 8px var(--color-success-text)",
              }}
            />
            <p className="metric-value" style={{ fontSize: "1rem", margin: 0 }}>Firestore Live</p>
          </div>
          <p className="metric-subtext" style={{ color: "var(--color-success-text)" }}>
            Encrypted · Real-time
          </p>
        </div>
      </div>

      {/* ── Main Ingestion Studio ─────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-medium)",
          padding: 24,
        }}
      >
        {/* Tab + Template row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { key: "logs", label: "🛡️ Server Logs & Vulnerabilities" },
              { key: "assets", label: "💼 Business Asset Inventory" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => { setActiveTab(key); setStatus(null); }}
                style={{
                  padding: "9px 18px",
                  fontSize: "0.875rem",
                  borderRadius: "var(--radius-small)",
                  border: "1px solid var(--color-border)",
                  background: activeTab === key ? "var(--color-text)" : "var(--color-surface-muted)",
                  color: activeTab === key ? "var(--color-surface)" : "var(--color-text)",
                  cursor: "pointer",
                  fontWeight: 650,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "background 0.15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleLoadTemplate(activeTab)}
            style={{ fontSize: "0.8125rem", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <span>⚡</span> Load Sample {activeTab === "logs" ? "Server Logs" : "Assets"} Template
          </button>
        </div>

        <form onSubmit={handleIngest}>
          {/* ── Drag & Drop Zone ──────────────────────────────────────────── */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? "var(--color-accent, #2563eb)" : "var(--color-border)"}`,
              borderRadius: "var(--radius-medium)",
              padding: "36px 24px",
              textAlign: "center",
              background: isDragging
                ? "rgba(37, 99, 235, 0.06)"
                : "var(--color-surface-muted)",
              cursor: "pointer",
              transition: "border-color 0.18s, background 0.18s",
              marginBottom: 16,
              userSelect: "none",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,.log,.txt,.tsv"
              onChange={handleFileInputChange}
              style={{ display: "none" }}
            />

            {isDragging ? (
              <>
                <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>📂</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-accent, #2563eb)" }}>
                  Release to upload file
                </div>
              </>
            ) : fileName ? (
              <>
                <div style={{ fontSize: "2rem", marginBottom: 6 }}>✅</div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 650 }}>
                  Loaded: <span style={{ fontFamily: "var(--font-mono)" }}>{fileName}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: 4 }}>
                  {rawText.split("\n").length} lines detected · Click to change file
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🗂️</div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 650, marginBottom: 4 }}>
                  Drag & drop your file here, or click to browse
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  CSV · JSON · LOG · TXT · Nessus exports · Qualys reports · syslog files
                </div>
              </>
            )}
          </div>

          {/* ── Schema hint ──────────────────────────────────────────────── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8125rem", marginBottom: 8 }}>
            <label style={{ fontWeight: 650 }}>
              {activeTab === "logs"
                ? "Or paste CSV / JSON — columns: timestamp, host, vulnerability, cve, severity, cvss, status"
                : "Or paste CSV / JSON — columns: asset_name, asset_type, ip_address, business_value, criticality, owner"}
            </label>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              Auto-detects CSV, JSON, quoted fields
            </span>
          </div>

          {/* ── Textarea ─────────────────────────────────────────────────── */}
          <textarea
            rows={8}
            placeholder={
              activeTab === "logs"
                ? "Paste raw server scan findings, CVE list, or syslog text..."
                : "Paste business asset inventory records..."
            }
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "var(--radius-small)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text)",
              fontSize: "0.8125rem",
              fontFamily: "var(--font-mono)",
              boxSizing: "border-box",
              lineHeight: "1.5",
              marginBottom: 16,
              resize: "vertical",
            }}
          />

          {/* ── Status banner ─────────────────────────────────────────────── */}
          {status && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "var(--radius-small)",
                fontSize: "0.875rem",
                marginBottom: 16,
                background: status.type === "success" ? "#ecfdf5" : "#fef2f2",
                border: `1px solid ${status.type === "success" ? "#a7f3d0" : "#fecaca"}`,
                color: status.type === "success" ? "#065f46" : "#991b1b",
                fontWeight: 500,
              }}
            >
              {status.message}
            </div>
          )}

          {/* ── Action row ───────────────────────────────────────────────── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", maxWidth: 460 }}>
              Uploaded data is <strong>immediately reflected</strong> across the Executive Dashboard, Vulnerabilities,
              Assets, Financial Risk, ML Analytics, Simulators, and AI Copilot.
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {rawText && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setRawText(""); setFileName(""); setStatus(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isProcessing || !rawText.trim()}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", fontSize: "0.875rem", fontWeight: 650 }}
              >
                {isProcessing ? (
                  <>
                    <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>
                    Ingesting & Syncing…
                  </>
                ) : (
                  <><span>🚀</span> Ingest & Quantify Data</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── Ingestion History ─────────────────────────────────────────────── */}
      {ingestHistory.length > 0 && (
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-medium)",
            padding: 20,
          }}
        >
          <h3 style={{ margin: "0 0 14px", fontSize: "0.9375rem", fontWeight: 700 }}>
            Session Ingestion History
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)", textAlign: "left" }}>
                  <th style={{ padding: "6px 10px" }}>Time</th>
                  <th style={{ padding: "6px 10px" }}>File</th>
                  <th style={{ padding: "6px 10px" }}>Type</th>
                  <th style={{ padding: "6px 10px" }}>Records</th>
                  <th style={{ padding: "6px 10px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {ingestHistory.map((h) => (
                  <tr key={h.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "8px 10px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>{h.time}</td>
                    <td style={{ padding: "8px 10px", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{h.fileName}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <span className={`status-badge status-badge--${h.tab === "logs" ? "warning" : "info"}`} style={{ fontSize: "0.6875rem" }}>
                        {h.tab === "logs" ? "Vulnerabilities" : "Assets"}
                      </span>
                    </td>
                    <td style={{ padding: "8px 10px", fontWeight: 650 }}>{h.count}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <span className="status-badge status-badge--success" style={{ fontSize: "0.6875rem" }}>✓ Ingested</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Live Data Preview Tables ──────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>

        {/* Vulnerabilities Preview */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-medium)",
            padding: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700 }}>
              Vulnerability Findings ({formatNumber(vulnerabilities.length)})
            </h3>
            <Link to="/vulnerabilities" style={{ fontSize: "0.75rem", color: "var(--color-accent, #2563eb)", fontWeight: 600 }}>
              Full Table →
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)", textAlign: "left" }}>
                  <th style={{ padding: "6px 8px" }}>CVE ID</th>
                  <th style={{ padding: "6px 8px" }}>Asset</th>
                  <th style={{ padding: "6px 8px" }}>Severity</th>
                  <th style={{ padding: "6px 8px" }}>CVSS</th>
                  <th style={{ padding: "6px 8px" }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {recentFindings.map((v) => (
                  <tr key={v.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "0.7rem" }}>{v.cveId}</td>
                    <td style={{ padding: "7px 8px" }}>{v.assetName}</td>
                    <td style={{ padding: "7px 8px" }}>
                      <span
                        className={`status-badge status-badge--${v.severity === "Critical" ? "danger" : v.severity === "High" ? "warning" : "neutral"}`}
                        style={{ fontSize: "0.6rem", padding: "2px 5px" }}
                      >
                        {v.severity}
                      </span>
                    </td>
                    <td style={{ padding: "7px 8px", fontWeight: 650 }}>{v.cvss}</td>
                    <td style={{ padding: "7px 8px" }}>
                      {v.isLiveIngested ? (
                        <span className="status-badge status-badge--info" style={{ fontSize: "0.6rem" }}>Live</span>
                      ) : (
                        <span style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>Baseline</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mini severity summary */}
          <div style={{ display: "flex", gap: 12, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--color-border)" }}>
            {[
              { label: "Critical", count: criticalCount, color: "#ef4444" },
              { label: "High", count: highCount, color: "#f97316" },
              { label: "Medium", count: vulnerabilities.filter(v => v.severity === "Medium").length, color: "#eab308" },
              { label: "Low", count: vulnerabilities.filter(v => v.severity === "Low").length, color: "#6b7280" },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.125rem", fontWeight: 700, color }}>{count}</div>
                <div style={{ fontSize: "0.625rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Assets Preview */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-medium)",
            padding: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700 }}>
              Enterprise Assets ({formatNumber(assets.length)})
            </h3>
            <Link to="/assets" style={{ fontSize: "0.75rem", color: "var(--color-accent, #2563eb)", fontWeight: 600 }}>
              Full Inventory →
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)", textAlign: "left" }}>
                  <th style={{ padding: "6px 8px" }}>Asset Name</th>
                  <th style={{ padding: "6px 8px" }}>Type</th>
                  <th style={{ padding: "6px 8px" }}>Criticality</th>
                  <th style={{ padding: "6px 8px" }}>Exposure</th>
                </tr>
              </thead>
              <tbody>
                {recentAssets.map((a) => (
                  <tr key={a.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "7px 8px", fontWeight: 600 }}>{a.name}</td>
                    <td style={{ padding: "7px 8px", color: "var(--color-text-muted)" }}>{a.type}</td>
                    <td style={{ padding: "7px 8px" }}>
                      <span
                        className={`status-badge status-badge--${a.businessCriticality === "Critical" || a.criticality === "Tier 1" ? "danger" : a.businessCriticality === "High" || a.criticality === "Tier 2" ? "warning" : "neutral"}`}
                        style={{ fontSize: "0.6rem", padding: "2px 5px" }}
                      >
                        {a.businessCriticality || a.criticality || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "7px 8px", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
                      {formatCurrency(a.financialExposure || a.financialValue || a.value || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total exposure footer */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Total Asset Exposure</span>
            <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-danger-text)" }}>
              {formatCurrency(totalExposure)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Propagation Callout ──────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-surface-muted)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-medium)",
          padding: "16px 20px",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ margin: "0 0 4px", fontWeight: 650, fontSize: "0.875rem" }}>
            📡 Ingested data is live across all platform modules
          </p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
            EAL · Risk Score · Monte Carlo · ML Prediction · Security Simulator · Investment Optimizer · AI Copilot — all recalculated from your data.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "→ Dashboard", to: "/" },
            { label: "→ Financial Risk", to: "/financial-risk" },
            { label: "→ ML Analytics", to: "/ml-analytics" },
            { label: "→ AI Copilot", to: "/ai-copilot" },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              style={{
                fontSize: "0.75rem",
                padding: "5px 12px",
                borderRadius: "var(--radius-small)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                color: "var(--color-text)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DataUpload;
