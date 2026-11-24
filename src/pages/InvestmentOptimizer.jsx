import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useDemoState } from "../hooks/useDemoState";
import { formatCurrency, formatCurrencyFull } from "../utils/formatters";
import { optimizeBudget } from "../services/optimizer";

function InvestmentOptimizer() {
  const { securityControls, demoSummary } = useDemoState();
  const [budgetInput, setBudgetInput] = useState("50");
  const [result, setResult] = useState(null);
  const [optimizing, setOptimizing] = useState(false);

  function runOptimization() {
    const budgetLakhs = parseFloat(budgetInput);
    if (isNaN(budgetLakhs) || budgetLakhs <= 0) return;
    const budget = budgetLakhs * 100000;

    setOptimizing(true);
    setTimeout(() => {
      setResult(optimizeBudget(budget));
      setOptimizing(false);
    }, 1200);
  }

  const chartData = result
    ? result.controls.map((c) => ({
        name: c.name,
        investment: c.investment / 100000,
      }))
    : [];

  return (
    <div className="animate-in">
      {/* Budget Input */}
      <div className="section-heading">
        <h2>Set Your Budget</h2>
        <p>Enter the available cybersecurity budget to find the optimal investment combination.</p>
      </div>

      <div className="budget-input-group">
        <label htmlFor="budget-field" className="budget-label">Available Budget (Lakhs)</label>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: "1.125rem", fontWeight: 600 }}>&#8377;</span>
          <input
            id="budget-field"
            type="number"
            className="budget-input"
            value={budgetInput}
            onChange={(e) => { setBudgetInput(e.target.value); setResult(null); }}
            min="1"
            max="200"
            step="5"
          />
          <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Lakhs</span>
        </div>
        <button
          className="btn btn-primary"
          onClick={runOptimization}
          disabled={optimizing}
        >
          {optimizing ? (
            <>
              <span className="loading-pulse" /> Optimizing...
            </>
          ) : (
            "Optimize Investment"
          )}
        </button>
      </div>

      {/* Available Controls Table */}
      <div className="dashboard-card" style={{ marginBottom: 32 }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Available Security Controls</h3>
            <p className="card-subtitle">Controls evaluated by the optimizer</p>
          </div>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Control</th>
                <th>Cost</th>
                <th>Modeled Risk Reduction</th>
              </tr>
            </thead>
            <tbody>
              {securityControls.map((ctrl) => (
                <tr key={ctrl.id}>
                  <td style={{ fontWeight: 600 }}>{ctrl.name}</td>
                  <td className="numeric">{formatCurrency(ctrl.cost)}</td>
                  <td>
                    <span className={`status-badge status-badge--${ctrl.riskReduction === "High" ? "danger" : ctrl.riskReduction === "Medium" ? "warning" : "neutral"}`}>
                      {ctrl.riskReduction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization Result */}
      {result && (
        <div className="animate-in">
          <div className="result-panel">
            <div className="card-header">
              <div>
                <h3 className="card-title">Recommended Investment Scenario</h3>
                <p className="card-subtitle">Optimized for maximum modeled risk reduction within budget</p>
              </div>
              <span className="status-badge status-badge--success">Optimized</span>
            </div>

            {/* Allocation */}
            <div className="data-table-container" style={{ marginBottom: 24 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Control</th>
                    <th>Investment</th>
                  </tr>
                </thead>
                <tbody>
                  {result.controls.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td className="numeric">{formatCurrency(c.investment)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "var(--color-surface-muted)" }}>
                    <td style={{ fontWeight: 700 }}>Total</td>
                    <td className="numeric" style={{ fontWeight: 700 }}>
                      {formatCurrency(result.controls.reduce((s, c) => s + c.investment, 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Allocation Bar Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip
                  formatter={(v) => `${v.toFixed(1)}L`}
                  contentStyle={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: "6px", fontSize: "12px" }}
                />
                <Bar dataKey="investment" fill="#111" radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>

            {/* Result Metrics */}
            <div className="result-row" style={{ marginTop: 24 }}>
              <div className="result-metric">
                <p className="result-metric-label">Current EAL</p>
                <p className="result-metric-value">{formatCurrency(result.currentEAL)}</p>
              </div>
              <div className="result-arrow">&#8594;</div>
              <div className="result-metric">
                <p className="result-metric-label">Optimized EAL</p>
                <p className="result-metric-value" style={{ color: "var(--color-success-text)" }}>
                  {formatCurrency(result.optimizedEAL)}
                </p>
              </div>
              <div className="result-metric">
                <p className="result-metric-label">Risk Reduction</p>
                <p className="result-metric-value">{formatCurrency(result.reductionAmount)} ({result.reductionPercentage}%)</p>
              </div>
              <div className="result-metric">
                <p className="result-metric-label">Budget Used</p>
                <p className="result-metric-value">{result.budgetUsedPercentage}%</p>
              </div>
            </div>
          </div>

          {/* Optimization Logic */}
          <div className="dashboard-card" style={{ marginTop: 24 }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Optimization Logic</h3>
                <p className="card-subtitle">How the platform determines the recommended combination</p>
              </div>
            </div>

            <div style={{ marginBottom: 16, padding: 16, background: "var(--color-surface-muted)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-small)", fontSize: "0.8125rem", fontWeight: 600 }}>
              Objective: Maximize modeled risk reduction within the available budget.
            </div>

            <div className="optimization-steps">
              {(result.optimizationSteps || []).map((step, i) => (
                <div className="opt-step" key={i}>
                  <span className="opt-step-number">{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvestmentOptimizer;
