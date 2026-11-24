import { useState } from "react";
import { useDemoState } from "../hooks/useDemoState";
import {
  parseUploadedData,
  normalizeVulnerabilityFindings,
  normalizeBusinessAssets,
  SAMPLE_INTERNAL_LOGS_CSV,
  SAMPLE_BUSINESS_ASSETS_CSV,
} from "../services/dataIngestion";

export default function UploadDataModal({ isOpen, onClose, onUploadSuccess }) {
  const { importCustomLogs, importCustomAssets } = useDemoState();

  const [uploadTab, setUploadTab] = useState("logs"); // "logs" | "assets"
  const [rawInputText, setRawInputText] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setRawInputText(event.target.result);
      setUploadStatus(null);
    };
    reader.readAsText(file);
  }

  function handleLoadSample(type) {
    if (type === "logs") {
      setRawInputText(SAMPLE_INTERNAL_LOGS_CSV);
      setUploadFileName("internal_server_findings.csv");
    } else {
      setRawInputText(SAMPLE_BUSINESS_ASSETS_CSV);
      setUploadFileName("enterprise_business_assets.csv");
    }
    setUploadStatus(null);
  }

  async function handleProcessUpload(e) {
    e.preventDefault();
    if (!rawInputText.trim()) {
      setUploadStatus({ type: "error", message: "Please paste text or select a CSV/JSON file to upload." });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const parsedRecords = parseUploadedData(rawInputText);
      if (parsedRecords.length === 0) {
        throw new Error("No valid data records found in input.");
      }

      if (uploadTab === "logs") {
        const normalized = normalizeVulnerabilityFindings(parsedRecords);
        await importCustomLogs(normalized, { fileName: uploadFileName || "Internal Logs" });
        setUploadStatus({
          type: "success",
          message: `Successfully ingested ${normalized.length} internal findings. Real-time risk recalculation updated and synced to Cloud!`,
        });
      } else {
        const normalized = normalizeBusinessAssets(parsedRecords);
        await importCustomAssets(normalized, { fileName: uploadFileName || "Business Assets" });
        setUploadStatus({
          type: "success",
          message: `Successfully ingested ${normalized.length} enterprise assets. Asset values and exposure levels updated and synced to Cloud!`,
        });
      }

      if (onUploadSuccess) onUploadSuccess();

      setTimeout(() => {
        setRawInputText("");
        setUploadFileName("");
      }, 2500);
    } catch (err) {
      setUploadStatus({ type: "error", message: err.message || "Failed to process upload." });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        className="animate-in"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-medium)",
          width: "100%",
          maxWidth: 680,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          overflow: "hidden",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>
              📤 Ingest Internal Logs & Business Data
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              Upload CSV or JSON files from internal servers, vulnerability scans, or asset catalogs.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.25rem",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "16px 20px", overflowY: "auto" }}>
          {/* Tab Selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => {
                setUploadTab("logs");
                setUploadStatus(null);
              }}
              style={{
                padding: "8px 16px",
                fontSize: "0.8125rem",
                borderRadius: "var(--radius-small)",
                border: "1px solid var(--color-border)",
                background: uploadTab === "logs" ? "var(--color-text)" : "var(--color-surface-muted)",
                color: uploadTab === "logs" ? "var(--color-surface)" : "var(--color-text)",
                cursor: "pointer",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>🛡️</span> Internal Server Logs & Scans
            </button>

            <button
              type="button"
              onClick={() => {
                setUploadTab("assets");
                setUploadStatus(null);
              }}
              style={{
                padding: "8px 16px",
                fontSize: "0.8125rem",
                borderRadius: "var(--radius-small)",
                border: "1px solid var(--color-border)",
                background: uploadTab === "assets" ? "var(--color-text)" : "var(--color-surface-muted)",
                color: uploadTab === "assets" ? "var(--color-surface)" : "var(--color-text)",
                cursor: "pointer",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>💼</span> Enterprise Business Assets
            </button>
          </div>

          {/* Quick Sample Loader */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <label style={{ fontSize: "0.8125rem", fontWeight: 650 }}>
              {uploadTab === "logs" ? "Vulnerability Scans & Security Logs" : "Asset Inventory (Criticality & Valuation)"}
            </label>

            <button
              type="button"
              onClick={() => handleLoadSample(uploadTab)}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-accent, #2563eb)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              ⚡ Load Sample {uploadTab === "logs" ? "Server Logs" : "Assets"} CSV
            </button>
          </div>

          <form onSubmit={handleProcessUpload}>
            {/* File Dropzone */}
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  border: "2px dashed var(--color-border)",
                  borderRadius: "var(--radius-medium)",
                  padding: "16px 12px",
                  textAlign: "center",
                  background: "var(--color-surface-muted)",
                  marginBottom: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  id="data-file-picker"
                  accept=".csv,.json,.log,.txt"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="data-file-picker" style={{ cursor: "pointer", display: "block" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>📁</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                    {uploadFileName ? `Selected: ${uploadFileName}` : "Click to select CSV or JSON file"}
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", marginTop: 2 }}>
                    Supports raw syslogs, Nessus/Qualys dumps, CVE lists, or JSON arrays
                  </div>
                </label>
              </div>

              {/* Text Area */}
              <textarea
                rows={6}
                placeholder={`Or paste raw ${uploadTab === "logs" ? "CSV / JSON server scan findings or syslog..." : "CSV / JSON asset records..."}`}
                value={rawInputText}
                onChange={(e) => setRawInputText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-small)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Status Banner */}
            {uploadStatus && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "var(--radius-small)",
                  fontSize: "0.8125rem",
                  marginBottom: 16,
                  background: uploadStatus.type === "success" ? "#ecfdf5" : "#fef2f2",
                  border: `1px solid ${uploadStatus.type === "success" ? "#a7f3d0" : "#fecaca"}`,
                  color: uploadStatus.type === "success" ? "#065f46" : "#991b1b",
                }}
              >
                {uploadStatus.type === "success" ? "✓ " : "⚠ "}
                {uploadStatus.message}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUploading || !rawInputText.trim()}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                {isUploading ? "Syncing to Cloud..." : "🚀 Ingest & Sync to Cloud"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
