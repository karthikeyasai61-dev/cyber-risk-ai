import { useState } from "react";
import { useDemoState } from "../hooks/useDemoState";
import { formatNumber } from "../utils/formatters";

function DataSources() {
  const {
    dataSources,
    syncSource,
    syncAll,
    isSyncing,
    syncingSourceId,
    lastGlobalSync,
    autoSync,
    toggleAutoSync,
    livePayloads,
  } = useDemoState();

  const [expandedId, setExpandedId] = useState(null);
  const [syncInterval, setSyncInterval] = useState(30);

  return (
    <div className="animate-in">
      {/* Top Controls & Status Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 24,
          padding: "16px 20px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-medium)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: autoSync ? "var(--color-success-text)" : "var(--color-text-muted)",
                boxShadow: autoSync ? "0 0 8px var(--color-success-text)" : "none",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: "0.875rem", fontWeight: 650 }}>
              Background Telemetry: {autoSync ? "Active Polling" : "Idle"}
            </span>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.8125rem",
              cursor: "pointer",
              padding: "5px 12px",
              background: "var(--color-surface-muted)",
              borderRadius: "var(--radius-small)",
              border: "1px solid var(--color-border)",
              fontWeight: 500,
            }}
          >
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => toggleAutoSync(e.target.checked, syncInterval)}
            />
            Auto-Sync in Background
          </label>

          {autoSync && (
            <select
              value={syncInterval}
              onChange={(e) => {
                const interval = parseInt(e.target.value, 10);
                setSyncInterval(interval);
                toggleAutoSync(true, interval);
              }}
              style={{
                fontSize: "0.75rem",
                padding: "5px 10px",
                background: "var(--color-surface-muted)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-small)",
                color: "var(--color-text)",
              }}
            >
              <option value={15}>Every 15s</option>
              <option value={30}>Every 30s</option>
              <option value={60}>Every 1 min</option>
              <option value={300}>Every 5 mins</option>
            </select>
          )}

          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
            Last Global Sync: <strong>{lastGlobalSync}</strong>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={() => syncAll()}
            disabled={isSyncing}
            style={{
              fontSize: "0.8125rem",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 18px",
            }}
          >
            {isSyncing ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>
                Simulating All Sources...
              </>
            ) : (
              <>
                <span>▶</span> Simulate All Sources
              </>
            )}
          </button>
        </div>
      </div>

      {/* Uniform Even Sources Grid */}
      <div className="sources-grid">
        {dataSources.map((src) => {
          const isExpanded = expandedId === src.id;
          const isSourceSyncing = syncingSourceId === src.id || isSyncing;
          const payload = livePayloads[src.id];

          return (
            <div
              key={src.id}
              className="source-card"
              style={{
                borderColor: isExpanded ? "var(--color-border-strong)" : "var(--color-border)",
                boxShadow: isExpanded ? "0 4px 14px rgba(0, 0, 0, 0.05)" : "none",
              }}
            >
              <div>
                {/* Header Row */}
                <div className="source-card-header">
                  <div className="source-card-title-group">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className="source-card-name">{src.name}</span>
                      <span className="source-card-id-tag">{src.id}</span>
                    </div>
                    <div className="source-card-meta">
                      {getProviderLabel(src.id)}
                    </div>
                  </div>

                  <div className="source-card-status-badge">
                    <span
                      className="source-card-dot"
                      style={{
                        background: isSourceSyncing ? "#eab308" : "var(--color-success-text)",
                        boxShadow: isSourceSyncing
                          ? "0 0 6px #eab308"
                          : "0 0 6px var(--color-success-text)",
                      }}
                      aria-label="Connected"
                    />
                    <span>{isSourceSyncing ? "SYNCING" : src.status}</span>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="source-metrics-row">
                  <div>
                    <p className="source-detail-label">Records Processed</p>
                    <p className="source-detail-value">{formatNumber(src.records)}</p>
                  </div>
                  <div>
                    <p className="source-detail-label">Last Sync</p>
                    <p className="source-detail-value">
                      {src.lastSync || "Live"}
                      {src.durationMs && ` (${src.durationMs}ms)`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="source-actions-row">
                <button
                  className="source-play-btn"
                  onClick={() => syncSource(src.id)}
                  disabled={isSourceSyncing}
                  title={`Simulate live ingestion from ${src.name}`}
                >
                  {isSourceSyncing ? (
                    <>
                      <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>
                        ⟳
                      </span>
                      <span>Simulating...</span>
                    </>
                  ) : (
                    <>
                      <span className="source-play-icon">▶</span>
                      <span>Simulate</span>
                    </>
                  )}
                </button>

                <button
                  className="source-log-toggle-btn"
                  onClick={() => setExpandedId(isExpanded ? null : src.id)}
                  title="Toggle Telemetry Payload Inspector"
                >
                  {isExpanded ? "Hide Logs ▲" : "Logs ▼"}
                </button>
              </div>

              {/* Expandable Live Telemetry Payload */}
              {isExpanded && (
                <div className="source-card-details animate-in">
                  <div>
                    <p className="source-detail-label">Ingestion Channel</p>
                    <p className="source-detail-value">{src.type}</p>
                  </div>
                  <div>
                    <p className="source-detail-label">Operational Health</p>
                    <p className="source-detail-value" style={{ color: "var(--color-success-text)" }}>
                      Normal • Latency {src.durationMs || 120}ms
                    </p>
                  </div>

                  <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
                    <p className="source-detail-label" style={{ marginBottom: 6 }}>
                      Live Telemetry Stream
                    </p>
                    <div
                      style={{
                        padding: 12,
                        background: "#0f172a",
                        color: "#38bdf8",
                        borderRadius: "var(--radius-small)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6875rem",
                        overflowX: "auto",
                        maxHeight: 160,
                      }}
                    >
                      {payload ? (
                        <pre style={{ margin: 0 }}>{JSON.stringify(payload, null, 2)}</pre>
                      ) : (
                        <div style={{ color: "#94a3b8" }}>
                          Click <strong>"▶ Simulate"</strong> to execute live background telemetry ingestion.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getProviderLabel(id) {
  switch (id) {
    case "SRC-001":
      return "Continuous Vulnerability Intelligence & CVEs";
    case "SRC-002":
      return "Enterprise Security Event Stream & SIEM";
    case "SRC-003":
      return "Directory Identity & Access Management";
    case "SRC-004":
      return "Endpoint Detection & Host Telemetry";
    case "SRC-005":
      return "Cloud Security Posture & CIS Controls";
    case "SRC-006":
      return "External Attack Surface & Recon Discovery";
    case "SRC-007":
      return "Global Threat Indicators & Feeds";
    default:
      return "Enterprise Telemetry Connector";
  }
}

export default DataSources;
