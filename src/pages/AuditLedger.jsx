import { useDemoState } from "../hooks/useDemoState";

function AuditLedger() {
  const { auditRecord, liveAuditEvents } = useDemoState();

  return (
    <div className="animate-in">
      {/* Primary Signed Audit Record */}
      <div className="audit-card">
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="status-badge status-badge--success" style={{ fontSize: "0.6875rem" }}>
            Integrity Verified
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
            SHA-256 Ledger
          </span>
        </div>

        <div className="audit-field">
          <p className="audit-field-label">Assessment ID</p>
          <p className="audit-field-value">Risk Assessment #{auditRecord.assessmentId}</p>
        </div>

        <div className="audit-field">
          <p className="audit-field-label">Status</p>
          <p className="audit-field-value">{auditRecord.status}</p>
        </div>

        <div className="audit-field">
          <p className="audit-field-label">Record Hash</p>
          <span className="audit-hash">{auditRecord.recordHash}</span>
        </div>

        <div className="audit-field">
          <p className="audit-field-label">Timestamp</p>
          <p className="audit-field-value">{auditRecord.timestamp}</p>
        </div>
      </div>

      {/* Live Tool Synchronization Trail */}
      <div className="dashboard-card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Live Data Source Ingestion Trail</h3>
            <p className="card-desc">
              Tamper-evident logs of live API calls, vulnerability findings, and threat ingestion cycles.
            </p>
          </div>
        </div>

        {liveAuditEvents.length === 0 ? (
          <div style={{ padding: "16px 0", color: "var(--color-text-muted)", fontSize: "0.8125rem" }}>
            No live sync events recorded in this session yet. Navigate to <strong>Data Sources</strong> and click <em>"Sync All Sources"</em> or trigger a tool to populate the live audit trail.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {liveAuditEvents.map((evt) => (
              <div
                key={evt.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "var(--color-surface-muted)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-small)",
                  fontSize: "0.8125rem",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        padding: "2px 6px",
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 4,
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6875rem",
                        fontWeight: 650,
                      }}
                    >
                      {evt.action}
                    </span>
                    <strong style={{ color: "var(--color-text)" }}>{evt.actor}</strong>
                  </div>
                  <div style={{ color: "var(--color-text-muted)", marginTop: 4 }}>{evt.details}</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    {evt.timestamp}
                  </span>
                  <span className="status-badge status-badge--success" style={{ fontSize: "0.6875rem" }}>
                    {evt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* About Box */}
      <div className="dashboard-card" style={{ marginTop: 24, maxWidth: 640 }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">About Audit Ledger</h3>
          </div>
        </div>
        <div style={{ fontSize: "0.875rem", lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
          <p>
            A blockchain or audit ledger can be used to provide tamper-evident verification
            of important risk assessment and investment decisions.
          </p>
          <p style={{ marginTop: 12 }}>
            Each assessment record is hashed and timestamped. The integrity of the record
            can be independently verified, ensuring that risk evaluations and budget
            recommendations have not been altered after the fact.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuditLedger;
