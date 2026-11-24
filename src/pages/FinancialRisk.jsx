import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { useDemoState } from "../hooks/useDemoState";
import { formatCurrency } from "../utils/formatters";

function FinancialRisk() {
  const {
    demoSummary, monteCarloSummary, monteCarloDistribution,
    financialRiskContributions, riskDrivers,
  } = useDemoState();

  const fairSteps = [
    "Security Findings",
    "Threat / Exposure",
    "Loss Event Frequency",
    "Loss Magnitude",
    "Financial Risk",
  ];

  const whyHighReasons = [
    "Critical payment infrastructure",
    "Internet exposure",
    "Unpatched critical vulnerabilities",
    "Weak identity controls",
    "High business impact",
  ];

  return (
    <div className="animate-in">
      {/* FAIR Progression */}
      <div className="section-heading">
        <h2>FAIR-Style Risk Quantification</h2>
        <p>How technical findings are converted into financial risk estimates.</p>
      </div>

      <div className="flow-diagram" style={{ marginBottom: 32 }}>
        {fairSteps.map((step, i) => (
          <span key={step} style={{ display: "contents" }}>
            <span className="flow-step">{step}</span>
            {i < fairSteps.length - 1 && <span className="flow-arrow">→</span>}
          </span>
        ))}
      </div>

      {/* EAL Card */}
      <div className="stat-cards" style={{ gridTemplateColumns: "1fr", maxWidth: 420, marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-card-accent stat-card-accent--danger" />
          <p className="stat-card-label">Current Modeled EAL</p>
          <p className="stat-card-value stat-card-value--danger" style={{ fontSize: "2.75rem" }}>
            {formatCurrency(demoSummary.currentEAL)}
          </p>
          <p className="stat-card-sub">Modeled Expected Annual Loss</p>
        </div>
      </div>

      {/* Monte Carlo */}
      <div className="dashboard-grid">
        <div className="dashboard-card dashboard-card--full">
          <div className="card-header">
            <div>
              <h3 className="card-title">Monte Carlo Simulation</h3>
              <p className="card-subtitle">
                {monteCarloSummary.simulations.toLocaleString()} simulated loss scenarios
              </p>
            </div>
            <span className="status-badge status-badge--info">Simulation</span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monteCarloDistribution}>
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v) => `${v.toLocaleString()} scenarios`}
                labelFormatter={(l) => `Loss Range: ₹${l}`}
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #eaeaea",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="frequency" fill="#111" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>

          <div className="result-row" style={{ marginTop: 24 }}>
            <div className="result-metric">
              <p className="result-metric-label">Expected Annual Loss</p>
              <p className="result-metric-value">{formatCurrency(monteCarloSummary.expectedAnnualLoss)}</p>
            </div>
            <div className="result-metric">
              <p className="result-metric-label">Median Loss</p>
              <p className="result-metric-value">{formatCurrency(monteCarloSummary.medianLoss)}</p>
            </div>
            <div className="result-metric">
              <p className="result-metric-label">90th Percentile</p>
              <p className="result-metric-value" style={{ color: "var(--color-danger-text)" }}>
                {formatCurrency(monteCarloSummary.percentile90)}
              </p>
            </div>
          </div>

          <div className="correlation-insight" style={{ marginTop: 16 }}>
            Monte Carlo Simulation models uncertainty in incident frequency and loss magnitude to estimate the distribution of potential financial losses. Instead of assuming one exact loss, the platform simulates thousands of possible outcomes because cyber incidents are uncertain.
          </div>
        </div>
      </div>

      {/* Risk Driver Analysis */}
      <div className="dashboard-grid" style={{ marginTop: 24 }}>
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Why Is Our Risk High?</h3>
              <p className="card-subtitle">Top risk factors</p>
            </div>
          </div>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: "0.875rem", lineHeight: 2 }}>
            {whyHighReasons.map((r, i) => (
              <li key={i} style={{ fontWeight: 500 }}>{r}</li>
            ))}
          </ol>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Financial Risk Contribution</h3>
              <p className="card-subtitle">By business area</p>
            </div>
          </div>
          {financialRiskContributions.map((c) => (
            <div key={c.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.8125rem" }}>
                <span style={{ fontWeight: 500 }}>{c.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>{c.percentage}%</span>
              </div>
              <div className="pct-bar-track">
                <div className="pct-bar-fill pct-bar-fill--primary" style={{ width: `${c.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FinancialRisk;
