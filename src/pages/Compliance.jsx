import { useDemoState } from "../hooks/useDemoState";

function Compliance() {
  const { complianceMappings } = useDemoState();

  const additionalMappings = [
    {
      risk: "Data Breach via Unpatched Vulnerability",
      controls: ["Patch Management", "Vulnerability Scanning", "WAF"],
      frameworks: ["NIST CSF", "CIS Controls", "ISO 27001"],
    },
    {
      risk: "Ransomware Attack",
      controls: ["EDR", "Backup Improvement", "Network Segmentation"],
      frameworks: ["NIST CSF", "CIS Controls", "ISO 27001"],
    },
    {
      risk: "Cloud Misconfiguration",
      controls: ["CSPM", "Access Control", "Encryption"],
      frameworks: ["CIS Controls", "ISO 27001", "SEBI"],
    },
    {
      risk: "Insider Threat",
      controls: ["IAM", "SIEM Monitoring", "Employee Training"],
      frameworks: ["NIST CSF", "ISO 27001", "RBI"],
    },
  ];

  const allMappings = [...complianceMappings, ...additionalMappings];

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 24, padding: 16, background: "var(--color-surface-muted)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-small)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
        Security controls are automatically mapped to relevant compliance frameworks. Regulatory compliance verification should be performed with your compliance team.
      </div>

      <div className="dashboard-card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Risk</th>
                <th>Controls</th>
                <th>Framework Mapping</th>
              </tr>
            </thead>
            <tbody>
              {allMappings.map((m, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, minWidth: 200 }}>{m.risk}</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {m.controls.map((c) => (
                        <span key={c} className="status-badge status-badge--neutral">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="framework-badges">
                      {m.frameworks.map((f) => (
                        <span key={f} className="framework-badge">{f}</span>
                      ))}
                    </div>
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

export default Compliance;
