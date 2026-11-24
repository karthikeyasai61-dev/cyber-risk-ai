import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useDemoState } from "../hooks/useDemoState";
import { formatCurrency } from "../utils/formatters";

function ScenarioComparison() {
  const { scenarioComparison } = useDemoState();

  const chartData = scenarioComparison.map((s) => ({
    name: s.scenario,
    eal: s.modeledEAL / 100000,
    investment: s.investment / 100000,
  }));

  return (
    <div className="animate-in">
      {/* Comparison Table */}
      <div className="dashboard-card" style={{ marginBottom: 32 }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Scenario Comparison</h3>
            <p className="card-subtitle">Compare investment strategies and their modeled impact on annual loss</p>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Investment</th>
                <th>Modeled EAL</th>
                <th>Risk Reduction</th>
              </tr>
            </thead>
            <tbody>
              {scenarioComparison.map((s, i) => (
                <tr key={s.scenario} style={i === scenarioComparison.length - 1 ? { background: "var(--color-surface-muted)" } : {}}>
                  <td style={{ fontWeight: 600 }}>{s.scenario}</td>
                  <td className="numeric">{s.investment ? formatCurrency(s.investment) : "&#8377;0"}</td>
                  <td className="numeric" style={{ fontWeight: 600 }}>{formatCurrency(s.modeledEAL)}</td>
                  <td className="numeric">
                    {s.riskReduction ? (
                      <span className="status-badge status-badge--success">{s.riskReduction}%</span>
                    ) : (
                      <span style={{ color: "var(--color-text-muted)" }}>Baseline</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EAL Comparison Chart */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Modeled EAL by Scenario</h3>
              <p className="card-subtitle">Expected Annual Loss in Lakhs</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v, name) => [`${v.toFixed(1)}L`, name === "eal" ? "Modeled EAL" : "Investment"]}
                contentStyle={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: "6px", fontSize: "12px" }}
              />
              <Bar dataKey="eal" fill="#111" radius={[4, 4, 0, 0]} barSize={36} name="Modeled EAL" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Investment vs Risk Reduction</h3>
              <p className="card-subtitle">Higher investment yields greater modeled reduction</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v) => `${v.toFixed(1)}L`}
                contentStyle={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: "6px", fontSize: "12px" }}
              />
              <Bar dataKey="investment" fill="#777" radius={[4, 4, 0, 0]} barSize={36} name="Investment" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary */}
      <div className="result-panel" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Key Insight</h3>
          </div>
        </div>
        <div className="result-row">
          <div className="result-metric">
            <p className="result-metric-label">Current EAL</p>
            <p className="result-metric-value">{formatCurrency(scenarioComparison[0].modeledEAL)}</p>
          </div>
          <div className="result-arrow">&#8594;</div>
          <div className="result-metric">
            <p className="result-metric-label">Optimized EAL</p>
            <p className="result-metric-value" style={{ color: "var(--color-success-text)" }}>
              {formatCurrency(scenarioComparison[scenarioComparison.length - 1].modeledEAL)}
            </p>
          </div>
          <div className="result-metric">
            <p className="result-metric-label">Maximum Reduction</p>
            <p className="result-metric-value">
              {scenarioComparison[scenarioComparison.length - 1].riskReduction}%
            </p>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
          Even the MFA-only scenario provides meaningful risk reduction. The Optimized scenario delivers the maximum modeled reduction by strategically allocating the full budget.
        </p>
      </div>
    </div>
  );
}

export default ScenarioComparison;
